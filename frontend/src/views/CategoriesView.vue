<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        Catégories
      </h2>
      <button
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        @click="showForm = true"
      >
        + Nouvelle catégorie
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
              Nom
            </th>
            <th class="px-6 py-4">
              Description
            </th>
            <th class="px-6 py-4">
              Produits
            </th>
            <th class="px-6 py-4 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="border-b border-gray-50 hover:bg-gray-50"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ cat.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ cat.description || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ cat.products?.length || 0 }}
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                class="text-sm text-indigo-600 hover:text-indigo-800"
                @click="startEdit(cat)"
              >
                Modifier
              </button>
              <button
                class="text-sm text-red-600 hover:text-red-800"
                @click="handleDelete(cat.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="!loading && categories.length === 0"
        class="text-center py-12 text-gray-500"
      >
        Aucune catégorie
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingCategory ? 'Modifier' : 'Nouvelle catégorie' }}
        </h3>
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              @click="closeForm"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              {{ editingCategory ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type { Category } from '@/types';
import { useCategoryStore } from '@/stores/category.store';

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);
const loading = computed(() => categoryStore.loading);

const showForm = ref(false);
const editingCategory = ref<Category | null>(null);
const form = reactive({ name: '', description: '' });

onMounted(() => categoryStore.fetchAll());

function startEdit(cat: Category) {
  editingCategory.value = cat;
  form.name = cat.name;
  form.description = cat.description || '';
  showForm.value = true;
}

async function handleSubmit() {
  if (editingCategory.value) {
    await categoryStore.updateCategory(editingCategory.value.id, { ...form });
  } else {
    await categoryStore.createCategory({ ...form });
  }
  closeForm();
}

async function handleDelete(id: number) {
  if (confirm('Supprimer cette catégorie ?')) {
    try {
      await categoryStore.deleteCategory(id);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e.response?.data?.error || 'Erreur');
    }
  }
}

function closeForm() {
  showForm.value = false;
  editingCategory.value = null;
  form.name = '';
  form.description = '';
}
</script>
