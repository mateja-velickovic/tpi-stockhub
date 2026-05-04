import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../src/middleware/errorHandler.middleware";

describe("errorHandler middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 401 for Invalid credentials", () => {
    const err = new Error("Invalid credentials");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return 404 for not found errors", () => {
    const err = new Error("Product not found");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Product not found" });
  });

  it("should return 404 for category not found", () => {
    const err = new Error("Category not found");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it("should return 400 for already exists errors", () => {
    const err = new Error("Email already in use");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Email already in use",
    });
  });

  it("should return 400 for Cannot delete errors", () => {
    const err = new Error("Cannot delete category with associated products");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Cannot delete category with associated products",
    });
  });

  it("should return 400 for Insufficient stock errors", () => {
    const err = new Error("Insufficient stock");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Insufficient stock" });
  });

  it("should return 500 for unknown errors", () => {
    const err = new Error("Something completely unexpected");
    errorHandler(err, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });
});
