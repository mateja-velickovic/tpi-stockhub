import { Request, Response, NextFunction } from "express";
import { ProductController } from "../../../src/controllers/product.controller";
import productService from "../../../src/services/product.service";

jest.mock("../../../src/services/product.service");

describe("ProductController", () => {
  let controller: ProductController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new ProductController();
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all products", async () => {
      const mockProducts = [
        { id: 1, name: "Laptop", sku: "ELEC-001" },
        { id: 2, name: "Monitor", sku: "ELEC-002" },
      ];

      (productService.findAll as jest.Mock).mockResolvedValue(mockProducts);

      await controller.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockProducts });
    });
  });

  describe("getById", () => {
    it("should return a product by id", async () => {
      const mockProduct = { id: 1, name: "Laptop", sku: "ELEC-001" };
      mockReq.params = { id: "1" };

      (productService.findById as jest.Mock).mockResolvedValue(mockProduct);

      await controller.getById(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockProduct });
    });

    it("should call next when product not found", async () => {
      mockReq.params = { id: "999" };
      const error = new Error("Product not found");
      (productService.findById as jest.Mock).mockRejectedValue(error);

      await controller.getById(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should update and return product", async () => {
      const updated = { id: 1, name: "Updated Laptop", sku: "ELEC-001" };
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Laptop" };
      (productService.update as jest.Mock).mockResolvedValue(updated);

      await controller.update(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(productService.update).toHaveBeenCalledWith(1, {
        name: "Updated Laptop",
      });
      expect(mockRes.json).toHaveBeenCalledWith({ data: updated });
    });

    it("should call next when product not found", async () => {
      mockReq.params = { id: "999" };
      const error = new Error("Product not found");
      (productService.update as jest.Mock).mockRejectedValue(error);

      await controller.update(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getLowStock", () => {
    it("should return low stock products", async () => {
      const mockLowStock = [
        { id: 1, name: "Laptop", quantity: 2, minQuantity: 10 },
      ];
      (productService.findLowStock as jest.Mock).mockResolvedValue(
        mockLowStock,
      );

      await controller.getLowStock(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockLowStock });
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (productService.findLowStock as jest.Mock).mockRejectedValue(error);

      await controller.getLowStock(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
