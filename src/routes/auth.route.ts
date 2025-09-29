import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

export const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
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
 *         description: Login succesful
 *         content:
 *           application/json:
 *             example:
 *               message: Login succesful
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email and password are required
 *         content:
 *           application/json:
 *             example:
 *               message: Email and password are required
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid credentials
 *       500:
 *         description: error
 */
authRouter.post("/login", authController.login);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Registro de usuario
 *     tags: [Auth]
 *     description: Permite registrar un nuevo usuario en la plataforma. Devuelve el usuario creado y un token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             username: Juan Perez
 *             email: juan@example.com
 *             password: secret123
 *     responses:
 *       201:
 *         description: Signup succesful
 *         content:
 *           application/json:
 *             example:
 *               message: Signup succesful
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email, password, and username are required
 *         content:
 *           application/json:
 *             example:
 *               message: Email, password, and username are required
 *       500:
 *         description: error
 */
authRouter.post("/signup", authController.signup);


/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     description: Devuelve los datos del usuario autenticado. Requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: user object
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: "6512f1c2e1b2a3c4d5e6f7a8"
 *                 name: "Juan Perez"
 *                 email: "juan@example.com"
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             example:
 *               message: No token provided
 *       500:
 *         description: error
 */
authRouter.get("/profile", auth,authController.getProfile);