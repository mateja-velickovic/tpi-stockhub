import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ProductForm from '../../../../src/components/products/ProductForm.vue';

const mocks = vi.hoisted(() => ({
  store: {
    categories: [] as Array<{ id: number; name: string }>,
    fetchAll: vi.fn(),
  },
}));

vi.mock('@/stores/category.store', () => ({
  useCategoryStore: () => mocks.store,
}));

describe('ProductForm', () => {
  beforeEach(() => {
    mocks.store.categories = [];
    mocks.store.fetchAll.mockReset();
  });

  it('fetches categories on mount when empty', async () => {
    mount(ProductForm);

    await flushPromises();

    expect(mocks.store.fetchAll).toHaveBeenCalledOnce();
  });

  it('does not fetch categories on mount when already loaded', async () => {
    mocks.store.categories = [{ id: 1, name: 'Electronics' }];

    mount(ProductForm);

    await flushPromises();

    expect(mocks.store.fetchAll).not.toHaveBeenCalled();
  });

  it('prefills form fields in edit mode and emits submit payload', async () => {
    mocks.store.categories = [{ id: 2, name: 'Office' }];

    const wrapper = mount(ProductForm, {
      props: {
        product: {
          id: 12,
          name: 'Desk Lamp',
          sku: 'LAMP-001',
          description: 'Warm light',
          price: 39.9,
          quantity: 4,
          minQuantity: 2,
          categoryId: 2,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
        },
      },
    });

    await flushPromises();

    const inputs = wrapper.findAll('input');
    expect((inputs[0].element as HTMLInputElement).value).toBe('Desk Lamp');
    expect((inputs[1].element as HTMLInputElement).value).toBe('LAMP-001');

    await wrapper.find('form').trigger('submit.prevent');

    const submitted = wrapper.emitted('submit');
    expect(submitted).toBeTruthy();
    expect(submitted?.[0]?.[0]).toEqual({
      name: 'Desk Lamp',
      sku: 'LAMP-001',
      description: 'Warm light',
      price: 39.9,
      categoryId: 2,
      minQuantity: 2,
    });
  });

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount(ProductForm);

    await wrapper.find('button[type="button"]').trigger('click');

    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
});
