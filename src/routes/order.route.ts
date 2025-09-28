import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const orderRouter = Router();

// Listar todos (solo admin)
orderRouter.get("/", auth, authorizeRoles(['admin']), orderController.getAllOrders);

// Ver detalle (auth; visibilidad se validará en el controlador)
orderRouter.get("/:id", auth, orderController.getOrderById);

// Crear pedido (solo buyer)
orderRouter.post("/", auth, authorizeRoles(['buyer']), orderController.createOrder);

// Cambiar estado (solo seller/admin) -> reglas exactas en controlador
orderRouter.put("/:id/status", auth, authorizeRoles(['seller','admin']), orderController.updateOrder);

// Cancelar pedido (buyer si pending; admin siempre) -> validar en controlador
orderRouter.delete("/:id", auth, orderController.deleteOrder);