<!-- src/views/TermsAndConditions.vue -->
<template>
  <div class="terms-view">
    <!-- Header Section -->
    <section class="terms-header">
      <div class="container">
        <div class="terms-header__content">
          <h1 class="terms-header__title">Términos y Condiciones</h1>
          <p class="terms-header__subtitle">Última actualización: {{ lastUpdated }}</p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="terms-content">
      <div class="container">
        <div class="terms-card">
          <!-- Índice -->
          <div class="terms-index">
            <h3>Índice de Contenidos</h3>
            <nav class="terms-nav">
              <a href="#acceptance" class="terms-nav__link">1. Aceptación de los Términos</a>
              <a href="#services" class="terms-nav__link">2. Descripción del Servicio</a>
              <a href="#registration" class="terms-nav__link">3. Registro y Cuenta de Usuario</a>
              <a href="#orders" class="terms-nav__link">4. Pedidos y Pagos</a>
              <a href="#delivery" class="terms-nav__link">5. Entrega y Recepción</a>
              <a href="#prices" class="terms-nav__link">6. Precios y Promociones</a>
              <a href="#responsibilities" class="terms-nav__link">7. Responsabilidades del Usuario</a>
              <a href="#restrictions" class="terms-nav__link">8. Restricciones de Uso</a>
              <a href="#intellectual" class="terms-nav__link">9. Propiedad Intelectual</a>
              <a href="#limitation" class="terms-nav__link">10. Limitación de Responsabilidad</a>
              <a href="#termination" class="terms-nav__link">11. Terminación del Servicio</a>
              <a href="#modifications" class="terms-nav__link">12. Modificaciones</a>
              <a href="#contact" class="terms-nav__link">13. Contacto</a>
            </nav>
          </div>

          <!-- Contenido Principal -->
          <div class="terms-main">
            <section id="acceptance" class="terms-section">
              <h2>1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar la plataforma de Elixium Foods, usted acepta estar sujeto a estos Términos y
                Condiciones y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos
                términos, no podrá utilizar nuestros servicios.</p>
              <p>Estos términos constituyen un acuerdo legal vinculante entre usted y Elixium Foods. Al crear una cuenta
                o realizar un pedido, confirma que ha leído, entendido y acepta cumplir con estos términos.</p>
            </section>

            <section id="services" class="terms-section">
              <h2>2. Descripción del Servicio</h2>
              <p>Elixium Foods es una plataforma digital que conecta a usuarios con restaurantes locales para facilitar
                pedidos de comida a domicilio. Nuestros servicios incluyen:</p>
              <ul>
                <li>Catálogo de restaurantes y menús disponibles</li>
                <li>Sistema de pedidos en línea</li>
                <li>Procesamiento de pagos seguros</li>
                <li>Coordinación de entregas</li>
                <li>Atención al cliente</li>
                <li>Sistema de reseñas y calificaciones</li>
              </ul>
              <p>Actuamos como intermediario entre usuarios y restaurantes. Los productos alimenticios son preparados
                por los restaurantes asociados, no por Elixium Foods.</p>
            </section>

            <section id="registration" class="terms-section">
              <h2>3. Registro y Cuenta de Usuario</h2>
              <p>Para utilizar nuestros servicios, debe crear una cuenta proporcionando información precisa y
                actualizada. Usted es responsable de:</p>
              <ul>
                <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                <li>Actualizar su información personal cuando sea necesario</li>
                <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                <li>Ser mayor de 18 años o tener autorización parental</li>
              </ul>
              <p>Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos o proporcionen
                información falsa.</p>
            </section>

            <section id="orders" class="terms-section">
              <h2>4. Pedidos y Pagos</h2>
              <p>Al realizar un pedido a través de nuestra plataforma:</p>
              <ul>
                <li>Confirma que toda la información proporcionada es correcta</li>
                <li>Acepta pagar el precio total mostrado, incluyendo impuestos y tarifas de entrega</li>
                <li>Entiende que los tiempos de entrega son estimados</li>
                <li>Reconoce que algunos productos pueden no estar disponibles</li>
              </ul>
              <p>Los pagos se procesan de forma segura a través de nuestros proveedores de servicios de pago
                autorizados. Aceptamos las principales tarjetas de crédito/débito y otros métodos de pago especificados
                en la plataforma.</p>
            </section>

            <section id="delivery" class="terms-section">
              <h2>5. Entrega y Recepción</h2>
              <p>Para garantizar una entrega exitosa:</p>
              <ul>
                <li>Proporcione una dirección de entrega precisa y completa</li>
                <li>Esté disponible durante el horario de entrega estimado</li>
                <li>Verifique su pedido al momento de la recepción</li>
                <li>Reporte cualquier problema inmediatamente</li>
              </ul>
              <p>Si no está disponible para recibir su pedido, podemos dejarlo en la dirección especificada bajo su
                responsabilidad. Los tiempos de entrega pueden variar debido a factores externos como clima o tráfico.
              </p>
            </section>

            <section id="prices" class="terms-section">
              <h2>6. Precios y Promociones</h2>
              <p>Los precios mostrados en nuestra plataforma están sujetos a cambios sin previo aviso. Incluyen:</p>
              <ul>
                <li>Precio base del producto</li>
                <li>Tarifas de entrega aplicables</li>
                <li>Impuestos correspondientes</li>
                <li>Descuentos o promociones vigentes</li>
              </ul>
              <p>Las promociones y códigos de descuento están sujetos a términos específicos y fechas de vencimiento. No
                se pueden combinar múltiples ofertas salvo indicación contraria.</p>
            </section>

            <section id="responsibilities" class="terms-section">
              <h2>7. Responsabilidades del Usuario</h2>
              <p>Como usuario de Elixium Foods, usted se compromete a:</p>
              <ul>
                <li>Utilizar la plataforma de manera legal y ética</li>
                <li>No interferir con el funcionamiento del servicio</li>
                <li>Respetar los derechos de otros usuarios y restaurantes</li>
                <li>Proporcionar reseñas honestas y constructivas</li>
                <li>Cumplir con todas las leyes locales aplicables</li>
                <li>No utilizar la plataforma para actividades fraudulentas</li>
              </ul>
            </section>

            <section id="restrictions" class="terms-section">
              <h2>8. Restricciones de Uso</h2>
              <p>Está prohibido:</p>
              <ul>
                <li>Utilizar sistemas automatizados para acceder a la plataforma</li>
                <li>Intentar obtener acceso no autorizado a nuestros sistemas</li>
                <li>Copiar, modificar o distribuir nuestro contenido sin autorización</li>
                <li>Crear cuentas falsas o múltiples para evadir restricciones</li>
                <li>Publicar contenido ofensivo, discriminatorio o ilegal</li>
                <li>Realizar actividades que puedan dañar nuestra reputación</li>
              </ul>
            </section>

            <section id="intellectual" class="terms-section">
              <h2>9. Propiedad Intelectual</h2>
              <p>Todo el contenido de la plataforma Elixium Foods, incluyendo textos, imágenes, logotipos, diseños y
                software, está protegido por derechos de autor y otras leyes de propiedad intelectual.</p>
              <p>Usted puede utilizar nuestro contenido únicamente para realizar pedidos y utilizar nuestros servicios.
                Cualquier otro uso requiere autorización escrita previa.</p>
            </section>

            <section id="limitation" class="terms-section">
              <h2>10. Limitación de Responsabilidad</h2>
              <p>Elixium Foods no será responsable de:</p>
              <ul>
                <li>Calidad, sabor o preparación de los alimentos (responsabilidad del restaurante)</li>
                <li>Retrasos causados por factores externos</li>
                <li>Daños indirectos o consecuenciales</li>
                <li>Pérdidas que excedan el valor del pedido afectado</li>
              </ul>
              <p>Nuestra responsabilidad máxima se limita al reembolso o reemplazo del pedido afectado.</p>
            </section>

            <section id="termination" class="terms-section">
              <h2>11. Terminación del Servicio</h2>
              <p>Podemos suspender o terminar su acceso a nuestros servicios si:</p>
              <ul>
                <li>Viola estos términos y condiciones</li>
                <li>Proporciona información falsa o engañosa</li>
                <li>Realiza actividades fraudulentas o ilegales</li>
                <li>Abusa de nuestros sistemas o personal</li>
              </ul>
              <p>Usted puede cancelar su cuenta en cualquier momento desde la configuración de su perfil.</p>
            </section>

            <section id="modifications" class="terms-section">
              <h2>12. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en
                vigor inmediatamente después de su publicación en la plataforma.</p>
              <p>Es su responsabilidad revisar periódicamente estos términos. El uso continuado de nuestros servicios
                después de las modificaciones constituye su aceptación de los nuevos términos.</p>
            </section>

            <section id="contact" class="terms-section">
              <h2>13. Contacto</h2>
              <p>Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:</p>
              <div class="contact-info">
                <p><strong>Email:</strong> legal@elixiumfoods.com</p>
                <p><strong>Teléfono:</strong> +34 900 123 456</p>
                <p><strong>Dirección:</strong> Calle Innovación 123, 28001 Madrid, España</p>
                <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const lastUpdated = computed(() => {
  const date = new Date('2024-01-15')
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
$secondary: #0652DD;
$accent: #FFC837;
$dark: #1e293b;
$light: #f8fafc;
$text: #1e293b;
$text-light: #64748b;
$border: #e2e8f0;

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
}

.terms-view {
  min-height: 100vh;
  background-color: $light;
}

.terms-header {
  background: $primary-gradient;
  color: white;
  padding: 4rem 0;
  text-align: center;
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
    position: relative;
    z-index: 5;
  }

  &__title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  &__subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.terms-content {
  padding: 2rem 0 4rem;
  position: relative;
  z-index: 5;
}

.terms-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.terms-index {
  background: $light;
  padding: 2rem;
  border-right: 1px solid $border;
  position: sticky;
  top: 0;
  height: fit-content;

  @media (max-width: 1024px) {
    position: static;
    border-right: none;
    border-bottom: 1px solid $border;
  }

  h3 {
    color: $dark;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.terms-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  &__link {
    color: $text-light;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:hover {
      background: white;
      color: $primary;
      border-color: $primary;
      transform: translateX(4px);

      @media (max-width: 1024px) {
        transform: none;
      }
    }
  }
}

.terms-main {
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
}

.terms-section {
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;

  h2 {
    color: $dark;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid $primary;
    display: inline-block;
  }

  p {
    color: $text;
    line-height: 1.7;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  ul {
    margin: 1rem 0 1.5rem 1.5rem;

    li {
      color: $text;
      line-height: 1.6;
      margin-bottom: 0.5rem;
      position: relative;

      &::marker {
        color: $primary;
      }
    }
  }
}

.contact-info {
  background: $light;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid $primary;
  margin-top: 1rem;

  p {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: $dark;
      font-weight: 600;
    }
  }
}

// Smooth scrolling
html {
  scroll-behavior: smooth;
}
</style>
