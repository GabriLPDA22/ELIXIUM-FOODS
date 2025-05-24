<!-- src/layouts/MainLayout.vue  -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="text-2xl">🍕</div>
              <span class="text-xl font-bold text-gray-900">UberEats</span>
            </router-link>
          </div>

          <!-- Search Bar - Con atributo de tutorial -->
          <div
            class="flex-1 max-w-lg mx-8"
            v-bind="tutorial.searchBarAttrs"
          >
            <div class="relative">
              <input
                type="text"
                placeholder="Buscar restaurantes o platos..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                v-model="searchQuery"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Right side navigation -->
          <div class="flex items-center space-x-4">
            <!-- Cart Button - Con atributo de tutorial -->
            <button
              v-bind="tutorial.cartButtonAttrs"
              @click="toggleCart"
              class="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8h11M7 13v8a2 2 0 002 2h4a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
              </svg>
              <span
                v-if="cartStore.itemCount > 0"
                class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.itemCount }}
              </span>
            </button>

            <!-- User Menu - Con atributo de tutorial -->
            <div
              class="relative"
              v-bind="tutorial.userMenuAttrs"
            >
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-semibold">
                    {{ authStore.user?.firstName?.charAt(0) || 'U' }}
                  </span>
                </div>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Mi Perfil
                </router-link>
                <router-link
                  to="/orders"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Mis Pedidos
                </router-link>
                <button
                  @click="showTutorialMenu"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  🎯 Ver Tutorial
                </button>
                <hr class="my-1">
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Categories Section - Con atributo de tutorial -->
      <section
        class="mb-8"
        v-bind="tutorial.categoriesAttrs"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="filterByCategory(category.id)"
          >
            <div class="text-3xl mb-2">{{ category.icon }}</div>
            <span class="text-sm font-medium text-gray-700 text-center">{{ category.name }}</span>
          </div>
        </div>
      </section>

      <!-- Popular Restaurants - Con atributo de tutorial -->
      <section
        class="mb-8"
        v-bind="tutorial.popularRestaurantsAttrs"
      >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Restaurantes Populares</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="restaurant in popularRestaurants"
            :key="restaurant.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToRestaurant(restaurant.id)"
          >
            <img
              :src="restaurant.coverImageUrl"
              :alt="restaurant.name"
              class="w-full h-48 object-cover rounded-t-lg"
            />
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1">{{ restaurant.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ restaurant.description }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>⭐ {{ restaurant.averageRating }}</span>
                <span>🚚 {{ restaurant.estimatedDeliveryTime }} min</span>
                <span>💰 ${{ restaurant.deliveryFee }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Slot para contenido dinámico -->
      <slot />
    </main>

    <!-- Tutorial Modal -->
    <TutorialModal />

    <!-- Tutorial Menu Modal -->
    <div
      v-if="showTutorialMenuModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeTutorialMenu"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">🎯 Tutoriales Disponibles</h3>

        <div class="space-y-3">
          <button
            @click="startSpecificTutorial('mainApp')"
            class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="font-medium text-gray-900">🏠 Tutorial Principal</div>
            <div class="text-sm text-gray-600">Funciones básicas de la app</div>
          </button>

          <button
            @click="startSpecificTutorial('restaurant')"
            class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="font-medium text-gray-900">🍽️ Tutorial de Restaurante</div>
            <div class="text-sm text-gray-600">Cómo hacer pedidos</div>
          </button>

          <button
            @click="startSpecificTutorial('checkout')"
            class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="font-medium text-gray-900">💳 Tutorial de Pago</div>
            <div class="text-sm text-gray-600">Proceso de checkout</div>
          </button>
        </div>

        <div class="mt-6 pt-4 border-t">
          <button
            @click="resetTutorials"
            class="w-full text-sm text-orange-600 hover:text-orange-700 transition-colors"
          >
            🔄 Resetear todos los tutoriales
          </button>
        </div>

        <button
          @click="closeTutorialMenu"
          class="mt-4 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHomeTutorial } from '@/composables/useTutorial'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import TutorialModal from '@/components/TutorialModal.vue'

// Composables
const tutorial = useHomeTutorial()
const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Local state
const searchQuery = ref('')
const showUserMenu = ref(false)
const showTutorialMenuModal = ref(false)

// Mock data
const categories = ref([
  { id: 1, name: 'Pizza', icon: '🍕' },
  { id: 2, name: 'Burgers', icon: '🍔' },
  { id: 3, name: 'Sushi', icon: '🍱' },
  { id: 4, name: 'Tacos', icon: '🌮' },
  { id: 5, name: 'Desserts', icon: '🍰' },
  { id: 6, name: 'Coffee', icon: '☕' },
  { id: 7, name: 'Healthy', icon: '🥗' },
  { id: 8, name: 'More', icon: '➕' }
])

const popularRestaurants = ref([
  {
    id: 1,
    name: 'Pizza Palace',
    description: 'Auténtica pizza italiana',
    coverImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    averageRating: 4.5,
    estimatedDeliveryTime: 25,
    deliveryFee: 2.99
  },
  // ... más restaurantes
])

// Methods
const toggleCart = () => {
  // Lógica para mostrar/ocultar carrito
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const showTutorialMenu = () => {
  showUserMenu.value = false
  showTutorialMenuModal.value = true
}

const closeTutorialMenu = () => {
  showTutorialMenuModal.value = false
}

const startSpecificTutorial = (tutorialName: 'mainApp' | 'restaurant' | 'checkout') => {
  closeTutorialMenu()
  tutorial.showTutorial(tutorialName)
}

const resetTutorials = () => {
  tutorial.resetAllTutorials()
  closeTutorialMenu()
  alert('Todos los tutoriales han sido reseteados. Recarga la página para ver el tutorial de bienvenida.')
}

const filterByCategory = (categoryId: number) => {
  // Lógica para filtrar por categoría
}

const goToRestaurant = (restaurantId: number) => {
  router.push(`/restaurant/${restaurantId}`)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as Element
    if (!target.closest('[data-tour="user-menu"]')) {
      showUserMenu.value = false
    }
  })
})
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
