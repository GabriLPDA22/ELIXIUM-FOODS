<!-- components/feature/home/HowItWorksSection.vue -->
<template>
  <section class="how-it-works">
    <div class="container">
      <div class="how-it-works__heading">
        <h2 class="how-it-works__title">Cómo Funciona</h2>
        <p class="how-it-works__description">Obtén tu comida favorita en tres simples pasos</p>
      </div>

      <div class="steps">
        <div class="steps__connection"></div>

        <div class="step" v-for="(step, index) in steps" :key="index">
          <div class="step__number-wrapper">
            <div class="step__number">{{ index + 1 }}</div>
          </div>
          <div class="step__visual">
            <div class="step__icon-wrapper">
              <div class="step__icon-bg"></div>
              <div class="step__icon">
                <span v-if="index === 0" class="step__emoji">🍽️</span>
                <span v-if="index === 1" class="step__emoji">📋</span>
                <span v-if="index === 2" class="step__emoji">🚚</span>
              </div>
            </div>
            <div class="step__animation-circle"></div>
          </div>
          <div class="step__content">
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__description">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <div class="how-it-works__action">
        <router-link to="/restaurants" class="how-it-works__button" style="text-decoration: none;">
          Comienza Ahora
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Encuentra Restaurantes',
    description: 'Descubre los mejores restaurantes cercanos con nuestro amplio catálogo de opciones'
  },
  {
    title: 'Elige tus Platillos',
    description: 'Personaliza tu pedido y paga de forma segura con múltiples opciones de pago'
  },
  {
    title: 'Entrega Rápida',
    description: 'Rastrea tu pedido en tiempo real y disfruta de comida deliciosa entregada a tu puerta'
  }
]
</script>

<style lang="scss" scoped>
.how-it-works {
  padding: 7rem 0;
  background: linear-gradient(to bottom, #ffffff, #f1f5f9);
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(#FF416C, 0.03), rgba(#FF4B2B, 0.03));
    z-index: 0;
    filter: blur(60px);
  }

  &::before {
    top: -300px;
    left: -200px;
  }

  &::after {
    bottom: -300px;
    right: -200px;
    background: linear-gradient(135deg, rgba(#0652DD, 0.03), rgba(#12CBC4, 0.03));
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  &__heading {
    text-align: center;
    max-width: 650px;
    margin: 0 auto 5rem;
  }

  &__title {
    font-size: 2.75rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #0652DD, #12CBC4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 40%;
      height: 4px;
      background: linear-gradient(to right, #0652DD, #12CBC4);
      margin: 0.8rem auto 0;
      border-radius: 4px;
    }
  }

  &__description {
    color: #64748b;
    font-size: 1.2rem;
    max-width: 550px;
    margin: 0 auto;
  }

  &__action {
    margin-top: 4rem;
    text-align: center;
  }

  &__button {
    background: linear-gradient(to right, #0652DD, #12CBC4);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 10px 25px rgba(6, 82, 221, 0.25);
    transition: all 0.3s ease;

    svg {
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(6, 82, 221, 0.35);

      svg {
        transform: translateX(4px);
      }
    }
  }
}

.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  &__connection {
    position: absolute;
    top: 100px;
    left: 10%;
    right: 10%;
    height: 4px;
    background: linear-gradient(to right, #0652DD, #12CBC4, #FF416C);
    z-index: 0;
    border-radius: 2px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #12CBC4;
      transform: translateY(-50%);
    }

    &::before {
      left: 33%;
    }

    &::after {
      left: 66%;
    }

    @media (max-width: 992px) {
      display: none;
    }
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
}

.step__emoji {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;

  &:hover {
    .step__icon {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(#0652DD, 0.25);

      svg {
        transform: scale(1.1);
      }
    }

    .step__animation-circle {
      opacity: 1;
      transform: scale(1);
    }

    .step__number {
      transform: scale(1.1);
    }
  }

  &__number-wrapper {
    position: relative;
    margin-bottom: 2rem;
  }

  &__number {
    position: relative;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    z-index: 3;
    box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
    transition: transform 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(#FF416C, 0.2), rgba(#FF4B2B, 0.2));
      z-index: -1;
    }

    .step:nth-child(2) & {
      background: linear-gradient(135deg, #12CBC4, #0652DD);
      box-shadow: 0 5px 15px rgba(#12CBC4, 0.3);

      &::before {
        background: linear-gradient(135deg, rgba(#12CBC4, 0.2), rgba(#0652DD, 0.2));
      }
    }

    .step:nth-child(3) & {
      background: linear-gradient(135deg, #FFA502, #FF6B2B);
      box-shadow: 0 5px 15px rgba(#FFA502, 0.3);

      &::before {
        background: linear-gradient(135deg, rgba(#FFA502, 0.2), rgba(#FF6B2B, 0.2));
      }
    }
  }

  &__visual {
    position: relative;
    margin-bottom: 2rem;
  }

  &__animation-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(#FF416C, 0.03), rgba(#FF4B2B, 0.03));
    z-index: -1;
    opacity: 0;
    transition: all 0.5s ease;

    .step:nth-child(2) & {
      background: linear-gradient(135deg, rgba(#12CBC4, 0.03), rgba(#0652DD, 0.03));
    }

    .step:nth-child(3) & {
      background: linear-gradient(135deg, rgba(#FFA502, 0.03), rgba(#FF6B2B, 0.03));
    }
  }

  &__icon-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon-bg {
    position: absolute;
    inset: 0;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    opacity: 0.1;
    animation: morphing 10s infinite alternate ease-in-out;

    .step:nth-child(2) & {
      background: linear-gradient(135deg, #12CBC4, #0652DD);
      animation-delay: 2s;
    }

    .step:nth-child(3) & {
      background: linear-gradient(135deg, #FFA502, #FF6B2B);
      animation-delay: 4s;
    }
  }

  &__icon {
    width: 100px;
    height: 100px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 2;
    transition: all 0.4s ease;

    svg {
      transition: all 0.4s ease;
      color: #FF416C;
    }

    .step:nth-child(2) & svg {
      color: #0652DD;
    }

    .step:nth-child(3) & svg {
      color: #FFA502;
    }
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1e293b;

    .step:nth-child(1) & {
      color: #FF416C;
    }

    .step:nth-child(2) & {
      color: #0652DD;
    }

    .step:nth-child(3) & {
      color: #FFA502;
    }
  }

  &__description {
    color: #64748b;
    line-height: 1.7;
    font-size: 1.05rem;
  }
}

@keyframes morphing {
  0% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }

  25% {
    border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
  }

  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
  }

  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
  }

  100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 5rem 0;

    &__title {
      font-size: 2.25rem;
    }

    &__description {
      font-size: 1.1rem;
    }
  }

  .step {
    padding: 1.5rem;

    &__icon {
      width: 90px;
      height: 90px;
    }
  }
}
</style>
