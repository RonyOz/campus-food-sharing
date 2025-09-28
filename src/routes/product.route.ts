import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { auth } from "../middlewares/auth.middleware";

export const productRouter = Router();

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.post("/", productController.createProduct,auth);
productRouter.put("/:id", productController.updateProduct,auth);
productRouter.delete("/:id", productController.deleteProduct,auth);