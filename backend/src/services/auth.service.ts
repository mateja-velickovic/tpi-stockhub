import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  async register(username: string, email: string, password: string, role: 'admin' | 'manager' = 'manager') {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}

export default new AuthService();
