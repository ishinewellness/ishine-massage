import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ServicesPage from '../pages/ServicesPage.vue'
import StoresPage from '../pages/StoresPage.vue'
import TherapistsPage from '../pages/TherapistsPage.vue'
import BookingPage from '../pages/BookingPage.vue'
import OrdersPage from '../pages/OrdersPage.vue'
import OrderDetailPage from '../pages/OrderDetailPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/services', name: 'services', component: ServicesPage },
  { path: '/stores', name: 'stores', component: StoresPage },
  { path: '/therapists', name: 'therapists', component: TherapistsPage },
  { path: '/booking', name: 'booking', component: BookingPage },
  { path: '/orders', name: 'orders', component: OrdersPage },
  { path: '/orders/:id', name: 'order-detail', component: OrderDetailPage },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
