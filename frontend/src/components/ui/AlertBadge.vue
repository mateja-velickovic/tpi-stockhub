<template>
  <span
    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full"
      :class="dotClass"
    />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant: 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
}>();

const badgeClass = computed(() => ({
  'bg-green-100 text-green-800': props.variant === 'success',
  'bg-yellow-100 text-yellow-800': props.variant === 'warning',
  'bg-red-100 text-red-800': props.variant === 'danger',
  'bg-blue-100 text-blue-800': props.variant === 'info',
}));

const dotClass = computed(() => ({
  'bg-green-500': props.variant === 'success',
  'bg-yellow-500': props.variant === 'warning',
  'bg-red-500': props.variant === 'danger',
  'bg-blue-500': props.variant === 'info',
}));
</script>
