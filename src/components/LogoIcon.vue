<template>
  <svg viewBox="0 0 64 64" :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <!-- Sun (top-right) with rays -->
    <g stroke="#C9A961" stroke-width="2.4" stroke-linecap="round">
      <line x1="46" y1="6" x2="46" y2="12" />
      <line x1="56" y1="14" x2="51" y2="17" />
      <line x1="60" y1="26" x2="54" y2="26" />
      <line x1="51" y1="37" x2="56" y2="34" />
      <line x1="36" y1="10" x2="40" y2="14" />
    </g>
    <circle cx="46" cy="24" r="8" fill="#C9A961" />

    <!-- Crescent moon / meditating figure (body) -->
    <path d="M30 14
             C 18 14 9 23 9 35
             C 9 48 20 58 33 58
             C 30 56 27 53 26 49
             C 19 48 14 42 14 35
             C 14 26 21 19 30 17
             Z"
          fill="#C9A961" />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: [Number, String], default: 36 }
})
</script>
