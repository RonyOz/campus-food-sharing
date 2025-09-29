import { Router } from 'express';
import { sellerController } from '../controllers/seller.controller';

export const sellerRouter = Router();

/**
 * @openapi
 * /seller:
 * get:
 * summary: Listar todos los vendedores
 * tags: [Seller]
 * description: Devuelve una lista pública de todos los usuarios con el rol 'seller'. Es un endpoint público.
 * responses:
 * 200:
 * description: Un array de vendedores.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * sellers:
 * type: array
 * items:
 * $ref: '#/components/schemas/User'
 * 500:
 * description: Error interno del servidor.
 */
sellerRouter.get('/', sellerController.listSellers);

/**
 * @openapi
 * /seller/{id}:
 * get:
 * summary: Obtener el perfil público de un vendedor
 * tags: [Seller]
 * description: Devuelve el perfil público de un vendedor, incluyendo sus productos y un historial de ventas. Es un endpoint público.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del vendedor.
 * responses:
 * 200:
 * description: Perfil público del vendedor.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * seller:
 * $ref: '#/components/schemas/User'
 * products:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * sales:
 * type: object
 * properties:
 * stats:
 * type: object
 * properties:
 * ordersCount:
 * type: integer
 * itemsSold:
 * type: integer
 * deliveredCount:
 * type: integer
 * orders:
 * type: array
 * items:
 * $ref: '#/components/schemas/Order'
 * 400:
 * description: El ID del vendedor es inválido o no fue proporcionado.
 * 404:
 * description: Vendedor no encontrado.
 * 500:
 * description: Error interno del servidor.
 */
sellerRouter.get('/:id', sellerController.getSellerById);