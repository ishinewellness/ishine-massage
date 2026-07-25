<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">我的订单</h1>
    <p class="text-gray-500 mb-8">查看您的所有预约记录</p>

    <!-- Lookup by phone -->
    <div v-if="!searched" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <label class="block text-sm font-medium text-gray-700 mb-2">输入手机号查询订单</label>
      <div class="flex gap-3">
        <input v-model="phoneInput" type="tel" placeholder="请输入下单时用的手机号"
          class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" />
        <button @click="searchOrders"
          class="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-lg transition">
          查询
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">加载中...</div>

    <div v-if="searched && !loading">
      <div v-if="orders.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-2xl mb-2">📋</p>
        <p>暂无订单记录</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order.id"
          class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
          <router-link :to="`/orders/${order.id}`" class="block">
            <div class="flex items-start justify-between mb-2">
              <div>
                <span class="font-mono text-sm text-gray-400">{{ order.id }}</span>
                <span :class="['ml-3 text-xs px-2 py-0.5 rounded-full', statusClass(order.status)]">
                  {{ statusText(order.status) }}
                </span>
              </div>
              <span class="text-sm text-gray-500">{{ order.date }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span v-if="order.mode === 'store'">🏪 到店</span>
              <span v-else>🚪 上门</span>
              <span class="text-gray-300">·</span>
              <span>服务ID: {{ order.serviceId }}</span>
              <span class="text-gray-300">·</span>
              <span>{{ order.time }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../api'

const phoneInput = ref('')
const orders = ref([])
const loading = ref(false)
const searched = ref(false)

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

async function searchOrders() {
  if (!phoneInput.value) return
  loading.value = true
  searched.value = true
  try {
    orders.value = await api.orders.list(phoneInput.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
