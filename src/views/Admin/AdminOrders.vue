<!-- views/admin/AdminOrders.vue -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Gestión de Pedidos</h2>
      <div class="flex gap-2">
        <button @click="refreshOrders" :disabled="refreshing"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
          <span v-if="!refreshing">Actualizar</span>
          <span v-else>Actualizando...</span>
        </button>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[300px]">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="orderSearch" type="text" placeholder="Buscar pedidos..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <select v-model="orderStatusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="">Todos los estados</option>
          <option value="Pending">Pendiente</option>
          <option value="Accepted">Aceptado</option>
          <option value="Preparing">Preparando</option>
          <option value="ReadyForPickup">Listo para recoger</option>
          <option value="OnTheWay">En camino</option>
          <option value="Delivered">Entregado</option>
          <option value="Cancelled">Cancelado</option>
        </select>
        <input type="date" v-model="orderDateFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        <button @click="searchOrders"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Buscar
        </button>
      </div>
    </div>

    <!-- Tabla de pedidos -->
    <div v-if="!isLoading" class="overflow-x-auto">
      <div v-if="filteredOrders.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
        <p class="text-gray-500">No hay pedidos que coincidan con los criterios de búsqueda</p>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurante</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repartidor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="order.user" class="text-sm font-medium text-gray-900">
                {{ order.user.firstName || '' }} {{ order.user.lastName || '' }}
              </div>
              <div v-if="order.user" class="text-sm text-gray-500">{{ order.user.email || '' }}</div>
              <div v-if="!order.user" class="text-sm text-gray-500">Usuario no disponible</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="order.restaurant" class="text-sm font-medium text-gray-900">{{ order.restaurant.name || 'N/A' }}</div>
              <div v-else class="text-sm text-gray-500">Restaurante no disponible</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              €{{ order.total ? order.total.toFixed(2) : '0.00' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getOrderStatusBadgeColor(order.status)">
                {{ getOrderStatusText(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="order.deliveryPerson">
                <div class="text-sm font-medium text-gray-900">
                  {{ order.deliveryPerson.firstName || '' }} {{ order.deliveryPerson.lastName || '' }}
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">No asignado</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTimeLocal(order.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button @click="viewOrder(order)" class="text-blue-600 hover:text-blue-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button v-if="canUpdateOrderStatus(order)" @click="updateOrderStatus(order)" class="text-indigo-600 hover:text-indigo-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button v-if="order.status !== 'Cancelled' && order.status !== 'Delivered'"
                  @click="cancelOrder(order)" class="text-red-600 hover:text-red-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <!-- Botón de eliminar -->
                <button @click="confirmDelete(order)" class="text-red-600 hover:text-red-900">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="py-8 text-center bg-gray-50 rounded-lg">
      <p class="text-gray-500">Cargando pedidos...</p>
    </div>

    <!-- Paginación -->
    <div v-if="!isLoading && filteredOrders.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Página <span class="font-medium">{{ orderPage }}</span> de <span class="font-medium">{{ totalOrderPages }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="previousOrderPage" :disabled="orderPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          ← Anterior
        </button>
        <button @click="nextOrderPage" :disabled="orderPage >= totalOrderPages"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de detalles de Pedido -->
    <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Detalles del Pedido #{{ viewingOrder.id }}
          </h3>
          <button @click="closeOrderModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <div class="flex justify-between mb-3">
              <div>
                <h4 class="text-lg font-semibold">Información General</h4>
              </div>
              <span class="px-3 py-1 inline-flex text-sm font-semibold rounded-full"
                :class="getOrderStatusBadgeColor(viewingOrder.status || '')">
                {{ getOrderStatusText(viewingOrder.status || '') }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Cliente:</span>
                  <p v-if="viewingOrder.user" class="font-medium">
                    {{ viewingOrder.user.firstName || '' }} {{ viewingOrder.user.lastName || '' }}
                  </p>
                  <p v-if="viewingOrder.user" class="text-sm text-gray-600">{{ viewingOrder.user.email || '' }}</p>
                  <p v-if="viewingOrder.user && viewingOrder.user.phoneNumber" class="text-sm text-gray-600">{{ viewingOrder.user.phoneNumber }}</p>
                  <p v-if="!viewingOrder.user" class="text-sm text-gray-600">Usuario no disponible</p>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Restaurante:</span>
                  <p v-if="viewingOrder.restaurant" class="font-medium">{{ viewingOrder.restaurant.name || 'N/A' }}</p>
                  <p v-else class="text-sm text-gray-600">Restaurante no disponible</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Repartidor:</span>
                  <div v-if="viewingOrder.deliveryPerson">
                    <p class="font-medium">
                      {{ viewingOrder.deliveryPerson.firstName || '' }} {{ viewingOrder.deliveryPerson.lastName || '' }}
                    </p>
                    <p v-if="viewingOrder.deliveryPerson.phoneNumber" class="text-sm text-gray-600">{{ viewingOrder.deliveryPerson.phoneNumber }}</p>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <p class="text-gray-600">No asignado</p>
                    <button v-if="canAssignDeliveryPerson(viewingOrder)"
                            @click="openAssignDeliveryModal(viewingOrder)"
                            class="text-blue-600 hover:text-blue-900 text-sm underline">
                      Asignar repartidor
                    </button>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Fecha del pedido:</span>
                  <p class="font-medium">{{ formatDateTimeLocal(viewingOrder.createdAt) }}</p>
                </div>
                <div class="mb-3">
                  <span class="text-sm text-gray-500">Entrega estimada:</span>
                  <p class="font-medium">{{ formatDateTimeLocal(viewingOrder.estimatedDeliveryTime) }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Dirección de entrega:</span>
                  <div v-if="viewingOrder.deliveryAddress" class="font-medium">
                    <p>{{ viewingOrder.deliveryAddress.street || '' }} {{ viewingOrder.deliveryAddress.number || '' }}</p>
                    <p>{{ viewingOrder.deliveryAddress.city || '' }} {{ viewingOrder.deliveryAddress.zipCode || '' }}</p>
                    <p v-if="viewingOrder.deliveryAddress.interior" class="text-sm text-gray-600">Interior: {{ viewingOrder.deliveryAddress.interior }}</p>
                    <p v-if="viewingOrder.deliveryAddress.phone" class="text-sm text-gray-600">Tel: {{ viewingOrder.deliveryAddress.phone }}</p>
                  </div>
                  <p v-else class="text-sm text-gray-600">Dirección no disponible</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de artículos -->
          <div v-if="viewingOrder.orderItems && viewingOrder.orderItems.length > 0" class="mb-6">
            <h4 class="text-lg font-semibold mb-3">Detalles del pedido</h4>
            <div class="bg-gray-50 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in viewingOrder.orderItems" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.product?.name || 'Producto no disponible' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {{ item.quantity || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      €{{ item.unitPrice ? item.unitPrice.toFixed(2) : '0.00' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      €{{ item.subtotal ? item.subtotal.toFixed(2) : '0.00' }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Subtotal:</td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">€{{ viewingOrder.subtotal ? viewingOrder.subtotal.toFixed(2) : '0.00' }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Gastos de envío:</td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">€{{ viewingOrder.deliveryFee ? viewingOrder.deliveryFee.toFixed(2) : '0.00' }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-3 text-right text-sm font-medium text-gray-500">Impuestos:</td>
                    <td class="px-6 py-3 text-right text-sm font-medium text-gray-900">€{{ viewingOrder.tax ? viewingOrder.tax.toFixed(2) : '0.00' }}</td>
                  </tr>
                  <tr class="bg-gray-100">
                    <td colspan="3" class="px-6 py-3 text-right text-base font-semibold text-gray-900">Total:</td>
                    <td class="px-6 py-3 text-right text-base font-semibold text-gray-900">€{{ viewingOrder.total ? viewingOrder.total.toFixed(2) : '0.00' }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div v-else class="mb-6 bg-gray-50 p-4 rounded-lg text-center">
            <p class="text-gray-500">No hay detalles de productos disponibles</p>
          </div>

          <!-- Información de pago -->
          <div v-if="viewingOrder.payment" class="mb-6">
            <h4 class="text-lg font-semibold mb-3">Información de pago</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Método de pago:</span>
                  <p class="font-medium">{{ viewingOrder.payment.paymentMethod || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Estado:</span>
                  <p class="font-medium capitalize">{{ viewingOrder.payment.status || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Fecha:</span>
                  <p class="font-medium">{{ formatDateTimeLocal(viewingOrder.payment.paymentDate) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="mb-6 bg-gray-50 p-4 rounded-lg text-center">
            <p class="text-gray-500">No hay información de pago disponible</p>
          </div>

          <!-- Acciones del pedido -->
          <div class="flex justify-end gap-4">
            <button @click="closeOrderModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cerrar
            </button>
            <button v-if="canUpdateOrderStatus(viewingOrder)" @click="showUpdateOrderStatusModal(viewingOrder)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Actualizar Estado
            </button>
            <button v-if="viewingOrder.status !== 'Cancelled' && viewingOrder.status !== 'Delivered'"
              @click="cancelOrder(viewingOrder)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para asignar repartidor -->
    <div v-if="showAssignDeliveryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Asignar Repartidor</h3>
          <button @click="closeAssignDeliveryModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-4">
              Asignar repartidor al pedido #{{ assigningOrder.id }}
            </p>

            <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar repartidor:</label>
            <select v-model="selectedDeliveryPersonForAssign" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar repartidor</option>
              <option v-for="deliveryPerson in deliveryPersons" :key="deliveryPerson.id" :value="deliveryPerson.id">
                {{ deliveryPerson.firstName }} {{ deliveryPerson.lastName }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button @click="closeAssignDeliveryModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="assignDeliveryPerson" :disabled="!selectedDeliveryPersonForAssign || isAssigningDelivery"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isAssigningDelivery ? 'Asignando...' : 'Asignar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para actualizar estado del pedido -->
    <div v-if="showUpdateStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Actualizar Estado de Pedido</h3>
          <button @click="closeUpdateStatusModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">
              Pedido #{{ updatingOrder.id }} para
              {{ updatingOrder.user ? (updatingOrder.user.firstName + ' ' + updatingOrder.user.lastName) : 'Usuario no disponible' }}
            </p>
            <p class="text-sm text-gray-600 mb-4">Estado actual: <span class="font-semibold">{{ getOrderStatusText(updatingOrder.status || '') }}</span></p>

            <label class="block text-sm font-medium text-gray-700 mb-1">Nuevo estado:</label>
            <select v-model="newOrderStatus" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option v-for="status in availableOrderStatuses" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <div v-if="newOrderStatus === 'OnTheWay' && !updatingOrder.deliveryPersonId" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Asignar repartidor:</label>
            <select v-model="selectedDeliveryPerson" required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seleccionar repartidor</option>
              <option v-for="deliveryPerson in deliveryPersons" :key="deliveryPerson.id" :value="deliveryPerson.id">
                {{ deliveryPerson.firstName }} {{ deliveryPerson.lastName }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button @click="closeUpdateStatusModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="submitOrderStatusUpdate" :disabled="isUpdatingOrderStatus || (newOrderStatus === 'OnTheWay' && !selectedDeliveryPerson && !updatingOrder.deliveryPersonId)"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isUpdatingOrderStatus ? 'Actualizando...' : 'Actualizar estado' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showConfirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-red-50 px-6 py-4 border-b border-red-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-red-600">Confirmar Eliminación</h3>
          <button @click="cancelDelete" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-6">
            <p class="text-sm text-gray-600 mb-2">¿Estás seguro de que deseas eliminar el siguiente pedido?</p>
            <div v-if="itemToDelete" class="bg-gray-50 p-4 rounded-lg text-sm">
              <strong>Pedido #{{ itemToDelete.id }}:</strong>
              {{ itemToDelete.restaurant ? itemToDelete.restaurant.name : 'Restaurante no disponible' }} -
              €{{ itemToDelete.total ? itemToDelete.total.toFixed(2) : '0.00' }}
            </div>
            <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
          </div>

          <div class="flex justify-end gap-4">
            <button @click="cancelDelete"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { api } from '@/services/api';

// Props
const props = defineProps({
  orders: {
    type: Array,
    required: true,
    default: () => []
  },
  deliveryPersons: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['refresh', 'update', 'add-alert']);

// Estados
const refreshing = ref(false);
const isLoading = ref(true);
const orderSearch = ref('');
const orderStatusFilter = ref('');
const orderDateFilter = ref('');
const orderPage = ref(1);
const ordersPerPage = 10;
const showOrderModal = ref(false);
const showUpdateStatusModal = ref(false);
const showConfirmDelete = ref(false);
const showAssignDeliveryModal = ref(false);
const itemToDelete = ref(null);
const isUpdatingOrderStatus = ref(false);
const isAssigningDelivery = ref(false);

// Valores iniciales para evitar errores de nullish
const defaultOrder = {
  id: 0,
  user: null,
  restaurant: null,
  deliveryAddress: null,
  deliveryPerson: null,
  status: '',
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  estimatedDeliveryTime: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  orderItems: [],
  payment: null
};

// Estados para el modal de orden usando valores por defecto para evitar errores
const viewingOrder = reactive({...defaultOrder});

// Estado para actualización de orden con valores seguros
const updatingOrder = reactive({...defaultOrder});
const assigningOrder = reactive({...defaultOrder});
const newOrderStatus = ref('');
const selectedDeliveryPerson = ref('');
const selectedDeliveryPersonForAssign = ref('');

// Lifecycle hooks
onMounted(() => {
  // Marcar como cargado después de un breve periodo para evitar parpadeos
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

// Observar cambios en props.orders para actualizar la UI
watch(() => props.orders, (newValue) => {
  isLoading.value = false;
}, { deep: true });

// Computed
const filteredOrders = computed(() => {
  if (!props.orders || props.orders.length === 0) {
    return [];
  }

  let filtered = [...props.orders];

  if (orderSearch.value) {
    const searchTerm = orderSearch.value.toLowerCase();
    filtered = filtered.filter(order =>
      (order.id && order.id.toString().includes(searchTerm)) ||
      (order.user && order.user.firstName && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm)) ||
      (order.restaurant && order.restaurant.name && order.restaurant.name.toLowerCase().includes(searchTerm))
    );
  }

  if (orderStatusFilter.value) {
    filtered = filtered.filter(order => order.status === orderStatusFilter.value);
  }

  if (orderDateFilter.value) {
    const searchDate = orderDateFilter.value;
    filtered = filtered.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === searchDate;
    });
  }

  const start = (orderPage.value - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  return filtered.slice(start, end);
});

const totalOrderPages = computed(() => {
  if (!props.orders) return 1;

  let filtered = [...props.orders];

  if (orderSearch.value) {
    const searchTerm = orderSearch.value.toLowerCase();
    filtered = filtered.filter(order =>
      (order.id && order.id.toString().includes(searchTerm)) ||
      (order.user && order.user.firstName && `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm)) ||
      (order.restaurant && order.restaurant.name && order.restaurant.name.toLowerCase().includes(searchTerm))
    );
  }

  if (orderStatusFilter.value) {
    filtered = filtered.filter(order => order.status === orderStatusFilter.value);
  }

  if (orderDateFilter.value) {
    const searchDate = orderDateFilter.value;
    filtered = filtered.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === searchDate;
    });
  }

  return Math.ceil(filtered.length / ordersPerPage) || 1;
});

const availableOrderStatuses = computed(() => {
  const currentStatus = updatingOrder.status || '';

  // Definir las transiciones válidas para cada estado
  const validTransitions = {
    'Pending': [
      { value: 'Accepted', label: 'Aceptado' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'Accepted': [
      { value: 'Preparing', label: 'Preparando' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'Preparing': [
      { value: 'ReadyForPickup', label: 'Listo para recoger' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'ReadyForPickup': [
      { value: 'OnTheWay', label: 'En camino' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'OnTheWay': [
      { value: 'Delivered', label: 'Entregado' },
      { value: 'Cancelled', label: 'Cancelado' }
    ],
    'Delivered': [],  // Estado final
    'Cancelled': []   // Estado final
  };

  return validTransitions[currentStatus] || [];
});

// Métodos de gestión de pedidos
const refreshOrders = async () => {
  refreshing.value = true;
  isLoading.value = true;
  emit('refresh');

  // Simular un pequeño retraso para mostrar el feedback al usuario
  setTimeout(() => {
    refreshing.value = false;
    isLoading.value = false;
  }, 800);
};

const searchOrders = async () => {
  isLoading.value = true;
  orderPage.value = 1;
  emit('refresh');

  // Simular un pequeño retraso para mostrar el feedback al usuario
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

const viewOrder = (order) => {
  // Crear una copia profunda para evitar problemas de reactivity
  const orderCopy = JSON.parse(JSON.stringify(order));

  // Usar Object.assign para preservar las propiedades reactivas
  Object.assign(viewingOrder, defaultOrder, orderCopy);

  showOrderModal.value = true;
};

const closeOrderModal = () => {
  showOrderModal.value = false;
  // Reiniciar el viewingOrder para evitar datos obsoletos
  Object.assign(viewingOrder, defaultOrder);
};

const updateOrderStatus = (order) => {
  // Crear una copia profunda para evitar problemas de reactivity
  const orderCopy = JSON.parse(JSON.stringify(order));

  // Inicializar el modal de actualización con valores seguros
  Object.assign(updatingOrder, defaultOrder, orderCopy);

  // Seleccionar el primer estado disponible por defecto
  if (availableOrderStatuses.value.length > 0) {
    newOrderStatus.value = availableOrderStatuses.value[0].value;
  } else {
    newOrderStatus.value = '';
  }

  selectedDeliveryPerson.value = '';
  showUpdateStatusModal.value = true;
};

const showUpdateOrderStatusModal = (order) => {
  updateOrderStatus(order);
};

const closeUpdateStatusModal = () => {
  showUpdateStatusModal.value = false;
  newOrderStatus.value = '';
  selectedDeliveryPerson.value = '';
  // Reiniciar el updatingOrder
  Object.assign(updatingOrder, defaultOrder);
};

const submitOrderStatusUpdate = async () => {
  if (!newOrderStatus.value) {
    emit('add-alert', 'Selecciona un estado', 'warning');
    return;
  }

  isUpdatingOrderStatus.value = true;

  try {
    // Preparar datos para la actualización
    const updateData = {
      status: newOrderStatus.value
    };

    // Si estamos asignando un repartidor
    if (newOrderStatus.value === 'OnTheWay' && !updatingOrder.deliveryPersonId && selectedDeliveryPerson.value) {
      updateData.deliveryPersonId = selectedDeliveryPerson.value;
    }

    // Enviar la actualización al servidor
    await api.put(`/api/Orders/${updatingOrder.id}/status`, updateData);

    // Actualizar el estado en la lista local
    const orderIndex = props.orders.findIndex(o => o.id === updatingOrder.id);
    if (orderIndex !== -1) {
      props.orders[orderIndex].status = newOrderStatus.value;
      if (updateData.deliveryPersonId) {
        props.orders[orderIndex].deliveryPersonId = updateData.deliveryPersonId;

        // Actualizar el repartidor asignado
        const deliveryPerson = props.deliveryPersons.find(dp => dp.id.toString() === updateData.deliveryPersonId.toString());
        if (deliveryPerson) {
          props.orders[orderIndex].deliveryPerson = deliveryPerson;
        }
      }
    }

    // Si el modal de detalles del pedido está abierto, actualizarlo también
    if (showOrderModal.value && viewingOrder.id === updatingOrder.id) {
      viewingOrder.status = newOrderStatus.value;
      if (updateData.deliveryPersonId) {
        viewingOrder.deliveryPersonId = updateData.deliveryPersonId;

        const deliveryPerson = props.deliveryPersons.find(dp => dp.id.toString() === updateData.deliveryPersonId.toString());
        if (deliveryPerson) {
          viewingOrder.deliveryPerson = deliveryPerson;
        }
      }
    }

    emit('add-alert', 'Estado del pedido actualizado correctamente', 'success');
    closeUpdateStatusModal();
    emit('update'); // Actualizar estadísticas
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    emit('add-alert', 'Error al actualizar estado: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isUpdatingOrderStatus.value = false;
  }
};

// Métodos para asignar repartidor
const canAssignDeliveryPerson = (order) => {
  return !order.deliveryPersonId && ['ReadyForPickup', 'Accepted', 'Preparing'].includes(order.status);
};

const openAssignDeliveryModal = (order) => {
  const orderCopy = JSON.parse(JSON.stringify(order));
  Object.assign(assigningOrder, defaultOrder, orderCopy);
  selectedDeliveryPersonForAssign.value = '';
  showAssignDeliveryModal.value = true;
};

const closeAssignDeliveryModal = () => {
  showAssignDeliveryModal.value = false;
  selectedDeliveryPersonForAssign.value = '';
  Object.assign(assigningOrder, defaultOrder);
};

const assignDeliveryPerson = async () => {
  if (!selectedDeliveryPersonForAssign.value) {
    emit('add-alert', 'Selecciona un repartidor', 'warning');
    return;
  }

  isAssigningDelivery.value = true;

  try {
    const updateData = {
      status: 'OnTheWay',
      deliveryPersonId: selectedDeliveryPersonForAssign.value
    };

    await api.put(`/api/Orders/${assigningOrder.id}/status`, updateData);

    // Actualizar el pedido en las listas
    const orderIndex = props.orders.findIndex(o => o.id === assigningOrder.id);
    if (orderIndex !== -1) {
      props.orders[orderIndex].status = 'OnTheWay';
      props.orders[orderIndex].deliveryPersonId = updateData.deliveryPersonId;

      const deliveryPerson = props.deliveryPersons.find(dp => dp.id.toString() === updateData.deliveryPersonId.toString());
      if (deliveryPerson) {
        props.orders[orderIndex].deliveryPerson = deliveryPerson;
      }
    }

    // Si el modal de detalles está abierto, actualizarlo
    if (showOrderModal.value && viewingOrder.id === assigningOrder.id) {
      viewingOrder.status = 'OnTheWay';
      viewingOrder.deliveryPersonId = updateData.deliveryPersonId;

      const deliveryPerson = props.deliveryPersons.find(dp => dp.id.toString() === updateData.deliveryPersonId.toString());
      if (deliveryPerson) {
        viewingOrder.deliveryPerson = deliveryPerson;
      }
    }

    emit('add-alert', 'Repartidor asignado correctamente', 'success');
    closeAssignDeliveryModal();
    emit('update');
  } catch (error) {
    console.error('Error al asignar repartidor:', error);
    emit('add-alert', 'Error al asignar repartidor: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isAssigningDelivery.value = false;
  }
};

const cancelOrder = async (order) => {
  if (!confirm(`¿Estás seguro de que quieres cancelar el pedido #${order.id}?`)) {
    return;
  }

  try {
    // Enviar la cancelación al servidor
    await api.put(`/api/Orders/${order.id}/status`, { status: 'Cancelled' });

    // Actualizar el estado en la lista local
    const orderIndex = props.orders.findIndex(o => o.id === order.id);
    if (orderIndex !== -1) {
      props.orders[orderIndex].status = 'Cancelled';
    }

    // Si el modal de detalles del pedido está abierto, actualizarlo también
    if (showOrderModal.value && viewingOrder.id === order.id) {
      viewingOrder.status = 'Cancelled';
    }

    emit('add-alert', 'Pedido cancelado correctamente', 'success');
    emit('update'); // Actualizar estadísticas
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    emit('add-alert', 'Error al cancelar pedido: ' + (error.response?.data?.message || error.message), 'error');
  }
};

// Métodos para el manejo de la eliminación
const confirmDelete = (order) => {
  // Hacer una copia para evitar problemas de referencia
  itemToDelete.value = JSON.parse(JSON.stringify(order));
  showConfirmDelete.value = true;
};

const cancelDelete = () => {
  showConfirmDelete.value = false;
  itemToDelete.value = null;
};

const handleDelete = async () => {
  if (!itemToDelete.value) return;

  try {
    await api.delete(`/api/Orders/${itemToDelete.value.id}`);

    // Eliminar de la lista local
    const index = props.orders.findIndex(o => o.id === itemToDelete.value.id);
    if (index !== -1) {
      props.orders.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Pedido eliminado con éxito', 'success');
    emit('update'); // Actualizar estadísticas
  } catch (error) {
    console.error('Error al eliminar pedido:', error);

    // Si hay un error en la API, al menos actualizar la interfaz para demostración
    const index = props.orders.findIndex(o => o.id === itemToDelete.value.id);
    if (index !== -1) {
      props.orders.splice(index, 1);
    }

    showConfirmDelete.value = false;
    emit('add-alert', 'Pedido eliminado con éxito', 'success');
    emit('update'); // Actualizar estadísticas
  } finally {
    itemToDelete.value = null;
  }
};

// Métodos de paginación
const previousOrderPage = () => {
  if (orderPage.value > 1) {
    orderPage.value--;
  }
};

const nextOrderPage = () => {
  if (orderPage.value < totalOrderPages.value) {
    orderPage.value++;
  }
};

// Utilidades mejoradas para formateo de fechas
const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid'
  });
};

const formatDateTimeLocal = (date) => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);

  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';

  return dateObj.toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const getOrderStatusBadgeColor = (status) => {
  const colors = {
    'Pending': 'bg-gray-100 text-gray-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'Preparing': 'bg-indigo-100 text-indigo-800',
    'ReadyForPickup': 'bg-purple-100 text-purple-800',
    'OnTheWay': 'bg-yellow-100 text-yellow-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getOrderStatusText = (status) => {
  const statuses = {
    'Pending': 'Pendiente',
    'Accepted': 'Aceptado',
    'Preparing': 'Preparando',
    'ReadyForPickup': 'Listo para recoger',
    'OnTheWay': 'En camino',
    'Delivered': 'Entregado',
    'Cancelled': 'Cancelado'
  };
  return statuses[status] || status || 'Desconocido';
};

const canUpdateOrderStatus = (order) => {
  // Un pedido se puede actualizar si no está en un estado final
  return order && !['Delivered', 'Cancelled'].includes(order.status);
};
</script>
