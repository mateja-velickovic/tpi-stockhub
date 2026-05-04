import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, categoryController.getAll.bind(categoryController));
router.get('/:id', authenticate, categoryController.getById.bind(categoryController));
router.post('/', authenticate, categoryController.create.bind(categoryController));
router.put('/:id', authenticate, categoryController.update.bind(categoryController));
router.delete('/:id', authenticate, categoryController.delete.bind(categoryController));

export default router;
