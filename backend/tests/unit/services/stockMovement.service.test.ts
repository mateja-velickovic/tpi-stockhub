import { StockMovementService } from '../../../src/services/stockMovement.service';
import { StockMovement, Product, User } from '../../../src/models';

jest.mock('../../../src/models');

describe('StockMovementService', () => {
  let service: StockMovementService;

  beforeEach(() => {
    service = new StockMovementService();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all stock movements', async () => {
      const mockMovements = [{ id: 1, type: 'IN', quantity: 10 }];
      (StockMovement.findAll as jest.Mock).mockResolvedValue(mockMovements);

      const result = await service.findAll();

      expect(StockMovement.findAll).toHaveBeenCalledWith({
        include: [
          { model: Product, as: 'product' },
          { model: User, as: 'user' },
        ],
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual(mockMovements);
    });
  });

  describe('create', () => {
    it('should create an IN movement and update stock', async () => {
      const mockProduct = { id: 1, quantity: 10, update: jest.fn() };
      const movementData = { type: 'IN' as const, quantity: 5, reason: 'Restock', productId: 1, userId: 1 };
      const mockMovement = { id: 1, ...movementData };

      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
      (StockMovement.create as jest.Mock).mockResolvedValue(mockMovement);

      const result = await service.create(movementData);

      expect(result).toEqual(mockMovement);
      expect(mockProduct.update).toHaveBeenCalledWith({ quantity: 15 });
    });

    it('should throw on insufficient stock for OUT movement', async () => {
      const mockProduct = { id: 1, quantity: 3 };
      const movementData = { type: 'OUT' as const, quantity: 5, reason: 'Withdrawal', productId: 1, userId: 1 };

      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      await expect(service.create(movementData)).rejects.toThrow('Insufficient stock');
    });

    it('should create an OUT movement and decrement stock', async () => {
      const mockProduct = { id: 1, quantity: 20, update: jest.fn() };
      const movementData = { type: 'OUT' as const, quantity: 5, reason: 'Sale', productId: 1, userId: 1 };
      const mockMovement = { id: 2, ...movementData };

      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
      (StockMovement.create as jest.Mock).mockResolvedValue(mockMovement);

      const result = await service.create(movementData);

      expect(result).toEqual(mockMovement);
      expect(mockProduct.update).toHaveBeenCalledWith({ quantity: 15 });
    });

    it('should throw if product not found', async () => {
      const movementData = { type: 'IN' as const, quantity: 5, reason: 'Restock', productId: 999, userId: 1 };
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.create(movementData)).rejects.toThrow('Product not found');
      expect(StockMovement.create).not.toHaveBeenCalled();
    });
  });

  describe('findByProductId', () => {
    it('should return movements for a specific product', async () => {
      const mockMovements = [{ id: 1, type: 'IN', quantity: 10, productId: 5 }];
      (StockMovement.findAll as jest.Mock).mockResolvedValue(mockMovements);

      const result = await service.findByProductId(5);

      expect(StockMovement.findAll).toHaveBeenCalledWith({
        where: { productId: 5 },
        include: [{ model: User, as: 'user' }],
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual(mockMovements);
    });
  });
});
