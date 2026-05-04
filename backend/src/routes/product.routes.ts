import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, productController.getAll.bind(productController));
router.get('/low-stock', authenticate, productController.getLowStock.bind(productController));
router.get('/:id', authenticate, productController.getById.bind(productController));
router.post('/', authenticate, productController.create.bind(productController));
router.put('/:id', authenticate, productController.update.bind(productController));
router.delete('/:id', authenticate, productController.delete.bind(productController));

export default router;
