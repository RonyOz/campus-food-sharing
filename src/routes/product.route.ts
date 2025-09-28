import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const productRouter = Router();

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.post("/", auth, authorizeRoles(['seller','admin']), productController.createProduct);
productRouter.put("/:id", auth, authorizeRoles(['seller','admin']), productController.updateProduct);
productRouter.delete("/:id", auth, authorizeRoles(['seller','admin']), productController.deleteProduct);