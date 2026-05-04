<template>
  <tr class="border-b border-gray-100 hover:bg-gray-50">
    <td class="px-6 py-4 text-sm text-gray-900">
      {{ movement.product?.name || '-' }}
    </td>
    <td class="px-6 py-4">
      <AlertBadge :variant="movement.type === 'IN' ? 'success' : 'danger'">
        {{ movement.type === 'IN' ? 'Entrée' : 'Sortie' }}
      </AlertBadge>
    </td>
    <td
      class="px-6 py-4 text-sm font-medium"
      :class="movement.type === 'IN' ? 'text-green-600' : 'text-red-600'"
    >
      {{ movement.type === 'IN' ? '+' : '-' }}{{ movement.quantity }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-600">
      {{ movement.reason }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-500">
      {{ movement.user?.username || '-' }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-500">
      {{ formatDate(movement.createdAt) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { StockMovement } from '@/types';
import AlertBadge from '@/components/ui/AlertBadge.vue';

defineProps<{ movement: StockMovement }>();

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>
