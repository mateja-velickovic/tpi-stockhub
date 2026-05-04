import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '../../../../src/components/layout/AppHeader.vue';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  logout: vi.fn(),
  authStore: {
    user: { username: 'admin', role: 'admin' },
    logout: vi.fn(),
  },
}));

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    user: mocks.authStore.user,
    logout: mocks.logout,
  }),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}));

describe('AppHeader', () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.logout.mockReset();
    mocks.authStore.user = { username: 'admin', role: 'admin' };
  });

  it('renders user info and admin role style', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.text()).toContain('admin');
    const roleBadge = wrapper.findAll('span').at(1);

    expect(roleBadge?.text()).toBe('admin');
    expect(roleBadge?.classes()).toContain('text-red-800');
  });

  it('renders non-admin role style', () => {
    mocks.authStore.user = { username: 'staff', role: 'user' };

    const wrapper = mount(AppHeader);
    const roleBadge = wrapper.findAll('span').at(1);

    expect(roleBadge?.text()).toBe('user');
    expect(roleBadge?.classes()).toContain('text-blue-800');
  });

  it('emits toggle-sidebar when menu button is clicked', async () => {
    const wrapper = mount(AppHeader);

    await wrapper.findAll('button')[0].trigger('click');

    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy();
  });

  it('logs out and redirects to login', async () => {
    const wrapper = mount(AppHeader);

    await wrapper.findAll('button')[1].trigger('click');

    expect(mocks.logout).toHaveBeenCalledOnce();
    expect(mocks.push).toHaveBeenCalledWith('/login');
  });
});
