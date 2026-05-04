import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.findAll();
      res.json({ data: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.findById(Number(req.params.id));
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(Number(req.params.id), req.body);
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.findLowStock();
      res.json({ data: products });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
