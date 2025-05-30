<!-- src/views/PrivacyPolicy.vue -->
<template>
  <div class="privacy-view">
    <!-- Header Section -->
    <section class="privacy-header">
      <div class="container">
        <div class="privacy-header__content">
          <h1 class="privacy-header__title">Política de Privacidad</h1>
          <p class="privacy-header__subtitle">Última actualización: {{ lastUpdated }}</p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="privacy-content">
      <div class="container">
        <div class="privacy-card">
          <!-- Índice -->
          <div class="privacy-index">
            <h3>Índice de Contenidos</h3>
            <nav class="privacy-nav">
              <a href="#introduction" class="privacy-nav__link">1. Introducción</a>
              <a href="#data-collection" class="privacy-nav__link">2. Datos que Recopilamos</a>
              <a href="#usage" class="privacy-nav__link">3. Cómo Usamos sus Datos</a>
              <a href="#sharing" class="privacy-nav__link">4. Compartir Información</a>
              <a href="#cookies" class="privacy-nav__link">5. Cookies y Tecnologías</a>
              <a href="#security" class="privacy-nav__link">6. Seguridad de Datos</a>
              <a href="#retention" class="privacy-nav__link">7. Retención de Datos</a>
              <a href="#rights" class="privacy-nav__link">8. Sus Derechos</a>
              <a href="#minors" class="privacy-nav__link">9. Menores de Edad</a>
              <a href="#international" class="privacy-nav__link">10. Transferencias Internacionales</a>
              <a href="#changes" class="privacy-nav__link">11. Cambios en la Política</a>
              <a href="#contact" class="privacy-nav__link">12. Contacto</a>
            </nav>
          </div>

          <!-- Contenido Principal -->
          <div class="privacy-main">
            <section id="introduction" class="privacy-section">
              <h2>1. Introducción</h2>
              <p>En Elixium Foods, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestros servicios.</p>
              <p>Al utilizar nuestra plataforma, usted acepta las prácticas descritas en esta política. Si no está de acuerdo con algún aspecto de esta política, le recomendamos que no utilice nuestros servicios.</p>
              <div class="highlight-box">
                <h4>🔒 Nuestro Compromiso</h4>
                <p>Cumplimos con el Reglamento General de Protección de Datos (RGPD) y todas las leyes aplicables de protección de datos.</p>
              </div>
            </section>

            <section id="data-collection" class="privacy-section">
              <h2>2. Datos que Recopilamos</h2>

              <h3>2.1 Información que Usted Proporciona</h3>
              <ul>
                <li><strong>Datos de registro:</strong> Nombre, apellido, dirección de correo electrónico, número de teléfono</li>
                <li><strong>Información de perfil:</strong> Preferencias alimentarias, alergias, direcciones de entrega</li>
                <li><strong>Datos de pago:</strong> Información de tarjetas de crédito/débito (procesada de forma segura por terceros)</li>
                <li><strong>Comunicaciones:</strong> Mensajes, reseñas, comentarios que nos envía</li>
              </ul>

              <h3>2.2 Información Recopilada Automáticamente</h3>
              <ul>
                <li><strong>Datos de uso:</strong> Páginas visitadas, tiempo en la plataforma, acciones realizadas</li>
                <li><strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, navegador</li>
                <li><strong>Datos de ubicación:</strong> Dirección IP, ubicación aproximada (con su consentimiento)</li>
                <li><strong>Cookies:</strong> Identificadores únicos para mejorar su experiencia</li>
              </ul>

              <h3>2.3 Información de Terceros</h3>
              <ul>
                <li><strong>Redes sociales:</strong> Si inicia sesión a través de Google, Facebook u otras plataformas</li>
                <li><strong>Socios comerciales:</strong> Restaurantes con información relevante para su pedido</li>
              </ul>
            </section>

            <section id="usage" class="privacy-section">
              <h2>3. Cómo Usamos sus Datos</h2>

              <div class="usage-grid">
                <div class="usage-card">
                  <h4>🛍️ Servicios Principales</h4>
                  <ul>
                    <li>Procesar y entregar pedidos</li>
                    <li>Gestionar su cuenta de usuario</li>
                    <li>Facilitar pagos seguros</li>
                    <li>Coordinar entregas</li>
                  </ul>
                </div>

                <div class="usage-card">
                  <h4>📞 Comunicación</h4>
                  <ul>
                    <li>Enviar confirmaciones de pedidos</li>
                    <li>Actualizaciones de estado</li>
                    <li>Atención al cliente</li>
                    <li>Notificaciones importantes</li>
                  </ul>
                </div>

                <div class="usage-card">
                  <h4>🎯 Personalización</h4>
                  <ul>
                    <li>Recomendaciones personalizadas</li>
                    <li>Ofertas relevantes</li>
                    <li>Mejora de la experiencia</li>
                    <li>Contenido adaptado</li>
                  </ul>
                </div>

                <div class="usage-card">
                  <h4>📊 Análisis y Mejoras</h4>
                  <ul>
                    <li>Análisis de uso de la plataforma</li>
                    <li>Detección de fraudes</li>
                    <li>Mejoras del servicio</li>
                    <li>Investigación y desarrollo</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="sharing" class="privacy-section">
              <h2>4. Compartir Información</h2>
              <p>Compartimos su información personal únicamente en las siguientes circunstancias:</p>

              <h3>4.1 Socios Comerciales</h3>
              <ul>
                <li><strong>Restaurantes:</strong> Compartimos detalles del pedido necesarios para la preparación</li>
                <li><strong>Servicios de entrega:</strong> Información de contacto y dirección para la entrega</li>
                <li><strong>Procesadores de pago:</strong> Datos necesarios para procesar transacciones</li>
              </ul>

              <h3>4.2 Proveedores de Servicios</h3>
              <ul>
                <li>Servicios de hosting y almacenamiento en la nube</li>
                <li>Servicios de análisis y marketing</li>
                <li>Servicios de atención al cliente</li>
                <li>Servicios de seguridad y prevención de fraudes</li>
              </ul>

              <h3>4.3 Obligaciones Legales</h3>
              <p>Podemos divulgar información cuando sea requerido por ley o para proteger nuestros derechos, seguridad o los de nuestros usuarios.</p>
            </section>

            <section id="cookies" class="privacy-section">
              <h2>5. Cookies y Tecnologías Similares</h2>

              <h3>5.1 Tipos de Cookies que Utilizamos</h3>
              <div class="cookies-grid">
                <div class="cookie-type">
                  <h4>🔧 Cookies Esenciales</h4>
                  <p>Necesarias para el funcionamiento básico de la plataforma. No se pueden desactivar.</p>
                </div>

                <div class="cookie-type">
                  <h4>📈 Cookies de Análisis</h4>
                  <p>Nos ayudan a entender cómo usa la plataforma para mejorar nuestros servicios.</p>
                </div>

                <div class="cookie-type">
                  <h4>🎯 Cookies de Marketing</h4>
                  <p>Utilizadas para mostrar contenido y anuncios relevantes a sus intereses.</p>
                </div>

                <div class="cookie-type">
                  <h4>⚙️ Cookies de Funcionalidad</h4>
                  <p>Permiten funciones mejoradas y personalización de la experiencia.</p>
                </div>
              </div>

              <h3>5.2 Gestión de Cookies</h3>
              <p>Puede gestionar sus preferencias de cookies a través de:</p>
              <ul>
                <li>Configuración de su navegador</li>
                <li>Nuestro centro de preferencias de cookies</li>
                <li>Herramientas de opt-out de terceros</li>
              </ul>
            </section>

            <section id="security" class="privacy-section">
              <h2>6. Seguridad de Datos</h2>
              <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información:</p>

              <div class="security-measures">
                <div class="security-item">
                  <h4>🔐 Cifrado</h4>
                  <p>Utilizamos cifrado SSL/TLS para proteger datos en tránsito y cifrado AES para datos almacenados.</p>
                </div>

                <div class="security-item">
                  <h4>🛡️ Acceso Restringido</h4>
                  <p>Solo el personal autorizado tiene acceso a datos personales, siguiendo el principio de menor privilegio.</p>
                </div>

                <div class="security-item">
                  <h4>🔍 Monitoreo</h4>
                  <p>Monitoreamos continuamente nuestros sistemas para detectar y prevenir actividades sospechosas.</p>
                </div>

                <div class="security-item">
                  <h4>📋 Auditorías</h4>
                  <p>Realizamos auditorías regulares de seguridad y cumplimiento con estándares internacionales.</p>
                </div>
              </div>
            </section>

            <section id="retention" class="privacy-section">
              <h2>7. Retención de Datos</h2>
              <p>Conservamos su información personal durante el tiempo necesario para:</p>
              <ul>
                <li>Proporcionar nuestros servicios</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Resolver disputas</li>
                <li>Hacer cumplir nuestros acuerdos</li>
              </ul>

              <div class="retention-table">
                <h4>Períodos de Retención Típicos</h4>
                <table>
                  <tr>
                    <td><strong>Datos de cuenta activa</strong></td>
                    <td>Mientras la cuenta esté activa</td>
                  </tr>
                  <tr>
                    <td><strong>Historial de pedidos</strong></td>
                    <td>7 años (obligaciones fiscales)</td>
                  </tr>
                  <tr>
                    <td><strong>Datos de marketing</strong></td>
                    <td>Hasta que retire su consentimiento</td>
                  </tr>
                  <tr>
                    <td><strong>Logs del sistema</strong></td>
                    <td>12 meses</td>
                  </tr>
                </table>
              </div>
            </section>

            <section id="rights" class="privacy-section">
              <h2>8. Sus Derechos</h2>
              <p>Bajo el RGPD y otras leyes aplicables, usted tiene los siguientes derechos:</p>

              <div class="rights-grid">
                <div class="right-item">
                  <h4>👁️ Derecho de Acceso</h4>
                  <p>Solicitar una copia de los datos personales que tenemos sobre usted.</p>
                </div>

                <div class="right-item">
                  <h4>✏️ Derecho de Rectificación</h4>
                  <p>Solicitar la corrección de datos inexactos o incompletos.</p>
                </div>

                <div class="right-item">
                  <h4>🗑️ Derecho de Supresión</h4>
                  <p>Solicitar la eliminación de sus datos personales en ciertas circunstancias.</p>
                </div>

                <div class="right-item">
                  <h4>⏸️ Derecho de Restricción</h4>
                  <p>Solicitar la limitación del procesamiento de sus datos.</p>
                </div>

                <div class="right-item">
                  <h4>📦 Derecho de Portabilidad</h4>
                  <p>Recibir sus datos en un formato estructurado y legible por máquina.</p>
                </div>

                <div class="right-item">
                  <h4>❌ Derecho de Oposición</h4>
                  <p>Oponerse al procesamiento de sus datos para marketing directo.</p>
                </div>
              </div>

              <p>Para ejercer estos derechos, contacte a: <strong>privacy@elixiumfoods.com</strong></p>
            </section>

            <section id="minors" class="privacy-section">
              <h2>9. Menores de Edad</h2>
              <p>Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información personal de menores de 18 años sin el consentimiento parental adecuado.</p>
              <p>Si descubrimos que hemos recopilado información de un menor sin consentimiento, tomaremos medidas para eliminar esa información de nuestros sistemas.</p>
            </section>

            <section id="international" class="privacy-section">
              <h2>10. Transferencias Internacionales</h2>
              <p>Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo (EEE). Cuando transferimos datos fuera del EEE, implementamos salvaguardas adecuadas como:</p>
              <ul>
                <li>Cláusulas contractuales estándar aprobadas por la UE</li>
                <li>Decisiones de adecuación de la Comisión Europea</li>
                <li>Certificaciones del Privacy Shield (donde aplicable)</li>
              </ul>
            </section>

            <section id="changes" class="privacy-section">
              <h2>11. Cambios en la Política</h2>
              <p>Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas, tecnologías o requisitos legales.</p>
              <p>Le notificaremos sobre cambios significativos a través de:</p>
              <ul>
                <li>Notificación en nuestra plataforma</li>
                <li>Correo electrónico (para cambios importantes)</li>
                <li>Actualización de la fecha "Última actualización"</li>
              </ul>
            </section>

            <section id="contact" class="privacy-section">
              <h2>12. Contacto</h2>
              <p>Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos sus datos personales, puede contactarnos:</p>

              <div class="contact-info">
                <div class="contact-method">
                  <h4>📧 Delegado de Protección de Datos</h4>
                  <p><strong>Email:</strong> privacy@elixiumfoods.com</p>
                  <p><strong>Respuesta:</strong> 72 horas máximo</p>
                </div>

                <div class="contact-method">
                  <h4>📞 Teléfono</h4>
                  <p><strong>Número:</strong> +34 900 123 456</p>
                  <p><strong>Horario:</strong> L-V, 9:00 - 18:00</p>
                </div>

                <div class="contact-method">
                  <h4>📍 Dirección Postal</h4>
                  <p>Elixium Foods - Departamento de Privacidad<br>
                     Calle Innovación 123<br>
                     28001 Madrid, España</p>
                </div>

                <div class="contact-method">
                  <h4>⚖️ Autoridad de Control</h4>
                  <p>Si no está satisfecho con nuestra respuesta, puede contactar a la Agencia Española de Protección de Datos (AEPD)</p>
                  <p><strong>Web:</strong> www.aepd.es</p>
                </div>
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

.privacy-view {
  min-height: 100vh;
  background-color: $light;
}

.privacy-header {
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

.privacy-content {
  padding: 2rem 0 4rem;
  position: relative;
  z-index: 5;
}

.privacy-card {
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

.privacy-index {
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

.privacy-nav {
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

.privacy-main {
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
}

.privacy-section {
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

  h3 {
    color: $dark;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem 0;
  }

  h4 {
    color: $dark;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
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

      strong {
        color: $dark;
        font-weight: 600;
      }
    }
  }
}

.highlight-box {
  background: linear-gradient(135deg, rgba($primary, 0.1), rgba($accent, 0.1));
  border-left: 4px solid $primary;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;

  h4 {
    color: $primary;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 0;
  }
}

.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.usage-card {
  background: $light;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid $border;

  h4 {
    color: $primary;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;

    li {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
  }
}

.cookies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.cookie-type {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid $border;

  h4 {
    color: $primary;
    margin-bottom: 0.75rem;
  }

  p {
    margin-bottom: 0;
    font-size: 0.95rem;
  }
}

.security-measures {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.security-item {
  background: $light;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid $border;

  h4 {
    color: $primary;
    margin-bottom: 0.75rem;
  }

  p {
    margin-bottom: 0;
    font-size: 0.95rem;
  }
}

.retention-table {
  background: $light;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;

  h4 {
    margin-bottom: 1rem;
    color: $dark;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    tr {
      border-bottom: 1px solid $border;

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;

      &:first-child {
        padding-left: 0;
        color: $text;
      }

      &:last-child {
        color: $text-light;
        text-align: right;
      }
    }
  }
}

.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.right-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid $border;

  h4 {
    color: $primary;
    margin-bottom: 0.75rem;
  }

  p {
    margin-bottom: 0;
    font-size: 0.95rem;
  }
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.contact-method {
  background: $light;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid $primary;

  h4 {
    color: $primary;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 0.5rem;
    font-size: 0.95rem;

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
