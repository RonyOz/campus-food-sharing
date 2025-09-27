import type { Request, Response } from "express";

class OrderController{

    async getAllOrders(req:Request, res:Response) {}

    async getOrderById(req:Request, res:Response) {}

    async createOrder(req:Request, res:Response) {}

    async updateOrder(req:Request, res:Response) {}

    async deleteOrder(req:Request, res:Response) {}

}

export const orderController = new OrderController();