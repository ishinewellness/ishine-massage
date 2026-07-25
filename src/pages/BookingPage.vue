<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">预约服务</h1>
    <p class="text-gray-500 mb-8">选择服务模式，几步完成预约</p>

    <!-- Step 1: Mode Selection -->
    <div v-if="step === 1" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <h2 class="text-xl font-bold text-gray-900 mb-6">选择服务方式</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button @click="selectMode('store')"
          class="p-8 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition text-center group">
          <span class="text-4xl">🏪</span>
          <h3 class="text-lg font-bold text-gray-900 mt-3 mb-1">到店体验</h3>
          <p class="text-sm text-gray-500">前往我们的门店，享受专业服务</p>
        </button>
        <button @click="selectMode('home')"
          class="p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition text-center group">
          <span class="text-4xl">🚪</span>
          <h3 class="text-lg font-bold text-gray-900 mt-3 mb-1">技师上门</h3>
          <p class="text-sm text-gray-500">专业技师到你家提供服务</p>
        </button>
      </div>
    </div>

    <!-- Step 2a: Store Selection (for store mode) -->
    <div v-if="step === 'store-2'" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-6">
        <button @click="goBack" class="text-gray-400 hover:text-gray-600">← 返回</button>
        <h2 class="text-xl font-bold text-gray-900">选择门店</h2>
      </div>
      <div v-if="storesLoading" class="text-center py-8 text-gray-400">加载中...</div>
      <div v-else class="space-y-4">
        <button v-for="s in stores" :key="s.id" @click="selectedStore = s; step = 'store-3'"
          class="w-full text-left p-5 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition">
          <h3 class="font-bold text-gray-900">{{ s.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ s.address }}</p>
          <p class="text-sm text-gray-400 mt-1">⭐ {{ s.rating }} ({{ s.reviews }} 评价) · {{ s.phone }}</p>
        </button>
      </div>
    </div>

    <!-- Step 2b: Service Selection -->
    <div v-if="step === 'store-3' || step === 'home-2'" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-6">
        <button @click="goBack" class="text-gray-400 hover:text-gray-600">← 返回</button>
        <h2 class="text-xl font-bold text-gray-900">选择服务项目</h2>
      </div>
      <div v-if="servicesLoading" class="text-center py-8 text-gray-400">加载中...</div>
      <div v-else class="space-y-3">
        <button v-for="s in availableServices" :key="s.id" @click="selectedService = s; step = isStoreMode ? 'store-4' : 'home-3'"
          class="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-sky-500 transition flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">{{ s.name }} <span class="text-gray-400 text-sm">({{ s.nameZh }})</span></h3>
            <p class="text-xs text-gray-400 mt-1">{{ s.duration }}</p>
          </div>
          <span class="text-sky-600 font-bold text-lg">${{ s.price }}</span>
        </button>
      </div>
    </div>

    <!-- Step: Therapist Selection (for home mode) -->
    <div v-if="step === 'home-3'" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-6">
        <button @click="goBack" class="text-gray-400 hover:text-gray-600">← 返回</button>
        <h2 class="text-xl font-bold text-gray-900">选择技师</h2>
      </div>
      <div v-if="therapistsLoading" class="text-center py-8 text-gray-400">加载中...</div>
      <div v-else class="space-y-4">
        <button v-for="t in therapists" :key="t.id" @click="selectedTherapist = t; step = 'home-4'"
          class="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 transition flex items-center gap-4">
          <img :src="t.avatar" :alt="t.name" class="w-14 h-14 rounded-full object-cover" />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ t.name }}</h3>
            <p class="text-xs text-gray-500">{{ t.title }}</p>
            <span class="text-amber-500 text-xs">⭐ {{ t.rating }} ({{ t.reviews }} 评价)</span>
            <div class="mt-1">
              <span v-for="spec in t.specialties" :key="spec" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded mr-1">{{ spec }}</span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Step: Date/Time Selection + Info -->
    <div v-if="step === 'store-4' || step === 'home-4'" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-6">
        <button @click="goBack" class="text-gray-400 hover:text-gray-600">← 返回</button>
        <h2 class="text-xl font-bold text-gray-900">填写预约信息</h2>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
        <div class="font-semibold text-gray-900 mb-2">📋 预约摘要</div>
        <p v-if="isStoreMode">🏪 {{ selectedStore.name }}</p>
        <p v-else>🚪 上门服务 · 技师: {{ selectedTherapist?.name }}</p>
        <p>💆 {{ selectedService.name }} ({{ selectedService.nameZh }}) · {{ selectedService.duration }} · <span class="text-sky-600 font-bold">${{ selectedService.price }}</span></p>
      </div>

      <div class="space-y-4">
        <div v-if="isStoreMode">
          <label class="block text-sm font-medium text-gray-700 mb-1">上门地址 (仅上门模式)</label>
          <input v-model="form.address" type="text" placeholder="请输入您的地址" disabled
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed" />
          <p class="text-xs text-gray-400 mt-1">到店模式无需填写地址</p>
        </div>
        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-1">上门地址</label>
          <input v-model="form.address" type="text" placeholder="请输入您的详细地址"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预约日期</label>
            <input v-model="form.date" type="date"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预约时间</label>
            <select v-model="form.time"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition">
              <option value="">选择时间</option>
              <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">您的姓名</label>
          <input v-model="form.customerName" type="text" placeholder="请输入您的姓名"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
          <input v-model="form.phone" type="tel" placeholder="请输入您的手机号"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注 (选填)</label>
          <textarea v-model="form.note" rows="2" placeholder="如有特殊需求，请在这里备注"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition resize-none"></textarea>
        </div>

        <button @click="submitOrder"
          :disabled="submitting"
          class="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition">
          {{ submitting ? '提交中...' : `确认预约 · $${selectedService.price}` }}
        </button>
      </div>
    </div>

    <!-- Success -->
    <div v-if="step === 'done'" class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
      <span class="text-5xl">✅</span>
      <h2 class="text-2xl font-bold text-gray-900 mt-4 mb-2">预约成功！</h2>
      <p class="text-gray-500 mb-6">您的预约已提交，我们会尽快与您联系确认。</p>
      <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
        <p><span class="text-gray-400">订单号：</span><span class="font-mono font-bold text-gray-900">{{ createdOrder?.id }}</span></p>
        <p><span class="text-gray-400">服务：</span>{{ selectedService.name }} ({{ selectedService.duration }})</p>
        <p><span class="text-gray-400">日期：</span>{{ form.date }} {{ form.time }}</p>
        <p><span class="text-gray-400">金额：</span><span class="text-sky-600 font-bold">${{ selectedService.price }}</span></p>
      </div>
      <div class="flex gap-3 justify-center">
        <router-link to="/orders" class="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-full transition">
          查看我的订单
        </router-link>
        <router-link to="/" class="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-2.5 rounded-full transition">
          返回首页
        </router-link>
      </div>
    </div>

    <!-- Error -->
    <div v-if="step === 'error'" class="bg-white rounded-xl p-8 shadow-sm border border-red-100 text-center">
      <span class="text-5xl">😅</span>
      <h2 class="text-xl font-bold text-gray-900 mt-4 mb-2">提交失败</h2>
      <p class="text-gray-500 mb-6">{{ errorMsg }}</p>
      <button @click="goBack" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded-full transition">
        返回重试
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'

const route = useRoute()

const step = ref(1)
const stores = ref([])
const therapists = ref([])
const services = ref([])
const loading = ref(false)
const submitting = ref(false)
const errorMsg = ref('')

const storesLoading = ref(false)
const servicesLoading = ref(false)
const therapistsLoading = ref(false)

const selectedStore = ref(null)
const selectedService = ref(null)
const selectedTherapist = ref(null)

const form = ref({
  address: '',
  date: new Date().toISOString().split('T')[0],
  time: '',
  customerName: '',
  phone: '',
  note: ''
})

const createdOrder = ref(null)

const isStoreMode = computed(() => selectedStore.value !== null)

const availableServices = computed(() => {
  if (isStoreMode.value && selectedStore.value) {
    return services.value.filter(s => s.available.includes('store'))
  }
  return services.value.filter(s => s.available.includes('home'))
})

const timeSlots = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30'
]

function selectMode(mode) {
  if (mode === 'store') {
    loadStores()
    step.value = 'store-2'
  } else {
    step.value = 'home-2'
    loadTherapists()
    loadServices()
  }
}

async function loadStores() {
  storesLoading.value = true
  loadServices()
  try {
    stores.value = await api.stores.list()
  } catch (e) {
    console.error(e)
  } finally {
    storesLoading.value = false
  }
}

async function loadServices() {
  servicesLoading.value = true
  try {
    services.value = await api.services.list()
  } catch (e) {
    console.error(e)
  } finally {
    servicesLoading.value = false
  }
}

async function loadTherapists() {
  therapistsLoading.value = true
  try {
    therapists.value = await api.therapists.list(true)
  } catch (e) {
    console.error(e)
  } finally {
    therapistsLoading.value = false
  }
}

function goBack() {
  if (step.value === 'store-2' || step.value === 'error') {
    step.value = 1
    selectedStore.value = null
    selectedService.value = null
    selectedTherapist.value = null
  } else if (step.value === 'store-3') {
    step.value = 'store-2'
    selectedService.value = null
  } else if (step.value === 'store-4') {
    step.value = 'store-3'
  } else if (step.value === 'home-2') {
    step.value = 1
    selectedService.value = null
  } else if (step.value === 'home-3') {
    step.value = 'home-2'
    selectedTherapist.value = null
  } else if (step.value === 'home-4') {
    step.value = 'home-3'
  }
}



async function submitOrder() {
  if (!form.value.customerName || !form.value.phone || !form.value.date || !form.value.time) {
    errorMsg.value = '请填写完整的预约信息'
    step.value = 'error'
    return
  }
  if (!isStoreMode.value && !form.value.address) {
    errorMsg.value = '上门服务请填写地址'
    step.value = 'error'
    return
  }

  submitting.value = true
  try {
    const orderData = {
      mode: isStoreMode.value ? 'store' : 'home',
      serviceId: selectedService.value.id,
      storeId: isStoreMode.value ? selectedStore.value.id : null,
      therapistId: isStoreMode.value ? null : selectedTherapist.value.id,
      customerName: form.value.customerName,
      phone: form.value.phone,
      address: isStoreMode.value ? null : form.value.address,
      date: form.value.date,
      time: form.value.time,
      note: form.value.note
    }
    createdOrder.value = await api.orders.create(orderData)
    step.value = 'done'
  } catch (e) {
    errorMsg.value = '提交失败，请稍后重试'
    step.value = 'error'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (route.query.store) {
    loadStores()
    step.value = 'store-2'
  } else if (route.query.therapist) {
    step.value = 'home-2'
    loadTherapists()
    loadServices()
  }
})
</script>
