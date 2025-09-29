import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router()

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Users]
 *     description: Devuelve un array con todos los usuarios registrados. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: users array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: error
 */
userRouter.get("/", auth, authorizeRoles(['admin']), userController.getAllUsers);


/**
 * @openapi
 * /users:
 *   post:
 *     summary: Crear un usuario (admin)
 *     tags: [Users]
 *     description: Permite a un administrador crear un usuario manualmente. El usuario creado se devuelve en la respuesta.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User data is required
 *         content:
 *           application/json:
 *             example:
 *               message: User data is required
 *       500:
 *         description: error
 */
userRouter.post("/", auth, authorizeRoles(['admin']), userController.createUser);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     description: Devuelve los datos de un usuario específico por su ID. Requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID is missing
 *         content:
 *           application/json:
 *             example:
 *               message: User ID is missing
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: error
 */
userRouter.get("/:id", auth, userController.getUserById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     description: Actualiza los datos de un usuario existente por su ID. Requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID is missing
 *         content:
 *           application/json:
 *             example:
 *               message: User ID is missing
 *       422:
 *         description: Update data is required
 *         content:
 *           application/json:
 *             example:
 *               message: Update data is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: error
 */
userRouter.put("/:id", auth, userController.updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     description: Elimina un usuario por su ID. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: User ID is missing
 *         content:
 *           application/json:
 *             example:
 *               message: User ID is missing
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: error
 */
userRouter.delete("/:id", auth, authorizeRoles(['admin']), userController.deleteUser);