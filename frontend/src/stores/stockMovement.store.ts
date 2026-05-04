import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { StockMovement } from '@/types';
import { stockMovementApi } from '@/services/api.service';

export const useStockMovementStore = defineStore('stockMovements', () => {
  const movements = ref<StockMovement[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await stockMovementApi.getAll();
      movements.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function createMovement(data: Partial<StockMovement>) {
    const response = await stockMovementApi.create(data);
    movements.value.unshift(response.data.data);
    return response.data.data;
  }

  return { movements, loading, fetchAll, createMovement };
});
