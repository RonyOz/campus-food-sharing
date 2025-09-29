import { ProductModel, type IProductDocument } from "../models/product.model";
import type mongoose from "mongoose";

import { securityService } from "./security.service";

class ProductService {
  async createProduct(productData: Partial<IProductDocument>) {
    const product = await ProductModel.create(productData);
    return product;
  }
}

export const productService = new ProductService();
