import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StatCard from '../../../src/components/ui/StatCard.vue';

describe('StatCard', () => {
  it('should display the value', () => {
    const wrapper = mount(StatCard, {
      props: { title: 'Produits', value: 42 },
    });

    const valueEl = wrapper.find('[data-testid="stat-value"]');
    expect(valueEl.text()).toBe('42');
  });

  it('should display the title', () => {
    const wrapper = mount(StatCard, {
      props: { title: 'Produits', value: 42 },
    });

    expect(wrapper.text()).toContain('Produits');
  });

  it('should display subtitle when provided', () => {
    const wrapper = mount(StatCard, {
      props: { title: 'Produits', value: 42, subtitle: 'Total en stock' },
    });

    expect(wrapper.text()).toContain('Total en stock');
  });
});
