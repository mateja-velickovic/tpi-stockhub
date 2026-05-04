<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        Produits
      </h2>
      <button
        class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        @click="showForm = true"
      >
        + Nouveau produit
      </button>
    </div>

    <div
      v-if="loading"
      class="text-center py-12 text-gray-500"
    >
      Chargement...
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @edit="editProduct"
        @delete="deleteProduct"
      />
    </div>

    <div
      v-if="!loading && products.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500">
        Aucun produit trouvé
      </p>
    </div>

    <ProductForm
      v-if="showForm"
      :product="selectedProduct"
      @submit="handleSubmit"
      @cancel="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard.vue';
import ProductForm from '@/components/products/ProductForm.vue';
import { useProductStore } from '@/stores/product.store';

const productStore = useProductStore();
const products = computed(() => productStore.products);
const loading = computed(() => productStore.loading);

const showForm = ref(false);
const selectedProduct = ref<Product | undefined>(undefined);

onMounted(() => productStore.fetchAll());

function editProduct(product: Product) {
  selectedProduct.value = product;
  showForm.value = true;
}

async function deleteProduct(id: number) {
  if (confirm('Supprimer ce produit ?')) {
    await productStore.deleteProduct(id);
  }
}

async function handleSubmit(data: Partial<Product>) {
  if (selectedProduct.value) {
    await productStore.updateProduct(selectedProduct.value.id, data);
  } else {
    await productStore.createProduct(data);
  }
  closeForm();
}

function closeForm() {
  showForm.value = false;
  selectedProduct.value = undefined;
}
</script>
