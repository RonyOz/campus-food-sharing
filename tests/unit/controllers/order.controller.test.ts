import mongoose from 'mongoose';
import { orderController } from '../../../src/controllers/order.controller';
import { orderService } from '../../../src/services/order.service';
import type { Request, Response } from 'express';

jest.mock('../../../src/services/order.service', () => ({
  orderService: {
    listOrders: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    updateStatus: jest.fn(),
    cancelOrder: jest.fn(),
  },
}));

type JwtUser = { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };

function makeRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  // @ts-ignore mock json
  res.json = jest.fn().mockReturnValue(res);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

function makeReq(overrides: Partial<Request> & { user?: JwtUser } = {}) {
  const { user, ...restOverrides } = overrides;
  const req = {
    body: {},
    params: {},
    ...restOverrides,
  } as unknown as Request;

  if (user) {
    (req as any).user = user;
  }

  return req;
}


describe('OrderController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrderById', () => {
    it('400 when id missing', async () => {
      const req = makeReq({ user: { _id: 'u', email: 'e', role: 'buyer' } });
      const res = makeRes();
      // @ts-ignore
      await orderController.getOrderById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order id is required' });
    });

    it('200 when service returns order', async () => {
      const req = makeReq({ params: { id: 'o1' }, user: { _id: 'u', email: 'e', role: 'admin' } });
      const res = makeRes();
      (orderService.getOrderById as jest.Mock).mockResolvedValueOnce({ order: { _id: 'o1' } });
      // @ts-ignore
      await orderController.getOrderById(req, res);
      expect(orderService.getOrderById).toHaveBeenCalledWith('o1', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ order: { _id: 'o1' } });
    });

    it('propagates error and status from service', async () => {
      const req = makeReq({ params: { id: 'o1' }, user: { _id: 'u', email: 'e', role: 'buyer' } });
      const res = makeRes();
      (orderService.getOrderById as jest.Mock).mockResolvedValueOnce({ order: null, error: 'Forbidden', status: 403 });
      // @ts-ignore
      await orderController.getOrderById(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
  });

  describe('updateOrder', () => {
    it('400 when id missing', async () => {
      const req = makeReq({ user: { _id: 'u', email: 'e', role: 'seller' }, body: { status: 'accepted' } });
      const res = makeRes();
      // @ts-ignore
      await orderController.updateOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('200 when service updates status', async () => {
      const req = makeReq({ params: { id: 'o1' }, user: { _id: 'u', email: 'e', role: 'admin' }, body: { status: 'accepted' } });
      const res = makeRes();
      (orderService.updateStatus as jest.Mock).mockResolvedValueOnce({ order: { _id: 'o1', status: 'accepted' } });
      // @ts-ignore
      await orderController.updateOrder(req, res);
      expect(orderService.updateStatus).toHaveBeenCalledWith('o1', expect.any(Object), 'accepted');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ order: { _id: 'o1', status: 'accepted' } });
    });
  });

  describe('deleteOrder', () => {
    it('400 when id missing', async () => {
      const req = makeReq({ user: { _id: 'u', email: 'e', role: 'buyer' } });
      const res = makeRes();
      // @ts-ignore
      await orderController.deleteOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('200 when service cancels order', async () => {
      const req = makeReq({ params: { id: 'o1' }, user: { _id: 'u', email: 'e', role: 'buyer' } });
      const res = makeRes();
      (orderService.cancelOrder as jest.Mock).mockResolvedValueOnce({ order: { _id: 'o1', status: 'canceled' } });
      // @ts-ignore
      await orderController.deleteOrder(req, res);
      expect(orderService.cancelOrder).toHaveBeenCalledWith('o1', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ order: { _id: 'o1', status: 'canceled' } });
    });
  });
});

describe('OrderController Adicional', () => {
    const mockUser = { _id: new mongoose.Types.ObjectId().toString(), email: 'test@test.com', role: 'buyer' as const };

    it('getAllOrders debería manejar errores del servidor', async () => {
        const req = makeReq({ user: mockUser });
        const res = makeRes();
        const error = new Error("Server Error");
        (orderService.listOrders as jest.Mock).mockRejectedValue(error);
        await orderController.getAllOrders(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });

    it('getOrderById debería manejar el caso donde el servicio retorna un error', async () => {
        const req = makeReq({ params: { id: 'order-id' }, user: mockUser });
        const res = makeRes();
        (orderService.getOrderById as jest.Mock).mockResolvedValue({ order: null, error: 'Forbidden', status: 403 });
        // @ts-ignore
        await orderController.getOrderById(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });

    it('createOrder debería manejar un error del servicio', async () => {
        const req = makeReq({ user: mockUser, body: { items: [] } });
        const res = makeRes();
        (orderService.createOrder as jest.Mock).mockResolvedValue({ order: null, error: 'Items are required', status: 400 });
        await orderController.createOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Items are required' });
    });

    it('updateOrder debería manejar errores del servidor', async () => {
        const req = makeReq({ params: { id: 'order-id' }, user: mockUser, body: { status: 'accepted' } });
        const res = makeRes();
        const error = new Error("Update failed");
        (orderService.updateStatus as jest.Mock).mockRejectedValue(error);
        // @ts-ignore
        await orderController.updateOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });

    it('deleteOrder debería manejar errores del servidor', async () => {
        const req = makeReq({ params: { id: 'order-id' }, user: mockUser });
        const res = makeRes();
        const error = new Error("Cancel failed");
        (orderService.cancelOrder as jest.Mock).mockRejectedValue(error);
        // @ts-ignore
        await orderController.deleteOrder(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
});