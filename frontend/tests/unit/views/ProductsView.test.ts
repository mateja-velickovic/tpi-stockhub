import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ProductsView from "../../../src/views/ProductsView.vue";
import type { Product } from "../../../src/types";

const mocks = vi.hoisted(() => ({
  store: {
    products: [] as Product[],
    loading: false,
    fetchAll: vi.fn(),
    deleteProduct: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
  },
}));

vi.mock("../../../src/stores/product.store", () => ({
  useProductStore: () => mocks.store,
}));

describe("ProductsView", () => {
  beforeEach(() => {
    mocks.store.products = [
      {
        id: 1,
        name: "Laptop",
        sku: "LAP-1",
        description: null,
        price: 1000,
        quantity: 4,
        minQuantity: 2,
        categoryId: 1,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    mocks.store.loading = false;
    mocks.store.fetchAll.mockReset();
    mocks.store.deleteProduct.mockReset();
    mocks.store.createProduct.mockReset();
    mocks.store.updateProduct.mockReset();
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true),
    );
  });

  it("fetches products on mount", async () => {
    mount(ProductsView, {
      global: {
        stubs: {
          ProductCard: { template: "<div />", props: ["product"] },
          ProductForm: { template: "<div />", props: ["product"] },
        },
      },
    });

    await flushPromises();

    expect(mocks.store.fetchAll).toHaveBeenCalledOnce();
  });

  it("updates and deletes product from card actions", async () => {
    const wrapper = mount(ProductsView, {
      global: {
        stubs: {
          ProductCard: {
            template:
              '<div><button data-testid="edit" @click="$emit(\'edit\', product)" /><button data-testid="delete" @click="$emit(\'delete\', product.id)" /></div>',
            props: ["product"],
          },
          ProductForm: {
            template:
              "<button data-testid=\"submit-update\" @click=\"$emit('submit', { name: 'Updated' })\" />",
            props: ["product"],
          },
        },
      },
    });

    await wrapper.find('[data-testid="edit"]').trigger("click");
    await wrapper.find('[data-testid="submit-update"]').trigger("click");
    await wrapper.find('[data-testid="delete"]').trigger("click");
    await flushPromises();

    expect(mocks.store.updateProduct).toHaveBeenCalledWith(1, {
      name: "Updated",
    });
    expect(mocks.store.deleteProduct).toHaveBeenCalledWith(1);
  });
});
