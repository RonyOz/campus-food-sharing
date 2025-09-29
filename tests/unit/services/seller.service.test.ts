import mongoose from 'mongoose';
import { sellerService } from '../../../src/services/seller.service';
import { UserModel } from '../../../src/models/user.model';
import { ProductModel } from '../../../src/models/product.model';
import { OrderModel } from '../../../src/models/order.model';

jest.mock('../../../src/models/user.model', () => ({
  UserModel: {
    find: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock('../../../src/models/product.model', () => ({
  ProductModel: {
    find: jest.fn(),
  },
}));

jest.mock('../../../src/models/order.model', () => ({
  OrderModel: {
    find: jest.fn(),
  },
}));

describe('SellerService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('listSellers', () => {
    it('returns sellers with public fields', async () => {
      (UserModel.find as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce([{ _id: 's1', username: 'u' }]) });
      const { sellers } = await sellerService.listSellers();
      expect(UserModel.find).toHaveBeenCalledWith({ role: 'seller' });
      expect(sellers).toEqual([{ _id: 's1', username: 'u' }]);
    });
  });

  describe('getSellerPublicProfile', () => {
    it('returns 400 for invalid id', async () => {
      const res = await sellerService.getSellerPublicProfile('not-an-id');
      expect(res.status).toBe(400);
      expect(res.error).toBe('Invalid seller id');
    });

    it('returns 404 if seller not found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      (UserModel.findOne as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce(null) });
      const res = await sellerService.getSellerPublicProfile(id);
      expect(UserModel.findOne).toHaveBeenCalledWith({ _id: id, role: 'seller' });
      expect(res.status).toBe(404);
      expect(res.error).toBe('Seller not found');
    });

    it('returns profile with products and empty sales if no products', async () => {
      const id = new mongoose.Types.ObjectId();
      (UserModel.findOne as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce({ _id: id, username: 'seller1' }) });
      (ProductModel.find as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce([]) });
      const res = await sellerService.getSellerPublicProfile(id.toString());
      expect(res.status).toBe(200);
      expect(res.profile?.products).toEqual([]);
      expect(res.profile?.sales.stats).toEqual({ ordersCount: 0, itemsSold: 0, deliveredCount: 0 });
    });

    it('returns profile with computed sales stats and filtered order items', async () => {
      const id = new mongoose.Types.ObjectId();
      const p1 = new mongoose.Types.ObjectId();
      const p2 = new mongoose.Types.ObjectId();

      (UserModel.findOne as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce({ _id: id, username: 'seller1' }) });
      (ProductModel.find as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce([
        { _id: p1, name: 'A', price: 10, available: true },
        { _id: p2, name: 'B', price: 20, available: true },
      ]) });

      const orderDocs = [
        { _id: new mongoose.Types.ObjectId(), status: 'pending', items: [ { productId: p1, quantity: 2 }, { productId: new mongoose.Types.ObjectId(), quantity: 5 } ], createdAt: new Date(), updatedAt: new Date() },
        { _id: new mongoose.Types.ObjectId(), status: 'delivered', items: [ { productId: p2, quantity: 3 } ], createdAt: new Date(), updatedAt: new Date() },
      ];
      (OrderModel.find as jest.Mock).mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce(orderDocs) });

      const res = await sellerService.getSellerPublicProfile(id.toString());
      expect(res.status).toBe(200);
      expect(res.profile?.sales.stats.ordersCount).toBe(2);
      expect(res.profile?.sales.stats.itemsSold).toBe(5); // 2 + 3 only items of seller
      expect(res.profile?.sales.stats.deliveredCount).toBe(1);
      // Ensure orders items are filtered to seller's products
      expect(res.profile?.sales.orders[0].items.every((it: any) => [p1.toString(), p2.toString()].includes(it.productId.toString()))).toBe(true);
    });
  });
});
