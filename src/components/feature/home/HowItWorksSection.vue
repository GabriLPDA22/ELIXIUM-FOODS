<!-- components/feature/home/HowItWorksSection.vue -->
<template>
    <section class="how-it-works">
        <div class="container">
            <h2 class="section-title">How It Works</h2>

            <div class="steps">
                <div class="step" v-for="(step, index) in steps" :key="index">
                    <div class="step__number">{{ index + 1 }}</div>
                    <div class="step__icon-wrapper">
                        <div class="step__icon">
                            <component :is="step.icon" />
                        </div>
                    </div>
                    <h3 class="step__title">{{ step.title }}</h3>
                    <p class="step__description">{{ step.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Iconos SVG como componentes Vue
const RestaurantIcon = {
    template: `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/>
      <path d="M12 11h.01"/>
      <circle cx="12" cy="11" r="1" />
      <path d="M12 12v4" />
      <line x1="7" y1="7" x2="17" y2="7" />
    </svg>
  `
}

const OrderIcon = {
    template: `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="15" y2="17"/>
      <line x1="9" y1="9" x2="10" y2="9"/>
    </svg>
  `
}

const DeliveryIcon = {
    template: `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  `
}

const steps = [
    {
        title: 'Choose a Restaurant',
        description: 'Browse through a variety of restaurants near you and select your favorite',
        icon: RestaurantIcon
    },
    {
        title: 'Place Your Order',
        description: 'Customize your meal and checkout securely with multiple payment options',
        icon: OrderIcon
    },
    {
        title: 'Fast Delivery',
        description: 'Track your order in real-time and enjoy delicious food delivered to your door',
        icon: DeliveryIcon
    }
]
</script>

<style lang="scss" scoped>
.how-it-works {
    padding: 6rem 0;
    background-color: #f9f9f9;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image:
            radial-gradient(circle at 10% 10%, rgba(255, 107, 107, 0.03) 0%, transparent 300px),
            radial-gradient(circle at 90% 90%, rgba(255, 142, 83, 0.03) 0%, transparent 300px);
        pointer-events: none;
    }
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 4rem;
    position: relative;

    &::after {
        content: '';
        display: block;
        width: 80px;
        height: 4px;
        background: linear-gradient(to right, #FF6B6B, #FF8E53);
        margin: 1rem auto 0;
        border-radius: 4px;
    }
}

.steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2.5rem;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 120px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, #f0f0f0, #ddd, #f0f0f0);
        z-index: -1;
        display: none;

        @media (min-width: 992px) {
            display: block;
        }
    }
}

.step {
    position: relative;
    text-align: center;
    padding: 2rem;
    transition: transform 0.3s;

    &:hover {
        transform: translateY(-10px);

        .step__icon {
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            color: white;
            transform: scale(1.1);
        }
    }

    &__number {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        z-index: 2;
    }

    &__icon-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    &__icon {
        width: 120px;
        height: 120px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        color: #FF6B6B;
        transition: all 0.3s;
    }

    &__title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #333;
    }

    &__description {
        color: #666;
        line-height: 1.6;
    }
}

@media (max-width: 768px) {
    .section-title {
        font-size: 2rem;
    }
}
</style>