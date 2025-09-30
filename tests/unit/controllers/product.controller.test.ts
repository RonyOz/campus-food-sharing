// tests/unit/controllers/product.controller.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';
import { productController } from '../../../src/controllers/product.controller';
import { productService } from '../../../src/services/product.service';

jest.mock('../../../src/services/product.service');

const mockedProductService = productService as jest.Mocked<typeof productService>;

const makeRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn((_code?: number) => res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  res.send = jest.fn((_?: any) => res);
  return res;
};

const makeReq = (overrides: Partial<Request> = {}): Request => {
  return { body: {}, params: {}, ...overrides } as Request;
};

describe('ProductController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProduct', () => {
    it('debería retornar 404 si el ID del producto no se proporciona', async () => {
        const req = makeReq({ body: { name: 'New Name' } }); // No params.id
        const res = makeRes();
        await productController.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product Id is missing' });
    });

    it('debería retornar 400 si no se proporcionan datos para actualizar', async () => {
        const req = makeReq({ params: { id: 'some-id' }, body: {} });
        const res = makeRes();
        await productController.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Update data is required' });
    });

    it('debería retornar 404 si el producto a actualizar no se encuentra', async () => {
        mockedProductService.updateProduct.mockResolvedValue(null);
        const req = makeReq({ params: { id: 'not-found-id' }, body: { name: 'New Name' } });
        const res = makeRes();
        await productController.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

     it('debería manejar errores del servidor al actualizar', async () => {
        const error = new Error('Update failed');
        mockedProductService.updateProduct.mockRejectedValue(error);
        const req = makeReq({ params: { id: 'some-id' }, body: { name: 'New Name' } });
        const res = makeRes();
        await productController.updateProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteProduct', () => {
    it('debería retornar 400 si no se proporciona el ID del producto', async () => {
        const req = makeReq(); // No params.id
        const res = makeRes();
        await productController.deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product ID is required' });
    });

    it('debería retornar 404 si el producto a eliminar no se encuentra', async () => {
        mockedProductService.deleteProduct.mockResolvedValue(null);
        const req = makeReq({ params: { id: 'not-found-id' } });
        const res = makeRes();
        await productController.deleteProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'product not found' });
    });
  });
});

describe('ProductController Adicional', () => {
    it('getAllProducts debería manejar errores del servidor', async () => {
        const req = makeReq();
        const res = makeRes();
        const error = new Error("DB Error");
        mockedProductService.getAllProducts.mockRejectedValue(error);
        await productController.getAllProducts(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });

    it('getProductById debería manejar errores del servidor', async () => {
        const req = makeReq({ params: { id: 'some-id' } });
        const res = makeRes();
        const error = new Error("DB Error");
        mockedProductService.getProductById.mockRejectedValue(error);
        await productController.getProductById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });

    it('createProduct debería manejar errores del servidor', async () => {
        const req = makeReq({ body: { name: 'Test', price: 10 }, user: { _id: 'seller-id' } } as any);
        const res = makeRes();
        const error = new Error("Creation failed");
        mockedProductService.createProduct.mockRejectedValue(error);
        await productController.createProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});