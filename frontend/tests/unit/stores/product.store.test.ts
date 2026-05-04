import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useProductStore } from '../../../src/stores/product.store';
import { productApi } from '../../../src/services/api.service';

vi.mock('../../../src/services/api.service', () => ({
  productApi: {
    getAll: vi.fn(),
    getLowStock: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches all and low stock products', async () => {
    const allProducts = [
      { id: 1, name: 'Laptop', sku: 'LAP-1', description: null, price: 1000, quantity: 4, minQuantity: 2, categoryId: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];
    const lowProducts = [
      { id: 2, name: 'Mouse', sku: 'MOU-1', description: null, price: 30, quantity: 1, minQuantity: 3, categoryId: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];

    vi.mocked(productApi.getAll).mockResolvedValue({ data: { data: allProducts } });
    vi.mocked(productApi.getLowStock).mockResolvedValue({ data: { data: lowProducts } });

    const store = useProductStore();
    await store.fetchAll();
    await store.fetchLowStock();

    expect(store.products).toEqual(allProducts);
    expect(store.lowStockProducts).toEqual(lowProducts);
    expect(store.loading).toBe(false);
  });

  it('creates, updates and deletes a product', async () => {
    const existing = { id: 1, name: 'Laptop', sku: 'LAP-1', description: null, price: 1000, quantity: 4, minQuantity: 2, categoryId: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const created = { id: 2, name: 'Keyboard', sku: 'KEY-1', description: null, price: 60, quantity: 8, minQuantity: 2, categoryId: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const updated = { ...existing, name: 'Laptop Pro' };

    const store = useProductStore();
    store.products = [existing];

    vi.mocked(productApi.create).mockResolvedValue({ data: { data: created } });
    const createResult = await store.createProduct({ name: 'Keyboard' });
    expect(createResult).toEqual(created);
    expect(store.products[0]).toEqual(created);

    vi.mocked(productApi.update).mockResolvedValue({ data: { data: updated } });
    const updateResult = await store.updateProduct(1, { name: 'Laptop Pro' });
    expect(updateResult).toEqual(updated);

    vi.mocked(productApi.delete).mockResolvedValue({});
    await store.deleteProduct(2);
    expect(store.products.find((p) => p.id === 2)).toBeUndefined();
  });
});
