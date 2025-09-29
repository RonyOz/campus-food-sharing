import mongoose from 'mongoose';
import { orderService } from '../../../src/services/order.service';
import { OrderModel } from '../../../src/models/order.model';
import { ProductModel } from '../../../src/models/product.model';

jest.mock('../../../src/models/order.model', () => ({
  OrderModel: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../../src/models/product.model', () => ({
  ProductModel: {
    find: jest.fn(() => ({ distinct: jest.fn() })),
  },
}));

type JwtUser = { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };

// Helper to build a fake order document with save()
function makeOrderDoc(data: Partial<any> = {}) {
  return {
    _id: new mongoose.Types.ObjectId(),
    buyerId: data.buyerId ?? new mongoose.Types.ObjectId(),
    items: data.items ?? [],
    status: data.status ?? 'pending',
    save: jest.fn().mockResolvedValue(undefined),
  } as any;
}

describe('OrderService', () => {
  const asObjectId = (id: string) => new mongoose.Types.ObjectId(id);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('returns 400 when items is empty', async () => {
      const result = await orderService.createOrder(new mongoose.Types.ObjectId(), []);
    //   expect(result.error).toBe('Items are required');
      expect(result.status).toBe(400);
    });

    it('returns 400 when a quantity < 1 is provided', async () => {
      const items = [{ productId: new mongoose.Types.ObjectId().toString(), quantity: 0 }];
      const result = await orderService.createOrder(new mongoose.Types.ObjectId(), items as any);
    //   expect(result.error).toBe('Quantity must be >= 1 for all items');
      expect(result.status).toBe(400);
    });

    it('returns 400 if any product does not exist', async () => {
      const items = [
        { productId: new mongoose.Types.ObjectId().toString(), quantity: 1 },
        { productId: new mongoose.Types.ObjectId().toString(), quantity: 2 },
      ];
      (ProductModel.find as jest.Mock).mockResolvedValueOnce([{ available: true }]); // length 1 != 2
      const result = await orderService.createOrder(new mongoose.Types.ObjectId(), items);
    //   expect(result.error).toBe('One or more products do not exist');
      expect(result.status).toBe(400);
    });

    it('returns 400 if any product is unavailable', async () => {
      const items = [{ productId: new mongoose.Types.ObjectId().toString(), quantity: 1 }];
      (ProductModel.find as jest.Mock).mockResolvedValueOnce([{ available: false, _id: new mongoose.Types.ObjectId() }]);
      const result = await orderService.createOrder(new mongoose.Types.ObjectId(), items);
    //   expect(result.error).toContain('is not available');
      expect(result.status).toBe(400);
    });

    it('creates order when all validations pass', async () => {
      const items = [{ productId: new mongoose.Types.ObjectId().toString(), quantity: 1 }];
      (ProductModel.find as jest.Mock).mockResolvedValueOnce([{ available: true, _id: new mongoose.Types.ObjectId() }]);
      (OrderModel.create as jest.Mock).mockResolvedValueOnce({ _id: new mongoose.Types.ObjectId(), status: 'pending' });
      const result = await orderService.createOrder(new mongoose.Types.ObjectId(), items);
    //   expect(result.error).toBeNull();
      expect(result.order).toBeTruthy();
      expect((OrderModel.create as jest.Mock).mock.calls[0][0].status).toBe('pending');
    });
  });

  describe('getOrderById', () => {
    it('allows admin to see any order', async () => {
      const orderDoc = makeOrderDoc();
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce({
        populate: jest.fn().mockResolvedValueOnce(orderDoc),
      });
      const admin: JwtUser = { _id: 'u1', email: 'a@a.com', role: 'admin' };
      const result = await orderService.getOrderById(orderDoc._id.toString(), admin);
      expect(result.order).toBe(orderDoc);
    });

    it('buyer forbidden if not owner', async () => {
      const orderDoc = makeOrderDoc({ buyerId: new mongoose.Types.ObjectId() });
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce({
        populate: jest.fn().mockResolvedValueOnce(orderDoc),
      });
      const buyer: JwtUser = { _id: new mongoose.Types.ObjectId().toString(), email: 'b@b.com', role: 'buyer' };
      const result = await orderService.getOrderById(orderDoc._id.toString(), buyer);
      expect(result.error).toBe('Forbidden');
      expect(result.status).toBe(403);
    });
  });

  describe('updateStatus', () => {
    it('rejects invalid transitions', async () => {
      const orderDoc = makeOrderDoc({ status: 'pending' });
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce(orderDoc);
      const admin: JwtUser = { _id: 'u1', email: 'a@a.com', role: 'admin' };
      const result = await orderService.updateStatus('o1', admin, 'delivered');
      // pending -> delivered is invalid per matrix
      expect(result.error).toContain('Invalid status transition');
      expect(result.status).toBe(400);
    });

    it('buyer can cancel own pending order', async () => {
      const buyerId = new mongoose.Types.ObjectId();
      const orderDoc = makeOrderDoc({ status: 'pending', buyerId });
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce(orderDoc);
      const buyer: JwtUser = { _id: buyerId.toString(), email: 'b@b.com', role: 'buyer' };
      const result = await orderService.updateStatus('o1', buyer, 'canceled');
      expect(result.order).toBeTruthy();
      expect(orderDoc.save).toHaveBeenCalled();
      expect(orderDoc.status).toBe('canceled');
    });

    it('seller can move pending -> accepted if order contains their product', async () => {
      const sellerId = new mongoose.Types.ObjectId();
      const sellerProductId = new mongoose.Types.ObjectId();
      const orderDoc = makeOrderDoc({
        status: 'pending',
        items: [{ productId: sellerProductId, quantity: 1 }],
      });
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce(orderDoc);
      // Mock ProductModel.find({ sellerId }).distinct('_id') => [sellerProductId]
      (ProductModel.find as unknown as jest.Mock).mockResolvedValueOnce({
        distinct: jest.fn().mockResolvedValueOnce([sellerProductId]),
      });
      const seller: JwtUser = { _id: sellerId.toString(), email: 's@s.com', role: 'seller' };
      const result = await orderService.updateStatus('o1', seller, 'accepted');
      expect(result.order).toBeTruthy();
      expect(orderDoc.status).toBe('accepted');
      expect(orderDoc.save).toHaveBeenCalled();
    });
  });

  describe('cancelOrder', () => {
    it('admin cannot cancel delivered/canceled', async () => {
      const orderDoc = makeOrderDoc({ status: 'delivered' });
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce(orderDoc);
      const admin: JwtUser = { _id: 'u1', email: 'a@a.com', role: 'admin' };
      const result = await orderService.cancelOrder('o1', admin);
      expect(result.error).toBe('Order can not be canceled anymore');
      expect(result.status).toBe(400);
    });

    it('seller can cancel pending order that includes their product', async () => {
      const sellerProductId = new mongoose.Types.ObjectId();
      const orderDoc = makeOrderDoc({ status: 'pending', items: [{ productId: sellerProductId, quantity: 1 }] });
      (OrderModel.findById as jest.Mock).mockResolvedValueOnce(orderDoc);
      (ProductModel.find as unknown as jest.Mock).mockResolvedValueOnce({
        distinct: jest.fn().mockResolvedValueOnce([sellerProductId]),
      });
      const seller: JwtUser = { _id: new mongoose.Types.ObjectId().toString(), email: 's@s.com', role: 'seller' };
      const result = await orderService.cancelOrder('o1', seller);
      expect(result.order).toBeTruthy();
      expect(orderDoc.status).toBe('canceled');
    });
  });
});
