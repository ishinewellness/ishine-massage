<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">加盟技师</h1>
    <p class="text-gray-500 mb-8">专业的持证按摩师，上门为你服务</p>

    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="t in therapists" :key="t.id"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
        <div class="flex items-center gap-4 mb-4">
          <img :src="t.avatar" :alt="t.name" class="w-16 h-16 rounded-full object-cover" />
          <div>
            <h3 class="font-bold text-gray-900">{{ t.name }}</h3>
            <p class="text-sm text-gray-500">{{ t.title }}</p>
            <span class="flex items-center gap-1 text-amber-500 text-sm">
              ⭐ {{ t.rating }} <span class="text-gray-400">({{ t.reviews }} 评价)</span>
            </span>
          </div>
        </div>
        <p class="text-gray-500 text-sm mb-3">{{ t.bio }}</p>
        <div class="mb-4">
          <span class="text-xs text-gray-400">{{ t.yearsExp }} 年经验 · </span>
          <span v-for="spec in t.specialties" :key="spec"
            class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-1">
            {{ spec }}
          </span>
        </div>
        <router-link :to="`/booking?therapist=${t.id}`"
          class="inline-block w-full text-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition">
          预约这位技师
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const therapists = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    therapists.value = await api.therapists.list(true)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
