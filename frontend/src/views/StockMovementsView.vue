<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        Mouvements de stock
      </h2>
      <button
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        @click="showForm = true"
      >
        + Nouveau mouvement
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div
        v-if="loading"
        class="text-center py-12 text-gray-500"
      >
        Chargement...
      </div>
      <table
        v-else
        class="w-full"
      >
        <thead>
          <tr class="text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
            <th class="px-6 py-4">
              Produit
            </th>
            <th class="px-6 py-4">
              Type
            </th>
            <th class="px-6 py-4">
              Quantité
            </th>
            <th class="px-6 py-4">
              Motif
            </th>
            <th class="px-6 py-4">
              Utilisateur
            </th>
            <th class="px-6 py-4">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          <StockMovementRow
            v-for="m in movements"
            :key="m.id"
            :movement="m"
          />
        </tbody>
      </table>
      <div
        v-if="!loading && movements.length === 0"
        class="text-center py-12 text-gray-500"
      >
        Aucun mouvement enregistré
      </div>
    </div>

    <!-- Modal mouvement -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold mb-4">
          Nouveau mouvement de stock
        </h3>
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Produit</label>
            <select
              v-model.number="form.productId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option
                value=""
                disabled
              >
                Choisir un produit...
              </option>
              <option
                v-for="p in products"
                :key="p.id"
                :value="p.id"
              >
                {{ p.name }} ({{ p.quantity }} en stock)
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                v-model="form.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="IN">
                  Entrée
                </option>
                <option value="OUT">
                  Sortie
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Motif</label>
            <input
              v-model="form.reason"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              @click="showForm = false"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import StockMovementRow from '@/components/stock/StockMovementRow.vue';
import { useStockMovementStore } from '@/stores/stockMovement.store';
import { useProductStore } from '@/stores/product.store';
import { useAuthStore } from '@/stores/auth.store';
import type { StockMovement } from '@/types';

const movementStore = useStockMovementStore();
const productStore = useProductStore();
const authStore = useAuthStore();

const products = computed(() => productStore.products);
const loading = computed(() => movementStore.loading);
const movements = computed<StockMovement[]>(() => {
  const productById = new Map(products.value.map(product => [product.id, product]));
  const currentUser = authStore.user;
  return movementStore.movements.map(movement => ({
    ...movement,
    product: movement.product ?? productById.get(movement.productId),
    user: movement.user ?? (movement.userId === currentUser?.id ? currentUser : undefined),
  }));
});

const showForm = ref(false);
const form = reactive({
  productId: '' as number | '',
  type: 'IN' as 'IN' | 'OUT',
  quantity: 1,
  reason: '',
});

onMounted(async () => {
  await Promise.all([
    movementStore.fetchAll(),
    productStore.fetchAll(),
  ]);
});

async function handleSubmit() {
  await movementStore.createMovement({ ...form, productId: Number(form.productId) });
  await productStore.fetchAll();
  showForm.value = false;
  form.productId = '';
  form.type = 'IN';
  form.quantity = 1;
  form.reason = '';
}
</script>
