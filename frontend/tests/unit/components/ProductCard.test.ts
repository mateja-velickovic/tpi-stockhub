import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '../../../src/components/products/ProductCard.vue';

vi.mock('@/stores/category.store', () => ({
  useCategoryStore: () => ({
    categories: [],
  }),
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Laptop Dell',
    sku: 'ELEC-001',
    description: 'Ordinateur portable professionnel',
    price: 1299.0,
    quantity: 12,
    minQuantity: 5,
    categoryId: 1,
    category: { id: 1, name: 'Électronique', description: null, createdAt: '', updatedAt: '' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  it('should display product name', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        stubs: {
          AlertBadge: { template: '<span><slot /></span>' },
        },
      },
    });

    const nameEl = wrapper.find('h3');
    expect(nameEl.text()).toBe('Laptop Dell');
  });

  it('should display SKU', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        stubs: {
          AlertBadge: { template: '<span><slot /></span>' },
        },
      },
    });

    expect(wrapper.text()).toContain('ELEC-001');
  });

  it('should emit delete event', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        stubs: {
          AlertBadge: { template: '<span><slot /></span>' },
        },
      },
    });

    const deleteBtn = wrapper.findAll('button')[1];
    await deleteBtn.trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
  });
});
