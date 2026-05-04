import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppSidebar from '../../../../src/components/layout/AppSidebar.vue';

describe('AppSidebar', () => {
  function mountSidebar(open: boolean, currentPath: string) {
    return mount(AppSidebar, {
      props: { open },
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to" data-testid="nav-link"><slot /></a>',
          },
        },
        mocks: {
          $route: { path: currentPath },
        },
      },
    });
  }

  it('renders menu items and highlights the active route', () => {
    const wrapper = mountSidebar(true, '/products');
    const links = wrapper.findAll('[data-testid="nav-link"]');

    expect(links).toHaveLength(4);

    const activeLink = links.find((link) => link.text().includes('Produits'));
    const inactiveLink = links.find((link) => link.text().includes('Tableau de bord'));

    expect(activeLink?.classes()).toContain('bg-gray-900');
    expect(inactiveLink?.classes()).toContain('text-gray-300');
  });

  it('applies collapsed classes when closed', () => {
    const wrapper = mountSidebar(false, '/');

    expect(wrapper.find('aside').classes()).toContain('hidden');
  });

  it('applies open classes when open is true', () => {
    const wrapper = mountSidebar(true, '/');

    const classes = wrapper.find('aside').classes();
    expect(classes).toContain('flex');
    expect(classes).toContain('flex-col');
  });
});
