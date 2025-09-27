import { Router } from "express";
import { orderController } from "../controllers/order.controller";

export const orderRouter = Router();

orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/:id", orderController.getOrderById);
orderRouter.post("/", orderController.createOrder);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.delete("/:id", orderController.deleteOrder);