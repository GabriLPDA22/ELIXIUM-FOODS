<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')" aria-label="Cerrar modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="modal-header">
        <h3 class="modal-title" v-if="product">
          Disponible en
        </h3>
        <p class="product-name" v-if="product">{{ product.name }}</p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando restaurantes...</p>
      </div>

      <div v-else-if="localError" class="error-state">
        <p>{{ localError }}</p>
        <button class="retry-btn" @click="processOfferings(props.offerings)">
          Reintentar
        </button>
      </div>

      <div v-else-if="sortedOfferings && sortedOfferings.length" class="restaurant-list">
        <div
          v-for="offering in sortedOfferings"
          :key="offering.restaurantId"
          class="restaurant-item"
          :class="{ 'unavailable': !offering.isAvailable }"
          @click="selectRestaurant(offering)"
        >
          <div class="offer-badge" v-if="offering.offerDetails?.hasOffer">
            {{ offering.offerDetails.offerText }}
          </div>

          <div class="restaurant-info">
            <div class="restaurant-logo">
              <img
                v-if="offering.restaurantLogoUrl"
                :src="offering.restaurantLogoUrl"
                :alt="offering.restaurantName || 'Logo'"
              />
              <div v-else class="logo-placeholder">
                {{ offering.restaurantName ? offering.restaurantName.charAt(0).toUpperCase() : 'R' }}
              </div>
            </div>

            <div class="restaurant-details">
              <h4 class="restaurant-name">{{ offering.restaurantName || 'Restaurante Desconocido' }}</h4>
              <div class="status">
                <span class="status-dot" :class="{ 'available': offering.isAvailable }"></span>
                {{ offering.isAvailable ? 'Disponible' : 'No disponible' }}
              </div>
            </div>
          </div>

          <div class="price-info">
            <template v-if="offering.isAvailable">
              <div v-if="offering.offerDetails && offering.offerDetails.hasOffer" class="price-offer">
                <span class="old-price">€{{ offering.price.toFixed(2) }}</span>
                <span class="new-price">€{{ offering.offerDetails.discountedPrice.toFixed(2) }}</span>
              </div>
              <div v-else class="price-normal">
                €{{ offering.price.toFixed(2) }}
              </div>
            </template>
            <span v-else class="price-unavailable">No disponible</span>
          </div>

          <div class="select-arrow" v-if="offering.isAvailable">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Este producto no está disponible en ningún restaurante.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
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
    const response = await api.get(`/api/restaurants/${restaurantId}/products/${productId}/active-offer`);

    if (response.data && response.data.hasOffer && response.data.isActive) {
      const offerData = response.data;
      let discountedPrice = originalPrice;
      let offerText = '';

      if (offerData.discountType === 'percentage') {
        discountedPrice = originalPrice * (1 - offerData.discountValue / 100);
        offerText = `${offerData.discountValue}% OFF`;
      } else if (offerData.discountType === 'fixed') {
        discountedPrice = Math.max(0, originalPrice - offerData.discountValue);
        offerText = `€${offerData.discountValue.toFixed(2)} OFF`;
      }

      return {
        hasOffer: true,
        discountedPrice,
        offerText,
        originalPrice
      };
    }

    return null;
  } catch (error) {
    console.warn(`No se pudo obtener oferta para producto ${productId} en restaurante ${restaurantId}:`, error);
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
        const offerDetails = await fetchOfferForProductInRestaurant(
          props.product!.id,
          offering.restaurantId,
          offering.price
        );

        return {
          ...offering,
          offerDetails: offerDetails || {
            hasOffer: false,
            discountedPrice: offering.price,
            offerText: ''
          }
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
  // Bloquear scroll del body cuando el modal se abre
  document.body.style.overflow = 'hidden';

  isLoading.value = props.isLoadingInitialOfferings ?? false;
  localError.value = props.errorInitialOfferings ?? null;
  if (props.offerings && !localError.value) {
     processOfferings(props.offerings);
  } else if (!props.offerings && !isLoading.value && !localError.value) {
    enhancedOfferings.value = [];
  }
});

onUnmounted(() => {
  // Restaurar scroll del body cuando el modal se cierra
  document.body.style.overflow = '';
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
// Mobile-first, simple styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 100%;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    max-width: 700px;
    border-radius: 20px;
  }

  @media (min-width: 1024px) {
    max-width: 900px;
  }
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: #e5e7eb;
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;

  @media (min-width: 768px) {
    padding: 24px;
  }
}

.modal-title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
}

.product-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.loading-state, .error-state, .empty-state {
  padding: 40px 20px;
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
}

.restaurant-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

.restaurant-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;

  @media (min-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 20px 16px;
    align-items: center;
    gap: 16px;
  }

  &:hover:not(.unavailable) {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }

  &.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f9fafb;
  }
}

.offer-badge {
  position: absolute;
  top: -6px;
  right: 12px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (min-width: 768px) {
    top: -8px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}

.restaurant-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  @media (min-width: 768px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
    width: 100%;
  }
}

.restaurant-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.restaurant-details {
  flex: 1;
  min-width: 0;
}

.restaurant-name {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    white-space: normal;
    text-align: center;
    line-height: 1.3;
  }
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #6b7280;

  @media (min-width: 768px) {
    justify-content: center;
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;

  &.available {
    background: #10b981;
  }
}

.price-info {
  flex-shrink: 0;
  text-align: right;

  @media (min-width: 768px) {
    text-align: center;
    width: 100%;
  }
}

.price-offer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.old-price {
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.new-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ef4444;
}

.price-normal {
  font-size: 1.125rem;
  font-weight: 600;
  color: #059669;
}

.price-unavailable {
  font-size: 0.875rem;
  color: #ef4444;
  font-style: italic;
}

.select-arrow {
  color: #9ca3af;
  flex-shrink: 0;
  transition: all 0.15s ease;

  @media (min-width: 768px) {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
}

.restaurant-item:hover:not(.unavailable) .select-arrow {
  color: #3b82f6;
  transform: translateX(2px);
}

.restaurant-list::-webkit-scrollbar {
  width: 4px;
}

.restaurant-list::-webkit-scrollbar-track {
  background: transparent;
}

.restaurant-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
</style>
