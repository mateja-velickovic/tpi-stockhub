import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from '@/types';
import { productApi } from '@/services/api.service';

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const lowStockProducts = ref<Product[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await productApi.getAll();
      products.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchLowStock() {
    const response = await productApi.getLowStock();
    lowStockProducts.value = response.data.data;
  }

  async function createProduct(data: Partial<Product>) {
    const response = await productApi.create(data);
    products.value.unshift(response.data.data);
    return response.data.data;
  }

  async function updateProduct(id: number, data: Partial<Product>) {
    const response = await productApi.update(id, data);
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) products.value[index] = response.data.data;
    return response.data.data;
  }

  async function deleteProduct(id: number) {
    await productApi.delete(id);
    products.value = products.value.filter(p => p.id !== id);
  }

  return { products, lowStockProducts, loading, fetchAll, fetchLowStock, createProduct, updateProduct, deleteProduct };
});
