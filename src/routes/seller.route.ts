import { Router } from 'express';
import { sellerController } from '../controllers/seller.controller';

export const sellerRouter = Router();

// Public endpoints
// GET /sellers -> list all sellers
sellerRouter.get('/', sellerController.listSellers);

// GET /sellers/:id -> seller public profile with products and sales history
sellerRouter.get('/:id', sellerController.getSellerById);
