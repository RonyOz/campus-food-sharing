import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

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
authRouter.post("/login", authController.login);

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
authRouter.post("/signup", authController.signup);

authRouter.get("/profile", authController.getProfile);