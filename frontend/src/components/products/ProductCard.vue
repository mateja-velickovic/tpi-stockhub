<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-gray-900">
          {{ product.name }}
        </h3>
        <p class="text-xs text-gray-500 mt-1">
          SKU: {{ product.sku }}
        </p>
      </div>
      <AlertBadge
        :variant="stockVariant"
        dot
      >
        {{ product.quantity }} en stock
      </AlertBadge>
    </div>
    <p
      v-if="product.description"
      class="mt-3 text-sm text-gray-600 line-clamp-2"
    >
      {{ product.description }}
    </p>
    <div class="mt-4 flex items-center justify-between">
      <span class="text-lg font-bold text-gray-900">CHF {{ Number(product.price).toFixed(2) }}</span>
      <span
        v-if="categoryName"
        class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
      >
        {{ categoryName }}
      </span>
    </div>
    <div class="mt-4 flex gap-2">
      <button
        class="flex-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        @click="$emit('edit', product)"
      >
        Modifier
      </button>
      <button
        class="text-sm text-red-600 hover:text-red-800 font-medium py-1.5 px-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        @click="$emit('delete', product.id)"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types';
import AlertBadge from '@/components/ui/AlertBadge.vue';
import { useCategoryStore } from '@/stores/category.store';

const props = defineProps<{ product: Product }>();
defineEmits(['edit', 'delete']);

const categoryStore = useCategoryStore();

const categoryName = computed(() => {
  const category = categoryStore.categories.find(c => c.id === props.product.categoryId);
  return category?.name || props.product.category?.name || '';
});

const stockVariant = computed(() => {
  if (props.product.quantity <= 0) return 'danger';
  if (props.product.quantity <= props.product.minQuantity) return 'warning';
  return 'success';
});
</script>
