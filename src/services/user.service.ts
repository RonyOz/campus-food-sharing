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
		// Validar campos requeridos
		if (!userData.email || !userData.password || !userData.username || !userData.role) {
			throw new Error("Username, email, password, and role are required");
		}

		// Validar formato de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(userData.email)) {
			throw new Error("Invalid email format");
		}

		const existingUser = await this.getUserByEmail(userData.email);
		if (existingUser) {
			return { user: null, error: "User with this email already exists", status: 409 };
		}

		const user = await UserModel.create(userData);
		return user;
	}

	async createUserByAdmin(userData: Partial<UserDocument>) {
		if (!userData.email || !userData.password || !userData.username || !userData.role) {
			return { user: null, error: "Username, email, password, and role are required", status: 400 };
		}

		const existingUser = await this.getUserByEmail(userData.email);
		if (existingUser) {
			return { user: null, error: "User with this email already exists", status: 409 };
		}

		const encryptedPassword = await securityService.encryptPassword(userData.password);

		const newUser = await UserModel.create({
			...userData,
			password: encryptedPassword,
		});

		const userObject = newUser.toObject() as Omit<UserDocument, "password"> & { password?: string };
		delete userObject.password;

		return { user: userObject, error: null, status: 201 };
	}

	async deleteUser(id: string) {
		const result = await UserModel.findByIdAndDelete(id);
		return result;
	}

	async getAllUsers() {
		const users = await UserModel.find();
		return users;
	}

	async getUserById(id: string) {
		return UserModel.findById(id);
	}

	async getUserByEmail(email: string) {
		const users = await UserModel.findOne({ email });
		return users;
	}

	async getUserByToken(token: string) {
		const decoded = securityService.verifyToken(token);
		if (!decoded) {
			return null;
		}
		const user = await this.getUserByEmail(decoded.email);
		return user;
	}

	async updateUser(id: string, updates: Partial<UserDocument>) {
		const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true });
		return updatedUser;
	}

}

export const userService = new UserService();