import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import type { UserDocument } from "../models/user.model";


class UserController {

	async getAllUsers(req: Request, res: Response) { }

	async getUserById(req: Request, res: Response) { }

	async createUser(req: Request, res: Response) { }

	async updateUser(req: Request, res: Response) { }

	async deleteUser(req: Request, res: Response) { }

}

export const userController = new UserController();