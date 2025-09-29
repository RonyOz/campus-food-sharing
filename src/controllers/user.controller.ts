import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import type mongoose from "mongoose";

class UserController {

	async getAllUsers(req: Request, res: Response) {
		try {
			const users = await userService.getAllUsers();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json(error);
		}
	 }

	async getUserById(req: Request, res: Response) {
		try {
			
			const userId: string | undefined = req.params.id;

			if (!userId) {
				return res.status(400).json({ message: "User ID is missing" });
			}

			const user = await userService.getUserById(userId);

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			res.status(200).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async createUser(req: Request, res: Response) {
		//TODO
	 }

	async updateUser(req: Request, res: Response) { }

	async deleteUser(req: Request, res: Response) { }

}

export const userController = new UserController();