import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  minQuantity: number;
  categoryId: number;
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id' | 'quantity' | 'minQuantity' | 'description'>;

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public sku!: string;
  public description!: string | null;
  public price!: number;
  public quantity!: number;
  public minQuantity!: number;
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
);

export default Product;
