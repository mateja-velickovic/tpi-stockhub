import { Request, Response, NextFunction } from "express";
import { AuthController } from "../../../src/controllers/auth.controller";
import authService from "../../../src/services/auth.service";
import type { AuthRequest } from "../../../src/middleware/auth.middleware";

jest.mock("../../../src/services/auth.service");

describe("AuthController", () => {
  let controller: AuthController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new AuthController();
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@test.com",
        password: "password123",
      };
      const mockResult = {
        user: { id: 1, ...userData, role: "manager" },
        token: "fake-token",
      };

      mockReq.body = userData;
      (authService.register as jest.Mock).mockResolvedValue(mockResult);

      await controller.register(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should call next on error", async () => {
      const error = new Error("Email already in use");
      mockReq.body = {
        username: "test",
        email: "test@test.com",
        password: "pass",
      };
      (authService.register as jest.Mock).mockRejectedValue(error);

      await controller.register(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should log in a user", async () => {
      const credentials = {
        email: "test@test.ch",
        password: "password123",
      };
      const mockResult = {
        user: { id: 1, username: "testuser", email: "test@test.ch", role: "manager" },
        token: "fake-token",
      };

      mockReq.body = credentials;
      (authService.login as jest.Mock).mockResolvedValue(mockResult);

      await controller.login(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe("profile", () => {
    it("should return authenticated user from req.user", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@test.com",
        role: "manager",
      };
      (mockReq as AuthRequest).user = mockUser;

      await controller.profile(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });
});
