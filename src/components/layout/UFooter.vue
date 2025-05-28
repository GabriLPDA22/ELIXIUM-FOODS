<!-- components/layout/UFooter.vue -->
<template>
  <footer class="u-footer">
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
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
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
                <li><a href="#" class="u-footer__link">Elixium Business</a></li>
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
        </div>
      </div>
    </div>

    <div class="u-footer__bottom">
      <div class="container">
        <div class="u-footer__bottom-content">
          <p class="u-footer__copyright">© {{ new Date().getFullYear() }} Elixium Foods. Todos los derechos reservados.
          </p>
          <div class="u-footer__payment">
            <!-- Tarjetas de crédito con las imágenes específicas proporcionadas -->
            <a href="#" class="u-footer__payment-link" title="American Express">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                  alt="American Express" class="u-footer__payment-img">
            </a>
            <a href="#" class="u-footer__payment-link" title="Mastercard">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/MasterCard_early_1990s_logo.png"
                  alt="Mastercard" class="u-footer__payment-img">
            </a>
            <a href="#" class="u-footer__payment-link" title="Visa">
              <img src="https://www.visa.es/dam/VCOM/regional/ve/unitedkingdom/in-page-images/click-to-pay/consumer/uk-visa-clicktopay-logo-800x450.jpg"
                  alt="Visa" class="u-footer__payment-img">
            </a>
            <a href="https://www.top-bank.ch/es/banca-online-movil/paypal" class="u-footer__payment-link" title="PayPal">
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                  alt="PayPal" class="u-footer__payment-img">
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');

const submitNewsletter = () => {
  // Aquí puedes implementar la lógica para enviar el formulario
  if (email.value) {
    // Simular envío
    alert('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas.');
    email.value = '';
  }
};
</script>

<style lang="scss" scoped>
.u-footer {
  position: relative;
  color: #fff;
  background-color: #0f172a;

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
    grid-template-columns: 1fr 2fr;
    gap: 3rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 2rem;
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
    width: 140px;
    height: auto;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }
  }

  &__nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
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
    gap: 1.2rem;
    align-items: center;
    margin-top: 0.5rem;
  }

  &__payment-link {
    display: block;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }
  }

  &__payment-img {
    height: 32px;
    width: auto;
    background-color: white;
    padding: 4px 8px;
    border-radius: 4px;
    object-fit: contain;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
}

@media (max-width: 768px) {
  .u-footer {
    &__bottom-content {
      flex-direction: column;
      text-align: center;
    }

    &__payment {
      justify-content: center;
      margin-top: 1rem;
    }
  }
}
</style>
