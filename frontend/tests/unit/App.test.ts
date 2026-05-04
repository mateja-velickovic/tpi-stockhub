import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../../src/App.vue';

describe('App', () => {
  it('renders RouterView content', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view-stub">Current page</div>',
          },
        },
      },
    });

    const routerView = wrapper.find('[data-testid="router-view-stub"]');
    expect(routerView.exists()).toBe(true);
    expect(routerView.text()).toBe('Current page');
  });
});
