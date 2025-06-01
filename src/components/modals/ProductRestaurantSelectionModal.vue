<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close-button" @click="$emit('close')" aria-label="Cerrar modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="modal-header">
        <h3 class="modal-title" v-if="product">
          <span class="modal-title-icon">🛍️</span>
          Ver "{{ product.name }}" en:
        </h3>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando restaurantes...</p>
      </div>
      <div v-else-if="localError" class="error-message">
        <p>⚠️ {{ localError }}</p>
      </div>
      <ul v-else-if="sortedOfferings && sortedOfferings.length" class="restaurant-list">
        <li
          v-for="offering in sortedOfferings"
          :key="offering.restaurantId"
          class="restaurant-list-item"
          :class="{ 'unavailable-item': !offering.isAvailable }"
          @click="selectRestaurant(offering)"
          role="button"
          :aria-disabled="!offering.isAvailable"
          :tabindex="offering.isAvailable ? 0 : -1"
        >
          <div class="item-main-info">
            <div class="restaurant-logo-container">
              <img
                v-if="offering.restaurantLogoUrl"
                :src="offering.restaurantLogoUrl"
                :alt="offering.restaurantName || 'Logo'"
                class="restaurant-logo"
              />
              <div v-else class="restaurant-logo-placeholder">
                {{ offering.restaurantName ? offering.restaurantName.charAt(0).toUpperCase() : 'R' }}
              </div>
            </div>
            <div class="restaurant-details">
              <span class="restaurant-name">{{ offering.restaurantName || 'Restaurante Desconocido' }}</span>
              <div class="price-and-offer-info">
                <template v-if="offering.isAvailable">
                  <span
                    v-if="offering.offerDetails && offering.offerDetails.hasOffer"
                    class="price-container"
                  >
                    <span class="original-price">€{{ offering.price.toFixed(2) }}</span>
                    <span class="discounted-price">€{{ offering.offerDetails.discountedPrice.toFixed(2) }}</span>
                    <span class="offer-badge">{{ offering.offerDetails.offerText }}</span>
                  </span>
                  <span v-else class="restaurant-price">€{{ offering.price.toFixed(2) }}</span>
                </template>
                <span v-else class="restaurant-unavailable">No disponible</span>
              </div>
            </div>
          </div>
          <div class="restaurant-actions" v-if="offering.isAvailable">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="select-arrow-icon">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </li>
      </ul>
      <div v-else class="no-offerings">
        <p>Este producto no parece estar disponible en ningún restaurante en este momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import type { SearchProduct, RestaurantProductOfferingDto as BaseRestaurantProductOfferingDto } from '@/services/searchService';
import { api } from '@/services/api';

interface OfferDetails {
  hasOffer: boolean;
  discountedPrice: number;
  offerText: string;
  originalPrice?: number;
}

interface RestaurantProductOfferingDto extends BaseRestaurantProductOfferingDto {
  restaurantLogoUrl?: string;
  offerDetails?: OfferDetails;
}

interface Props {
  product: SearchProduct | null;
  offerings: BaseRestaurantProductOfferingDto[];
  isLoadingInitialOfferings?: boolean;
  errorInitialOfferings?: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', offering: BaseRestaurantProductOfferingDto): void;
  (e: 'close'): void;
}>();

const isLoading = ref(false);
const localError = ref<string | null>(null);
const enhancedOfferings = ref<RestaurantProductOfferingDto[]>([]);

const fetchOfferForProductInRestaurant = async (productId: number, restaurantId: number, originalPrice: number): Promise<OfferDetails | null> => {
  try {
    // const response = await api.get(`/restaurants/${restaurantId}/products/${productId}/active-offer`);
    // if (response.data && response.data.isActive) {
    //   const offerData = response.data;
    //   let discountedPrice = originalPrice;
    //   let offerText = '';
    //   if (offerData.discountType === 'percentage') {
    //     discountedPrice = originalPrice * (1 - offerData.discountValue / 100);
    //     offerText = `${offerData.discountValue}% OFF`;
    //   } else if (offerData.discountType === 'fixed') {
    //     discountedPrice = Math.max(0, originalPrice - offerData.discountValue);
    //     offerText = `€${offerData.discountValue.toFixed(2)} OFF`;
    //   }
    //   return { hasOffer: true, discountedPrice, offerText, originalPrice };
    // }
    return null;
  } catch (error) {
    console.error(`API error fetching offer for product ${productId} at restaurant ${restaurantId}:`, error);
    return null;
  }
};

const processOfferings = async (rawOfferings: BaseRestaurantProductOfferingDto[]) => {
  if (!props.product) {
    enhancedOfferings.value = [];
    isLoading.value = false;
    return;
  }

  if (!rawOfferings || rawOfferings.length === 0) {
    enhancedOfferings.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  localError.value = null;

  try {
    const processed = await Promise.all(
      rawOfferings.map(async (offering) => {
        const offerDetails = await fetchOfferForProductInRestaurant(props.product!.id, offering.restaurantId, offering.price);
        return {
          ...offering,
          offerDetails: offerDetails || { hasOffer: false, discountedPrice: offering.price, offerText: '' }
        };
      })
    );
    enhancedOfferings.value = processed;
  } catch (error) {
    console.error("Error processing offerings:", error);
    localError.value = "No se pudieron cargar las opciones del restaurante.";
    enhancedOfferings.value = rawOfferings.map(o => ({
        ...o,
        offerDetails: { hasOffer: false, discountedPrice: o.price, offerText: '' }
    }));
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.offerings, (newOfferings) => {
  if (newOfferings) {
    processOfferings(newOfferings);
  } else {
    enhancedOfferings.value = [];
  }
}, { immediate: true, deep: true });


watch(() => props.isLoadingInitialOfferings, (newVal) => {
  isLoading.value = newVal ?? false;
});

watch(() => props.errorInitialOfferings, (newVal) => {
  localError.value = newVal ?? null;
  if (newVal) {
    enhancedOfferings.value = [];
  }
});

onMounted(() => {
  isLoading.value = props.isLoadingInitialOfferings ?? false;
  localError.value = props.errorInitialOfferings ?? null;
  if (props.offerings && !localError.value) {
     processOfferings(props.offerings);
  } else if (!props.offerings && !isLoading.value && !localError.value) {
    enhancedOfferings.value = []; // Asegurar que esté vacío si no hay offerings iniciales
  }
});

const sortedOfferings = computed(() => {
  return [...enhancedOfferings.value].sort((a, b) => {
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;
    if (a.offerDetails?.hasOffer && !b.offerDetails?.hasOffer) return -1;
    if (!a.offerDetails?.hasOffer && b.offerDetails?.hasOffer) return 1;
    const priceA = a.offerDetails?.hasOffer ? a.offerDetails.discountedPrice : a.price;
    const priceB = b.offerDetails?.hasOffer ? b.offerDetails.discountedPrice : b.price;
    if (priceA !== priceB) return priceA - priceB;
    return (a.restaurantName || '').localeCompare(b.restaurantName || '');
  });
});

const selectRestaurant = (offering: RestaurantProductOfferingDto) => {
  if (offering.isAvailable) {
    const baseOffering: BaseRestaurantProductOfferingDto = {
        restaurantId: offering.restaurantId,
        restaurantName: offering.restaurantName,
        restaurantLogoUrl: offering.restaurantLogoUrl,
        price: offering.price,
        isAvailable: offering.isAvailable,
        stockQuantity: offering.stockQuantity,
        productId: offering.productId,
        productName: offering.productName,
    };
    emit('select', baseOffering);
  } else {
    alert(`"${props.product?.name || 'Este producto'}" no está disponible actualmente en "${offering.restaurantName}".`);
  }
};

</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.modal-content {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  width: 100%;
  max-width: 480px;
  position: relative;
  animation: slideInUp 0.3s ease-out;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-grow: 1;
}

.modal-title-icon {
  color: #f97316;
  font-size: 1.5rem;
}

.modal-close-button {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 8px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-button:hover {
  color: #ef4444;
}

.loading-state,
.error-message,
.no-offerings {
  text-align: center;
  padding: 40px 20px;
  font-size: 1rem;
  color: #4b5563;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 4px solid #e5e7eb;
  border-top: 4px solid #f97316;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message p {
  color: #ef4444;
  font-weight: 500;
}

.restaurant-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 4px;
}

.restaurant-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.restaurant-list-item:last-child {
  border-bottom: none;
}

.restaurant-list-item:hover:not(.unavailable-item) {
  background-color: #fff7ed;
}

.restaurant-list-item.unavailable-item {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-main-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
  min-width: 0;
}

.restaurant-logo-container {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.restaurant-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-logo-placeholder {
  width: 100%;
  height: 100%;
  background-color: #fdba74;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.restaurant-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
  min-width: 0;
}

.restaurant-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-and-offer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.restaurant-price {
  color: #16a34a;
  font-size: 0.9rem;
  font-weight: 600;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.original-price {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 0.8rem;
}

.discounted-price {
  color: #f97316;
  font-weight: 700;
  font-size: 0.95rem;
}

.offer-badge {
  background-color: #f97316;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
}

.restaurant-unavailable {
  color: #ef4444;
  font-size: 0.85rem;
  font-style: italic;
  font-weight: 500;
}

.restaurant-actions {
  color: #9ca3af;
  margin-left: 12px;
  flex-shrink: 0;
}

.select-arrow-icon {
  transition: transform 0.15s ease-in-out;
}

.restaurant-list-item:hover:not(.unavailable-item) .select-arrow-icon {
  color: #f97316;
  transform: translateX(2px);
}

.restaurant-list::-webkit-scrollbar {
  width: 5px;
}
.restaurant-list::-webkit-scrollbar-track {
  background: transparent;
}
.restaurant-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.restaurant-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
