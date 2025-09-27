import type { Request, Response } from "express";

class UserController{

    async getAllUsers(req:Request, res:Response) {}

    async getUserById(req:Request, res:Response) {}

    async createUser(req:Request, res:Response) {}

    async updateUser(req:Request, res:Response) {}

    async deleteUser(req:Request, res:Response) {}

}

export const userController = new UserController();