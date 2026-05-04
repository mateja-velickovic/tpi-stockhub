import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';

export class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.findAll();
      res.json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.findById(Number(req.params.id));
      res.json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.body);
      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(Number(req.params.id), req.body);
      res.json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
