<template>
  <aside
    class="w-64 bg-gray-800 text-white min-h-screen flex-shrink-0"
    :class="{ 'hidden lg:flex lg:flex-col': !open, 'flex flex-col': open }"
  >
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <span class="text-lg font-bold">StockHub</span>
      </div>
    </div>
    <nav class="flex-1 p-4 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        :class="$route.path === item.path
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
      >
        <component
          :is="item.icon"
          class="w-5 h-5"
        />
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { h } from 'vue';

defineProps<{ open: boolean }>();

const HomeIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />' });
const BoxIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />' });
const TagIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />' });
const ArrowIcon = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />' });

const menuItems = [
  { path: '/', label: 'Tableau de bord', icon: HomeIcon },
  { path: '/products', label: 'Produits', icon: BoxIcon },
  { path: '/categories', label: 'Catégories', icon: TagIcon },
  { path: '/stock-movements', label: 'Mouvements', icon: ArrowIcon },
];
</script>
