import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);

userRouter.get("/", userController.getAllUsers,auth,authorizeRoles(['admin']));
userRouter.get("/:id", userController.getUserById,auth);
userRouter.put("/:id", userController.updateUser,auth);
userRouter.delete("/:id", userController.deleteUser,auth,authorizeRoles(['admin']));