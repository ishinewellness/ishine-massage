<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('stores.title') }}</h1>
    <p class="text-gray-500 mb-8">{{ $t('stores.subtitle') }}</p>

    <div v-if="loading" class="text-center py-20 text-gray-400">{{ $t('common.loading') }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="store in stores" :key="store.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
        <img :src="store.image" :alt="store.name" class="w-full h-48 object-cover" />
        <div class="p-6">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold text-gray-900">{{ store.name }}</h3>
            <span class="flex items-center gap-1 text-amber-500 text-sm font-semibold">
              ⭐ {{ store.rating }}
            </span>
          </div>
          <p class="text-gray-500 text-sm mb-1">{{ store.address }}</p>
          <p class="text-gray-500 text-sm mb-1">{{ store.phone }}</p>
          <p class="text-gray-500 text-sm mb-4">{{ store.hours }}</p>
          <router-link :to="`/booking?store=${store.id}`"
            class="inline-block bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition">
            {{ $t('stores.bookThis') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const stores = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    stores.value = await api.stores.list()
  } catch (e) {
    console.error('Failed to load stores', e)
  } finally {
    loading.value = false
  }
})
</script>
