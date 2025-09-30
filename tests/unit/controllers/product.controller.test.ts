// tests/unit/controllers/product.controller.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';
import { productController } from '../../../src/controllers/product.controller';
import { productService } from '../../../src/services/product.service';

jest.mock('../../../src/services/product.service');

const mockedProductService = productService as jest.Mocked<typeof productService>;

const makeRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  res.send = jest.fn().mockReturnValue(res) as unknown as Response['send'];
  return res as Response;
};

const makeReq = (overrides: Partial<Request> = {}): Request => {
  const req = { body: {}, params: {}, ...overrides };
  return req as Request;
};

describe('ProductController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('debería retornar una lista de productos con estado 200', async () => {
      const products = [{ name: 'Product 1' }, { name: 'Product 2' }];
      mockedProductService.getAllProducts.mockResolvedValue(products as any);
      const req = makeReq();
      const res = makeRes();
      await productController.getAllProducts(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });
  });

  describe('getProductById', () => {
    it('debería retornar 404 si el producto no se encuentra', async () => {
      mockedProductService.getProductById.mockResolvedValue(null);
      const req = makeReq({ params: { id: 'non-existent-id' } });
      const res = makeRes();
      await productController.getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });
  });

  describe('createProduct', () => {
    it('debería crear un producto y retornar 201', async () => {
      const product = { name: 'New Product', price: 10 };
      mockedProductService.createProduct.mockResolvedValue(product as any);
      // Aquí casteamos `req` a `any` para poder añadir la propiedad `user`
      const req = makeReq({ body: product, user: { _id: 'seller-id' } } as any);
      const res = makeRes();
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Product created", product });
    });
  });

  describe('deleteProduct', () => {
    it('debería eliminar un producto y retornar 204', async () => {
      mockedProductService.deleteProduct.mockResolvedValue({ id: 'deleted-id' } as any);
      const req = makeReq({ params: { id: 'deleted-id' } });
      const res = makeRes();
      await productController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});