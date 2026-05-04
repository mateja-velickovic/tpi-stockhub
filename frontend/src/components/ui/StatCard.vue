<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">
          {{ title }}
        </p>
        <p
          data-testid="stat-value"
          class="mt-1 text-3xl font-bold text-gray-900"
        >
          {{ value }}
        </p>
      </div>
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center"
        :class="iconBgClass"
      >
        <slot name="icon" />
      </div>
    </div>
    <p
      v-if="subtitle"
      class="mt-2 text-sm text-gray-500"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  iconBgClass?: string;
}>();
</script>
