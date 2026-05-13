import { describe, it, expect, vi, beforeEach } from "vitest";

type RequestConfig = { headers: Record<string, string> };
type AxiosResponse = { data: unknown };

const mockState = vi.hoisted(() => {
  const state = {
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockPut: vi.fn(),
    mockDelete: vi.fn(),
    requestOnFulfilled: undefined as
      | undefined
      | ((config: RequestConfig) => RequestConfig),
    responseOnFulfilled: undefined as
      | undefined
      | ((response: AxiosResponse) => AxiosResponse),
    responseOnRejected: undefined as
      | undefined
      | ((error: unknown) => Promise<never>),
    requestUse: vi.fn(
      (onFulfilled: (config: RequestConfig) => RequestConfig) => {
        state.requestOnFulfilled = onFulfilled;
      },
    ),
    responseUse: vi.fn(
      (
        onFulfilled: (response: AxiosResponse) => AxiosResponse,
        onRejected: (error: unknown) => Promise<never>,
      ) => {
        state.responseOnFulfilled = onFulfilled;
        state.responseOnRejected = onRejected;
      },
    ),
  };
  return state;
});

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: mockState.mockGet,
      post: mockState.mockPost,
      put: mockState.mockPut,
      delete: mockState.mockDelete,
      interceptors: {
        request: { use: mockState.requestUse },
        response: { use: mockState.responseUse },
      },
    })),
  },
}));

import {
  authApi,
  productApi,
  categoryApi,
  stockMovementApi,
} from "../../../src/services/api.service";

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("registers request and response interceptors at startup", () => {
    expect(typeof mockState.requestOnFulfilled).toBe("function");
    expect(typeof mockState.responseOnFulfilled).toBe("function");
    expect(typeof mockState.responseOnRejected).toBe("function");
  });

  it("adds Authorization header when token exists", () => {
    localStorage.setItem("token", "jwt-token");
    const config = { headers: {} as Record<string, string> };

    const nextConfig = mockState.requestOnFulfilled?.(config);

    expect(nextConfig.headers.Authorization).toBe("Bearer jwt-token");
  });

  it("keeps request unchanged when token is missing", () => {
    const config = { headers: {} as Record<string, string> };

    const nextConfig = mockState.requestOnFulfilled?.(config);

    expect(nextConfig.headers.Authorization).toBeUndefined();
  });

  it("passes successful responses through response interceptor", () => {
    const response = { data: { ok: true } };

    const nextResponse = mockState.responseOnFulfilled?.(response);

    expect(nextResponse).toBe(response);
  });

  it("removes token and redirects on 401 response", async () => {
    localStorage.setItem("token", "jwt-token");
    const removeItemSpy = vi.spyOn(localStorage, "removeItem");

    const error = { response: { status: 401 } };
    await expect(mockState.responseOnRejected?.(error)).rejects.toEqual(error);

    expect(removeItemSpy).toHaveBeenCalledWith("token");
    expect(window.location.href).toContain("/login");
  });

  it("keeps token untouched for non-401 errors", async () => {
    localStorage.setItem("token", "jwt-token");
    const removeItemSpy = vi.spyOn(localStorage, "removeItem");

    const error = { response: { status: 500 } };
    await expect(mockState.responseOnRejected?.(error)).rejects.toEqual(error);

    expect(removeItemSpy).not.toHaveBeenCalled();
  });

  it("calls auth endpoints", async () => {
    await authApi.login({ email: "admin@stockhub.ch", password: "admin123" });
    await authApi.register({
      username: "admin",
      email: "admin@stockhub.ch",
      password: "admin123",
    });
    await authApi.profile();

    expect(mockState.mockPost).toHaveBeenNthCalledWith(1, "/auth/login", {
      email: "admin@stockhub.ch",
      password: "admin123",
    });
    expect(mockState.mockPost).toHaveBeenNthCalledWith(2, "/auth/register", {
      username: "admin",
      email: "admin@stockhub.ch",
      password: "admin123",
    });
    expect(mockState.mockGet).toHaveBeenCalledWith("/auth/profile");
  });

  it("calls all product endpoints", async () => {
    const payload = { name: "Laptop" };

    await productApi.getAll();
    await productApi.getById(1);
    await productApi.create(payload);
    await productApi.update(1, payload);
    await productApi.delete(1);
    await productApi.getLowStock();

    expect(mockState.mockGet).toHaveBeenCalledWith("/products");
    expect(mockState.mockGet).toHaveBeenCalledWith("/products/1");
    expect(mockState.mockPost).toHaveBeenCalledWith("/products", payload);
    expect(mockState.mockPut).toHaveBeenCalledWith("/products/1", payload);
    expect(mockState.mockDelete).toHaveBeenCalledWith("/products/1");
    expect(mockState.mockGet).toHaveBeenCalledWith("/products/low-stock");
  });

  it("calls all category endpoints", async () => {
    const payload = { name: "IT" };

    await categoryApi.getAll();
    await categoryApi.getById(2);
    await categoryApi.create(payload);
    await categoryApi.update(2, payload);
    await categoryApi.delete(2);

    expect(mockState.mockGet).toHaveBeenCalledWith("/categories");
    expect(mockState.mockGet).toHaveBeenCalledWith("/categories/2");
    expect(mockState.mockPost).toHaveBeenCalledWith("/categories", payload);
    expect(mockState.mockPut).toHaveBeenCalledWith("/categories/2", payload);
    expect(mockState.mockDelete).toHaveBeenCalledWith("/categories/2");
  });

  it("calls all stock movement endpoints", async () => {
    const payload = { productId: 1, type: "IN", quantity: 3, reason: "Restock" };

    await stockMovementApi.getAll();
    await stockMovementApi.getByProductId(1);
    await stockMovementApi.create(payload);

    expect(mockState.mockGet).toHaveBeenCalledWith("/stock-movements");
    expect(mockState.mockGet).toHaveBeenCalledWith("/stock-movements/product/1");
    expect(mockState.mockPost).toHaveBeenCalledWith("/stock-movements", payload);
  });

  // TD: Ajouter des tests pour les mouvements de stock
});