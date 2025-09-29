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
    

    async getProductById(req:Request, res:Response) {
        try{
            const productId: string | undefined = req.params.id;
            
            if (!productId){
                return res.status(400).json({message: "Product ID is missing"});
            }

            const product = await productService.getProductById(productId);

            if (!product){
                return res.status(404).json({message: "Product not found"});
            }

            res.status(200).json(product);

        }catch(error){
            res.status(500).json(error);
        }
    }

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


    async updateProduct(req: Request, res: Response) {
        try {
            const productId= req.params.id;
            if (!productId){
                return res.status(404).json({message: "Product Id is missing"});
            }

            const updates= req.body;
            if(!updates || Object.keys(updates).length === 0){
                return res.status(400).json({message: "Update data is required"});
            }

            const updated= await productService.updateProduct(productId, updates);

            if (!updated){
                return res.status(404).json({message: "Product not found"});
            }
            res.status(200).json(updated);
        }catch(error){
            res.status(500).json(error);
        }

    }

  async deleteProduct(req: Request, res: Response) {}

}

export const productController = new ProductController();