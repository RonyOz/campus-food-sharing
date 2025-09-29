import type { Request, Response } from "express";
import { userService } from "../services/user.service";

class UserController {

	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await userService.getAllUsers();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json(error);
		}
	 }

	async getUserById(req: Request, res: Response) { }

	async createUser(req: Request, res: Response) { }

	async updateUser(req: Request, res: Response) { }

	async deleteUser(req: Request, res: Response) { }

}

export const userController = new UserController();