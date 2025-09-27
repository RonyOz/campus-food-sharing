import type { Request, Response } from "express";

class ProductController{

    async getAllProducts(req:Request, res:Response) {}

    async getProductById(req:Request, res:Response) {}

    async createProduct(req:Request, res:Response) {}

    async updateProduct(req:Request, res:Response) {}

    async deleteProduct(req:Request, res:Response) {}

}

export const productController = new ProductController();