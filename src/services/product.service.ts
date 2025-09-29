import { ProductModel, type IProductDocument } from "../models/product.model";
import type mongoose from "mongoose";
import { securityService } from "./security.service";

class ProductService {
  async createProduct(productData: Partial<IProductDocument>) {
    const product = await ProductModel.create(productData);
    return product;
  }

  async getAllProducts() {
      const products = await ProductModel.find();
      return products;
    }
}

export const productService = new ProductService();
