<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-blue-500 to-sky-800">{{ title }}</h1>
    <slot />
  </div>
</template>
