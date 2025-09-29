import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router()

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Users]
 *     description: Devuelve un array con todos los usuarios registrados. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Un array de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get("/", auth, authorizeRoles(['admin']), userController.getAllUsers);


/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Crear un usuario (admin)
 *     tags: [Users]
 *     description: Permite a un administrador crear un usuario manualmente, asignando todos los campos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, seller, buyer]
 *             example:
 *               username: "nuevo.vendedor"
 *               email: "vendedor@example.com"
 *               password: "password123"
 *               role: "seller"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Conflicto, el email ya existe.
 */
userRouter.post("/", auth, authorizeRoles(['admin']), userController.createUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     description: Devuelve los datos de un usuario específico por su ID.
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
 *         description: Datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.get("/:id", auth, userController.getUserById);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     description: Actualiza los datos de un usuario existente por su ID.
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuario actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.put("/:id", auth, userController.updateUser);

/**
 * @openapi
 * /api/v1/users/{id}:
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
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.delete("/:id", auth, authorizeRoles(['admin']), userController.deleteUser);