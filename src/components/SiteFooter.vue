<template>
  <footer class="bg-gray-900 text-gray-400 py-10 mt-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 class="text-white font-bold mb-3">{{ $t('site.brand') }}</h4>
          <p class="text-sm">{{ $t('site.slogan') }}</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">Contact</h4>
          <p class="text-sm">17800-C Boul Gouin O<br>Pierrefonds - Roxboro, QC H9J 1A8</p>
          <p class="text-sm mt-1">(514) 664-1908</p>
          <p class="text-sm">ishine.centre@gmail.com</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">Hours</h4>
          <p class="text-sm">{{ locale === 'fr' ? 'Mercredi - Dimanche' : (locale === 'en' ? 'Wednesday - Sunday' : '周三 - 周日') }}</p>
          <p class="text-sm">12:00 - 20:00</p>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
        <p>{{ $t('site.copyright', { year: new Date().getFullYear() }) }}</p>
        <p class="mt-1">
          <a :href="mainSiteUrl" target="_blank" class="hover:text-sky-400 transition">{{ $t('site.officialSite') }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const mainSiteUrl = 'https://www.ishinewellnesscenter.ca'
</script>
