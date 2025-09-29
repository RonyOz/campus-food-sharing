import mongoose from 'mongoose';
import { OrderModel, type IOrderDocument, type OrderStatus } from '../models/order.model';
import { ProductModel } from '../models/product.model';

type JwtUser = { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };

class OrderService {
  // Crear pedido (buyer)
  async createOrder(buyerId: mongoose.Types.ObjectId, items: { productId: string; quantity: number }[]) {
    if (!Array.isArray(items) || items.length === 0) {
      return { order: null, error: 'Items are required', status: 400 } as const;
    }

    // Validar productos existen y disponibles, y cantidades válidas
    const productIds = items.map(i => new mongoose.Types.ObjectId(i.productId));
    const products = await ProductModel.find({ _id: { $in: productIds } });
    if (products.length !== items.length) {
      return { order: null, error: 'One or more products do not exist', status: 400 } as const;
    }

    const unavailable = products.find(p => !p.available);
    if (unavailable) {
      return { order: null, error: `Product ${(unavailable._id as mongoose.Types.ObjectId).toString()} is not available`, status: 400 } as const;
    }

    for (const it of items) {
      if (!it.quantity || it.quantity < 1) {
        return { order: null, error: 'Quantity must be >= 1 for all items', status: 400 } as const;
      }
    }

    const normalizedItems = items.map(it => ({ productId: new mongoose.Types.ObjectId(it.productId), quantity: it.quantity }));

    const order = await OrderModel.create({ buyerId, items: normalizedItems, status: 'pending' });
    return { order, error: null, status: 201 } as const;
  }

  // Listar pedidos según rol
  async listOrders(user: JwtUser) {
    if (user.role === 'admin') {
      const orders = await OrderModel.find({}).populate('items.productId');
      return { orders } as const;
    }
    if (user.role === 'buyer') {
      const orders = await OrderModel.find({ buyerId: user._id }).populate('items.productId');
      return { orders } as const;
    }
    // seller: pedidos que contengan productos del seller
    const sellerProductIds = await ProductModel.find({ sellerId: user._id }).distinct('_id');
    const orders = await OrderModel.find({ 'items.productId': { $in: sellerProductIds } }).populate('items.productId');
    return { orders } as const;
  }

  // Obtener detalle con control de acceso
  async getOrderById(orderId: string, user: JwtUser) {
    const found = await OrderModel.findById(orderId);
    const order = found ? await (found as any).populate('items.productId') : null;
    if (!order) return { order: null, error: 'Order not found', status: 404 } as const;

    if (user.role === 'admin') return { order } as const;

    if (user.role === 'buyer') {
      if (order.buyerId.toString() !== user._id) {
        return { order: null, error: 'Forbidden', status: 403 } as const;
      }
      return { order } as const;
    }

    // seller: debe tener al menos un producto propio en la orden
    const sellerProductIds = await (ProductModel.find({ sellerId: user._id }) as any).distinct('_id');
    const containsSellerProduct = order.items.some(it => sellerProductIds.some(id => id.toString() === it.productId.toString()));
    if (!containsSellerProduct) return { order: null, error: 'Forbidden', status: 403 } as const;
    return { order } as const;
  }

  // Cambiar estado con reglas
  async updateStatus(orderId: string, user: JwtUser, newStatus: OrderStatus) {
    // 1) Cargar la orden objetivo
    const order = await OrderModel.findById(orderId);
    if (!order) return { order: null, error: 'Order not found', status: 404 } as const;

    // 2) Definir estado actual y destino
    const from = order.status as OrderStatus;   // estado actual
    const to = newStatus;                       // estado solicitado

    // 3) Validar que la transición sea válida a nivel de máquina de estados
    // Matriz de transiciones permitidas SIN considerar roles todavía.
    const isValidTransition = (from: OrderStatus, to: OrderStatus) => {
      if (from === to) return false; // no se permite "cambiar" al mismo estado
      const allowed: Record<OrderStatus, OrderStatus[]> = {
        pending: ['accepted', 'canceled'],    // desde pending: aceptar o cancelar
        accepted: ['delivered', 'canceled'],  // desde accepted: entregar o cancelar
        delivered: [],                        // entregado es terminal
        canceled: [],                         // cancelado es terminal
      };
      return allowed[from].includes(to);
    };

    if (!isValidTransition(from, to)) {
      // La transición no existe (p.ej. pending -> delivered directamente)
      return { order: null, error: `Invalid status transition from ${from} to ${to}`, status: 400 } as const;
    }

    // 4) Reglas por rol
    if (user.role === 'admin') {
      // Admin puede forzar cualquier transición válida
      order.status = to;
      await order.save();
      return { order } as const;
    }

    if (user.role === 'buyer') {
      // Buyer solo puede CANCELAR, siempre que sea su pedido y esté en pending
      if (to !== 'canceled') return { order: null, error: 'Buyers can only cancel pending orders', status: 403 } as const;
      // Debe ser dueño de la orden
      if (order.buyerId.toString() !== user._id) return { order: null, error: 'Forbidden', status: 403 } as const;
      // Debe estar en pending
      if (order.status !== 'pending') return { order: null, error: 'Only pending orders can be canceled by buyer', status: 400 } as const;
      order.status = 'canceled';
      await order.save();
      return { order } as const;
    }

    // seller: verificación de ownership INDIRECTO
    // Un seller solo puede actuar si la orden incluye al menos un producto suyo.
    const sellerProductIds = await (ProductModel.find({ sellerId: user._id }) as any).distinct('_id');
    const containsSellerProduct = order.items.some(it => sellerProductIds.some(id => id.toString() === it.productId.toString()));
    if (!containsSellerProduct) return { order: null, error: 'Forbidden', status: 403 } as const;

    // 5) Reglas específicas del seller
    // El seller puede:
    //   - pasar de pending -> accepted (aceptar el pedido)
    //   - pasar de accepted -> delivered (marcar como entregado)
    // No puede realizar otras transiciones en este endpoint.
    const sellerAllowed = (from === 'pending' && to === 'accepted') || (from === 'accepted' && to === 'delivered');
    if (!sellerAllowed) return { order: null, error: 'Seller not allowed for this transition', status: 403 } as const;

    // 6) Aplicar la transición
    order.status = to;
    await order.save();
    return { order } as const;
  }

  // Cancelar (DELETE semantics -> cancelación)
  // Reglas de negocio de cancelación:
  // - admin: puede cancelar mientras la orden no esté delivered/canceled.
  // - buyer: puede cancelar SOLO si es dueño y el estado actual es pending.
  // - seller: puede cancelar SI la orden incluye al menos un producto suyo
  //           y el estado actual es pending o accepted (evita cancelar una ya entregada o ya cancelada).
  async cancelOrder(orderId: string, user: JwtUser) {
    const order = await OrderModel.findById(orderId);
    if (!order) return { order: null, error: 'Order not found', status: 404 } as const;

    if (user.role === 'admin') {
      if (order.status === 'delivered' || order.status === 'canceled') {
        return { order: null, error: 'Order can not be canceled anymore', status: 400 } as const;
      }
      order.status = 'canceled';
      await order.save();
      return { order } as const;
    }

    if (user.role === 'buyer') {
      if (order.buyerId.toString() !== user._id) return { order: null, error: 'Forbidden', status: 403 } as const;
      if (order.status !== 'pending') return { order: null, error: 'Only pending orders can be canceled by buyer', status: 400 } as const;
      order.status = 'canceled';
      await order.save();
      return { order } as const;
    }

    // seller: validar que la orden tenga al menos un producto del seller
    const sellerProductIds = await (ProductModel.find({ sellerId: user._id }) as any).distinct('_id');
    const containsSellerProduct = order.items.some(it => sellerProductIds.some(id => id.toString() === it.productId.toString()));
    if (!containsSellerProduct) return { order: null, error: 'Forbidden', status: 403 } as const;

    // Solo permitir cancelar si el estado actual es pending o accepted
    if (order.status !== 'pending' && order.status !== 'accepted') {
      return { order: null, error: 'Sellers can only cancel pending or accepted orders', status: 400 } as const;
    }

    order.status = 'canceled';
    await order.save();
    return { order } as const;
  }
}

export const orderService = new OrderService();
