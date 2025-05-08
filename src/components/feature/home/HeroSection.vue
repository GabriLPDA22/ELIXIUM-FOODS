<!-- components/feature/home/HeroSection.vue -->
<template>
  <section class="hero">
    <div class="hero__animated-bg">
      <!-- Iconos animados de comida (suponiendo que es una web de comida) -->
      <div class="hero__food-icon hero__food-icon--1">🍕</div>
      <div class="hero__food-icon hero__food-icon--2">🍔</div>
      <div class="hero__food-icon hero__food-icon--3">🍜</div>
      <div class="hero__food-icon hero__food-icon--4">🌮</div>
      <div class="hero__food-icon hero__food-icon--5">🥗</div>
      <div class="hero__food-icon hero__food-icon--6">🥐</div>
      <div class="hero__food-icon hero__food-icon--7">🍣</div>
    </div>

    <div class="hero__container">
      <div class="hero__content">
        <h1 class="hero__title">
          Descubre los mejores <span class="hero__title-highlight">restaurantes</span>
        </h1>
        <p class="hero__subtitle">
          Encuentra fácilmente los restaurantes y platos que más te gustan en tu zona
        </p>

        <div class="hero__search-container">
          <div class="hero__search">
            <div class="hero__search-input-wrapper">
              <div class="hero__search-icon">
                <i class="fas fa-search"></i> <!-- Suponiendo que usas Font Awesome -->
              </div>
              <input type="text" class="hero__search-input" placeholder="Buscar restaurantes, platos, cocinas...">
            </div>
            <button class="hero__search-button">
              Buscar
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="hero__badges">
          <!-- Corregidos los badges para mayor contraste -->
          <div class="hero__badge">
            <span class="hero__badge-icon">🍽️</span>
            <span class="hero__badge-text">Restaurantes</span>
          </div>
          <div class="hero__badge">
            <span class="hero__badge-icon">🚚</span>
            <span class="hero__badge-text">Delivery</span>
          </div>
          <div class="hero__badge">
            <span class="hero__badge-icon">👨‍🍳</span>
            <span class="hero__badge-text">Chefs</span>
          </div>
        </div>
      </div>

      <div class="hero__image-container">
        <div class="hero__image">
                    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Deliciosa comida" />
        </div>
      </div>
    </div>

    <div class="hero__wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#ffffff" fill-opacity="1"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,106.7C672,85,768,75,864,90.7C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
        </path>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const address = ref('')
</script>

<style lang="scss" scoped>
.hero {
    position: relative;
    padding: 9rem 2rem 10rem; // Padding generoso para desktop
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image:
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 200px),
            radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.12) 0%, transparent 200px);
        z-index: 0;
    }

    &__container {
        position: relative;
        z-index: 2;
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr; // Mobile-first: una columna por defecto
        gap: 2rem;
        align-items: center;

        @media (min-width: 992px) { // Ajuste para tablets y desktop
            grid-template-columns: 1fr 1fr;
        }
    }

    &__content {
        max-width: 600px;
        z-index: 5; // Asegura que el contenido esté sobre otros elementos como el fondo animado
        text-align: center; // Centrar texto en mobile

        @media (min-width: 992px) {
            text-align: left; // Alinear a la izquierda en pantallas más grandes
        }
    }

    &__title {
        font-size: 2.4rem; // Tamaño base para mobile
        font-weight: 800;
        color: white;
        margin: 0 0 1rem; // Reducir margen inferior para mobile
        line-height: 1.1;
        letter-spacing: -0.03em;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &-highlight {
            background: linear-gradient(to right, #FFC837, #FF8008);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                height: 6px; // Un poco más delgado para mobile
                width: 100%;
                bottom: -2px; // Ajustar posición
                left: 0;
                background: linear-gradient(to right, #FFC837, #FF8008);
                border-radius: 3px;
                opacity: 0.5;
            }
        }

        @media (min-width: 768px) {
            font-size: 2.8rem;
            margin-bottom: 1.5rem; // Restaurar margen para pantallas más grandes
            &-highlight::after {
                height: 8px;
                bottom: -4px;
            }
        }

        @media (min-width: 992px) {
            font-size: 3.5rem;
        }
    }

    &__subtitle {
        font-size: 1.1rem; // Ligeramente más pequeño para mobile
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin: 0 auto 2rem; // Centrar y ajustar margen para mobile
        max-width: 90%;    // Usar porcentaje para mejor adaptabilidad en mobile

        @media (min-width: 768px) {
            font-size: 1.25rem;
            max-width: 500px; // Restaurar max-width para pantallas más grandes
            margin: 0 0 2.5rem; // Restaurar margen
        }
    }

    &__search-container {
        position: relative;
        margin-bottom: 2rem; // Ajustar margen para mobile

        @media (min-width: 768px) {
            margin-bottom: 2.5rem;
        }
    }

    &__search {
        display: flex;
        flex-direction: column; // Por defecto en columna para mobile
        max-width: 100%;    // Ocupar ancho disponible en mobile
        border-radius: 16px; // Ligeramente menos redondeado para mobile
        overflow: hidden;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); // Sombra más sutil para mobile
        background: white;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover,
        &:focus-within {
            transform: translateY(-3px); // Menor elevación en hover para mobile
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        @media (min-width: 768px) {
            flex-direction: row; // Fila en pantallas más grandes
            max-width: 600px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            &:hover,
            &:focus-within {
                transform: translateY(-5px);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            }
        }
    }

    &__search-input-wrapper {
        flex: 1;
        position: relative;
        background: white;
    }

    &__search-icon {
        position: absolute;
        left: 1rem; // Ajustar para mobile
        top: 50%;
        transform: translateY(-50%);
        color: #FF416C;

        @media (min-width: 768px) {
            left: 1.5rem;
        }
    }

    &__search-input {
        width: 100%;
        border: none;
        outline: none;
        padding: 1.2rem 1rem 1.2rem 3rem; // Ajustar padding para mobile
        font-size: 1rem; // Ajustar tamaño de fuente para mobile
        font-weight: 500;

        &::placeholder {
            color: #aaa;
            font-weight: 400;
        }

        @media (min-width: 768px) {
            padding: 1.4rem 1.5rem 1.4rem 3.5rem;
            font-size: 1.1rem;
        }
    }

    &__search-button {
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        color: white;
        border: none;
        padding: 1rem; // Padding uniforme para mobile
        font-weight: 600;
        font-size: 1rem; // Ajustar tamaño de fuente para mobile
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center; // Centrar contenido en mobile
        gap: 0.5rem;
        border-top: 1px solid rgba(0,0,0,0.05); // Línea sutil de separación en mobile

        &:hover {
            background: linear-gradient(to right, darken(#FF416C, 5%), darken(#FF4B2B, 5%));
        }

        svg {
            transition: transform 0.3s ease;
        }

        &:hover svg {
            transform: translateX(3px);
        }

        @media (min-width: 768px) {
            padding: 0 2rem; // Restaurar padding para pantallas grandes
            font-size: 1.1rem;
            border-top: none; // Quitar borde en pantallas grandes
            justify-content: flex-start; // Alinear como antes
        }
    }

    &__badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem; // Un poco menos de espacio entre badges en mobile
        justify-content: center; // Centrar badges en mobile
        position: relative;
        z-index: 5; // Asegura que los badges estén visibles

        @media (min-width: 992px) {
             justify-content: flex-start; // Alinear a la izquierda en desktop
             gap: 1rem;
        }
    }

    &__badge {
        display: flex;
        align-items: center;
        // CORRECCIÓN PRINCIPAL: Cambio de color de fondo y texto para mejor contraste
        background: rgba(255, 255, 255, 0.85); // Mayor opacidad para mejor visibilidad
        border-radius: 50px;
        padding: 0.6rem 1rem;
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255, 255, 255, 0.85); // Borde más visible
        transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12); // Sombra definida

        &:hover {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.95); // Más opaco en hover
            border-color: rgba(255, 255, 255, 1);
        }

        &-icon {
            margin-right: 0.5rem;
            font-size: 1.1rem;
        }

        &-text {
            font-weight: 600; // Más grueso para mejor legibilidad
            color: #FF416C; // Cambio a color principal para mejor contraste con el fondo
            font-size: 0.85rem;
        }

        @media (min-width: 768px) {
            padding: 0.7rem 1.2rem;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            &-icon {
                font-size: 1.2rem;
            }
            &-text {
                font-size: 0.95rem;
            }
        }
    }

    &__image-container {
        position: relative;
        display: none; // Oculto por defecto (mobile-first)

        @media (min-width: 992px) {
            display: block; // Mostrar en pantallas más grandes
        }
    }

    &__image {
        position: relative;
        width: 100%;
        height: 400px;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
        transform: rotate(3deg);
        transition: transform 0.5s ease;

        &:hover {
            transform: rotate(0);
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
        }
    }

    &__wave {
        position: absolute;
        bottom: -1px; // Para evitar pequeños gaps por antialiasing
        left: 0;
        width: 100%;
        line-height: 0;
        z-index: 1;

        svg {
            display: block;
            width: 100%;
        }
    }

    &__animated-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 0; // Detrás del contenido y la ola
    }

    &__food-icon {
        position: absolute;
        font-size: 1.5rem; // Más pequeños en mobile
        opacity: 0.2; // Un poco más sutiles
        animation: float 10s infinite ease-in-out;

        &--1 { top: 15%; left: 5%; font-size: 2rem; animation-delay: 0s; }
        &--2 { top: 75%; left: 15%; font-size: 1.8rem; animation-delay: 1s; }
        &--3 { top: 25%; left: 80%; font-size: 2.2rem; animation-delay: 2s; }
        &--4 { top: 85%; left: 90%; font-size: 1.6rem; animation-delay: 3s; }
        &--5 { top: 5%; left: 40%; font-size: 1.7rem; animation-delay: 4s; }
        &--6 { top: 40%; left: 92%; font-size: 1.5rem; animation-delay: 5s; }
        &--7 { top: 65%; left: 55%; font-size: 1.9rem; animation-delay: 6s; }

        @media (min-width: 768px) {
            font-size: 2rem; // Restaurar tamaños para pantallas más grandes
            opacity: 0.25;
            &--1 { top: 20%; left: 10%; font-size: 3rem; }
            &--2 { top: 70%; left: 20%; font-size: 2.5rem; }
            &--3 { top: 30%; left: 75%; font-size: 2.8rem; }
            &--4 { top: 80%; left: 85%; font-size: 2.2rem; }
            &--5 { top: 10%; left: 45%; font-size: 2.4rem; }
            &--6 { top: 35%; left: 90%; font-size: 2rem; }
            &--7 { top: 60%; left: 50%; font-size: 2.6rem; }
        }
    }
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-15px) rotate(5deg); } // Menor desplazamiento para mobile
}

// Media query general para mobile, refinando paddings y algunos elementos
@media (max-width: 767px) { // Aplicar hasta el breakpoint antes de 768px
    .hero {
        padding: 6rem 1rem 8rem; // Padding ajustado para mobile
    }
}
</style>
