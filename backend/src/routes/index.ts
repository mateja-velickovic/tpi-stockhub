import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import stockMovementRoutes from './stockMovement.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/stock-movements', stockMovementRoutes);

export default router;
