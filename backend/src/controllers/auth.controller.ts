import { Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, email, password, role } = req.body;
      const result = await authService.register(username, email, password, role);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async profile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
