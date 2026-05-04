import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CategoriesView from '../../../src/views/CategoriesView.vue';
import type { Category } from '../../../src/types';

const mocks = vi.hoisted(() => ({
  store: {
    categories: [] as Category[],
    loading: false,
    fetchAll: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

vi.mock('../../../src/stores/category.store', () => ({
  useCategoryStore: () => mocks.store,
}));

describe('CategoriesView', () => {
  beforeEach(() => {
    mocks.store.categories = [
      { id: 1, name: 'IT', description: 'Matériel', products: [{ id: 10 }] },
    ];
    mocks.store.loading = false;
    mocks.store.fetchAll.mockReset();
    mocks.store.createCategory.mockReset();
    mocks.store.updateCategory.mockReset();
    mocks.store.deleteCategory.mockReset();
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
  });

  it('fetches categories on mount', async () => {
    mount(CategoriesView);
    await flushPromises();

    expect(mocks.store.fetchAll).toHaveBeenCalledOnce();
  });

  it('creates a category from modal form', async () => {
    const wrapper = mount(CategoriesView);

    await wrapper.find('button').trigger('click');
    await wrapper.find('input[type="text"]').setValue('Office');
    await wrapper.find('textarea').setValue('Fournitures');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(mocks.store.createCategory).toHaveBeenCalledWith({ name: 'Office', description: 'Fournitures' });
  });

  it('updates and deletes category', async () => {
    const wrapper = mount(CategoriesView);

    await wrapper.find('button.text-indigo-600').trigger('click');
    await wrapper.find('input[type="text"]').setValue('Informatique');
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.find('button.text-red-600').trigger('click');
    await flushPromises();

    expect(mocks.store.updateCategory).toHaveBeenCalledWith(1, { name: 'Informatique', description: 'Matériel' });
    expect(mocks.store.deleteCategory).toHaveBeenCalledWith(1);
  });
});
