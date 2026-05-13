import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import LoginView from "../../../src/views/LoginView.vue";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  login: vi.fn(),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../../src/stores/auth.store", () => ({
  useAuthStore: () => ({ login: mocks.login }),
}));

describe("LoginView", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.login.mockReset();
  });

  it("logs in successfully and redirects", async () => {
    mocks.login.mockResolvedValue();
    const wrapper = mount(LoginView);
    await wrapper.find('input[type="email"]').setValue("admin@stockhub.ch");
    await wrapper.find('input[type="password"]').setValue("admin123");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(mocks.push).toHaveBeenCalledWith("/");
  });

  it("shows backend error message on login failure", async () => {
    mocks.login.mockRejectedValue({
      response: { data: { error: "Identifiants invalides" } },
    });
    const wrapper = mount(LoginView);

    await wrapper.find('input[type="email"]').setValue("admin@stockhub.ch");
    await wrapper.find('input[type="password"]').setValue("wrong");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Identifiants invalides");
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
