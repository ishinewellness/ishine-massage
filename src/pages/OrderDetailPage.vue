<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <router-link to="/orders" class="text-sky-600 hover:text-sky-700 text-sm mb-4 inline-block">← 返回订单列表</router-link>

    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>

    <div v-if="error" class="bg-white rounded-xl p-8 shadow-sm border border-red-100 text-center">
      <p class="text-gray-500">订单不存在</p>
      <router-link to="/orders" class="text-sky-600 hover:text-sky-700 text-sm mt-2 inline-block">返回订单列表</router-link>
    </div>

    <div v-if="order && !loading" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">订单详情</h1>
          <span class="font-mono text-sm text-gray-400">{{ order.id }}</span>
        </div>
        <span :class="['text-sm px-3 py-1 rounded-full', statusClass(order.status)]">
          {{ statusText(order.status) }}
        </span>
      </div>

      <div class="border-t border-gray-100 pt-6 space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-400">服务方式</p>
            <p class="font-semibold text-gray-900">{{ order.mode === 'store' ? '🏪 到店服务' : '🚪 上门服务' }}</p>
          </div>
          <div>
            <p class="text-gray-400">预约日期</p>
            <p class="font-semibold text-gray-900">{{ order.date }} {{ order.time }}</p>
          </div>
          <div>
            <p class="text-gray-400">顾客姓名</p>
            <p class="font-semibold text-gray-900">{{ order.customerName }}</p>
          </div>
          <div>
            <p class="text-gray-400">手机号码</p>
            <p class="font-semibold text-gray-900">{{ order.phone }}</p>
          </div>
          <div v-if="order.mode === 'home'">
            <p class="text-gray-400">上门地址</p>
            <p class="font-semibold text-gray-900">{{ order.address }}</p>
          </div>
          <div v-if="order.note">
            <p class="text-gray-400">备注</p>
            <p class="font-semibold text-gray-900">{{ order.note }}</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mt-4">
          <p class="text-gray-400 text-sm mb-1">创建时间</p>
          <p class="text-sm text-gray-600">{{ new Date(order.createdAt).toLocaleString() }}</p>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <router-link to="/booking" class="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition">
          再次预约
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const error = ref(false)

function statusClass(status) {
  return {
    'confirmed': 'bg-blue-50 text-blue-600',
    'in-progress': 'bg-amber-50 text-amber-600',
    'completed': 'bg-green-50 text-green-600',
    'cancelled': 'bg-red-50 text-red-600'
  }[status] || 'bg-gray-50 text-gray-600'
}

function statusText(status) {
  return {
    'confirmed': '已确认',
    'in-progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }[status] || status
}

onMounted(async () => {
  try {
    order.value = await api.orders.get(route.params.id)
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
