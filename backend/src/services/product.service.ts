import { Product, Category } from '../models';

export class ProductService {
  async findAll() {
    return Product.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number) {
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async create(data: {
    name: string;
    sku: string;
    description?: string;
    price: number;
    quantity?: number;
    minQuantity?: number;
    categoryId: number;
  }) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return Product.create(data);
  }

  async update(id: number, data: Partial<{
    name: string;
    sku: string;
    description: string;
    price: number;
    minQuantity: number;
    categoryId: number;
  }>) {
    const product = await this.findById(id);
    return product.update(data);
  }

  async delete(id: number) {
    const product = await this.findById(id);
    await product.destroy();
  }

  async findLowStock() {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
    });
    return products.filter(p => p.quantity <= p.minQuantity);
  }
}

export default new ProductService();
