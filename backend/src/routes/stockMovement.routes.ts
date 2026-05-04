import { Router } from 'express';
import stockMovementController from '../controllers/stockMovement.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, stockMovementController.getAll.bind(stockMovementController));
router.get('/product/:productId', authenticate, stockMovementController.getByProductId.bind(stockMovementController));
router.post('/', authenticate, stockMovementController.create.bind(stockMovementController));

export default router;
