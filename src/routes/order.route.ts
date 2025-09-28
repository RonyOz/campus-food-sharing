import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const orderRouter = Router();

orderRouter.get("/", orderController.getAllOrders,auth,authorizeRoles(['admin']));
orderRouter.get("/:id", orderController.getOrderById,auth);
orderRouter.post("/", orderController.createOrder,auth);
orderRouter.put("/:id", orderController.updateOrder,auth);
orderRouter.delete("/:id", orderController.deleteOrder,auth);