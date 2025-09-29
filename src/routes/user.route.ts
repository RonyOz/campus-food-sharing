import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router();

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Users]
 *     description: Permite a un usuario autenticarse en la plataforma. Devuelve un token si las credenciales son válidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: user@example.com
 *             password: secret123
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Devuelve token y datos del usuario.
 *       400:
 *         description: Credenciales inválidas.
 */
userRouter.post("/login", userController.login);

/**
 * @openapi
 * /users/signup:
 *   post:
 *     summary: Registro de usuario
 *     tags: [Users]
 *     description: Permite registrar un nuevo usuario en la plataforma. Devuelve el usuario creado y un token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             name: Juan Perez
 *             email: juan@example.com
 *             password: secret123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente. Devuelve usuario y token.
 *       400:
 *         description: Datos inválidos.
 *       409:
 *         description: El email ya está registrado.
 */
userRouter.post("/signup", userController.signup);

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
userRouter.get("/", userController.getAllUsers,auth,authorizeRoles(['admin']));

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
userRouter.delete("/:id", userController.deleteUser,auth,authorizeRoles(['admin']));