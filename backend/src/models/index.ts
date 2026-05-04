import User from './user.model';
import Category from './category.model';
import Product from './product.model';
import StockMovement from './stockMovement.model';

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Product.hasMany(StockMovement, { foreignKey: 'productId', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(StockMovement, { foreignKey: 'userId', as: 'movements' });
StockMovement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Category, Product, StockMovement };
