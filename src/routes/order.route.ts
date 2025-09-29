import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const orderRouter = Router();

/**
 * @openapi
 * /orders:
 * get:
 * summary: Listar todos los pedidos
 * tags: [Orders]
 * description: Devuelve un array con todos los pedidos. Solo accesible para administradores.
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Un array de pedidos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Order'
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido.
 * 500:
 * description: Error interno del servidor.
 */
orderRouter.get("/", auth, authorizeRoles(['admin']), orderController.getAllOrders);

/**
 * @openapi
 * /orders/{id}:
 * get:
 * summary: Obtener un pedido por su ID
 * tags: [Orders]
 * description: Devuelve los detalles de un pedido específico. Accesible para el comprador del pedido, vendedores de productos en el pedido y administradores.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del pedido.
 * responses:
 * 200:
 * description: Detalles del pedido.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Order'
 * 400:
 * description: Falta el ID del pedido.
 * 404:
 * description: Pedido no encontrado.
 * 403:
 * description: No tienes permiso para ver este pedido.
 * 500:
 * description: Error interno del servidor.
 */
orderRouter.get("/:id", auth, orderController.getOrderById);

/**
 * @openapi
 * /orders:
 * post:
 * summary: Crear un nuevo pedido
 * tags: [Orders]
 * description: Permite a un 'buyer' crear un nuevo pedido.
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - items
 * properties:
 * items:
 * type: array
 * items:
 * $ref: '#/components/schemas/OrderItem'
 * example:
 * items:
 * - productId: "652a9b4b9b7e4a5b6c7d8e9f"
 * quantity: 2
 * - productId: "652a9b4b9b7e4a5b6c7d8ea0"
 * quantity: 1
 * responses:
 * 201:
 * description: Pedido creado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Order'
 * 400:
 * description: Datos del pedido inválidos.
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido (solo para 'buyers').
 * 500:
 * description: Error interno del servidor.
 */
orderRouter.post("/", auth, authorizeRoles(['buyer']), orderController.createOrder);

/**
 * @openapi
 * /orders/{id}/status:
 * put:
 * summary: Actualizar el estado de un pedido
 * tags: [Orders]
 * description: Permite a un 'seller' o 'admin' cambiar el estado de un pedido.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del pedido.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - status
 * properties:
 * status:
 * type: string
 * enum: [pending, accepted, delivered, canceled]
 * example:
 * status: "accepted"
 * responses:
 * 200:
 * description: Estado del pedido actualizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Order'
 * 400:
 * description: Transición de estado inválida o ID faltante.
 * 403:
 * description: No tienes permiso para cambiar el estado.
 * 404:
 * description: Pedido no encontrado.
 * 500:
 * description: Error interno del servidor.
 */
orderRouter.put("/:id/status", auth, authorizeRoles(['seller','admin']), orderController.updateOrder);

/**
 * @openapi
 * /orders/{id}:
 * delete:
 * summary: Cancelar un pedido
 * tags: [Orders]
 * description: Permite cancelar un pedido. Los 'buyers' solo pueden cancelar pedidos pendientes, mientras que los 'admins' pueden cancelar en cualquier estado.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del pedido a cancelar.
 * responses:
 * 200:
 * description: Pedido cancelado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Order'
 * 400:
 * description: El pedido ya no se puede cancelar.
 * 403:
 * description: No tienes permiso para cancelar este pedido.
 * 404:
 * description: Pedido no encontrado.
 * 500:
 * description: Error interno del servidor.
 */
orderRouter.delete("/:id", auth, orderController.deleteOrder);