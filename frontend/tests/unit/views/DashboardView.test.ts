import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DashboardView from '../../../src/views/DashboardView.vue';
import type { Product, Category, StockMovement } from '../../../src/types';

const mocks = vi.hoisted(() => ({
  productStore: {
    products: [] as Product[],
    lowStockProducts: [] as Product[],
    fetchAll: vi.fn(),
    fetchLowStock: vi.fn(),
  },
  categoryStore: {
    categories: [] as Category[],
    fetchAll: vi.fn(),
  },
  movementStore: {
    movements: [] as StockMovement[],
    fetchAll: vi.fn(),
  },
}));

vi.mock('../../../src/stores/product.store', () => ({
  useProductStore: () => mocks.productStore,
}));

vi.mock('../../../src/stores/category.store', () => ({
  useCategoryStore: () => mocks.categoryStore,
}));

vi.mock('../../../src/stores/stockMovement.store', () => ({
  useStockMovementStore: () => mocks.movementStore,
}));

describe('DashboardView', () => {
  beforeEach(() => {
    mocks.productStore.products = [{ id: 1 }, { id: 2 }];
    mocks.productStore.lowStockProducts = [];
    mocks.categoryStore.categories = [{ id: 1 }];
    mocks.movementStore.movements = [{ id: 1 }, { id: 2 }, { id: 3 }];
    mocks.productStore.fetchAll.mockReset();
    mocks.productStore.fetchLowStock.mockReset();
    mocks.categoryStore.fetchAll.mockReset();
    mocks.movementStore.fetchAll.mockReset();
  });

  it('loads dashboard data on mount', async () => {
    mount(DashboardView, {
      global: {
        stubs: {
          StatCard: { template: '<div data-testid="stat-card"><slot name="icon" />{{ title }}:{{ value }}</div>', props: ['title', 'value'] },
        },
      },
    });

    await flushPromises();

    expect(mocks.productStore.fetchAll).toHaveBeenCalledOnce();
    expect(mocks.productStore.fetchLowStock).toHaveBeenCalledOnce();
    expect(mocks.categoryStore.fetchAll).toHaveBeenCalledOnce();
    expect(mocks.movementStore.fetchAll).toHaveBeenCalledOnce();
  });

  it('shows low stock table when low stock products exist', async () => {
    mocks.productStore.lowStockProducts = [
      { id: 99, name: 'Cable', sku: 'CAB-1', quantity: 1, minQuantity: 5 },
    ];

    const wrapper = mount(DashboardView, {
      global: {
        stubs: {
          StatCard: { template: '<div />', props: ['title', 'value'] },
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Produits en stock bas');
    expect(wrapper.text()).toContain('Cable');
  });
});
