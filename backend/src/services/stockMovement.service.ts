import { StockMovement, Product, User } from '../models';

export class StockMovementService {
  async findAll() {
    return StockMovement.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'user' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByProductId(productId: number) {
    return StockMovement.findAll({
      where: { productId },
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']],
    });
  }

  async create(data: {
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    productId: number;
    userId: number;
  }) {
    const product = await Product.findByPk(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (data.type === 'OUT' && product.quantity < data.quantity) {
      throw new Error('Insufficient stock');
    }

    const movement = await StockMovement.create(data);

    const newQuantity = data.type === 'IN'
      ? product.quantity + data.quantity
      : product.quantity - data.quantity;
    await product.update({ quantity: newQuantity });

    return movement;
  }
}

export default new StockMovementService();
