import type { Request, Response } from "express";
import { productService } from "../services/product.service";
import type {IProductDocument} from "../models/product.model";

class ProductController{

    async getAllProducts(req:Request, res:Response) {
        try{
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        }catch(error){
            res.status(500).json(error);

        }
    }

    async getProductById(req:Request, res:Response) {}

    async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, available } = req.body;
      const sellerId = (req as any).user._id; // esto viene del token en el middleware "auth"

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      const product = await productService.createProduct({
        name,
        description,
        price,
        available,
        sellerId,
      });

      res.status(201).json({ message: "Product created", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating product", error });
    }
  }

  async updateProduct(req: Request, res: Response) {}

  async deleteProduct(req: Request, res: Response) {}

}

export const productController = new ProductController();