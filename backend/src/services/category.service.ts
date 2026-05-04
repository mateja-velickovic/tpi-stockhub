import { Category, Product } from '../models';

export class CategoryService {
  async findAll() {
    return Category.findAll({
      include: [{ model: Product, as: 'products' }],
      order: [['name', 'ASC']],
    });
  }

  async findById(id: number) {
    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: 'products' }],
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async create(data: { name: string; description?: string }) {
    const existing = await Category.findOne({ where: { name: data.name } });
    if (existing) {
      throw new Error('Category name already exists');
    }
    return Category.create(data);
  }

  async update(id: number, data: Partial<{ name: string; description: string }>) {
    const category = await this.findById(id);
    return category.update(data);
  }

  async delete(id: number) {
    const category = await this.findById(id);
    const productCount = await Product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new Error('Cannot delete category with associated products');
    }
    await category.destroy();
  }
}

export default new CategoryService();
