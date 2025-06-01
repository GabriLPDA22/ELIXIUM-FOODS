<!-- src/views/About.vue -->
<template>
    <div class="about-view">
      <!-- Hero Section -->
      <section class="about-hero">
        <div class="about-hero__background"></div>
        <div class="about-hero__overlay"></div>
        <div class="container">
          <div class="about-hero__content">
            <h1 class="about-hero__title">Quiénes Somos</h1>
            <p class="about-hero__subtitle">
              Conectando personas con la mejor comida local de forma fácil y rápida
            </p>
            <div class="about-hero__scroll">
              <span>Descubre más</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div class="about-hero__wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fill-opacity="1"
              d="M0,160L48,149.3C96,139,192,117,288,122.7C384,128,480,160,576,170.7C672,181,768,171,864,154.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>

      <!-- Story Section -->
      <section class="about-story">
        <div class="container">
          <div class="about-story__grid">
            <div class="about-story__content">
              <span class="about-story__badge">Nuestra Misión</span>
              <h2 class="about-story__title">Revolucionando la forma de pedir comida</h2>
              <p class="about-story__text">
                Elixium Foods es una plataforma innovadora que conecta a los amantes de la buena comida
                con los mejores restaurantes locales. Nuestra misión es hacer que pedir comida sea
                una experiencia simple, rápida y satisfactoria para todos nuestros usuarios.
              </p>
              <p class="about-story__text">
                Utilizamos tecnología de vanguardia para ofrecer una plataforma intuitiva y confiable.
                Desde la búsqueda de tu restaurante favorito hasta el seguimiento en tiempo real de tu pedido,
                cada detalle está diseñado pensando en tu comodidad y satisfacción.
              </p>
              <div class="about-story__stats">
                <div class="about-story__stat">
                  <span class="about-story__stat-number">25+</span>
                  <span class="about-story__stat-label">Restaurantes Asociados</span>
                </div>
                <div class="about-story__stat">
                  <span class="about-story__stat-number">1K+</span>
                  <span class="about-story__stat-label">Pedidos Realizados</span>
                </div>
                <div class="about-story__stat">
                  <span class="about-story__stat-number">4.8</span>
                  <span class="about-story__stat-label">Valoración Media</span>
                </div>
              </div>
            </div>
            <div class="about-story__image">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Equipo Elixium Foods"
                class="about-story__img"
              />
              <div class="about-story__decoration">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" stroke="#FF416C" stroke-width="4" stroke-dasharray="12 8"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tech Stack Section -->
      <section class="about-tech">
        <div class="container">
          <div class="about-tech__header">
            <h2 class="about-tech__title">Nuestra Tecnología</h2>
            <p class="about-tech__subtitle">Innovación y calidad en cada línea de código</p>
          </div>
          <div class="about-tech__grid">
            <div class="about-tech__item">
              <div class="about-tech__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"></path>
                  <path d="M2 7l10 5 10-5"></path>
                  <path d="M12 12v10"></path>
                </svg>
              </div>
              <h3 class="about-tech__item-title">Frontend Moderno</h3>
              <p class="about-tech__item-text">
                Interfaz rápida y responsive desarrollada con Vue.js, ofreciendo una experiencia fluida en cualquier dispositivo.
              </p>
            </div>
            <div class="about-tech__item">
              <div class="about-tech__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 class="about-tech__item-title">Backend Robusto</h3>
              <p class="about-tech__item-text">
                API segura y escalable construida con ASP.NET Core, garantizando rendimiento y confiabilidad.
              </p>
            </div>
            <div class="about-tech__item">
              <div class="about-tech__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </div>
              <h3 class="about-tech__item-title">Datos Seguros</h3>
              <p class="about-tech__item-text">
                Base de datos optimizada que protege tu información personal y garantiza transacciones seguras.
              </p>
            </div>
            <div class="about-tech__item">
              <div class="about-tech__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 class="about-tech__item-title">Experiencia Completa</h3>
              <p class="about-tech__item-text">
                Plataforma integral con carrito inteligente, pagos seguros y seguimiento de pedidos en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="about-features">
        <div class="container">
          <div class="about-features__header">
            <h2 class="about-features__title">Nuestros Servicios</h2>
            <p class="about-features__subtitle">Todo lo que necesitas en una sola plataforma</p>
          </div>
          <div class="about-features__grid">
            <div class="about-features__item">
              <div class="about-features__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 class="about-features__item-title">Cuenta Personal</h3>
              <p class="about-features__item-text">
                Crea tu perfil personalizado, guarda tus direcciones favoritas y accede rápidamente a tus pedidos anteriores.
              </p>
            </div>
            <div class="about-features__item">
              <div class="about-features__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path>
                  <path d="M20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path>
                  <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6"></path>
                </svg>
              </div>
              <h3 class="about-features__item-title">Carrito Inteligente</h3>
              <p class="about-features__item-text">
                Añade tus platos favoritos, personaliza tu pedido y calcula automáticamente costos de envío y totales.
              </p>
            </div>
            <div class="about-features__item">
              <div class="about-features__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h3 class="about-features__item-title">Pagos Seguros</h3>
              <p class="about-features__item-text">
                Múltiples métodos de pago disponibles con transacciones encriptadas y totalmente seguras.
              </p>
            </div>
            <div class="about-features__item">
              <div class="about-features__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <h3 class="about-features__item-title">Seguimiento en Vivo</h3>
              <p class="about-features__item-text">
                Monitorea tu pedido en tiempo real desde la cocina hasta tu puerta con actualizaciones constantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Values Section -->
      <section class="about-developer">
        <div class="container">
          <div class="about-developer__header">
            <h2 class="about-developer__title">Nuestros Valores</h2>
            <p class="about-developer__subtitle">Los principios que guían cada decisión que tomamos</p>
          </div>
          <div class="about-developer__content">
            <div class="about-developer__text">
              <div class="about-developer__card">
                <h3 class="about-developer__card-title">Innovación Constante</h3>
                <p class="about-developer__card-text">
                  Desarrollamos constantemente nuevas funcionalidades y mejoras para
                  ofrecerte la mejor experiencia de pedido online del mercado.
                </p>
              </div>
              <div class="about-developer__card">
                <h3 class="about-developer__card-title">Apoyo Local</h3>
                <p class="about-developer__card-text">
                  Impulsamos el negocio local conectando restaurantes de barrio con nuevos clientes,
                  creando una comunidad gastronómica sólida y próspera.
                </p>
              </div>
              <div class="about-developer__card">
                <h3 class="about-developer__card-title">Transparencia Total</h3>
                <p class="about-developer__card-text">
                  Sin sorpresas ni costes ocultos. Precios claros, tiempos de entrega precisos
                  y información completa sobre cada restaurante y plato.
                </p>
              </div>
            </div>
            <div class="about-developer__stats">
              <div class="about-developer__stat">
                <span class="about-developer__stat-number">30min</span>
                <span class="about-developer__stat-label">Tiempo Promedio Entrega</span>
              </div>
              <div class="about-developer__stat">
                <span class="about-developer__stat-number">24/7</span>
                <span class="about-developer__stat-label">Soporte al Cliente</span>
              </div>
              <div class="about-developer__stat">
                <span class="about-developer__stat-number">98%</span>
                <span class="about-developer__stat-label">Satisfacción Cliente</span>
              </div>
              <div class="about-developer__stat">
                <span class="about-developer__stat-number">2.50€</span>
                <span class="about-developer__stat-label">Envío Desde*</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="about-team">
        <div class="container">
          <div class="about-team__header">
            <h2 class="about-team__title">Conoce al Equipo</h2>
            <p class="about-team__subtitle">Las personas apasionadas detrás de Elixium Foods</p>
          </div>
          <div class="about-team__grid">
            <div class="about-team__member">
              <div class="about-team__member-image">
                <img
                  src="../../images/Abuelo.jpg"
                  alt="CEO"
                />
              </div>
              <h3 class="about-team__member-name">Presi Martínez</h3>
              <p class="about-team__member-role">CEO & Fundador</p>
              <p class="about-team__member-bio">
                Visionario del proyecto, apasionado por conectar personas con la mejor comida local.
              </p>
            </div>
            <div class="about-team__member">
              <div class="about-team__member-image">
                <img
                  src="../../images/BigBoss.jpg"
                  alt="BIG BOSS"
                />
              </div>
              <h3 class="about-team__member-name">Francisco Villa</h3>
              <p class="about-team__member-role">CTO & Co-fundador</p>
              <p class="about-team__member-bio">
                El cerebro técnico detrás de nuestra plataforma, experto en desarrollo full-stack.
              </p>
            </div>
            <div class="about-team__member">
              <div class="about-team__member-image">
                <img
                  src="../../images/Claudia.png"
                  alt="COO"
                />
              </div>
              <h3 class="about-team__member-name">Claude</h3>
              <p class="about-team__member-role">Asistente IA</p>
              <p class="about-team__member-bio">
                Nuestro asistente de inteligencia artificial que ayuda a optimizar la experiencia del usuario.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="about-cta">
        <div class="container">
          <div class="about-cta__content">
            <h2 class="about-cta__title">¿Listo para ordenar?</h2>
            <p class="about-cta__text">
              Únete a miles de usuarios que ya disfrutan de la mejor comida local con Elixium Foods
            </p>
            <div class="about-cta__buttons">
              <router-link to="/restaurants" class="about-cta__button about-cta__button--primary">
                Ver Restaurantes
              </router-link>
              <router-link to="/register" class="about-cta__button about-cta__button--secondary">
                Crear Cuenta
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>

  <script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    // Animación de scroll suave para el indicador
    const scrollIndicator = document.querySelector('.about-hero__scroll');
    scrollIndicator?.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  });
  </script>

  <style lang="scss" scoped>
  // Variables
  $primary: #FF416C;
  $primary-gradient: linear-gradient(to right, #FF416C, #FF4B2B);
  $secondary: #0652DD;
  $secondary-gradient: linear-gradient(to right, #0652DD, #12CBC4);
  $accent: #FFA502;
  $dark: #1e293b;
  $light: #f8fafc;
  $text: #1e293b;
  $text-light: #64748b;
  $border: #e2e8f0;
  $border-radius: 16px;
  $transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
      padding: 0 1.5rem;
    }
  }

  .about-view {
    min-height: 100vh;
    background-color: $light;
  }

  // Hero Section
  .about-hero {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: white;

    &__background {
      position: absolute;
      inset: 0;
      background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
      background-size: cover;
      background-position: center;
      filter: brightness(0.4);
    }

    &__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(#FF416C, 0.8) 0%, rgba(#FF4B2B, 0.6) 100%);
    }

    &__content {
      position: relative;
      z-index: 5;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    &__title {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.1;

      @media (max-width: 768px) {
        font-size: 3rem;
      }

      @media (max-width: 480px) {
        font-size: 2.5rem;
      }
    }

    &__subtitle {
      font-size: 1.5rem;
      margin-bottom: 3rem;
      opacity: 0.9;

      @media (max-width: 768px) {
        font-size: 1.25rem;
      }
    }

    &__scroll {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      animation: float 3s ease-in-out infinite;

      span {
        font-weight: 500;
        opacity: 0.8;
      }

      svg {
        animation: bounce 2s infinite;
      }
    }

    &__wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 0;
    }
  }

  // Story Section (mantener estilos similares)
  .about-story {
    padding: 8rem 0;

    @media (max-width: 768px) {
      padding: 5rem 0;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: center;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }

    &__content {
      @media (max-width: 992px) {
        order: 2;
      }
    }

    &__badge {
      display: inline-block;
      background: rgba($primary, 0.1);
      color: $primary;
      padding: 0.5rem 1rem;
      border-radius: 30px;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.2;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    &__text {
      font-size: 1.1rem;
      line-height: 1.8;
      color: $text-light;
      margin-bottom: 1.5rem;
    }

    &__stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 3rem;

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    &__stat {
      text-align: center;

      &-number {
        display: block;
        font-size: 2.5rem;
        font-weight: 800;
        background: $primary-gradient;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin-bottom: 0.5rem;
      }

      &-label {
        font-size: 0.9rem;
        color: $text-light;
      }
    }

    &__image {
      position: relative;

      @media (max-width: 992px) {
        order: 1;
      }
    }

    &__img {
      width: 100%;
      border-radius: $border-radius;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    &__decoration {
      position: absolute;
      top: -40px;
      right: -40px;
      z-index: -1;
      animation: rotate 20s linear infinite;

      @media (max-width: 992px) {
        display: none;
      }
    }
  }

  // Tech Stack Section
  .about-tech {
    padding: 8rem 0;
    background-color: white;

    @media (max-width: 768px) {
      padding: 5rem 0;
    }

    &__header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 4rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    &__subtitle {
      font-size: 1.25rem;
      color: $text-light;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &__item {
      text-align: center;
      padding: 2rem;
      background-color: $light;
      border-radius: $border-radius;
      transition: $transition;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
      }
    }

    &__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: $primary-gradient;
      border-radius: 20px;
      margin-bottom: 1.5rem;
      color: white;
    }

    &__item-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    &__item-text {
      color: $text-light;
      line-height: 1.6;
    }
  }

  // Features Section
  .about-features {
    padding: 8rem 0;
    background-color: $light;

    @media (max-width: 768px) {
      padding: 5rem 0;
    }

    &__header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 4rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    &__subtitle {
      font-size: 1.25rem;
      color: $text-light;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &__item {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: $border-radius;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      transition: $transition;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }
    }

    &__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: $secondary-gradient;
      border-radius: 20px;
      margin-bottom: 1.5rem;
      color: white;
    }

    &__item-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    &__item-text {
      color: $text-light;
      line-height: 1.6;
    }
  }

  // Developer Section
  .about-developer {
    padding: 8rem 0;
    background-color: white;

    @media (max-width: 768px) {
      padding: 5rem 0;
    }

    &__header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 4rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    &__subtitle {
      font-size: 1.25rem;
      color: $text-light;
    }

    &__content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 4rem;
      align-items: start;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }

    &__text {
      display: grid;
      gap: 2rem;
    }

    &__card {
      padding: 2rem;
      background-color: $light;
      border-radius: $border-radius;
      border-left: 4px solid $primary;
    }

    &__card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: $dark;
    }

    &__card-text {
      color: $text-light;
      line-height: 1.6;
    }

    &__stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;

      @media (max-width: 992px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    &__stat {
      text-align: center;
      padding: 1.5rem;
      background-color: $light;
      border-radius: $border-radius;

      &-number {
        display: block;
        font-size: 2rem;
        font-weight: 800;
        background: $primary-gradient;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin-bottom: 0.5rem;
      }

      &-label {
        font-size: 0.85rem;
        color: $text-light;
        font-weight: 500;
      }
    }
  }

  // Team Section
  .about-team {
    padding: 8rem 0;
    background-color: $light;

    @media (max-width: 768px) {
      padding: 5rem 0;
    }

    &__header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 4rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    &__subtitle {
      font-size: 1.25rem;
      color: $text-light;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
        max-width: 400px;
        margin: 0 auto;
      }
    }

    &__member {
      text-align: center;
      background: white;
      padding: 2rem;
      border-radius: $border-radius;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      transition: $transition;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }
    }

    &__member-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1.5rem;
      border: 4px solid white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__member-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    &__member-role {
      color: $primary;
      font-weight: 600;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    &__member-bio {
      color: $text-light;
      line-height: 1.6;
    }
  }

  // CTA Section
  .about-cta {
    padding: 8rem 0;
    background: $primary-gradient;
    color: white;
    text-align: center;

    @media (max-width: 768px) {
      padding: 5rem 0;
    }

    &__content {
      max-width: 800px;
      margin: 0 auto;
    }

    &__title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1.5rem;

      @media (max-width: 768px) {
        font-size: 2.25rem;
      }
    }

    &__text {
      font-size: 1.25rem;
      margin-bottom: 3rem;
      opacity: 0.9;
    }

    &__buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;

      @media (max-width: 480px) {
        flex-direction: column;
        align-items: center;
      }
    }

    &__button {
      display: inline-flex;
      align-items: center;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: $transition;

      &--primary {
        background-color: white;
        color: $primary;

        &:hover {
          background-color: rgba(white, 0.9);
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      }

      &--secondary {
        background-color: transparent;
        color: white;
        border: 2px solid white;

        &:hover {
          background-color: rgba(white, 0.1);
          transform: translateY(-5px);
        }
      }
    }
  }

  // Animaciones
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  </style>
