import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import StockMovementsView from '../../../src/views/StockMovementsView.vue';
import type { StockMovement, Product } from '../../../src/types';

const mocks = vi.hoisted(() => ({
  movementStore: {
    movements: [] as StockMovement[],
    loading: false,
    fetchAll: vi.fn(),
    createMovement: vi.fn(),
  },
  productStore: {
    products: [] as Product[],
    fetchAll: vi.fn(),
  },
}));

vi.mock('../../../src/stores/stockMovement.store', () => ({
  useStockMovementStore: () => mocks.movementStore,
}));

vi.mock('../../../src/stores/product.store', () => ({
  useProductStore: () => mocks.productStore,
}));

describe('StockMovementsView', () => {
  beforeEach(() => {
    mocks.movementStore.movements = [
      { id: 1, type: 'IN', quantity: 3, reason: 'Restock', productId: 1, userId: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];
    mocks.movementStore.loading = false;
    mocks.productStore.products = [
      { id: 1, name: 'Laptop', quantity: 5 },
    ];
    mocks.movementStore.fetchAll.mockReset();
    mocks.movementStore.createMovement.mockReset();
    mocks.productStore.fetchAll.mockReset();
  });

  it('loads movements and products on mount', async () => {
    mount(StockMovementsView, {
      global: {
        stubs: {
          StockMovementRow: { template: '<tr data-testid="row" />', props: ['movement'] },
        },
      },
    });

    await flushPromises();

    expect(mocks.movementStore.fetchAll).toHaveBeenCalledOnce();
    expect(mocks.productStore.fetchAll).toHaveBeenCalledOnce();
  });

  it('creates a movement from modal and refreshes products', async () => {
    const wrapper = mount(StockMovementsView, {
      global: {
        stubs: {
          StockMovementRow: { template: '<tr data-testid="row" />', props: ['movement'] },
        },
      },
    });

    await wrapper.find('button').trigger('click');
    await wrapper.find('select').setValue('1');
    await wrapper.find('input[type="number"]').setValue('2');
    await wrapper.find('input[type="text"]').setValue('Vente');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(mocks.movementStore.createMovement).toHaveBeenCalledWith({
      productId: 1,
      type: 'IN',
      quantity: 2,
      reason: 'Vente',
    });
    expect(mocks.productStore.fetchAll).toHaveBeenCalled();
  });
});
