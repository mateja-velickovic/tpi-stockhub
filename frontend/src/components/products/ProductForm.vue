<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">
        {{ product ? 'Modifier le produit' : 'Nouveau produit' }}
      </h2>
      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              v-model="form.sku"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix (CHF)</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              v-model.number="form.categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option
                value=""
                disabled
              >
                Choisir...
              </option>
              <option
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Seuil minimum</label>
            <input
              v-model.number="form.minQuantity"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            @click="$emit('cancel')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {{ product ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import type { Product } from '@/types';
import { useCategoryStore } from '@/stores/category.store';

const props = defineProps<{ product?: Product }>();
const emit = defineEmits(['submit', 'cancel']);

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);

const form = reactive({
  name: '',
  sku: '',
  description: '',
  price: 0,
  categoryId: '' as number | '',
  minQuantity: 5,
});

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchAll();
  }
  if (props.product) {
    form.name = props.product.name;
    form.sku = props.product.sku;
    form.description = props.product.description || '';
    form.price = props.product.price;
    form.categoryId = props.product.categoryId;
    form.minQuantity = props.product.minQuantity;
  }
});

function handleSubmit() {
  emit('submit', { ...form });
}
</script>
