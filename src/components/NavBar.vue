<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <span class="text-2xl">💆</span>
        <span class="text-xl font-bold text-sky-600">iShine<span class="text-amber-500">按摩</span></span>
      </router-link>

      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
        <router-link to="/" class="hover:text-sky-600 transition">首页</router-link>
        <router-link to="/services" class="hover:text-sky-600 transition">服务项目</router-link>
        <router-link to="/stores" class="hover:text-sky-600 transition">门店</router-link>
        <router-link to="/therapists" class="hover:text-sky-600 transition">技师</router-link>
        <router-link to="/orders" class="hover:text-sky-600 transition">我的订单</router-link>
      </nav>

      <div class="flex items-center gap-2">
        <router-link to="/booking"
          class="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
          立即预约
        </router-link>
      </div>
    </div>
  </header>
</template>
