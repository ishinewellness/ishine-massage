<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <span class="text-2xl">💆</span>
        <span class="text-xl font-bold text-sky-600">iShine<span class="text-amber-500">Wellness</span></span>
      </router-link>

      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
        <router-link to="/" class="hover:text-sky-600 transition">{{ $t('nav.home') }}</router-link>
        <router-link to="/services" class="hover:text-sky-600 transition">{{ $t('nav.services') }}</router-link>
        <router-link to="/stores" class="hover:text-sky-600 transition">{{ $t('nav.stores') }}</router-link>
        <router-link to="/therapists" class="hover:text-sky-600 transition">{{ $t('nav.therapists') }}</router-link>
        <router-link to="/orders" class="hover:text-sky-600 transition">{{ $t('nav.orders') }}</router-link>
      </nav>

      <div class="flex items-center gap-3">
        <!-- Language Switcher -->
        <div class="flex items-center gap-1 text-sm">
          <button @click="switchLang('zh')" :class="['px-2 py-1 rounded transition', locale === 'zh' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-400 hover:text-gray-600']">中文</button>
          <span class="text-gray-300">|</span>
          <button @click="switchLang('en')" :class="['px-2 py-1 rounded transition', locale === 'en' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-400 hover:text-gray-600']">EN</button>
          <span class="text-gray-300">|</span>
          <button @click="switchLang('fr')" :class="['px-2 py-1 rounded transition', locale === 'fr' ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-gray-400 hover:text-gray-600']">FR</button>
        </div>

        <router-link to="/booking"
          class="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
          {{ $t('nav.bookNow') }}
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function switchLang(lang) {
  locale.value = lang
  localStorage.setItem('iShineLang', lang)
}
</script>
