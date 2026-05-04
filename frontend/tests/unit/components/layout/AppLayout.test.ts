import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AppLayout from '../../../../src/components/layout/AppLayout.vue';

const mocks = vi.hoisted(() => ({
  authStore: {
    token: null as string | null,
    user: null as { username: string; role: string } | null,
    fetchProfile: vi.fn(),
  },
}));

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => mocks.authStore,
}));

describe('AppLayout', () => {
  beforeEach(() => {
    mocks.authStore.token = null;
    mocks.authStore.user = null;
    mocks.authStore.fetchProfile.mockReset();
  });

  it('fetches profile on mount when token exists and user is missing', async () => {
    mocks.authStore.token = 'jwt-token';

    mount(AppLayout, {
      global: {
        stubs: {
          RouterView: { template: '<div>Page</div>' },
          AppHeader: { template: '<header />' },
          AppSidebar: { props: ['open'], template: '<aside :data-open="String(open)" />' },
        },
      },
    });

    await flushPromises();

    expect(mocks.authStore.fetchProfile).toHaveBeenCalledOnce();
  });

  it('does not fetch profile when token is missing', async () => {
    mount(AppLayout, {
      global: {
        stubs: {
          RouterView: { template: '<div>Page</div>' },
          AppHeader: { template: '<header />' },
          AppSidebar: { props: ['open'], template: '<aside :data-open="String(open)" />' },
        },
      },
    });

    await flushPromises();

    expect(mocks.authStore.fetchProfile).not.toHaveBeenCalled();
  });

  it('toggles sidebar when header emits toggle-sidebar', async () => {
    const wrapper = mount(AppLayout, {
      global: {
        stubs: {
          RouterView: { template: '<div>Page</div>' },
          AppHeader: { template: '<button data-testid="toggle" @click="$emit(\'toggle-sidebar\')" />' },
          AppSidebar: { props: ['open'], template: '<aside data-testid="sidebar" :data-open="String(open)" />' },
        },
      },
    });

    const sidebar = () => wrapper.find('[data-testid="sidebar"]');

    expect(sidebar().attributes('data-open')).toBe('false');

    await wrapper.find('[data-testid="toggle"]').trigger('click');

    expect(sidebar().attributes('data-open')).toBe('true');
  });
});
