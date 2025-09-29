import type { Request, Response } from 'express';
import { sellerController } from '../../../src/controllers/seller.controller';
import { sellerService } from '../../../src/services/seller.service';

jest.mock('../../../src/services/seller.service', () => ({
  sellerService: {
    listSellers: jest.fn(),
    getSellerPublicProfile: jest.fn(),
  },
}));

function makeRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  // @ts-ignore
  res.json = jest.fn().mockReturnValue(res);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

function makeReq(overrides: Partial<Request> = {}) {
  return {
    body: {},
    params: {},
    ...overrides,
  } as unknown as Request;
}

describe('SellerController', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('listSellers', () => {
    it('returns 200 with sellers', async () => {
      const req = makeReq();
      const res = makeRes();
      (sellerService.listSellers as jest.Mock).mockResolvedValueOnce({ sellers: [{ _id: 's1' }] });
      // @ts-ignore
      await sellerController.listSellers(req, res);
      expect(sellerService.listSellers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ sellers: [{ _id: 's1' }] });
    });
  });

  describe('getSellerById', () => {
    it('400 when id missing', async () => {
      const req = makeReq();
      const res = makeRes();
      // @ts-ignore
      await sellerController.getSellerById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Seller id is required' });
    });

    it('propagates error and status from service', async () => {
      const req = makeReq({ params: { id: 'bad' } });
      const res = makeRes();
      (sellerService.getSellerPublicProfile as jest.Mock).mockResolvedValueOnce({ profile: null, error: 'Invalid seller id', status: 400 });
      // @ts-ignore
      await sellerController.getSellerById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid seller id' });
    });

    it('200 with profile from service', async () => {
      const req = makeReq({ params: { id: '507f1f77bcf86cd799439011' } });
      const res = makeRes();
      const profile = { seller: { _id: '507f1f77bcf86cd799439011' }, products: [], sales: { stats: { ordersCount: 0, itemsSold: 0, deliveredCount: 0 }, orders: [] } };
      (sellerService.getSellerPublicProfile as jest.Mock).mockResolvedValueOnce({ profile, error: null, status: 200 });
      // @ts-ignore
      await sellerController.getSellerById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(profile);
    });
  });
});
