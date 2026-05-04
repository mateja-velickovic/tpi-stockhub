import { Request, Response, NextFunction } from "express";
import { CategoryController } from "../../../src/controllers/category.controller";
import categoryService from "../../../src/services/category.service";

jest.mock("../../../src/services/category.service");

describe("CategoryController", () => {
  let controller: CategoryController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new CategoryController();
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
    it("should return all categories", async () => {
      const mockCategories = [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Tools" },
      ];
      (categoryService.findAll as jest.Mock).mockResolvedValue(mockCategories);

      await controller.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ data: mockCategories });
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (categoryService.findAll as jest.Mock).mockRejectedValue(error);

      await controller.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getById", () => {
    it("should return category by id", async () => {
      const mockCategory = { id: 1, name: "Electronics", products: [] };
      mockReq.params = { id: "1" };
      (categoryService.findById as jest.Mock).mockResolvedValue(mockCategory);

      await controller.getById(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(categoryService.findById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockCategory });
    });

    it("should call next when category not found", async () => {
      mockReq.params = { id: "999" };
      const error = new Error("Category not found");
      (categoryService.findById as jest.Mock).mockRejectedValue(error);

      await controller.getById(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    it("should create category and return 201", async () => {
      const newCategory = { name: "New Category", description: "desc" };
      const created = { id: 1, ...newCategory };
      mockReq.body = newCategory;
      (categoryService.create as jest.Mock).mockResolvedValue(created);

      await controller.create(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: created });
    });

    it("should call next on duplicate name", async () => {
      mockReq.body = { name: "Electronics" };
      const error = new Error("Category name already exists");
      (categoryService.create as jest.Mock).mockRejectedValue(error);

      await controller.create(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("delete", () => {
    it("should delete category and return 204", async () => {
      mockReq.params = { id: "1" };
      (categoryService.delete as jest.Mock).mockResolvedValue(undefined);

      await controller.delete(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(categoryService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should call next if category has products", async () => {
      mockReq.params = { id: "1" };
      const error = new Error(
        "Cannot delete category with associated products",
      );
      (categoryService.delete as jest.Mock).mockRejectedValue(error);

      await controller.delete(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
