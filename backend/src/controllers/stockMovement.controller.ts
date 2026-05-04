import { Response, NextFunction } from 'express';
import stockMovementService from '../services/stockMovement.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class StockMovementController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const movements = await stockMovementService.findAll();
      res.json({ data: movements });
    } catch (error) {
      next(error);
    }
  }

  async getByProductId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const movements = await stockMovementService.findByProductId(Number(req.params.productId));
      res.json({ data: movements });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const movement = await stockMovementService.create({
        ...req.body,
        userId,
      });
      res.status(201).json({ data: movement });
    } catch (error) {
      next(error);
    }
  }
}

export default new StockMovementController();
