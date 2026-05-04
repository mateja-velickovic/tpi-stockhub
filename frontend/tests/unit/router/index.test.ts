import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => {
  let guard: ((...args: unknown[]) => unknown) | undefined;
  const router = {
    beforeEach: vi.fn((cb) => {
      guard = cb;
    }),
  };

  return {
    router,
    getGuard: () => guard,
  };
});

vi.mock("vue-router", () => ({
  createWebHistory: vi.fn(),
  createRouter: vi.fn(() => mocks.router),
}));

describe("Router guards", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    await import("../../../src/router");
  });

  it("redirects to login when route requires auth and no token exists", () => {
    const next = vi.fn();
    const guard = mocks.getGuard();

    guard(
      { path: "/", meta: { requiresAuth: true } },
      { path: "/login" },
      next,
    );

    expect(next).toHaveBeenCalledWith("/login");
  });

  it("redirects authenticated users away from login page", () => {
    localStorage.setItem("token", "jwt");
    const next = vi.fn();
    const guard = mocks.getGuard();

    guard({ path: "/login", meta: {} }, { path: "/" }, next);

    expect(next).toHaveBeenCalledWith("/");
  });

  it("allows navigation for public or authenticated routes", () => {
    localStorage.setItem("token", "jwt");
    const next = vi.fn();
    const guard = mocks.getGuard();

    guard(
      { path: "/products", meta: { requiresAuth: true } },
      { path: "/" },
      next,
    );

    expect(next).toHaveBeenCalledWith();
  });
});
