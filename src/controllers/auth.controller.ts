import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import type { UserDocument } from "../models/user.model";


class AuthController {

    async signup(req: Request, res: Response) {
        try {
            const { email, password, username } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({ message: "Email, password, and username are required" });
            }

            const { user, token, error, status } = await userService.signupUser({ email, password, role: 'buyer', username } as UserDocument);

            if (error) {
                return res.status(status || 400).json({ message: error });
            }

            res.status(201).json({ message: "Signup succesful", token });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const { user, token } = await userService.loginUser(email, password);

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.status(200).json({ message: "Login succesful", token });
        } catch (error) {
            res.status(500).json(error);
        }
    }

}

export const authController = new AuthController();