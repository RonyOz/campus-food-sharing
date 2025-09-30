import { productService } from '../../../src/services/product.service';
import { ProductModel } from '../../../src/models/product.model';
import mongoose from 'mongoose';

jest.mock('../../../src/models/product.model');

describe('ProductService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('debería crear un producto', async () => {
      const productData = { name: 'Test Product', price: 100 };
      const product = { ...productData, _id: 'a-product-id' };
      (ProductModel.create as jest.Mock).mockResolvedValue(product);

      const result = await productService.createProduct(productData);

      expect(ProductModel.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(product);
    });
  });

  describe('getAllProducts', () => {
    it('debería devolver todos los productos', async () => {
      const products = [{ name: 'Product 1' }, { name: 'Product 2' }];
      (ProductModel.find as jest.Mock).mockResolvedValue(products);

      const result = await productService.getAllProducts();

      expect(ProductModel.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('getProductById', () => {
    it('debería devolver un producto por su id', async () => {
      const product = { name: 'Test Product', _id: 'a-product-id' };
      (ProductModel.findById as jest.Mock).mockResolvedValue(product);

      const result = await productService.getProductById('a-product-id');

      expect(ProductModel.findById).toHaveBeenCalledWith('a-product-id');
      expect(result).toEqual(product);
    });
  });

  describe('updateProduct', () => {
    it('debería actualizar un producto', async () => {
      const updates = { name: 'Updated Product' };
      const updatedProduct = { name: 'Updated Product', _id: 'a-product-id' };
      (ProductModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct('a-product-id', updates);

      expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith('a-product-id', updates, { new: true });
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('debería eliminar un producto', async () => {
      const deletedProduct = { name: 'Deleted Product', _id: 'a-product-id' };
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedProduct);

      const result = await productService.deleteProduct('a-product-id');

      expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith('a-product-id');
      expect(result).toEqual(deletedProduct);
    });
  });
});