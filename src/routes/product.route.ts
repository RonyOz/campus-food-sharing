import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const productRouter = Router();

/**
 * @openapi
 * /products:
 * get:
 * summary: Listar todos los productos
 * tags: [Products]
 * description: Devuelve un array con todos los productos disponibles. Es un endpoint público.
 * responses:
 * 200:
 * description: Un array de productos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * 500:
 * description: Error interno del servidor.
 */
productRouter.get("/", productController.getAllProducts);

/**
 * @openapi
 * /products/{id}:
 * get:
 * summary: Obtener un producto por su ID
 * tags: [Products]
 * description: Devuelve los detalles de un producto específico. Es un endpoint público.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del producto.
 * responses:
 * 200:
 * description: Detalles del producto.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Falta el ID del producto.
 * 404:
 * description: Producto no encontrado.
 * 500:
 * description: Error interno del servidor.
 */
productRouter.get("/:id", productController.getProductById);

/**
 * @openapi
 * /products:
 * post:
 * summary: Crear un nuevo producto
 * tags: [Products]
 * description: Permite a un 'seller' o 'admin' crear un nuevo producto.
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - price
 * properties:
 * name:
 * type: string
 * description:
 * type: string
 * price:
 * type: number
 * available:
 * type: boolean
 * example:
 * name: "Pizza Margarita"
 * description: "Clásica pizza con tomate, mozzarella y albahaca."
 * price: 15.99
 * available: true
 * responses:
 * 201:
 * description: Producto creado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Faltan el nombre o el precio del producto.
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido (solo para 'seller' o 'admin').
 * 500:
 * description: Error interno del servidor.
 */
productRouter.post("/", auth, authorizeRoles(['seller','admin']), productController.createProduct);

/**
 * @openapi
 * /products/{id}:
 * put:
 * summary: Actualizar un producto existente
 * tags: [Products]
 * description: Permite a un 'seller' o 'admin' actualizar los detalles de un producto por su ID.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del producto a actualizar.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * description:
 * type: string
 * price:
 * type: number
 * available:
 * type: boolean
 * example:
 * price: 16.50
 * available: false
 * responses:
 * 200:
 * description: Producto actualizado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Datos de actualización inválidos o ID faltante.
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido.
 * 404:
 * description: Producto no encontrado.
 * 500:
 * description: Error interno del servidor.
 */
productRouter.put("/:id", auth, authorizeRoles(['seller','admin']), productController.updateProduct);

/**
 * @openapi
 * /products/{id}:
 * delete:
 * summary: Eliminar un producto
 * tags: [Products]
 * description: Permite a un 'seller' o 'admin' eliminar un producto por su ID.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID del producto a eliminar.
 * responses:
 * 204:
 * description: Producto eliminado exitosamente (sin contenido).
 * 401:
 * description: No autorizado.
 * 403:
 * description: Prohibido.
 * 404:
 * description: Producto no encontrado.
 * 500:
 * description: Error interno del servidor.
 */
productRouter.delete("/:id", auth, authorizeRoles(['seller','admin']), productController.deleteProduct);