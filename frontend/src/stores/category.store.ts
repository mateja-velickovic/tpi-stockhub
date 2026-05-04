import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Category } from '@/types';
import { categoryApi } from '@/services/api.service';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await categoryApi.getAll();
      categories.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function createCategory(data: Partial<Category>) {
    const response = await categoryApi.create(data);
    categories.value.push(response.data.data);
    return response.data.data;
  }

  async function updateCategory(id: number, data: Partial<Category>) {
    const response = await categoryApi.update(id, data);
    const index = categories.value.findIndex(c => c.id === id);
    if (index !== -1) categories.value[index] = response.data.data;
    return response.data.data;
  }

  async function deleteCategory(id: number) {
    await categoryApi.delete(id);
    categories.value = categories.value.filter(c => c.id !== id);
  }

  return { categories, loading, fetchAll, createCategory, updateCategory, deleteCategory };
});
