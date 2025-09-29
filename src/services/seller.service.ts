import mongoose from 'mongoose';
import { UserModel, type UserDocument } from '../models/user.model';
import { ProductModel, type IProductDocument } from '../models/product.model';
import { OrderModel, type IOrderDocument } from '../models/order.model';

export class SellerService {
  async listSellers() {
    const sellers = await UserModel.find({ role: 'seller' }).select('_id username email createdAt updatedAt');
    return { sellers } as const;
  }

  async getSellerPublicProfile(sellerId: string) {
    if (!mongoose.isValidObjectId(sellerId)) {
      return { profile: null, error: 'Invalid seller id', status: 400 } as const;
    }

    const seller = await UserModel.findOne({ _id: sellerId, role: 'seller' }).select('_id username email createdAt');
    if (!seller) return { profile: null, error: 'Seller not found', status: 404 } as const;

    // Products by this seller
    const products: Pick<IProductDocument, '_id' | 'name' | 'price' | 'available' | 'description'>[] =
      await ProductModel.find({ sellerId: seller._id }).select('_id name price available description');

    // Sales history: orders that include any of seller's product ids
    const productIds = products.map(p => p._id as mongoose.Types.ObjectId);

    let orders: IOrderDocument[] = [];
    let stats = { ordersCount: 0, itemsSold: 0, deliveredCount: 0 };

    if (productIds.length > 0) {
      orders = await OrderModel.find({ 'items.productId': { $in: productIds } }).select('_id items status createdAt updatedAt');
      // compute stats and filter items per seller
      let itemsSold = 0;
      let deliveredCount = 0;

      const filteredOrders = orders.map(o => {
        const itemsForSeller = o.items.filter(it => productIds.some(pid => pid.toString() === it.productId.toString()));
        if (o.status === 'delivered') deliveredCount += 1;
        itemsSold += itemsForSeller.reduce((acc, it) => acc + (it.quantity || 0), 0);
        return {
          _id: o._id,
          status: o.status,
          createdAt: (o as any).createdAt,
          updatedAt: (o as any).updatedAt,
          items: itemsForSeller,
        };
      });

      stats = { ordersCount: filteredOrders.length, itemsSold, deliveredCount };
      // replace orders variable with filtered results typed loosely
      return {
        profile: {
          seller,
          products,
          sales: {
            stats,
            orders: filteredOrders,
          },
        },
        error: null,
        status: 200,
      } as const;
    }

    // No products => empty sales
    return {
      profile: {
        seller,
        products,
        sales: { stats, orders: [] as any[] },
      },
      error: null,
      status: 200,
    } as const;
  }
}

export const sellerService = new SellerService();
