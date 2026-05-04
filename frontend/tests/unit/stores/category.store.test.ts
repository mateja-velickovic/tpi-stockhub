import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCategoryStore } from '../../../src/stores/category.store';
import { categoryApi } from '../../../src/services/api.service';

vi.mock('../../../src/services/api.service', () => ({
  categoryApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Category Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches all categories and toggles loading', async () => {
    const rows = [
      { id: 1, name: 'IT', description: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ];
    vi.mocked(categoryApi.getAll).mockResolvedValue({ data: { data: rows } });

    const store = useCategoryStore();
    await store.fetchAll();

    expect(store.categories).toEqual(rows);
    expect(store.loading).toBe(false);
  });

  it('creates, updates and deletes categories', async () => {
    const initial = { id: 1, name: 'IT', description: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const created = { id: 2, name: 'Office', description: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' };
    const updated = { ...initial, name: 'Informatique' };

    const store = useCategoryStore();
    store.categories = [initial];

    vi.mocked(categoryApi.create).mockResolvedValue({ data: { data: created } });
    const createResult = await store.createCategory({ name: 'Office' });

    expect(createResult).toEqual(created);
    expect(store.categories[1]).toEqual(created);

    vi.mocked(categoryApi.update).mockResolvedValue({ data: { data: updated } });
    const updateResult = await store.updateCategory(1, { name: 'Informatique' });

    expect(updateResult).toEqual(updated);
    expect(store.categories[0].name).toBe('Informatique');

    vi.mocked(categoryApi.delete).mockResolvedValue({});
    await store.deleteCategory(2);

    expect(store.categories).toHaveLength(1);
    expect(store.categories[0].id).toBe(1);
  });
});
