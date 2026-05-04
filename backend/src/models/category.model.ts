import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CategoryAttributes {
  id: number;
  name: string;
  description: string | null;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id' | 'description'>;

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  }
);

export default Category;
