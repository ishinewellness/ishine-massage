<template>
  <footer class="bg-gray-900 text-gray-400 py-10 mt-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 class="text-white font-bold mb-3">iShine康养中心</h4>
          <p class="text-sm">随时随地，按出好状态</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">联系方式</h4>
          <p class="text-sm">17800-C Boul Gouin O<br>Pierrefonds - Roxboro, QC H9J 1A8</p>
          <p class="text-sm mt-1">(514) 664-1908</p>
          <p class="text-sm">ishine.centre@gmail.com</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">营业时间</h4>
          <p class="text-sm">周三 - 周日</p>
          <p class="text-sm">中午 12:00 - 晚上 8:00</p>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
        <p>&copy; {{ new Date().getFullYear() }} iShine Wellness Center. All rights reserved.</p>
        <p class="mt-1">
          <a :href="mainSiteUrl" target="_blank" class="hover:text-sky-400 transition">访问官网 ishinewellnesscenter.ca</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const mainSiteUrl = 'https://www.ishinewellnesscenter.ca'
</script>
