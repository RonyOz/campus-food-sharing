import { Router } from "express";
import { userController } from "../controllers/user.controller";

export const adminRouter = Router();

/**
 * @openapi
 * /admin/users:
 *   post:
 *     summary: Crear un usuario por el administrador de la aplicacion
 *     tags: [Admin]
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
 *       400:
 *         description: Faltan datos requeridos.
 *       403:
 *         description: Prohibido. No es administrador.
 *       409:
 *         description: Conflicto, el email ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
adminRouter.post("/user", userController.createUserByAdmin);