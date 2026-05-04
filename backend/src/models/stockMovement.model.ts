import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StockMovementAttributes {
  id: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  productId: number;
  userId: number;
}

type StockMovementCreationAttributes = Optional<StockMovementAttributes, 'id'>;

class StockMovement extends Model<StockMovementAttributes, StockMovementCreationAttributes> implements StockMovementAttributes {
  public id!: number;
  public type!: 'IN' | 'OUT';
  public quantity!: number;
  public reason!: string;
  public productId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StockMovement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('IN', 'OUT'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'stock_movements',
    timestamps: true,
  }
);

export default StockMovement;
