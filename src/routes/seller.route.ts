import { Router } from 'express';
import { sellerController } from '../controllers/seller.controller';

export const sellerRouter = Router();

/**
 * @openapi
 * /api/v1/seller:
 *   get:
 *     summary: Listar todos los vendedores
 *     tags: [Seller]
 *     description: Devuelve una lista pública de todos los usuarios con el rol 'seller'.
 *     responses:
 *       200:
 *         description: Un array de vendedores.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sellers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
sellerRouter.get('/', sellerController.listSellers);

/**
 * @openapi
 * /api/v1/seller/{id}:
 *   get:
 *     summary: Obtener el perfil público de un vendedor
 *     tags: [Seller]
 *     description: Devuelve el perfil público de un vendedor, incluyendo sus productos y un historial de ventas.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del vendedor.
 *     responses:
 *       200:
 *         description: Perfil público del vendedor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller:
 *                   $ref: '#/components/schemas/User'
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 sales:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         ordersCount:
 *                           type: integer
 *                         itemsSold:
 *                           type: integer
 *                         deliveredCount:
 *                           type: integer
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       404:
 *         description: Vendedor no encontrado.
 */
sellerRouter.get('/:id', sellerController.getSellerById);