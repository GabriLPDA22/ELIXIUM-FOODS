<!-- components/layout/UFooter.vue -->
<template>
  <footer class="u-footer">
    <div class="u-footer__top">
      <div class="u-footer__wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#0f172a" fill-opacity="1"
            d="M0,192L48,202.7C96,213,192,235,288,218.7C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
    </div>

    <div class="u-footer__main">
      <div class="container">
        <div class="u-footer__content">
          <div class="u-footer__brand">
            <div class="u-footer__logo">
              <span class="u-footer__logo-icon">🍽️</span>
              <h2 class="u-footer__logo-text">Elixium Foods</h2>
            </div>
            <p class="u-footer__tagline">Deliciosa comida entregada a tu puerta. Los mejores restaurantes locales a tu
              alcance.</p>
            <div class="u-footer__social">
              <a href="#" class="u-footer__social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" class="u-footer__social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                  </path>
                </svg>
              </a>
              <a href="#" class="u-footer__social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" class="u-footer__social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z">
                  </path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
            <div class="u-footer__apps">
              <a href="#" class="u-footer__app-link">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png"
                  alt="Descarga en App Store" class="u-footer__app-image">
              </a>
              <a href="#" class="u-footer__app-link">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/es_badge_web_generic.png"
                  alt="Disponible en Google Play" class="u-footer__app-image">
              </a>
            </div>
          </div>

          <div class="u-footer__nav">
            <div class="u-footer__column">
              <h3 class="u-footer__heading">Compañía</h3>
              <ul class="u-footer__list">
                <li><a href="#" class="u-footer__link">Sobre Nosotros</a></li>
                <li><a href="#" class="u-footer__link">Empleos</a></li>
                <li><a href="#" class="u-footer__link">Blog</a></li>
                <li><a href="#" class="u-footer__link">Asociarse</a></li>
                <li><a href="#" class="u-footer__link">Inversores</a></li>
              </ul>
            </div>

            <div class="u-footer__column">
              <h3 class="u-footer__heading">Soporte</h3>
              <ul class="u-footer__list">
                <li><a href="#" class="u-footer__link">Centro de Ayuda</a></li>
                <li><a href="#" class="u-footer__link">Contacto</a></li>
                <li><a href="#" class="u-footer__link">Seguridad</a></li>
                <li><a href="#" class="u-footer__link">COVID-19</a></li>
                <li><a href="#" class="u-footer__link">Preguntas Frecuentes</a></li>
              </ul>
            </div>

            <div class="u-footer__column">
              <h3 class="u-footer__heading">Legal</h3>
              <ul class="u-footer__list">
                <li><a href="#" class="u-footer__link">Términos y Condiciones</a></li>
                <li><a href="#" class="u-footer__link">Política de Privacidad</a></li>
                <li><a href="#" class="u-footer__link">Política de Cookies</a></li>
                <li><a href="#" class="u-footer__link">Accesibilidad</a></li>
                <li><a href="#" class="u-footer__link">Licencias</a></li>
              </ul>
            </div>
          </div>

          <div class="u-footer__newsletter">
            <h3 class="u-footer__heading">Mantente Actualizado</h3>
            <p class="u-footer__newsletter-text">Suscríbete a nuestro boletín y recibe ofertas especiales</p>
            <form class="u-footer__form">
              <div class="u-footer__form-group">
                <input type="email" placeholder="Tu dirección de email" class="u-footer__input" />
                <button type="submit" class="u-footer__button">
                  <span>Suscribirse</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
              <p class="u-footer__privacy">Al suscribirte, aceptas nuestra <a href="#"
                  class="u-footer__privacy-link">Política de Privacidad</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="u-footer__bottom">
      <div class="container">
        <div class="u-footer__bottom-content">
          <p class="u-footer__copyright">© {{ new Date().getFullYear() }} Elixium Foods. Todos los derechos reservados.
          </p>
          <div class="u-footer__payment">
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#016FD0" />
                <path d="M13.5 14H16.5V6H13.5V14ZM18.5 14H21.5V10H18.5V14ZM7.5 14H10.5V6H7.5V14ZM10.5 8H13.5V6H10.5V8Z"
                  fill="white" />
              </svg>
            </span>
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#EB001B" />
                <circle cx="11" cy="10" r="5" fill="#EB001B" />
                <circle cx="19" cy="10" r="5" fill="#F79E1B" />
                <path
                  d="M15 6.8C16.6 8 17.7 9.9 17.7 12C17.7 14.1 16.6 16 15 17.2C13.4 16 12.3 14.1 12.3 12C12.3 9.9 13.4 8 15 6.8Z"
                  fill="#FF5F00" />
              </svg>
            </span>
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#393939" />
                <path
                  d="M11.5 12.9C11.5 14.1 12.4 15 13.6 15H18.5V13.2H13.8C13.5 13.2 13.3 13 13.3 12.7V10H18.5V8.2H13.3V5H11.5V12.9Z"
                  fill="white" />
              </svg>
            </span>
            <span class="u-footer__payment-icon">
              <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" rx="4" fill="#1434CB" />
                <path
                  d="M10.5 7L9 14H11L12.5 7H10.5ZM16 7L14.5 14H16.5L18 7H16ZM12.5 7L11 14H13L14.5 7H12.5ZM19 11.5H21L21.5 10H19.5L20 8.5H22L22.5 7H18.5L17 14H21L21.5 12.5H19.5L19 11.5Z"
                  fill="white" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No se necesita script específico para el footer
</script>

<style lang="scss" scoped>
.u-footer {
  position: relative;
  color: #fff;

  &__top {
    position: relative;
    height: 150px;
  }

  &__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    svg {
      display: block;
      width: 100%;
    }
  }

  &__main {
    background-color: #0f172a;
    padding: 4rem 0 3rem;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image:
        radial-gradient(circle at 10% 10%, rgba(#FF416C, 0.05), transparent 400px),
        radial-gradient(circle at 90% 90%, rgba(#0652DD, 0.05), transparent 400px);
      pointer-events: none;
    }
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 5;
  }

  &__content {
    display: grid;
    grid-template-columns: 1.5fr 2fr 1.5fr;
    gap: 3rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  &__logo-icon {
    font-size: 2rem;
  }

  &__logo-text {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;
  }

  &__tagline {
    color: #94a3b8;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    font-size: 1.05rem;
  }

  &__social {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #fff;
    transition: all 0.3s ease;

    &:hover {
      background-color: #FF416C;
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(#FF416C, 0.2);
    }
  }

  &__apps {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__app-link {
    max-width: 140px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }
  }

  &__app-image {
    width: 100%;
    height: auto;
    border-radius: 6px;
  }

  &__nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;

    @media (max-width: 992px) {
      grid-column: span 2;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      grid-column: auto;
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  &__heading {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 1.5rem;
    position: relative;
    padding-bottom: 0.8rem;
    color: white;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(to right, #FF416C, #FF4B2B);
      border-radius: 2px;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__link {
    color: #94a3b8;
    text-decoration: none;
    display: block;
    padding: 0.6rem 0;
    transition: all 0.3s;

    &:hover {
      color: #fff;
      transform: translateX(5px);
    }
  }

  &__newsletter {
    @media (max-width: 992px) {
      grid-column: span 2;
    }

    @media (max-width: 768px) {
      grid-column: auto;
    }
  }

  &__newsletter-text {
    color: #94a3b8;
    margin-bottom: 1.2rem;
    line-height: 1.6;
    font-size: 1.05rem;
  }

  &__form-group {
    display: flex;
    overflow: hidden;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;

    &:focus-within {
      background-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }

  &__input {
    flex: 1;
    padding: 1rem 1.2rem;
    border: none;
    outline: none;
    background-color: transparent;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;

    &::placeholder {
      color: #64748b;
    }
  }

  &__button {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    padding: 0 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: inherit;
    font-size: 0.95rem;

    svg {
      transition: transform 0.3s ease;
    }

    &:hover {
      background: linear-gradient(135deg, darken(#FF416C, 5%), darken(#FF4B2B, 5%));

      svg {
        transform: translateX(3px);
      }
    }
  }

  &__privacy {
    margin-top: 0.75rem;
    font-size: 0.8rem;
    color: #64748b;
  }

  &__privacy-link {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }

  &__bottom {
    background-color: #0a0f1a;
    padding: 1.5rem 0;
  }

  &__bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__copyright {
    color: #64748b;
    margin: 0;
    font-size: 0.9rem;
  }

  &__payment {
    display: flex;
    gap: 0.75rem;
  }

  &__payment-icon {
    opacity: 0.7;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}

@media (max-width: 768px) {
  .u-footer {
    &__bottom-content {
      flex-direction: column;
      text-align: center;
    }
  }
}
</style>