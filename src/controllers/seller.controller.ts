import type { Request, Response } from 'express';
import { sellerService } from '../services/seller.service';

class SellerController {
  async listSellers(req: Request, res: Response) {
    try {
      const { sellers } = await sellerService.listSellers();
      res.status(200).json({ sellers });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getSellerById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: 'Seller id is required' });
      const result = await sellerService.getSellerPublicProfile(id);
      if (result.error) return res.status(result.status!).json({ message: result.error });
      res.status(200).json(result.profile);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export const sellerController = new SellerController();
