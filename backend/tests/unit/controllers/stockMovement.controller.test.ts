import { Response, NextFunction } from 'express';
import { StockMovementController } from '../../../src/controllers/stockMovement.controller';
import stockMovementService from '../../../src/services/stockMovement.service';
import type { AuthRequest } from '../../../src/middleware/auth.middleware';

jest.mock('../../../src/services/stockMovement.service');

describe('StockMovementController', () => {
  let controller: StockMovementController;
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new StockMovementController();
    mockReq = { body: {}, params: {}, user: { id: 42, username: "user", email: "user@test.com", role: "admin" } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all stock movements', async () => {
      const mockMovements = [{ id: 1, type: 'IN', quantity: 10 }, { id: 2, type: 'OUT', quantity: 3 }];
      (stockMovementService.findAll as jest.Mock).mockResolvedValue(mockMovements);

      await controller.getAll(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockMovements });
    });

    it('should call next on error', async () => {
      const error = new Error('DB error');
      (stockMovementService.findAll as jest.Mock).mockRejectedValue(error);

      await controller.getAll(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getByProductId', () => {
    it('should return movements for a product', async () => {
      const mockMovements = [{ id: 1, type: 'IN', quantity: 5, productId: 7 }];
      mockReq.params = { productId: '7' };
      (stockMovementService.findByProductId as jest.Mock).mockResolvedValue(mockMovements);

      await controller.getByProductId(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(stockMovementService.findByProductId).toHaveBeenCalledWith(7);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockMovements });
    });

    it('should call next on error', async () => {
      mockReq.params = { productId: '999' };
      const error = new Error('Product not found');
      (stockMovementService.findByProductId as jest.Mock).mockRejectedValue(error);

      await controller.getByProductId(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('should create movement with userId injected from req.user', async () => {
      const movementData = { type: 'IN', quantity: 10, reason: 'Restock', productId: 1 };
      const created = { id: 1, ...movementData, userId: 42 };
      mockReq.body = movementData;
      mockReq.user = { id: 42, username: "user", email: "user@test.com", role: "admin" };
      (stockMovementService.create as jest.Mock).mockResolvedValue(created);

      await controller.create(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(stockMovementService.create).toHaveBeenCalledWith({ ...movementData, userId: 42 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: created });
    });

    it('should call next on insufficient stock', async () => {
      mockReq.body = { type: 'OUT', quantity: 100, reason: 'Sale', productId: 1 };
      const error = new Error('Insufficient stock');
      (stockMovementService.create as jest.Mock).mockRejectedValue(error);

      await controller.create(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should call next if product not found', async () => {
      mockReq.body = { type: 'IN', quantity: 5, reason: 'Restock', productId: 999 };
      const error = new Error('Product not found');
      (stockMovementService.create as jest.Mock).mockRejectedValue(error);

      await controller.create(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
