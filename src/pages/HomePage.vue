<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-sky-50 via-white to-amber-50 overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div class="flex flex-col md:flex-row items-center gap-10">
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {{ $t('home.title') }}<br>
              <span class="text-sky-600">{{ $t('home.titleHighlight') }}</span>
            </h1>
            <p class="mt-4 text-lg text-gray-600 max-w-lg">
              {{ $t('home.subtitle') }}
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <router-link to="/booking"
                class="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full text-center transition shadow-lg shadow-sky-200">
                {{ $t('home.bookNow') }}
              </router-link>
              <router-link to="/services"
                class="border-2 border-gray-300 hover:border-sky-500 text-gray-700 font-semibold px-8 py-3 rounded-full text-center transition">
                {{ $t('home.viewServices') }}
              </router-link>
            </div>
          </div>
          <div class="flex-1">
            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80"
              alt="Massage therapy" class="rounded-2xl shadow-xl w-full max-w-md mx-auto" />
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">{{ $t('home.howItWorks') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('home.step1Title') }}</h3>
            <p class="text-gray-500 text-sm">{{ $t('home.step1Desc') }}</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('home.step2Title') }}</h3>
            <p class="text-gray-500 text-sm">{{ $t('home.step2Desc') }}</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('home.step3Title') }}</h3>
            <p class="text-gray-500 text-sm">{{ $t('home.step3Desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-sky-600 text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ $t('home.ctaTitle') }}</h2>
        <p class="text-sky-100 mb-8">{{ $t('home.ctaSubtitle') }}</p>
        <router-link to="/booking"
          class="inline-block bg-white text-sky-600 font-bold px-10 py-3 rounded-full hover:bg-sky-50 transition shadow-lg">
          {{ $t('home.ctaButton') }}
        </router-link>
      </div>
    </section>
  </div>
</template>
