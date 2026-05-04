<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      Tableau de bord
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Produits"
        :value="totalProducts"
        subtitle="Total en catalogue"
        icon-bg-class="bg-indigo-100"
      >
        <template #icon>
          <svg
            class="w-6 h-6 text-indigo-600"
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
        </template>
      </StatCard>

      <StatCard
        title="Catégories"
        :value="totalCategories"
        subtitle="Groupes de produits"
        icon-bg-class="bg-green-100"
      >
        <template #icon>
          <svg
            class="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        title="Mouvements"
        :value="totalMovements"
        subtitle="Total enregistrés"
        icon-bg-class="bg-blue-100"
      >
        <template #icon>
          <svg
            class="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </template>
      </StatCard>

      <StatCard
        title="Alertes stock"
        :value="lowStockCount"
        subtitle="Produits sous le seuil"
        icon-bg-class="bg-red-100"
      >
        <template #icon>
          <svg
            class="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </template>
      </StatCard>
    </div>

    <div
      v-if="lowStockProducts.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Produits en stock bas
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
              <th class="px-4 py-3">
                Produit
              </th>
              <th class="px-4 py-3">
                SKU
              </th>
              <th class="px-4 py-3">
                Stock
              </th>
              <th class="px-4 py-3">
                Seuil
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in lowStockProducts"
              :key="product.id"
              class="border-b border-gray-50"
            >
              <td class="px-4 py-3 text-sm font-medium text-gray-900">
                {{ product.name }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ product.sku }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-sm font-medium"
                  :class="product.quantity <= 0 ? 'text-red-600' : 'text-yellow-600'"
                >
                  {{ product.quantity }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ product.minQuantity }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import StatCard from '@/components/ui/StatCard.vue';
import { useProductStore } from '@/stores/product.store';
import { useCategoryStore } from '@/stores/category.store';
import { useStockMovementStore } from '@/stores/stockMovement.store';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const movementStore = useStockMovementStore();

const totalProducts = computed(() => productStore.products.length);
const totalCategories = computed(() => categoryStore.categories.length);
const totalMovements = computed(() => movementStore.movements.length);
const lowStockProducts = computed(() => productStore.lowStockProducts);
const lowStockCount = computed(() => lowStockProducts.value.length);

onMounted(async () => {
  await Promise.all([
    productStore.fetchAll(),
    productStore.fetchLowStock(),
    categoryStore.fetchAll(),
    movementStore.fetchAll(),
  ]);
});
</script>
