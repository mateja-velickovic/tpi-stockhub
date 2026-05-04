import { AuthService } from "../../../src/services/auth.service";
import { User } from "../../../src/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../../src/models");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register user and return sanitized user + token", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@test.com",
        role: "manager",
        password: "hashed",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("fake-token");

      const result = await service.register(
        "testuser",
        "test@test.com",
        "password123",
      );

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@test.com" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(result.token).toBe("fake-token");
      expect(result.user).toEqual({
        id: 1,
        username: "testuser",
        email: "test@test.com",
        role: "manager",
      });
      expect(result.user).not.toHaveProperty("password");
    });

    it("should default role to manager", async () => {
      const mockUser = {
        id: 1,
        username: "u",
        email: "e@e.com",
        role: "manager",
        password: "h",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("h");
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("tok");

      await service.register("u", "e@e.com", "p");

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: "manager" }),
      );
    });

    it("should support admin role", async () => {
      const mockUser = {
        id: 2,
        username: "admin",
        email: "admin@test.com",
        role: "admin",
        password: "h",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("h");
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("tok");

      const result = await service.register(
        "admin",
        "admin@test.com",
        "pass",
        "admin",
      );

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: "admin" }),
      );
      expect(result.user.role).toBe("admin");
    });

    it("should throw if email already in use", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@test.com",
      });

      await expect(
        service.register("user", "test@test.com", "pass"),
      ).rejects.toThrow("Email already in use");
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login and return sanitized user + token", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@test.com",
        role: "manager",
        password: "hashed",
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("fake-token");

      const result = await service.login("test@test.com", "password123");

      expect(result.token).toBe("fake-token");
      expect(result.user).toEqual({
        id: 1,
        username: "testuser",
        email: "test@test.com",
        role: "manager",
      });
      expect(result.user).not.toHaveProperty("password");
    });

    it("should throw if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.login("nobody@test.com", "pass")).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("should throw if password invalid", async () => {
      const mockUser = { id: 1, email: "test@test.com", password: "hashed" };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login("test@test.com", "wrongpass")).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });
});
