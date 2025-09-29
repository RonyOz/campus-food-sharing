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
		try {
			const data = req.body;
			if (!data || Object.keys(data).length === 0) {
				return res.status(400).json({ message: "User data is required" });
			}
			const user = await userService.createUser(data);
			res.status(201).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async createUserByAdmin(req: Request, res: Response) {
		try {
			const data = req.body;
			if (!data || Object.keys(data).length === 0) {
				return res.status(400).json({ message: "User data is required" });
			}

			const { user, error, status } = await userService.createUserByAdmin(data);

			if (error) {
				return res.status(status!).json({ message: error });
			}

			res.status(201).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async updateUser(req: Request, res: Response) {
		try {
			const userId = req.params.id;
			if (!userId) {
				return res.status(400).json({ message: "User ID is missing" });
			}
			const updates = req.body;
			if (!updates || Object.keys(updates).length === 0) {
				return res.status(400).json({ message: "Update data is required" });
			}
			const updated = await userService.updateUser(userId, updates);

			if (!updated) {
				return res.status(404).json({ message: "User not found" });
			}
			res.status(200).json(updated);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async deleteUser(req: Request, res: Response) {
		try {
			const userId = req.params.id;
			if (!userId) {
				return res.status(400).json({ message: "User ID is missing" });
			}
			const deleted = await userService.deleteUser(userId);
			if (!deleted) {
				return res.status(404).json({ message: "User not found" });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json(error);
		}
	}

}

export const userController = new UserController();