import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StockMovementRow from '../../../../src/components/stock/StockMovementRow.vue';

describe('StockMovementRow', () => {
  it('renders IN movement with success label and positive quantity', () => {
    const wrapper = mount(StockMovementRow, {
      props: {
        movement: {
          id: 1,
          type: 'IN',
          quantity: 7,
          reason: 'Réapprovisionnement',
          productId: 10,
          userId: 2,
          product: {
            id: 10,
            name: 'Monitor',
            sku: 'MON-10',
            description: null,
            price: 120,
            quantity: 10,
            minQuantity: 3,
            categoryId: 1,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          user: {
            id: 2,
            username: 'manager',
            email: 'm@test.ch',
            role: 'manager',
          },
          createdAt: '2024-01-01T10:20:00.000Z',
          updatedAt: '2024-01-01T10:20:00.000Z',
        },
      },
    });

    expect(wrapper.text()).toContain('Monitor');
    expect(wrapper.text()).toContain('Entrée');
    expect(wrapper.text()).toContain('+7');
    expect(wrapper.text()).toContain('Réapprovisionnement');
    expect(wrapper.text()).toContain('manager');
    expect(wrapper.text()).toContain('01.01.2024');
  });

  it('renders OUT movement with fallbacks and negative quantity', () => {
    const wrapper = mount(StockMovementRow, {
      props: {
        movement: {
          id: 2,
          type: 'OUT',
          quantity: 2,
          reason: 'Vente',
          productId: 11,
          userId: 3,
          createdAt: '2024-06-15T08:05:00.000Z',
          updatedAt: '2024-06-15T08:05:00.000Z',
        },
      },
    });

    expect(wrapper.text()).toContain('Sortie');
    expect(wrapper.text()).toContain('-2');
    expect(wrapper.text()).toContain('Vente');

    const cells = wrapper.findAll('td');
    expect(cells[0].text()).toBe('-');
    expect(cells[4].text()).toBe('-');
    expect(cells[5].text()).toContain('15.06.2024');
  });
});
