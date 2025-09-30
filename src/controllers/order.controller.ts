import type { Request, Response } from "express";
import mongoose from 'mongoose';
import { orderService } from "../services/order.service";
import type { OrderStatus } from "../models/order.model";

class OrderController {

    async getAllOrders(req: Request, res: Response) {
        try {
            const user = (req as any).user as { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };
            const { orders } = await orderService.listOrders(user);
            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getOrderById(req: Request<{ id: string }>, res: Response) {
        try {
            const user = (req as any).user as { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Order id is required' });
            const result = await orderService.getOrderById(id, user);
            if (result.error) return res.status(result.status!).json({ message: result.error });
            res.status(200).json({ order: result.order });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async createOrder(req: Request, res: Response) {
        try {
            const user = (req as any).user as { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };
            const items = req.body.items as { productId: string; quantity: number }[];
            const buyerId = new mongoose.Types.ObjectId(user._id);
            const result = await orderService.createOrder(buyerId, items);
            if (result.error) return res.status(result.status!).json({ message: result.error });
            res.status(201).json({ order: result.order });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    async updateOrder(req: Request<{ id: string }>, res: Response) {
        try {
            const user = (req as any).user as { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };
            const { id } = req.params;
            const { status } = req.body as { status: OrderStatus };
            if (!id) return res.status(400).json({ message: 'Order id is required' });
            const result = await orderService.updateStatus(id, user, status);
            if (result.error) return res.status(result.status!).json({ message: result.error });
            res.status(200).json({ order: result.order });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteOrder(req: Request<{ id: string }>, res: Response) {
        try {
            const user = (req as any).user as { _id: string; email: string; role: 'admin' | 'seller' | 'buyer' };
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Order id is required' });
            const result = await orderService.cancelOrder(id, user);
            if (result.error) return res.status(result.status!).json({ message: result.error });
            res.status(200).json({ order: result.order });
        } catch (error) {
            res.status(500).json(error);
        }
    }

}

export const orderController = new OrderController();