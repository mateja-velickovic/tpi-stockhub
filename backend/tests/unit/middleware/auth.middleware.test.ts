import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  authenticate,
  AuthRequest,
} from "../../../src/middleware/auth.middleware";
import { User } from "../../../src/models";

jest.mock("jsonwebtoken");
jest.mock("../../../src/models");

describe("Auth Middleware", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should reject request without token", async () => {
    await authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Access token required",
    });
  });

  it("should authenticate valid token", async () => {
    mockReq.headers = { authorization: "Bearer valid-token" };
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@test.com",
      role: "admin",
    };

    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    await authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should reject expired token", async () => {
    mockReq.headers = { authorization: "Bearer expired-token" };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it("should reject when user not found in database", async () => {
    mockReq.headers = { authorization: "Bearer valid-token" };
    (jwt.verify as jest.Mock).mockReturnValue({ id: 99 });
    (User.findByPk as jest.Mock).mockResolvedValue(null);

    await authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
  });
});

import { authorize } from "../../../src/middleware/auth.middleware";

describe("authorize middleware", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("should call next when user has required role", () => {
    mockReq = { user: { id: 1, username: "admin", email: "admin@test.com", role: "admin" } };
    const middleware = authorize("admin", "manager");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return 403 when user role not in allowed list", () => {
    mockReq = { user: { id: 1, username: "manager", email: "manager@test.com", role: "manager" } };
    const middleware = authorize("admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Insufficient permissions",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 when req.user is missing", () => {
    mockReq = {};
    const middleware = authorize("admin");

    middleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
  });
});
