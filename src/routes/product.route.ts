import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const productRouter = Router();

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Products]
 *     description: Devuelve un array con todos los productos disponibles. Endpoint público.
 *     responses:
 *       200:
 *         description: Un array de productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productRouter.get("/", productController.getAllProducts);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Products]
 *     description: Devuelve los detalles de un producto específico. Endpoint público.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del producto.
 *     responses:
 *       200:
 *         description: Detalles del producto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado.
 */
productRouter.get("/:id", productController.getProductById);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     description: Permite a un 'seller' o 'admin' crear un nuevo producto.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *             example:
 *               name: "Pizza Margarita"
 *               description: "Clásica pizza con tomate, mozzarella y albahaca."
 *               price: 15.99
 *               available: true
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Faltan datos requeridos.
 */
productRouter.post("/", auth, authorizeRoles(['seller','admin']), productController.createProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 *     description: Permite al 'seller' propietario o a un 'admin' actualizar un producto.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del producto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *             example:
 *               price: 16.50
 *               available: false
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente.
 *       404:
 *         description: Producto no encontrado.
 */
productRouter.put("/:id", auth, authorizeRoles(['seller','admin']), productController.updateProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     description: Permite al 'seller' propietario o a un 'admin' eliminar un producto.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del producto a eliminar.
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente.
 *       404:
 *         description: Producto no encontrado.
 */
productRouter.delete("/:id", auth, authorizeRoles(['seller','admin']), productController.deleteProduct);