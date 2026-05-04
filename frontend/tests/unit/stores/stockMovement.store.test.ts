import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useStockMovementStore } from '../../../src/stores/stockMovement.store';
import { stockMovementApi } from '../../../src/services/api.service';

vi.mock('../../../src/services/api.service', () => ({
  stockMovementApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

describe('StockMovement Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches all movements and toggles loading', async () => {
    const rows = [
      { id: 1, type: 'IN', quantity: 3, reason: 'Restock', productId: 10, userId: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];
    vi.mocked(stockMovementApi.getAll).mockResolvedValue({ data: { data: rows } });

    const store = useStockMovementStore();
    await store.fetchAll();

    expect(store.movements).toEqual(rows);
    expect(store.loading).toBe(false);
  });

  it('creates a movement and prepends it', async () => {
    const movement = { id: 2, type: 'OUT', quantity: 1, reason: 'Sale', productId: 11, userId: 3, createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    vi.mocked(stockMovementApi.create).mockResolvedValue({ data: { data: movement } });

    const store = useStockMovementStore();
    const result = await store.createMovement({ type: 'OUT', quantity: 1 });

    expect(result).toEqual(movement);
    expect(store.movements[0]).toEqual(movement);
  });
});
