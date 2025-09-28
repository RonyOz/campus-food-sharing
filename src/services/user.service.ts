import type mongoose from "mongoose";
import { UserModel, type UserDocument } from "../models/user.model";
import { securityService } from "./security.service";

class UserService {

	async signupUser(userData: UserDocument) {
		const existingUser: UserDocument | null = await this.getUserByEmail(userData.email);

		if (existingUser) {
			return { user: null, token: null, error: "User already exists", status: 409 };
		}
		
		const token = await securityService.generateToken(
			userData._id as mongoose.Types.ObjectId,
			userData.email,
			userData.role
		);
		
		userData.password = await securityService.encryptPassword(userData.password);

		const user  = await this.createUser(userData);

		return { user, token, error: null, status: 201 };
	}

	async loginUser(email: string, password: string) {
		const user = await this.getUserByEmail(email);

		if (!user) {
			return { user: null, token: null };
		}

		const isMatch = await securityService.comparePassword(password, user.password);

		if (!isMatch) {
			return { user: null, token: null };
		}

		const token = await securityService.generateToken(
			user._id as mongoose.Types.ObjectId,
			user.email,
			user.role
		);

		return { user, token };
	}

	async createUser(userData: UserDocument) {
		const user = await UserModel.create(userData);
		return user;
	}

	async getUserByEmail(email: string) {
		const users = await UserModel.findOne({ email });
		return users;
	}

}

export const userService = new UserService();