import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export interface AuthRequest extends Request {
  user?: { id: number; username: string; email: string; role: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
