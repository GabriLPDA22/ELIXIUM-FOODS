<!-- src/views/UserProfile.vue -->
<template>
    <div class="user-profile">
        <!-- Header with user info -->
        <section class="profile-header">
            <div class="container">
                <div class="profile-header__content">
                    <div class="profile-header__avatar">
                        <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName"
                            class="profile-header__avatar-img" />
                        <div v-else class="profile-header__avatar-placeholder">
                            {{ getInitials(user.displayName) }}
                        </div>
                    </div>
                    <div class="profile-header__info">
                        <h1 class="profile-header__name">{{ user.displayName }}</h1>
                        <div class="profile-header__details">
                            <span class="profile-header__email">{{ user.email }}</span>
                            <span class="profile-header__joined">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Miembro desde {{ formatDate(user.createdAt) }}
                            </span>
                        </div>
                    </div>
                    <div class="profile-header__actions">
                        <button class="profile-header__edit-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                            Editar perfil
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Navigation tabs -->
        <div class="profile-tabs">
            <div class="container">
                <div class="profile-tabs__list">
                    <button v-for="tab in tabs" :key="tab.id"
                        :class="['profile-tabs__tab', { 'profile-tabs__tab--active': activeTab === tab.id }]"
                        @click="activeTab = tab.id">
                        <span class="profile-tabs__tab-icon">{{ tab.icon }}</span>
                        <span class="profile-tabs__tab-text">{{ tab.label }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Content based on active tab -->
        <div class="profile-content">
            <div class="container">
                <!-- Tab: My Info -->
                <div v-if="activeTab === 'info'" class="profile-content__section">
                    <div class="content-panel">
                        <div class="content-panel__header">
                            <h2 class="content-panel__title">Mi Información Personal</h2>
                            <p class="content-panel__subtitle">
                                Administra tu información personal y preferencias de contacto
                            </p>
                        </div>

                        <div class="content-panel__body">
                            <div class="info-form">
                                <div class="info-form__row">
                                    <div class="info-form__field">
                                        <label class="info-form__label">Nombre</label>
                                        <input type="text" v-model="userInfo.firstName" class="info-form__input"
                                            placeholder="Tu nombre" />
                                    </div>
                                    <div class="info-form__field">
                                        <label class="info-form__label">Apellido</label>
                                        <input type="text" v-model="userInfo.lastName" class="info-form__input"
                                            placeholder="Tu apellido" />
                                    </div>
                                </div>

                                <div class="info-form__row">
                                    <div class="info-form__field">
                                        <label class="info-form__label">Email</label>
                                        <input type="email" v-model="userInfo.email" class="info-form__input"
                                            placeholder="tu@email.com" />
                                    </div>
                                    <div class="info-form__field">
                                        <label class="info-form__label">Teléfono</label>
                                        <input type="tel" v-model="userInfo.phone" class="info-form__input"
                                            placeholder="+34 XXX XXX XXX" />
                                    </div>
                                </div>

                                <div class="info-form__row">
                                    <div class="info-form__field info-form__field--full">
                                        <label class="info-form__label">Fecha de nacimiento</label>
                                        <input type="date" v-model="userInfo.birthdate" class="info-form__input" />
                                    </div>
                                </div>

                                <div class="info-form__divider"></div>

                                <div class="info-form__row">
                                    <div class="info-form__field info-form__field--full">
                                        <label class="info-form__label">Preferencias nutricionales</label>
                                        <div class="info-form__tags">
                                            <button v-for="pref in dietaryPreferences" :key="pref.id" :class="[
                                                'info-form__tag',
                                                {
                                                    'info-form__tag--active':
                                                        userInfo.dietaryPreferences.includes(pref.id),
                                                },
                                            ]" @click="toggleDietaryPreference(pref.id)">
                                                <span class="info-form__tag-icon">{{ pref.icon }}</span>
                                                <span>{{ pref.label }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="info-form__actions">
                                    <button class="info-form__submit">Guardar cambios</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Address -->
                <div v-else-if="activeTab === 'address'" class="profile-content__section">
                    <div class="content-panel">
                        <div class="content-panel__header">
                            <h2 class="content-panel__title">Mis Direcciones</h2>
                            <p class="content-panel__subtitle">
                                Administra tus direcciones de entrega y facturación
                            </p>
                        </div>

                        <div class="content-panel__body">
                            <div v-if="addresses.length === 0" class="empty-state">
                                <div class="empty-state__icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <h3 class="empty-state__title">No tienes direcciones guardadas</h3>
                                <p class="empty-state__text">
                                    Agrega direcciones para agilizar tu proceso de pedido y entrega
                                </p>
                                <button class="empty-state__button" @click="showAddressForm = true">
                                    Añadir dirección
                                </button>
                            </div>

                            <div v-else class="address-list">
                                <div v-for="address in addresses" :key="address.id" class="address-card" :class="{
                                    'address-card--default': address.isDefault,
                                }">
                                    <div v-if="address.isDefault" class="address-card__badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        Predeterminada
                                    </div>

                                    <div class="address-card__type">
                                        <svg v-if="address.type === 'home'" width="18" height="18" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                        </svg>
                                        <svg v-else-if="address.type === 'work'" width="18" height="18"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="3" y1="9" x2="21" y2="9"></line>
                                            <line x1="9" y1="21" x2="9" y2="9"></line>
                                        </svg>
                                        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span class="address-card__type-text">
                                            {{ address.type === 'home' ? 'Casa' : address.type === 'work' ? 'Trabajo' :
                                            'Otro' }}
                                        </span>
                                    </div>

                                    <h3 class="address-card__name">{{ address.name }}</h3>
                                    <p class="address-card__street">{{ address.street }}</p>
                                    <p class="address-card__city">
                                        {{ address.postalCode }} {{ address.city }}, {{ address.country }}
                                    </p>

                                    <div class="address-card__actions">
                                        <button v-if="!address.isDefault"
                                            class="address-card__action-btn address-card__action-btn--default"
                                            @click="setDefaultAddress(address.id)">
                                            Hacer predeterminada
                                        </button>
                                        <button class="address-card__action-btn address-card__action-btn--edit"
                                            @click="editAddress(address.id)">
                                            Editar
                                        </button>
                                        <button class="address-card__action-btn address-card__action-btn--delete"
                                            @click="deleteAddress(address.id)">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div class="address-list__add">
                                    <button class="address-list__add-btn" @click="showAddressForm = true">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="16"></line>
                                            <line x1="8" y1="12" x2="16" y2="12"></line>
                                        </svg>
                                        Añadir nueva dirección
                                    </button>
                                </div>
                            </div>

                            <!-- Address form (add/edit) -->
                            <div v-if="showAddressForm" class="address-form">
                                <div class="address-form__header">
                                    <h3 class="address-form__title">
                                        {{ editingAddressId ? 'Editar dirección' : 'Añadir nueva dirección' }}
                                    </h3>
                                    <button class="address-form__close" @click="closeAddressForm">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>

                                <div class="address-form__body">
                                    <div class="address-form__row">
                                        <div class="address-form__field address-form__field--full">
                                            <label class="address-form__label">Nombre de la dirección</label>
                                            <input type="text" v-model="addressForm.name" class="address-form__input"
                                                placeholder="Ej: Mi casa, Oficina, etc." />
                                        </div>
                                    </div>

                                    <div class="address-form__row">
                                        <div class="address-form__field address-form__field--full">
                                            <label class="address-form__label">Tipo de dirección</label>
                                            <div class="address-form__type-selector">
                                                <button class="address-form__type-btn"
                                                    :class="{ 'address-form__type-btn--active': addressForm.type === 'home' }"
                                                    @click="addressForm.type = 'home'">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                                    </svg>
                                                    <span>Casa</span>
                                                </button>
                                                <button class="address-form__type-btn"
                                                    :class="{ 'address-form__type-btn--active': addressForm.type === 'work' }"
                                                    @click="addressForm.type = 'work'">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                        <line x1="3" y1="9" x2="21" y2="9"></line>
                                                        <line x1="9" y1="21" x2="9" y2="9"></line>
                                                    </svg>
                                                    <span>Trabajo</span>
                                                </button>
                                                <button class="address-form__type-btn"
                                                    :class="{ 'address-form__type-btn--active': addressForm.type === 'other' }"
                                                    @click="addressForm.type = 'other'">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                    <span>Otro</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="address-form__row">
                                        <div class="address-form__field address-form__field--full">
                                            <label class="address-form__label">Calle y número</label>
                                            <input type="text" v-model="addressForm.street" class="address-form__input"
                                                placeholder="Ej: Calle Gran Vía 123, 2º B" />
                                        </div>
                                    </div>

                                    <div class="address-form__row">
                                        <div class="address-form__field">
                                            <label class="address-form__label">Código postal</label>
                                            <input type="text" v-model="addressForm.postalCode"
                                                class="address-form__input" placeholder="28001" />
                                        </div>
                                        <div class="address-form__field">
                                            <label class="address-form__label">Ciudad</label>
                                            <input type="text" v-model="addressForm.city" class="address-form__input"
                                                placeholder="Madrid" />
                                        </div>
                                    </div>

                                    <div class="address-form__row">
                                        <div class="address-form__field address-form__field--full">
                                            <label class="address-form__label">País</label>
                                            <select v-model="addressForm.country" class="address-form__select">
                                                <option value="España">España</option>
                                                <option value="Portugal">Portugal</option>
                                                <option value="Francia">Francia</option>
                                                <option value="Alemania">Alemania</option>
                                                <option value="Italia">Italia</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="address-form__row">
                                        <div class="address-form__field address-form__field--full">
                                            <label class="address-form__label">Instrucciones de entrega
                                                (opcional)</label>
                                            <textarea v-model="addressForm.instructions" class="address-form__textarea"
                                                placeholder="Ej: Puerta negra, timbre 4B, perro grande amistoso..."></textarea>
                                        </div>
                                    </div>

                                    <div class="address-form__row">
                                        <div class="address-form__field address-form__field--full">
                                            <div class="address-form__checkbox">
                                                <input type="checkbox" id="default-address"
                                                    v-model="addressForm.isDefault"
                                                    class="address-form__checkbox-input" />
                                                <label for="default-address" class="address-form__checkbox-label">
                                                    Establecer como dirección predeterminada
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="address-form__actions">
                                        <button class="address-form__cancel" @click="closeAddressForm">Cancelar</button>
                                        <button class="address-form__submit" @click="saveAddress">Guardar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Orders -->
                <div v-else-if="activeTab === 'orders'" class="profile-content__section">
                    <div class="content-panel">
                        <div class="content-panel__header">
                            <h2 class="content-panel__title">Mis Pedidos</h2>
                            <p class="content-panel__subtitle">
                                Consulta el historial de tus pedidos y su estado
                            </p>
                        </div>

                        <div class="content-panel__body">
                            <div v-if="orders.length === 0" class="empty-state">
                                <div class="empty-state__icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                </div>
                                <h3 class="empty-state__title">No tienes pedidos</h3>
                                <p class="empty-state__text">Tus pedidos aparecerán aquí una vez que realices uno</p>
                                <button class="empty-state__button" @click="goToRestaurants">
                                    Explorar restaurantes
                                </button>
                            </div>

                            <div v-else class="order-list">
                                <div v-for="order in orders" :key="order.id" class="order-card" :class="{
                                    'order-card--active': order.status === 'active',
                                    'order-card--completed': order.status === 'completed',
                                    'order-card--cancelled': order.status === 'cancelled',
                                }">
                                    <div class="order-card__header">
                                        <div class="order-card__restaurant">
                                            <img :src="order.restaurant.logo" :alt="order.restaurant.name"
                                                class="order-card__restaurant-logo" />
                                            <h3 class="order-card__restaurant-name">{{ order.restaurant.name }}</h3>
                                        </div>
                                        <div class="order-card__status">
                                            <span class="order-card__status-badge" :class="{
                                                'order-card__status-badge--active': order.status === 'active',
                                                'order-card__status-badge--completed': order.status === 'completed',
                                                'order-card__status-badge--cancelled': order.status === 'cancelled',
                                            }">
                                                {{
                                                    order.status === 'active'
                                                        ? 'En progreso'
                                                        : order.status === 'completed'
                                                            ? 'Entregado'
                                                : 'Cancelado'
                                                }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="order-card__info">
                                        <div class="order-card__info-item">
                                            <span class="order-card__info-label">Pedido</span>
                                            <span class="order-card__info-value">#{{ order.orderNumber }}</span>
                                        </div>
                                        <div class="order-card__info-item">
                                            <span class="order-card__info-label">Fecha</span>
                                            <span class="order-card__info-value">{{ formatDate(order.date) }}</span>
                                        </div>
                                        <div class="order-card__info-item">
                                            <span class="order-card__info-label">Total</span>
                                            <span class="order-card__info-value">{{ formatPrice(order.total) }}</span>
                                        </div>
                                        <div class="order-card__info-item">
                                            <span class="order-card__info-label">Elementos</span>
                                            <span class="order-card__info-value">{{ order.items.length }}</span>
                                        </div>
                                    </div>

                                    <div class="order-card__items">
                                        <div v-for="(item, index) in order.items.slice(0, 2)" :key="index"
                                            class="order-card__item">
                                            <span class="order-card__item-quantity">{{ item.quantity }}x</span>
                                            <span class="order-card__item-name">{{ item.name }}</span>
                                        </div>
                                        <div v-if="order.items.length > 2" class="order-card__more-items">
                                            + {{ order.items.length - 2 }} más
                                        </div>
                                    </div>

                                    <div class="order-card__actions">
                                        <button class="order-card__action-btn order-card__action-btn--details"
                                            @click="viewOrderDetails(order.id)">
                                            Ver detalles
                                        </button>
                                        <button v-if="order.status === 'completed'"
                                            class="order-card__action-btn order-card__action-btn--reorder"
                                            @click="reorder(order.id)">
                                            Pedir de nuevo
                                        </button>
                                        <button v-if="order.status === 'active' && canCancel(order)"
                                            class="order-card__action-btn order-card__action-btn--cancel"
                                            @click="cancelOrder(order.id)">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Payment -->
                <div v-else-if="activeTab === 'payment'" class="profile-content__section">
                    <div class="content-panel">
                        <div class="content-panel__header">
                            <h2 class="content-panel__title">Métodos de Pago</h2>
                            <p class="content-panel__subtitle">
                                Administra tus tarjetas y otros métodos de pago
                            </p>
                        </div>

                        <div class="content-panel__body">
                            <div v-if="paymentMethods.length === 0" class="empty-state">
                                <div class="empty-state__icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                </div>
                                <h3 class="empty-state__title">No tienes métodos de pago</h3>
                                <p class="empty-state__text">
                                    Añade un método de pago para agilizar el proceso de compra
                                </p>
                                <button class="empty-state__button">Añadir método de pago</button>
                            </div>

                            <div v-else class="payment-list">
                                <div v-for="method in paymentMethods" :key="method.id" class="payment-card" :class="{
                                    'payment-card--default': method.isDefault,
                                }">
                                    <div class="payment-card__type">
                                        <img v-if="method.type === 'visa'" src="" alt="Visa"
                                            class="payment-card__type-logo" />
                                        <img v-else-if="method.type === 'mastercard'"
                                            src="" alt="Mastercard"
                                            class="payment-card__type-logo" />
                                        <img v-else-if="method.type === 'amex'" src=""
                                            alt="American Express" class="payment-card__type-logo" />
                                        <img v-else-if="method.type === 'paypal'" src=""
                                            alt="PayPal" class="payment-card__type-logo" />
                                        <span v-else class="payment-card__type-generic">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                <line x1="1" y1="10" x2="23" y2="10"></line>
                                            </svg>
                                        </span>
                                    </div>

                                    <div class="payment-card__info">
                                        <h3 class="payment-card__name">{{ method.name }}</h3>
                                        <p class="payment-card__number">
                                            <span v-if="method.type === 'paypal'">{{ method.email }}</span>
                                            <span v-else>**** **** **** {{ method.lastFour }}</span>
                                        </p>
                                        <p class="payment-card__expiry" v-if="method.type !== 'paypal'">
                                            Expira: {{ method.expiryMonth }}/{{ method.expiryYear }}
                                        </p>
                                    </div>

                                    <div v-if="method.isDefault" class="payment-card__badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        Predeterminado
                                    </div>

                                    <div class="payment-card__actions">
                                        <button v-if="!method.isDefault"
                                            class="payment-card__action-btn payment-card__action-btn--default"
                                            @click="setDefaultPaymentMethod(method.id)">
                                            Hacer predeterminado
                                        </button>
                                        <button class="payment-card__action-btn payment-card__action-btn--edit"
                                            @click="editPaymentMethod(method.id)">
                                            Editar
                                        </button>
                                        <button class="payment-card__action-btn payment-card__action-btn--delete"
                                            @click="deletePaymentMethod(method.id)">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div class="payment-list__add">
                                    <button class="payment-list__add-btn">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="16"></line>
                                            <line x1="8" y1="12" x2="16" y2="12"></line>
                                        </svg>
                                        Añadir nuevo método de pago
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Favorites -->
                <div v-else-if="activeTab === 'favorites'" class="profile-content__section">
                    <div class="content-panel">
                        <div class="content-panel__header">
                            <h2 class="content-panel__title">Mis Favoritos</h2>
                            <p class="content-panel__subtitle">
                                Restaurantes y platos que has marcado como favoritos
                            </p>
                        </div>

                        <div class="content-panel__body">
                            <div v-if="favoriteRestaurants.length === 0" class="empty-state">
                                <div class="empty-state__icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path
                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                        </path>
                                    </svg>
                                </div>
                                <h3 class="empty-state__title">No tienes favoritos</h3>
                                <p class="empty-state__text">
                                    Marca tus restaurantes y platos favoritos para encontrarlos fácilmente
                                </p>
                                <button class="empty-state__button" @click="goToRestaurants">
                                    Explorar restaurantes
                                </button>
                            </div>

                            <div v-else class="favorites-restaurants">
                                <h3 class="favorites-section-title">Restaurantes favoritos</h3>
                                <div class="favorites-grid">
                                    <div v-for="restaurant in favoriteRestaurants" :key="restaurant.id"
                                        class="favorite-restaurant-card" @click="goToRestaurant(restaurant.id)">
                                        <div class="favorite-restaurant-card__image">
                                            <img :src="restaurant.coverImage" :alt="restaurant.name"
                                                class="favorite-restaurant-card__img" />
                                            <button class="favorite-restaurant-card__fav-btn"
                                                @click.stop="toggleFavoriteRestaurant(restaurant.id)">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                    <path
                                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                                    </path>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="favorite-restaurant-card__content">
                                            <h4 class="favorite-restaurant-card__name">{{ restaurant.name }}</h4>
                                            <div class="favorite-restaurant-card__info">
                                                <span class="favorite-restaurant-card__cuisine">
                                                    {{ restaurant.cuisine }}
                                                </span>
                                                <span class="favorite-restaurant-card__rating">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFC107"
                                                        stroke="#FFC107" stroke-width="0.5" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <polygon
                                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                                        </polygon>
                                                    </svg>
                                                    {{ restaurant.rating }}
                                                    <span class="favorite-restaurant-card__reviews">
                                                        ({{ restaurant.reviewCount }})
                                                    </span>
                                                </span>
                                            </div>
                                            <p class="favorite-restaurant-card__delivery">
                                                <span>{{ restaurant.deliveryTime }} min</span>
                                                <span>{{ formatPrice(restaurant.deliveryFee) }} envío</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="favoriteDishes.length > 0" class="favorites-dishes">
                                    <h3 class="favorites-section-title">Platos favoritos</h3>
                                    <div class="favorites-grid">
                                        <div v-for="dish in favoriteDishes" :key="dish.id" class="favorite-dish-card"
                                            @click="goToDish(dish.id, dish.restaurantId)">
                                            <div class="favorite-dish-card__image">
                                                <img :src="dish.image" :alt="dish.name"
                                                    class="favorite-dish-card__img" />
                                                <button class="favorite-dish-card__fav-btn"
                                                    @click.stop="toggleFavoriteDish(dish.id)">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round">
                                                        <path
                                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                                        </path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div class="favorite-dish-card__content">
                                                <h4 class="favorite-dish-card__name">{{ dish.name }}</h4>
                                                <p class="favorite-dish-card__restaurant">
                                                    {{ dish.restaurantName }}
                                                </p>
                                                <p class="favorite-dish-card__price">{{ formatPrice(dish.price) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Active tab
const tabs = [
    { id: 'info', label: 'Mi Información', icon: '👤' },
    { id: 'address', label: 'Direcciones', icon: '📍' },
    { id: 'orders', label: 'Mis Pedidos', icon: '📦' },
    { id: 'payment', label: 'Métodos de Pago', icon: '💳' },
    { id: 'favorites', label: 'Favoritos', icon: '❤️' }
]
const activeTab = ref('info')

// Mock user data
const user = reactive({
    id: 1,
    displayName: 'Juan Pérez',
    email: 'juan.perez@example.com',
    photoURL: null,
    createdAt: new Date('2023-01-15')
})

// User information form
const userInfo = reactive({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+34 666 777 888',
    birthdate: '1990-06-15',
    dietaryPreferences: ['vegetarian']
})

// Dietary preferences options
const dietaryPreferences = [
    { id: 'vegetarian', label: 'Vegetariano', icon: '🥗' },
    { id: 'vegan', label: 'Vegano', icon: '🌱' },
    { id: 'glutenFree', label: 'Sin Gluten', icon: '🌾' },
    { id: 'lactoseFree', label: 'Sin Lactosa', icon: '🥛' },
    { id: 'nutFree', label: 'Sin Frutos Secos', icon: '🥜' },
    { id: 'pescatarian', label: 'Pescatariano', icon: '🐟' },
    { id: 'keto', label: 'Keto', icon: '🥩' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' }
]

// Toggle dietary preference
const toggleDietaryPreference = (prefId: string) => {
    const index = userInfo.dietaryPreferences.indexOf(prefId)
    if (index === -1) {
        userInfo.dietaryPreferences.push(prefId)
    } else {
        userInfo.dietaryPreferences.splice(index, 1)
    }
}

// Addresses
const addresses = ref([
    {
        id: 1,
        name: 'Mi Casa',
        type: 'home',
        street: 'Calle Gran Vía 123, 2º B',
        postalCode: '28001',
        city: 'Madrid',
        country: 'España',
        instructions: 'Puerta negra, timbre 4B',
        isDefault: true
    },
    {
        id: 2,
        name: 'Oficina',
        type: 'work',
        street: 'Calle Serrano 45, Planta 3',
        postalCode: '28006',
        city: 'Madrid',
        country: 'España',
        instructions: 'Preguntar por recepción',
        isDefault: false
    }
])

// Address form
const showAddressForm = ref(false)
const editingAddressId = ref<number | null>(null)
const addressForm = reactive({
    name: '',
    type: 'home',
    street: '',
    postalCode: '',
    city: '',
    country: 'España',
    instructions: '',
    isDefault: false
})

// Address methods
const setDefaultAddress = (id: number) => {
    addresses.value = addresses.value.map((addr) => ({
        ...addr,
        isDefault: addr.id === id
    }))
}

const editAddress = (id: number) => {
    const address = addresses.value.find((addr) => addr.id === id)
    if (address) {
        editingAddressId.value = id
        Object.assign(addressForm, address)
        showAddressForm.value = true
    }
}

const deleteAddress = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
        addresses.value = addresses.value.filter((addr) => addr.id !== id)
    }
}

const closeAddressForm = () => {
    showAddressForm.value = false
    editingAddressId.value = null
    resetAddressForm()
}

const resetAddressForm = () => {
    Object.assign(addressForm, {
        name: '',
        type: 'home',
        street: '',
        postalCode: '',
        city: '',
        country: 'España',
        instructions: '',
        isDefault: false
    })
}

const saveAddress = () => {
    if (editingAddressId.value) {
        // Update existing address
        addresses.value = addresses.value.map((addr) => {
            if (addr.id === editingAddressId.value) {
                return { ...addressForm, id: addr.id }
            }
            // If this is now the default, set others as non-default
            if (addressForm.isDefault && addr.isDefault) {
                return { ...addr, isDefault: false }
            }
            return addr
        })
    } else {
        // Add new address
        const newId = Math.max(0, ...addresses.value.map((a) => a.id)) + 1

        // If this is the first address or set as default
        if (addressForm.isDefault || addresses.value.length === 0) {
            // Set other addresses as non-default
            addresses.value = addresses.value.map((addr) => ({
                ...addr,
                isDefault: false
            }))
        }

        // Add the new address
        addresses.value.push({
            ...addressForm,
            id: newId,
            isDefault: addressForm.isDefault || addresses.value.length === 0
        })
    }

    closeAddressForm()
}

// Orders
const orders = ref([
    {
        id: 1,
        orderNumber: 'ELX-10045',
        status: 'completed',
        date: new Date('2023-12-15T20:30:00'),
        total: 24.99,
        restaurant: {
            id: 1,
            name: 'Burger Kingdom',
            logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        items: [
            { id: 1, name: 'Burger Clásica', quantity: 1, price: 8.99 },
            { id: 2, name: 'Patatas Fritas', quantity: 1, price: 3.5 },
            { id: 3, name: 'Refresco Cola', quantity: 2, price: 2.5 },
            { id: 4, name: 'Alitas de Pollo', quantity: 1, price: 7.5 }
        ]
    },
    {
        id: 2,
        orderNumber: 'ELX-10078',
        status: 'active',
        date: new Date('2023-12-28T13:45:00'),
        total: 32.5,
        restaurant: {
            id: 2,
            name: 'Pizza Paradise',
            logo: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        items: [
            { id: 1, name: 'Pizza Margarita (Grande)', quantity: 1, price: 12.99 },
            { id: 2, name: 'Pizza Pepperoni (Mediana)', quantity: 1, price: 10.5 },
            { id: 3, name: 'Bebida Cola (2L)', quantity: 1, price: 3.5 },
            { id: 4, name: 'Palitos de Ajo', quantity: 1, price: 5.5 }
        ]
    },
    {
        id: 3,
        orderNumber: 'ELX-10102',
        status: 'cancelled',
        date: new Date('2023-12-20T19:15:00'),
        total: 18.75,
        restaurant: {
            id: 3,
            name: 'Taco Town',
            logo: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        items: [
            { id: 1, name: 'Tacos de Carnitas (3)', quantity: 1, price: 9.99 },
            { id: 2, name: 'Guacamole con Nachos', quantity: 1, price: 5.75 },
            { id: 3, name: 'Agua de Horchata', quantity: 1, price: 3.0 }
        ]
    }
])

// Order methods
const viewOrderDetails = (id: number) => {
    router.push(`/order-tracking/${id}`)
}

const reorder = (id: number) => {
    const order = orders.value.find((o) => o.id === id)
    if (order) {
        // Add to cart logic would go here
        alert(`Reordenando pedido #${order.orderNumber}`)
    }
}

const cancelOrder = (id: number) => {
    if (confirm('¿Estás seguro de cancelar este pedido?')) {
        orders.value = orders.value.map((order) => {
            if (order.id === id) {
                return { ...order, status: 'cancelled' }
            }
            return order
        })
    }
}

const canCancel = (order: any) => {
    // Logic to determine if an order can be cancelled
    // For example, only within the first 5 minutes
    const orderTime = new Date(order.date).getTime()
    const now = new Date().getTime()
    const diffInMinutes = Math.floor((now - orderTime) / 1000 / 60)
    return diffInMinutes <= 5
}

// Payment methods
const paymentMethods = ref([
    {
        id: 1,
        type: 'visa',
        name: 'Visa Principal',
        lastFour: '4321',
        expiryMonth: '08',
        expiryYear: '25',
        isDefault: true
    },
    {
        id: 2,
        type: 'mastercard',
        name: 'Mastercard Negocios',
        lastFour: '8765',
        expiryMonth: '11',
        expiryYear: '24',
        isDefault: false
    },
    {
        id: 3,
        type: 'paypal',
        name: 'Mi cuenta PayPal',
        email: 'juan.perez@example.com',
        isDefault: false
    }
])

// Payment methods methods
const setDefaultPaymentMethod = (id: number) => {
    paymentMethods.value = paymentMethods.value.map((method) => ({
        ...method,
        isDefault: method.id === id
    }))
}

const editPaymentMethod = (id: number) => {
    // Usually this would show a form, but payment info editing is often more complex
    alert(`Editando método de pago ID: ${id}. En una implementación real, esto mostraría un formulario seguro.`)
}

const deletePaymentMethod = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
        paymentMethods.value = paymentMethods.value.filter((method) => method.id !== id)
    }
}

// Favorites
const favoriteRestaurants = ref([
    {
        id: 1,
        name: 'Burger Kingdom',
        cuisine: 'Americana',
        rating: 4.8,
        reviewCount: 324,
        deliveryTime: 25,
        deliveryFee: 2.99,
        coverImage: 'https://images.unsplash.com/photo-1542574271-7f3b92e6c821?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 2,
        name: 'Pizza Paradise',
        cuisine: 'Italiana',
        rating: 4.6,
        reviewCount: 258,
        deliveryTime: 35,
        deliveryFee: 3.99,
        coverImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
])

const favoriteDishes = ref([
    {
        id: 1,
        name: 'Burger Clásica',
        restaurantId: 1,
        restaurantName: 'Burger Kingdom',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        name: 'Pizza Margarita',
        restaurantId: 2,
        restaurantName: 'Pizza Paradise',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        name: 'Alitas Buffalo',
        restaurantId: 1,
        restaurantName: 'Burger Kingdom',
        price: 7.5,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
])

// Favorites methods
const toggleFavoriteRestaurant = (id: number) => {
    favoriteRestaurants.value = favoriteRestaurants.value.filter((r) => r.id !== id)
}

const toggleFavoriteDish = (id: number) => {
    favoriteDishes.value = favoriteDishes.value.filter((d) => d.id !== id)
}

const goToRestaurant = (id: number) => {
    router.push(`/restaurants/${id}`)
}

const goToDish = (dishId: number, restaurantId: number) => {
    router.push(`/restaurants/${restaurantId}?dishId=${dishId}`)
}

const goToRestaurants = () => {
    router.push('/restaurants')
}

// Utility functions
const getInitials = (name: string) => {
    if (!name) return '?'
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

const formatDate = (date: Date) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date))
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price)
}

onMounted(() => {
    // Initialize with the first tab
    activeTab.value = tabs[0].id
})
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);
$accent: #FFA502;
$dark: #1e293b;
$medium: #64748b;
$light: #f8fafc;
$light-gray: #e2e8f0;
$border-radius: 16px;
$border-radius-sm: 8px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

// Container
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
        padding: 0 1rem;
    }
}

// User profile
.user-profile {
    padding-bottom: 5rem;
    background-color: $light;
    min-height: 100vh;
}

// Profile header
.profile-header {
    background: $primary-gradient;
    color: white;
    padding: 3rem 0;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        z-index: 1;
    }

    &__content {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 2;

        @media (max-width: 768px) {
            flex-direction: column;
            text-align: center;
        }
    }

    &__avatar {
        flex: 0 0 120px;
        width: 120px;
        height: 120px;
        margin-right: 2rem;
        position: relative;

        @media (max-width: 768px) {
            margin-right: 0;
            margin-bottom: 1.5rem;
        }
    }

    &__avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid rgba(255, 255, 255, 0.3);
    }

    &__avatar-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 700;
        color: white;
        border: 4px solid rgba(255, 255, 255, 0.3);
    }

    &__info {
        flex: 1;

        @media (max-width: 768px) {
            width: 100%;
            margin-bottom: 1.5rem;
        }
    }

    &__name {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0 0 0.5rem;
        letter-spacing: -0.02em;

        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }

    &__details {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        font-size: 1rem;
        opacity: 0.9;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
        }
    }

    &__email,
    &__joined {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    &__actions {
        @media (max-width: 768px) {
            width: 100%;
        }
    }

    &__edit-btn {
        padding: 0.75rem 1.5rem;
        background-color: rgba(255, 255, 255, 0.15);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);

        &:hover {
            background-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }
    }
}

// Profile tabs
.profile-tabs {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    position: sticky;
    top: 0;
    z-index: 100;

    &__list {
        display: flex;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
            display: none;
        }

        @media (max-width: 768px) {
            padding: 0.5rem 0;
        }
    }

    &__tab {
        padding: 1.25rem 1.5rem;
        position: relative;
        font-weight: 600;
        color: $medium;
        background: none;
        border: none;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
            color: $primary;
        }

        &--active {
            color: $primary;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 1.5rem;
                right: 1.5rem;
                height: 3px;
                background: $primary-gradient;
                border-radius: 3px 3px 0 0;
            }
        }

        &-icon {
            font-size: 1.2rem;
        }

        @media (max-width: 768px) {
            padding: 1rem;

            &--active::after {
                left: 1rem;
                right: 1rem;
            }
        }
    }
}

// Profile content
.profile-content {
    padding: 2rem 0;

    &__section {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
}

// Content panel
.content-panel {
    background-color: white;
    border-radius: $border-radius;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    &__header {
        padding: 2rem;
        border-bottom: 1px solid $light-gray;

        @media (max-width: 768px) {
            padding: 1.5rem;
        }
    }

    &__title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__subtitle {
        color: $medium;
        margin: 0;
    }

    &__body {
        padding: 2rem;

        @media (max-width: 768px) {
            padding: 1.5rem;
        }
    }
}

// Info form
.info-form {
    &__row {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 1rem;
        }
    }

    &__field {
        flex: 1;

        &--full {
            width: 100%;
        }
    }

    &__label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: $dark;
    }

    &__input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid $light-gray;
        border-radius: $border-radius-sm;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
            outline: none;
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
    }

    &__divider {
        height: 1px;
        background-color: $light-gray;
        margin: 2rem 0;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    &__tag {
        padding: 0.6rem 1.25rem;
        border: 1px solid $light-gray;
        border-radius: 50px;
        background-color: white;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
            border-color: $primary;
            color: $primary;
        }

        &--active {
            background: $primary-gradient;
            color: white;
            border-color: transparent;

            &:hover {
                color: white;
                box-shadow: 0 5px 15px rgba($primary, 0.2);
            }
        }

        &-icon {
            font-size: 1.2rem;
        }
    }

    &__actions {
        margin-top: 2rem;
        display: flex;
        justify-content: flex-end;
    }

    &__submit {
        padding: 0.75rem 2rem;
        background: $primary-gradient;
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba($primary, 0.3);
        }
    }
}

// Empty state
.empty-state {
    text-align: center;
    padding: 3rem 1rem;

    &__icon {
        width: 80px;
        height: 80px;
        background-color: $light;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: $medium;
    }

    &__title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__text {
        color: $medium;
        margin: 0 0 2rem;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }

    &__button {
        padding: 0.75rem 1.5rem;
        background: $primary-gradient;
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba($primary, 0.3);
        }
    }
}

// Address list
.address-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }

    &__add {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
    }

    &__add-btn {
        padding: 0.75rem 1.5rem;
        background-color: white;
        color: $primary;
        border: 1px dashed $primary;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
            background-color: rgba($primary, 0.05);
            transform: translateY(-2px);
        }
    }
}

// Address card
.address-card {
    background-color: white;
    border: 1px solid $light-gray;
    border-radius: $border-radius;
    padding: 1.5rem;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        border-color: $primary;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        transform: translateY(-5px);
    }

    &--default {
        border-color: $primary;
        border-width: 2px;
    }

    &__badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.3rem 0.7rem;
        background-color: $primary;
        color: white;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    &__type {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: $medium;
    }

    &__type-text {
        font-size: 0.9rem;
    }

    &__name {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__street,
    &__city {
        margin: 0 0 0.5rem;
        color: $medium;
        font-size: 0.95rem;
        line-height: 1.5;
    }

    &__city {
        margin-bottom: 1.5rem;
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    &__action-btn {
        padding: 0.5rem 0.75rem;
        background: none;
        font-size: 0.85rem;
        border-radius: $border-radius-sm;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid $light-gray;

        &--default {
            color: $secondary;
            border-color: $secondary;

            &:hover {
                background-color: rgba($secondary, 0.05);
            }
        }

        &--edit {
            color: $medium;

            &:hover {
                background-color: $light;
            }
        }

        &--delete {
            color: $primary;
            border-color: $primary;

            &:hover {
                background-color: rgba($primary, 0.05);
            }
        }
    }
}

// Address form
.address-form {
    background-color: white;
    border-radius: $border-radius;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid $light-gray;
    }

    &__title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: $dark;
    }

    &__close {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $light;
        border: none;
        color: $medium;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: $light-gray;
            color: $dark;
        }
    }

    &__body {
        padding: 1.5rem;
    }

    &__row {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 1rem;
        }
    }

    &__field {
        flex: 1;

        &--full {
            width: 100%;
        }
    }

    &__label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: $dark;
    }

    &__input,
    &__select,
    &__textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid $light-gray;
        border-radius: $border-radius-sm;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
            outline: none;
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
    }

    &__textarea {
        resize: vertical;
        min-height: 100px;
    }

    &__type-selector {
        display: flex;
        gap: 1rem;

        @media (max-width: 640px) {
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    &__type-btn {
        flex: 1;
        padding: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
        border: 1px solid $light-gray;
        border-radius: $border-radius-sm;
        background-color: white;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            border-color: $primary;
            color: $primary;
        }

        &--active {
            background: $primary-gradient;
            color: white;
            border-color: transparent;

            &:hover {
                color: white;
            }
        }
    }

    &__checkbox {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    &__checkbox-input {
        width: 1.2rem;
        height: 1.2rem;
        accent-color: $primary;
    }

    &__checkbox-label {
        font-size: 0.95rem;
        color: $dark;
    }

    &__actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 2rem;

        @media (max-width: 640px) {
            flex-direction: column-reverse;
            gap: 0.75rem;
        }
    }

    &__cancel {
        padding: 0.75rem 1.5rem;
        background-color: white;
        color: $medium;
        border: 1px solid $light-gray;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: $light;
        }
    }

    &__submit {
        padding: 0.75rem 2rem;
        background: $primary-gradient;
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba($primary, 0.3);
        }
    }
}

// Order list
.order-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

// Order card
.order-card {
    background-color: white;
    border: 1px solid $light-gray;
    border-radius: $border-radius;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        transform: translateY(-5px);
    }

    &--active {
        border-left: 4px solid #3498db;
    }

    &--completed {
        border-left: 4px solid #2ecc71;
    }

    &--cancelled {
        border-left: 4px solid #e74c3c;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background-color: #f8fafc;
        border-bottom: 1px solid $light-gray;

        @media (max-width: 640px) {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
    }

    &__restaurant {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    &__restaurant-logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    &__restaurant-name {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
        color: $dark;
    }

    &__status-badge {
        padding: 0.4rem 0.9rem;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;

        &--active {
            background-color: rgba(#3498db, 0.1);
            color: #3498db;
        }

        &--completed {
            background-color: rgba(#2ecc71, 0.1);
            color: #2ecc71;
        }

        &--cancelled {
            background-color: rgba(#e74c3c, 0.1);
            color: #e74c3c;
        }
    }

    &__info {
        display: flex;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid $light-gray;
        flex-wrap: wrap;
        gap: 1.5rem;

        @media (max-width: 768px) {
            padding: 1rem;
            gap: 1rem;
        }
    }

    &__info-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    &__info-label {
        font-size: 0.85rem;
        color: $medium;
    }

    &__info-value {
        font-weight: 600;
        color: $dark;
    }

    &__items {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid $light-gray;

        @media (max-width: 768px) {
            padding: 1rem;
        }
    }

    &__item {
        display: flex;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }

    &__item-quantity {
        font-weight: 600;
        margin-right: 0.5rem;
        color: $primary;
    }

    &__item-name {
        color: $dark;
    }

    &__more-items {
        font-size: 0.9rem;
        color: $medium;
        font-style: italic;
    }

    &__actions {
        display: flex;
        padding: 1.25rem 1.5rem;
        gap: 1rem;
        flex-wrap: wrap;

        @media (max-width: 768px) {
            padding: 1rem;
        }
    }

    &__action-btn {
        padding: 0.6rem 1rem;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &--details {
            background-color: $light;
            color: $dark;
            border: 1px solid $light-gray;

            &:hover {
                background-color: darken($light, 5%);
            }
        }

        &--reorder {
            background: $secondary-gradient;
            color: white;
            border: none;

            &:hover {
                box-shadow: 0 5px 15px rgba($secondary, 0.3);
                transform: translateY(-2px);
            }
        }

        &--cancel {
            background-color: rgba(#e74c3c, 0.1);
            color: #e74c3c;
            border: 1px solid rgba(#e74c3c, 0.2);

            &:hover {
                background-color: rgba(#e74c3c, 0.15);
            }
        }
    }
}

// Payment methods
.payment-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }

    &__add {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
    }

    &__add-btn {
        padding: 0.75rem 1.5rem;
        background-color: white;
        color: $primary;
        border: 1px dashed $primary;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
            background-color: rgba($primary, 0.05);
            transform: translateY(-2px);
        }
    }
}

// Payment card
.payment-card {
    background-color: white;
    border: 1px solid $light-gray;
    border-radius: $border-radius;
    padding: 1.5rem;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        border-color: $secondary;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        transform: translateY(-5px);
    }

    &--default {
        border-color: $secondary;
        border-width: 2px;
    }

    &__badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.3rem 0.7rem;
        background-color: $secondary;
        color: white;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    &__type {
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
    }

    &__type-logo {
        height: 30px;
        object-fit: contain;
    }

    &__type-generic {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 30px;
        color: $medium;
    }

    &__info {
        margin-bottom: 1.5rem;
    }

    &__name {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__number,
    &__expiry {
        margin: 0 0 0.5rem;
        color: $medium;
        font-size: 0.95rem;
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    &__action-btn {
        padding: 0.5rem 0.75rem;
        background: none;
        font-size: 0.85rem;
        border-radius: $border-radius-sm;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid $light-gray;

        &--default {
            color: $secondary;
            border-color: $secondary;

            &:hover {
                background-color: rgba($secondary, 0.05);
            }
        }

        &--edit {
            color: $medium;

            &:hover {
                background-color: $light;
            }
        }

        &--delete {
            color: $primary;
            border-color: $primary;

            &:hover {
                background-color: rgba($primary, 0.05);
            }
        }
    }
}

// Favorites
.favorites-section-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 1.5rem;
    color: $dark;
}

.favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
}

// Favorite restaurant card
.favorite-restaurant-card {
    background-color: white;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

        .favorite-restaurant-card__img {
            transform: scale(1.05);
        }
    }

    &__image {
        height: 150px;
        position: relative;
        overflow: hidden;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    &__fav-btn {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        color: $primary;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: white;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
    }

    &__content {
        padding: 1.25rem;
    }

    &__name {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    &__cuisine {
        font-size: 0.9rem;
        color: $medium;
    }

    &__rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-weight: 600;
        color: $dark;
        font-size: 0.9rem;
    }

    &__reviews {
        font-weight: 400;
        color: $medium;
    }

    &__delivery {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: $medium;
    }
}

// Favorite dish card
.favorite-dish-card {
    background-color: white;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

        .favorite-dish-card__img {
            transform: scale(1.05);
        }
    }

    &__image {
        height: 180px;
        position: relative;
        overflow: hidden;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    &__fav-btn {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        color: $primary;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: white;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
    }

    &__content {
        padding: 1.25rem;
    }

    &__name {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: $dark;
    }

    &__restaurant {
        font-size: 0.9rem;
        color: $medium;
        margin: 0 0 0.5rem;
    }

    &__price {
        font-weight: 600;
        color: $accent;
        margin: 0;
    }
}

// Responsive utilities
@media (max-width: 991px) {
    .profile-content {
        padding: 1rem 0;
    }
}

@media (max-width: 768px) {
    .profile-header {
        padding: 2rem 0;

        &__name {
            font-size: 1.75rem;
        }
    }
}

@media (max-width: 576px) {
    .container {
        padding: 0 1rem;
    }

    .profile-header {
        padding: 1.5rem 0;

        &__name {
            font-size: 1.5rem;
        }

        &__avatar {
            width: 100px;
            height: 100px;
        }
    }
}
</style>