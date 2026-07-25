<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">服务项目</h1>
    <p class="text-gray-500 mb-8">专业的中医理疗服务，总有一款适合你</p>

    <!-- Category Filter -->
    <div class="flex gap-3 mb-8 flex-wrap">
      <button @click="category = ''"
        :class="['px-5 py-2 rounded-full text-sm font-medium transition', !category ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
        全部
      </button>
      <button @click="category = 'massage'"
        :class="['px-5 py-2 rounded-full text-sm font-medium transition', category === 'massage' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
        按摩
      </button>
      <button @click="category = 'reflexology'"
        :class="['px-5 py-2 rounded-full text-sm font-medium transition', category === 'reflexology' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
        反射疗法
      </button>
      <button @click="category = 'therapy'"
        :class="['px-5 py-2 rounded-full text-sm font-medium transition', category === 'therapy' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
        理疗
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>

    <!-- Services Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="s in filteredServices" :key="s.id"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-bold text-gray-900">{{ s.name }}</h3>
            <p class="text-sm text-gray-400">{{ s.nameZh }}</p>
          </div>
          <span class="text-sky-600 font-bold text-lg">${{ s.price }}</span>
        </div>
        <p class="text-gray-500 text-sm mb-3">{{ s.description }}</p>
        <div class="flex items-center gap-2">
          <span class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{{ s.duration }}</span>
          <span v-if="s.available.includes('store')" class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">到店</span>
          <span v-if="s.available.includes('home')" class="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">上门</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'

const services = ref([])
const loading = ref(true)
const category = ref('')

const filteredServices = computed(() => {
  if (!category.value) return services.value
  return services.value.filter(s => s.category === category.value)
})

onMounted(async () => {
  try {
    services.value = await api.services.list()
  } catch (e) {
    console.error('Failed to load services', e)
  } finally {
    loading.value = false
  }
})
</script>
