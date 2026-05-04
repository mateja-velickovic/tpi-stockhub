import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../../../src/stores/auth.store";
import { authApi } from "../../../src/services/api.service";

vi.mock("../../../src/services/api.service", () => ({
  authApi: {
    login: vi.fn(),
    profile: vi.fn(),
  },
}));

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should login and store user data", async () => {
    const mockResponse = {
      data: {
        user: {
          id: 1,
          username: "admin",
          email: "admin@stockhub.ch",
          role: "admin",
        },
        token: "fake-jwt-token",
      },
    };

    vi.mocked(authApi.login).mockResolvedValue(mockResponse);

    const store = useAuthStore();
    await store.login({ email: "admin@stockhub.ch", password: "admin123" });

    expect(store.user).toEqual(mockResponse.data.user);
    expect(store.token).toBe("fake-jwt-token");
  });

  it("should fetch and store profile data", async () => {
    const profileResponse = {
      data: {
        user: {
          id: 2,
          username: "manager",
          email: "manager@stockhub.ch",
          role: "manager",
        },
      },
    };

    vi.mocked(authApi.profile).mockResolvedValue(profileResponse);

    const store = useAuthStore();
    await store.fetchProfile();

    expect(authApi.profile).toHaveBeenCalledOnce();
    expect(store.user).toEqual(profileResponse.data.user);
  });
});
