<!-- src/views/About.vue -->
<template>
    <div class="about-view">
      <!-- Hero Section -->
      <section class="about-hero">
        <div class="about-hero__background"></div>
        <div class="about-hero__overlay"></div>
        <div class="container">
          <div class="about-hero__content">
            <h1 class="about-hero__title">Nuestra Historia</h1>
            <p class="about-hero__subtitle">
              Llevando lo mejor de cada cocina directamente a tu puerta
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
              <span class="about-story__badge">Nuestra Visión</span>
              <h2 class="about-story__title">De una idea simple a tu mesa favorita</h2>
              <p class="about-story__text">
                En 2020, durante los tiempos más desafiantes, nació Elixium Foods con una misión clara: 
                conectar personas con la mejor comida local. Lo que comenzó como una idea simple se ha 
                convertido en una comunidad de miles de restaurantes y clientes felices.
              </p>
              <p class="about-story__text">
                Creemos que la buena comida une a las personas, y nuestra tecnología hace posible que 
                disfrutes de experiencias gastronómicas increíbles sin salir de casa. Cada pedido es una 
                oportunidad para celebrar la diversidad culinaria de nuestra ciudad.
              </p>
              <div class="about-story__stats">
                <div class="about-story__stat">
                  <span class="about-story__stat-number">500+</span>
                  <span class="about-story__stat-label">Restaurantes</span>
                </div>
                <div class="about-story__stat">
                  <span class="about-story__stat-number">50K+</span>
                  <span class="about-story__stat-label">Pedidos Entregados</span>
                </div>
                <div class="about-story__stat">
                  <span class="about-story__stat-number">4.8</span>
                  <span class="about-story__stat-label">Valoración Media</span>
                </div>
              </div>
            </div>
            <div class="about-story__image">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
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
  
      <!-- Values Section -->
      <section class="about-values">
        <div class="container">
          <div class="about-values__header">
            <h2 class="about-values__title">Nuestros Valores</h2>
            <p class="about-values__subtitle">Los principios que guían cada decisión que tomamos</p>
          </div>
          <div class="about-values__grid">
            <div class="about-values__item">
              <div class="about-values__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <h3 class="about-values__item-title">Excelencia</h3>
              <p class="about-values__item-text">
                Nos esforzamos por ofrecer el mejor servicio y la mejor selección de restaurantes para nuestros clientes.
              </p>
            </div>
            <div class="about-values__item">
              <div class="about-values__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 class="about-values__item-title">Comunidad</h3>
              <p class="about-values__item-text">
                Apoyamos a los negocios locales y creamos conexiones significativas entre restaurantes y clientes.
              </p>
            </div>
            <div class="about-values__item">
              <div class="about-values__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 class="about-values__item-title">Confianza</h3>
              <p class="about-values__item-text">
                La seguridad y satisfacción de nuestros usuarios es nuestra máxima prioridad en cada transacción.
              </p>
            </div>
            <div class="about-values__item">
              <div class="about-values__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 class="about-values__item-title">Innovación</h3>
              <p class="about-values__item-text">
                Constantemente mejoramos nuestra plataforma para ofrecer experiencias más rápidas y eficientes.
              </p>
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
                  src="../../public/images/Abuelo.jpg" 
                  alt="CEO" 
                />
              </div>
              <h3 class="about-team__member-name">Presi Martínez</h3>
              <p class="about-team__member-role">CEO & Fundador</p>
              <p class="about-team__member-bio">
                El que paga el claude.
              </p>
            </div>
            <div class="about-team__member">
              <div class="about-team__member-image">
                <img 
                  src="../../public/images/BigBoss.jpg" 
                  alt="BIG BOSS" 
                />
              </div>
              <h3 class="about-team__member-name">Francisco Villa</h3>
              <p class="about-team__member-role">BIG BOSS</p>
              <p class="about-team__member-bio">
                El cerebro detrás de nuestras operaciones y estrategia de crecimiento.
              </p>
            </div>
            <div class="about-team__member">
              <div class="about-team__member-image">
                <img 
                  src="../../public/images/Claudia.png" 
                  alt="COO" 
                />
              </div>
              <h3 class="about-team__member-name">Claude</h3>
              <p class="about-team__member-role">Esclavo y carry</p>
              <p class="about-team__member-bio">
                Tercer miembro del equipo, el encargado de hacer los inserts que me dan pereza.
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="about-cta">
        <div class="container">
          <div class="about-cta__content">
            <h2 class="about-cta__title">Únete a nuestra historia</h2>
            <p class="about-cta__text">
              ¿Eres un restaurante buscando expandir tu negocio? ¿O simplemente quieres disfrutar de la mejor comida local?
            </p>
            <div class="about-cta__buttons">
              <router-link to="/partner" class="about-cta__button about-cta__button--primary">
                Hazte Partner
              </router-link>
              <router-link to="/restaurants" class="about-cta__button about-cta__button--secondary">
                Explorar Restaurantes
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
  
  // Story Section
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
  
  // Values Section
  .about-values {
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
  
  // Team Section
  .about-team {
    padding: 8rem 0;
  
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
    }
  
    &__member-image {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1.5rem;
      border: 5px solid white;
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