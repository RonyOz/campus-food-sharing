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
 *     description: Devuelve una lista de todos los usuarios. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 */
userRouter.get("/",auth,authorizeRoles(['admin']), userController.getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     description: Devuelve los datos de un usuario específico. Requiere autenticación.
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
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.get("/:id", userController.getUserById,auth);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     description: Actualiza los datos de un usuario existente. Requiere autenticación.
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
 *         description: Usuario actualizado.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.put("/:id", userController.updateUser,auth);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     description: Elimina un usuario por ID. Solo accesible para administradores.
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
 *         description: Usuario eliminado.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.delete("/:id", auth,authorizeRoles(['admin']),userController.deleteUser);