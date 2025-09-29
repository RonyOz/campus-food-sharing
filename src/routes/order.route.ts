import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const orderRouter = Router();

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Listar todos los pedidos (solo admin)
 *     tags:
 *       - Orders
 *     description: Devuelve un array con todos los pedidos. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Un array de pedidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       403:
 *         description: Prohibido.
 */

orderRouter.get("/", auth, authorizeRoles(['admin']), orderController.getAllOrders);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Obtener un pedido por su ID
 *     tags:
 *       - Orders
 *     description: Devuelve los detalles de un pedido específico. Accesible para el comprador, vendedores de productos en el pedido y administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del pedido.
 *     responses:
 *       200:
 *         description: Detalles del pedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido no encontrado.
 */
orderRouter.get("/:id", auth, orderController.getOrderById);

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Crear un nuevo pedido (solo buyer)
 *     tags: [Orders]
 *     description: Permite a un 'buyer' crear un nuevo pedido.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *           example:
 *             items:
 *               - productId: "652a9b4b9b7e4a5b6c7d8e9f"
 *                 quantity: 2
 *               - productId: "652a9b4b9b7e4a5b6c7d8ea0"
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos del pedido inválidos.
 */
orderRouter.post("/", auth, authorizeRoles(['buyer']), orderController.createOrder);

/**
 * @openapi
 * /api/v1/orders/{id}/status:
 *   put:
 *     summary: Actualizar el estado de un pedido
 *     tags: [Orders]
 *     description: Permite a un 'seller' o 'admin' cambiar el estado de un pedido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, delivered, canceled]
 *           example:
 *             status: "accepted"
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Transición de estado inválida.
 */
orderRouter.put("/:id/status", auth, authorizeRoles(['seller','admin']), orderController.updateOrder);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Cancelar un pedido
 *     tags: [Orders]
 *     description: Permite cancelar un pedido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del pedido a cancelar.
 *     responses:
 *       200:
 *         description: Pedido cancelado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: El pedido ya no se puede cancelar.
 */
orderRouter.delete("/:id", auth, orderController.deleteOrder);