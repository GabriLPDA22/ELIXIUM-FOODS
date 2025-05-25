<template>
  <div class="business-analytics">
    <div class="business-analytics__header">
      <h1 class="business-analytics__title">Análisis y Estadísticas</h1>
      <div class="business-analytics__period-selector">
        <button v-for="period in periods" :key="period.value" @click="selectedPeriod = period.value"
          :class="['business-analytics__period-btn', { 'business-analytics__period-btn--active': selectedPeriod === period.value }]">
          {{ period.label }}
        </button>
        <div class="business-analytics__date-range">
          <input type="date" v-model="startDate" class="business-analytics__date-input"
            :disabled="selectedPeriod !== 'custom'">
          <span>hasta</span>
          <input type="date" v-model="endDate" class="business-analytics__date-input"
            :disabled="selectedPeriod !== 'custom'">
          <button @click="applyDateRange" class="business-analytics__date-apply"
            :disabled="selectedPeriod !== 'custom'">
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="business-analytics__summary">
      <div class="business-analytics__card business-analytics__card--revenue">
        <div class="business-analytics__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <title>Ingresos Totales Icono</title>
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="business-analytics__card-content">
          <h3 class="business-analytics__card-title">Ingresos Totales</h3>
          <p class="business-analytics__card-value">{{ formatCurrency(analytics.totalRevenue) }}</p>
          <p :class="['business-analytics__card-change', getChangeClass(analytics.revenueChange)]">
            <span v-if="analytics.revenueChange >= 0">+</span>{{ analytics.revenueChange }}% vs periodo anterior
          </p>
        </div>
      </div>

      <div class="business-analytics__card business-analytics__card--orders">
        <div class="business-analytics__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <title>Total Pedidos Icono</title>
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <div class="business-analytics__card-content">
          <h3 class="business-analytics__card-title">Total Pedidos</h3>
          <p class="business-analytics__card-value">{{ analytics.totalOrders }}</p>
          <p :class="['business-analytics__card-change', getChangeClass(analytics.ordersChange)]">
            <span v-if="analytics.ordersChange >= 0">+</span>{{ analytics.ordersChange }}% vs periodo anterior
          </p>
        </div>
      </div>

      <div class="business-analytics__card business-analytics__card--avg">
        <div class="business-analytics__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <title>Ticket Promedio Icono</title>
            <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
            <line x1="16" y1="8" x2="22" y2="8"></line>
            <line x1="16" y1="12" x2="22" y2="12"></line>
            <line x1="16" y1="16" x2="22" y2="16"></line>
          </svg>
        </div>
        <div class="business-analytics__card-content">
          <h3 class="business-analytics__card-title">Ticket Promedio</h3>
          <p class="business-analytics__card-value">{{ formatCurrency(analytics.averageOrderValue) }}</p>
          <p :class="['business-analytics__card-change', getChangeClass(analytics.aovChange)]">
            <span v-if="analytics.aovChange >= 0">+</span>{{ analytics.aovChange }}% vs periodo anterior
          </p>
        </div>
      </div>

      <div class="business-analytics__card business-analytics__card--rating">
        <div class="business-analytics__card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <title>Valoración Media Icono</title>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
            </polygon>
          </svg>
        </div>
        <div class="business-analytics__card-content">
          <h3 class="business-analytics__card-title">Valoración Media</h3>
          <p class="business-analytics__card-value">{{ analytics.averageRating.toFixed(1) }}</p>
          <div class="business-analytics__rating-stars">
            <div class="business-analytics__stars-filled" :style="{ width: `${(analytics.averageRating / 5) * 100}%` }">
              ★★★★★
            </div>
            <div class="business-analytics__stars-empty">
              ★★★★★
            </div>
          </div>
        </div>
      </div>
    </div>
     <div v-else class="business-analytics__loading-placeholder">Cargando resumen...</div>


    <div v-if="!loading" class="business-analytics__charts">
      <div class="business-analytics__chart-container">
        <div class="business-analytics__chart-header">
          <h3 class="business-analytics__chart-title">Tendencia de Ingresos</h3>
          <div class="business-analytics__chart-legend">
            <div class="business-analytics__legend-item">
              <span class="business-analytics__legend-color business-analytics__legend-color--current"></span>
              <span>Periodo actual</span>
            </div>
            <div class="business-analytics__legend-item">
              <span class="business-analytics__legend-color business-analytics__legend-color--previous"></span>
              <span>Periodo anterior</span>
            </div>
          </div>
        </div>
        <div class="business-analytics__chart">
          <div class="business-analytics__chart-placeholder">
            <svg class="business-analytics__chart-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
              <path d="M0,300 L100,280 L200,260 L300,220 L400,240 L500,180 L600,150 L700,120 L800,100" fill="none"
                stroke="#06a98d" stroke-width="3"></path>
              <path d="M0,300 L100,290 L200,280 L300,270 L400,250 L500,230 L600,210 L700,190 L800,170" fill="none"
                stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5"></path>
              <path d="M0,300 L100,280 L200,260 L300,220 L400,240 L500,180 L600,150 L700,120 L800,100 L800,300 L0,300"
                fill="url(#gradient)" opacity="0.2"></path>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#06a98d;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#06a98d;stop-opacity:0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div class="business-analytics__chart-container">
        <div class="business-analytics__chart-header">
          <h3 class="business-analytics__chart-title">Pedidos por Día de la Semana</h3>
        </div>
        <div class="business-analytics__chart">
          <div class="business-analytics__chart-placeholder">
            <svg class="business-analytics__chart-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
              <rect x="50" y="120" width="80" height="180" fill="#06a98d" opacity="0.8"></rect>
              <rect x="150" y="150" width="80" height="150" fill="#06a98d" opacity="0.8"></rect>
              <rect x="250" y="100" width="80" height="200" fill="#06a98d" opacity="0.8"></rect>
              <rect x="350" y="80" width="80" height="220" fill="#06a98d" opacity="0.8"></rect>
              <rect x="450" y="60" width="80" height="240" fill="#06a98d" opacity="0.8"></rect>
              <rect x="550" y="40" width="80" height="260" fill="#06a98d" opacity="0.8"></rect>
              <rect x="650" y="90" width="80" height="210" fill="#06a98d" opacity="0.8"></rect>
              <text x="90" y="320" text-anchor="middle" fill="#475569" font-size="14">Lun</text>
              <text x="190" y="320" text-anchor="middle" fill="#475569" font-size="14">Mar</text>
              <text x="290" y="320" text-anchor="middle" fill="#475569" font-size="14">Mié</text>
              <text x="390" y="320" text-anchor="middle" fill="#475569" font-size="14">Jue</text>
              <text x="490" y="320" text-anchor="middle" fill="#475569" font-size="14">Vie</text>
              <text x="590" y="320" text-anchor="middle" fill="#475569" font-size="14">Sáb</text>
              <text x="690" y="320" text-anchor="middle" fill="#475569" font-size="14">Dom</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="business-analytics__loading-placeholder">Cargando gráficos...</div>

    <div v-if="!loading" class="business-analytics__sections">
      <div class="business-analytics__section">
        <div class="business-analytics__section-header">
          <h3 class="business-analytics__section-title">Productos Más Vendidos</h3>
        </div>
        <div class="business-analytics__products-table-container">
          <table class="business-analytics__products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Ventas</th>
                <th>Cantidad</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in analytics.topProducts" :key="product.id" class="business-analytics__product-row">
                <td>
                  <div class="business-analytics__product">
                    <div class="business-analytics__product-image">
                      <img :src="product.imageUrl || '/images/product-placeholder.png'" :alt="product.name">
                    </div>
                    <div class="business-analytics__product-info">
                      <span class="business-analytics__product-name">{{ product.name }}</span>
                      <span class="business-analytics__product-category">{{ product.category }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ product.salesCount }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ formatCurrency(product.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="business-analytics__section">
        <div class="business-analytics__section-header">
          <h3 class="business-analytics__section-title">Distribución de Ventas por Categoría</h3>
        </div>
        <div class="business-analytics__pie-chart">
          <div class="business-analytics__pie-container">
             <svg class="business-analytics__pie-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e2e8f0" stroke-width="2"></circle>
              <path d="M50,50 L95,50 A45,45 0 0,1 80,87 Z" :fill="getCategoryColor(1)"></path>
              <path d="M50,50 L80,87 A45,45 0 0,1 20,80 Z" :fill="getCategoryColor(2)"></path>
              <path d="M50,50 L20,80 A45,45 0 0,1 15,30 Z" :fill="getCategoryColor(3)"></path>
              <path d="M50,50 L15,30 A45,45 0 0,1 95,50 Z" :fill="getCategoryColor(4)"></path>
            </svg>
          </div>
          <div class="business-analytics__pie-legend">
            <div v-for="category in analytics.categorySales" :key="category.id"
              class="business-analytics__pie-legend-item">
              <span class="business-analytics__pie-color"
                :style="{ backgroundColor: getCategoryColor(category.id) }"></span>
              <span class="business-analytics__pie-label">{{ category.name }}</span>
              <span class="business-analytics__pie-value">{{ formatCurrency(category.sales) }} ({{ category.percentage
              }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="business-analytics__loading-placeholder">Cargando secciones...</div>

    <div v-if="!loading" class="business-analytics__customer-section">
      <div class="business-analytics__section-header">
        <h3 class="business-analytics__section-title">Análisis de Clientes</h3>
      </div>
      <div class="business-analytics__customer-stats">
        <div class="business-analytics__customer-card">
          <div class="business-analytics__customer-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <title>Clientes Nuevos Icono</title>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="business-analytics__customer-content">
            <h4 class="business-analytics__customer-title">Clientes Nuevos</h4>
            <p class="business-analytics__customer-value">{{ analytics.newCustomers }}</p>
            <p :class="['business-analytics__customer-change', getChangeClass(analytics.newCustomersChange)]">
              <span v-if="analytics.newCustomersChange >= 0">+</span>{{ analytics.newCustomersChange }}%
            </p>
          </div>
        </div>

        <div class="business-analytics__customer-card">
          <div class="business-analytics__customer-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <title>Clientes Recurrentes Icono</title>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <div class="business-analytics__customer-content">
            <h4 class="business-analytics__customer-title">Clientes Recurrentes</h4>
            <p class="business-analytics__customer-value">{{ analytics.returningCustomers }}</p>
            <p :class="['business-analytics__customer-change', getChangeClass(analytics.returningCustomersChange)]">
              <span v-if="analytics.returningCustomersChange >= 0">+</span>{{ analytics.returningCustomersChange }}%
            </p>
          </div>
        </div>

        <div class="business-analytics__customer-card">
          <div class="business-analytics__customer-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <title>Tiempo de Entrega Icono</title>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="business-analytics__customer-content">
            <h4 class="business-analytics__customer-title">Tiempo de Entrega</h4>
            <p class="business-analytics__customer-value">{{ analytics.averageDeliveryTime }} min</p>
            <p :class="['business-analytics__customer-change', getInverseChangeClass(analytics.deliveryTimeChange)]">
              <span v-if="analytics.deliveryTimeChange <= 0">-</span>
              <span v-else>+</span>
              {{ Math.abs(analytics.deliveryTimeChange) }}%
            </p>
          </div>
        </div>

        <div class="business-analytics__customer-card">
          <div class="business-analytics__customer-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <title>Clientes Totales Icono</title>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="business-analytics__customer-content">
            <h4 class="business-analytics__customer-title">Clientes Totales</h4>
            <p class="business-analytics__customer-value">{{ analytics.totalCustomers }}</p>
            <p class="business-analytics__customer-satisfaction">
              {{ analytics.customerSatisfaction }}% satisfacción
            </p>
          </div>
        </div>
      </div>
    </div>
     <div v-else class="business-analytics__loading-placeholder">Cargando análisis de clientes...</div>

    <div v-if="!loading" class="business-analytics__reports">
      <div class="business-analytics__section-header">
        <h3 class="business-analytics__section-title">Informes y Exportación</h3>
      </div>
      <div class="business-analytics__reports-grid">
        <div class="business-analytics__report-card">
          <div class="business-analytics__report-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <title>Descargar Informe de Ventas Icono</title>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <div class="business-analytics__report-content">
            <h4 class="business-analytics__report-title">Informe de Ventas</h4>
            <p class="business-analytics__report-description">Descarga un informe detallado con todas las ventas del
              periodo seleccionado.</p>
            <button class="business-analytics__report-btn" @click="downloadReport('sales_pdf')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        <div class="business-analytics__report-card">
          <div class="business-analytics__report-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <title>Descargar Datos en Excel Icono</title>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="business-analytics__report-content">
            <h4 class="business-analytics__report-title">Datos en Excel</h4>
            <p class="business-analytics__report-description">Exporta todos los datos de ventas, productos y clientes a
              formato Excel.</p>
            <button class="business-analytics__report-btn" @click="downloadReport('data_excel')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Descargar Excel</span>
            </button>
          </div>
        </div>

        <div class="business-analytics__report-card">
          <div class="business-analytics__report-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <title>Descargar Análisis de Rendimiento Icono</title>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div class="business-analytics__report-content">
            <h4 class="business-analytics__report-title">Análisis de Rendimiento</h4>
            <p class="business-analytics__report-description">Informe completo de rendimiento con comparativas y
              proyecciones.</p>
            <button class="business-analytics__report-btn" @click="downloadReport('performance_report')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Descargar Informe</span>
            </button>
          </div>
        </div>

        <div class="business-analytics__report-card">
          <div class="business-analytics__report-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <title>Descargar Calendario de Ventas Icono</title>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <div class="business-analytics__report-content">
            <h4 class="business-analytics__report-title">Calendario de Ventas</h4>
            <p class="business-analytics__report-description">Visualiza tus ventas en un formato de calendario mensual.
            </p>
            <button class="business-analytics__report-btn" @click="downloadReport('sales_calendar')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Descargar Calendario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="business-analytics__loading-placeholder">Cargando informes...</div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue' // Removed 'computed' as it's unused
// import { useBusinessAuthStore } from '@/stores/businessAuth' // Comment out if not used

// Store
// const businessAuthStore = useBusinessAuthStore() // Comment out if not used

// --- Interfaces for Type Safety (Recommended) ---
interface ProductAnalytics {
  id: number;
  name: string;
  category: string;
  salesCount: number;
  quantity: number;
  revenue: number;
  imageUrl?: string;
}

interface CategorySale {
  id: number;
  name: string;
  sales: number;
  percentage: number;
}

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  averageOrderValue: number;
  aovChange: number;
  averageRating: number;
  newCustomers: number;
  newCustomersChange: number;
  returningCustomers: number;
  returningCustomersChange: number;
  totalCustomers: number;
  customerSatisfaction: number;
  averageDeliveryTime: number;
  deliveryTimeChange: number;
  topProducts: ProductAnalytics[];
  categorySales: CategorySale[];
  // Future: Add fields for dynamic chart data if not using a library
  // revenueTrendData?: { current: { x: any, y: number }[], previous: { x: any, y: number }[] };
  // ordersByDayData?: { day: string, orders: number }[];
}

// Estado
const loading = ref(true)
const selectedPeriod = ref('month') // Default period
const initialStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const initialEndDate = new Date();

const startDate = ref(initialStartDate.toISOString().split('T')[0])
const endDate = ref(initialEndDate.toISOString().split('T')[0])

// Opciones de periodos
const periods = [
  { label: 'Hoy', value: 'today' },
  { label: 'Esta Semana', value: 'week' },
  { label: 'Este Mes', value: 'month' },
  { label: 'Este Año', value: 'year' },
  { label: 'Personalizado', value: 'custom' }
]

// Datos de ejemplo (en un caso real, estos datos vendrían de una API)
const analytics = ref<AnalyticsData>({
  totalRevenue: 12567.85,
  revenueChange: 12.4,
  totalOrders: 324,
  ordersChange: 8.7,
  averageOrderValue: 38.79,
  aovChange: 3.5,
  averageRating: 4.6,

  newCustomers: 87,
  newCustomersChange: 15.3,
  returningCustomers: 156,
  returningCustomersChange: 4.2,
  totalCustomers: 243,
  customerSatisfaction: 92,
  averageDeliveryTime: 28,
  deliveryTimeChange: -5.2,

  topProducts: [
    { id: 1, name: 'Hamburguesa Clásica', category: 'Hamburguesas', salesCount: 156, quantity: 156, revenue: 1918.20, imageUrl: '/images/product-placeholder.png' },
    { id: 2, name: 'Pizza Margarita', category: 'Pizzas', salesCount: 124, quantity: 124, revenue: 1612.00, imageUrl: '/images/product-placeholder.png' },
    { id: 3, name: 'Pasta Carbonara', category: 'Pastas', salesCount: 98, quantity: 98, revenue: 1372.00, imageUrl: '/images/product-placeholder.png' },
    { id: 4, name: 'Ensalada César', category: 'Ensaladas', salesCount: 76, quantity: 76, revenue: 912.00, imageUrl: '/images/product-placeholder.png' },
    { id: 5, name: 'Patatas Fritas', category: 'Complementos', salesCount: 243, quantity: 243, revenue: 849.00, imageUrl: '/images/product-placeholder.png' }
  ],

  categorySales: [
    { id: 1, name: 'Hamburguesas', sales: 3624.50, percentage: 40 },
    { id: 2, name: 'Pizzas', sales: 2718.38, percentage: 30 },
    { id: 3, name: 'Pastas', sales: 1812.25, percentage: 20 },
    { id: 4, name: 'Ensaladas y Complementos', sales: 906.13, percentage: 10 }
  ]
})

// --- Métodos ---
const formatCurrency = (value: number | undefined): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0,00 €';
  }
  return value.toFixed(2).replace('.', ',') + ' €'
}

const getChangeClass = (change: number | undefined): string => {
  if (typeof change !== 'number' || isNaN(change)) return '';
  return change >= 0 ? 'business-analytics__card-change--positive' : 'business-analytics__card-change--negative'
}

const getInverseChangeClass = (change: number | undefined): string => {
  if (typeof change !== 'number' || isNaN(change)) return '';
  return change <= 0 ? 'business-analytics__card-change--positive' : 'business-analytics__card-change--negative'
}

const getCategoryColor = (categoryId: number | undefined): string => {
  if (typeof categoryId !== 'number' || isNaN(categoryId)) return '#cccccc'; // Default color
  const colors = ['#06a98d', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];
  // Ensure positive index and handle categoryId possibly being 0 or other non 1-based values
  return colors[((categoryId - 1 % colors.length) + colors.length) % colors.length];
}

const fetchAnalyticsData = async (start: string, end: string) => {
  loading.value = true;
  console.log(`Workspaceing data for period: ${start} to ${end}`);
  // --- Simulación de API ---
  // En una aplicación real, aquí harías una llamada a tu backend:
  // try {
  //   const response = await api.getAnalytics({ startDate: start, endDate: end });
  //   analytics.value = response.data; // Actualiza analytics.value con los datos recibidos
  // } catch (error) {
  //   console.error("Error fetching analytics data:", error);
  //   // Manejar el error, quizás mostrar un mensaje al usuario
  // } finally {
  //   loading.value = false;
  // }

  // Simulación con setTimeout
  await new Promise(resolve => setTimeout(resolve, 800));
  // Aquí podrías modificar `analytics.value` con datos mock diferentes según el rango,
  // pero para esta demo, simplemente usamos los datos hardcodeados.
  // Por ejemplo, para simular un cambio:
  // analytics.value.totalRevenue = Math.random() * 20000;
  // analytics.value.totalOrders = Math.floor(Math.random() * 500);
  loading.value = false;
}


const applyDateRange = () => {
  // Este método se llama cuando se pulsa "Aplicar" para el rango personalizado
  // o cuando se cambia un periodo predefinido (a través de updateDateRange)
  fetchAnalyticsData(startDate.value, endDate.value);
}

const updateDateRange = (newPeriodValue?: string) => {
  const periodToUpdate = newPeriodValue || selectedPeriod.value;
  const today = new Date();
  let newStart = new Date(today); // Default to today
  let newEnd = new Date(today);   // Default to today

  switch (periodToUpdate) {
    case 'today':
      // newStart and newEnd are already today
      break;
    case 'week':
      // Lunes de esta semana
      const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)
      const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajuste para que Lunes sea el inicio
      newStart = new Date(today.setDate(diffToMonday));
      // newEnd es hoy
      break;
    case 'month':
      newStart = new Date(today.getFullYear(), today.getMonth(), 1); // Primer día del mes actual
      // newEnd es hoy
      break;
    case 'year':
      newStart = new Date(today.getFullYear(), 0, 1); // Primer día del año actual
      // newEnd es hoy
      break;
    case 'custom':
      // Para 'custom', las fechas se gestionan directamente por los inputs y el botón "Aplicar".
      // No es necesario actualizar startDate y endDate aquí, solo llamar a fetch si se pulsa "Aplicar".
      // Si se selecciona 'custom' desde otro periodo, no se hace nada hasta pulsar "Aplicar".
      return;
  }

  startDate.value = newStart.toISOString().split('T')[0];
  endDate.value = newEnd.toISOString().split('T')[0];

  fetchAnalyticsData(startDate.value, endDate.value);
}

const downloadReport = (reportType: string) => {
  // Lógica para descargar informes (simulada)
  alert(`Descargando informe: ${reportType} para el periodo ${startDate.value} - ${endDate.value}`);
  // En una app real:
  // 1. Preparar los datos del informe.
  // 2. Usar una librería (jsPDF, ExcelJS) o una API de backend para generar el archivo.
  // 3. Provocar la descarga en el navegador.
}

// --- Lifecycle Hooks ---
onMounted(() => {
  updateDateRange(); // Carga los datos para el periodo por defecto ('month')
});

// --- Watchers ---
watch(selectedPeriod, (newPeriodValue) => {
  if (newPeriodValue !== 'custom') {
    updateDateRange(newPeriodValue);
  }
  // Si es 'custom', el usuario debe ajustar las fechas y pulsar 'Aplicar'.
  // Los date inputs ya están vinculados con v-model a startDate y endDate.
});

// Opcional: Si quieres que los cambios en las fechas 'custom' se apliquen inmediatamente
// sin necesidad del botón "Aplicar", podrías hacer watch sobre startDate y endDate
// cuando selectedPeriod.value === 'custom'. Sin embargo, el botón "Aplicar" da más control.
// watch([startDate, endDate], () => {
//   if (selectedPeriod.value === 'custom') {
//      fetchAnalyticsData(startDate.value, endDate.value);
//   }
// });

</script>

<style lang="scss" scoped>
.business-analytics {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 992px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b; // Consider SCSS variable: $color-text-dark;
  }

  &__period-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  &__period-btn {
    background: none;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #64748b; // $color-text-light
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f1f5f9; // $color-bg-subtle-hover
      color: #1e293b; // $color-text-dark
    }

    &--active {
      background-color: #e0f2fe; // $color-primary-light
      color: #0ea5e9; // $color-primary-active
      font-weight: 500;
    }
  }

  &__date-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;

    @media (max-width: 768px) {
      margin-left: 0;
      width: 100%;
      flex-wrap: wrap;
    }

    span {
      color: #64748b; // $color-text-light
      font-size: 0.9rem;
    }
  }

  &__date-input {
    padding: 0.4rem 0.6rem;
    border: 1px solid #e2e8f0; // $color-border
    border-radius: 6px;
    font-size: 0.9rem;
    color: #1e293b; // $color-text-dark

    &:disabled {
      background-color: #f1f5f9; // $color-bg-disabled
      color: #94a3b8; // $color-text-disabled
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
      border-color: #06a98d; // $color-primary
      box-shadow: 0 0 0 3px rgba(6, 169, 141, 0.1); // Consider rgba($color-primary, 0.1)
    }
  }

  &__date-apply {
    padding: 0.4rem 0.8rem;
    background-color: #06a98d; // $color-primary
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #058a73;
    }

    &:disabled {
      background-color: #94a3b8; // $color-bg-disabled-strong
      cursor: not-allowed;
    }
  }

  &__loading-placeholder {
    padding: 2rem;
    text-align: center;
    color: #64748b;
    font-size: 1rem;
  }

  // Summary cards
  &__summary {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    &--revenue {
      border-top: 3px solid #10b981; // $color-success
    }

    &--orders {
      border-top: 3px solid #3b82f6; // $color-info
    }

    &--avg {
      border-top: 3px solid #8b5cf6; // $color-purple
    }

    &--rating {
      border-top: 3px solid #f59e0b; // $color-warning
    }
  }

  &__card-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 24px;
      height: 24px;
    }

    .business-analytics__card--revenue & {
      background-color: rgba(16, 185, 129, 0.1); // rgba($color-success, 0.1)
      color: #10b981; // $color-success
    }

    .business-analytics__card--orders & {
      background-color: rgba(59, 130, 246, 0.1); // rgba($color-info, 0.1)
      color: #3b82f6; // $color-info
    }

    .business-analytics__card--avg & {
      background-color: rgba(139, 92, 246, 0.1); // rgba($color-purple, 0.1)
      color: #8b5cf6; // $color-purple
    }

    .business-analytics__card--rating & {
      background-color: rgba(245, 158, 11, 0.1); // rgba($color-warning, 0.1)
      color: #f59e0b; // $color-warning
    }
  }

  &__card-content {
    flex: 1;
  }

  &__card-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: #64748b; // $color-text-light
    margin: 0 0 0.5rem;
  }

  &__card-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1e293b; // $color-text-dark
  }

  &__card-change {
    font-size: 0.85rem;
    // color: #ef4444; // $color-danger (default if not positive)
    margin: 0;

    &--positive {
      color: #10b981; // $color-success
    }

    &--negative {
      color: #ef4444; // $color-danger
    }
  }

  &__rating-stars {
    position: relative;
    display: inline-block;
    font-size: 1.25rem;
    line-height: 1;

    .business-analytics__stars-filled {
      position: absolute;
      top: 0;
      left: 0;
      white-space: nowrap;
      overflow: hidden;
      color: #f59e0b; // $color-warning
    }

    .business-analytics__stars-empty {
      color: #e2e8f0; // $color-border-light
    }
  }

  // Charts
  &__charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  &__chart-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
  }

  &__chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__chart-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b; // $color-text-dark
  }

  &__chart-legend {
    display: flex;
    gap: 1rem;
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #64748b; // $color-text-light
  }

  &__legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;

    &--current {
      background-color: #06a98d; // $color-primary
    }

    &--previous {
      background-color: #94a3b8; // $color-grey
    }
  }

  &__chart {
    height: 300px;
    position: relative;
  }

  &__chart-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__chart-svg {
    width: 100%;
    height: 100%;
  }

  // Sections with tables
  &__sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  &__section {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    // height: 100%; // Be careful with fixed heights, can cause overflow. Consider min-height or letting content define height.
    display: flex;
    flex-direction: column; // To allow pie chart legend to push container height
  }

  &__section-header {
    margin-bottom: 1.25rem;
  }

  &__section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b; // $color-text-dark
  }

  &__products-table-container {
    overflow-x: auto;
    flex-grow: 1; // Allow table to take available space if section is flex
  }

  &__products-table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      padding: 0.75rem;
      font-weight: 600;
      color: #64748b; // $color-text-light
      border-bottom: 1px solid #e2e8f0; // $color-border
      font-size: 0.85rem;
      white-space: nowrap;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #f1f5f9; // $color-border-subtle
      font-size: 0.9rem;
      color: #1e293b; // $color-text-dark
    }
  }

  &__product {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__product-image {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__product-info {
    display: flex;
    flex-direction: column;
  }

  &__product-name {
    font-weight: 500;
    color: #1e293b; // $color-text-dark
  }

  &__product-category {
    font-size: 0.85rem;
    color: #64748b; // $color-text-light
  }

  // Pie chart
  &__pie-chart {
    display: flex;
    flex-direction: column;
    // height: 100%; // Let content define height or use flex-grow on container
    flex-grow: 1;
  }

  &__pie-container {
    // flex: 1; // This might make the SVG too big if legend is small.
    display: flex;
    justify-content: center;
    align-items: center;
    // max-height: 200px; // This is good to constrain SVG size
    min-height: 180px; // Ensure some space for the pie
    margin-bottom: 1.25rem;
  }

  &__pie-svg {
    max-width: 180px; // Adjusted for better balance with legend
    max-height: 180px;
    width: 100%;
    height: auto; // Maintain aspect ratio
  }

  &__pie-legend {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    // margin-top: auto; // If you want legend pushed to bottom if pie container has fixed height
  }

  &__pie-legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__pie-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  &__pie-label {
    flex: 1;
    font-size: 0.9rem;
    color: #1e293b; // $color-text-dark
    word-break: break-word;
  }

  &__pie-value {
    font-weight: 500;
    color: #1e293b; // $color-text-dark
    font-size: 0.85rem;
    white-space: nowrap;
  }

  // Customer section
  &__customer-section {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    margin-bottom: 2rem;
  }

  &__customer-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.25rem;
  }

  &__customer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.25rem;
    background-color: #f8fafc; // $color-bg-subtle
    border-radius: 8px;
  }

  &__customer-icon {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: #e0f2fe; // $color-primary-light
    color: #0ea5e9; // $color-primary-active
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    flex-shrink: 0;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__customer-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b; // $color-text-light
    margin: 0 0 0.5rem;
  }

  &__customer-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1e293b; // $color-text-dark
  }

  &__customer-change {
    font-size: 0.85rem;
    // color: #ef4444; // $color-danger (default if not positive)
    margin: 0;

    &--positive {
      color: #10b981; // $color-success
    }

    &--negative {
      color: #ef4444; // $color-danger
    }
  }

  &__customer-satisfaction {
    font-size: 0.85rem;
    color: #10b981; // $color-success
    font-weight: 500;
  }

  // Reports section
  &__reports {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    margin-bottom: 2rem; // Or remove if it's the last element
  }

  &__reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  &__report-card {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background-color: #f8fafc; // $color-bg-subtle
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f1f5f9; // $color-bg-subtle-hover
      // Consider adding a subtle border or shadow on hover too
      // box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
  }

  &__report-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: #dbeafe; // $color-info-light
    color: #3b82f6; // $color-info
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__report-content {
    flex: 1;
  }

  &__report-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #1e293b; // $color-text-dark
  }

  &__report-description {
    font-size: 0.9rem;
    color: #64748b; // $color-text-light
    margin: 0 0 1rem;
    line-height: 1.4;
  }

  &__report-btn {
    display: inline-flex; // Changed to inline-flex for better alignment with text if needed
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: 1px solid #e2e8f0; // $color-border
    border-radius: 6px;
    font-size: 0.85rem;
    color: #1e293b; // $color-text-dark
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none; // If you were to use <a> tags

    &:hover {
      background-color: #3b82f6; // $color-info
      border-color: #3b82f6; // $color-info
      color: white;
    }

    svg {
      width: 16px;
      height: 16px;
      // fill: currentColor; // If SVG should inherit color from text
    }
  }
}

// Animaciones (Consider removing if not used)
/*
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
*/
</style>
