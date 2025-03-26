<!-- components/feature/home/HeroSection.vue -->
<template>
    <section class="hero">
        <div class="hero__container">
            <!-- Animated background elements -->
            <div class="hero__animated-bg">
                <div class="hero__food-icon hero__food-icon--1">🍕</div>
                <div class="hero__food-icon hero__food-icon--2">🍔</div>
                <div class="hero__food-icon hero__food-icon--3">🍣</div>
                <div class="hero__food-icon hero__food-icon--4">🌮</div>
                <div class="hero__food-icon hero__food-icon--5">🥗</div>
                <div class="hero__food-icon hero__food-icon--6">🍦</div>
                <div class="hero__food-icon hero__food-icon--7">🍜</div>
            </div>

            <div class="hero__content">
                <h1 class="hero__title">Deliciosa comida.<br /><span class="hero__title-highlight">Entrega
                        rápida.</span></h1>
                <p class="hero__subtitle">Descubre los mejores restaurantes locales y recibe tu comida favorita en
                    minutos</p>

                <div class="hero__search-container">
                    <div class="hero__search">
                        <div class="hero__search-input-wrapper">
                            <svg class="hero__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <input v-model="address" type="text" class="hero__search-input"
                                placeholder="Ingresa tu dirección de entrega" />
                        </div>
                        <button class="hero__search-button">
                            <span>Buscar</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="hero__badges">
                    <div class="hero__badge">
                        <div class="hero__badge-icon">⭐</div>
                        <span class="hero__badge-text">4.8 Rating</span>
                    </div>
                    <div class="hero__badge">
                        <div class="hero__badge-icon">⚡</div>
                        <span class="hero__badge-text">Entrega en 30 min</span>
                    </div>
                    <div class="hero__badge">
                        <div class="hero__badge-icon">↩️</div>
                        <span class="hero__badge-text">Devoluciones sencillas</span>
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
                    d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,176C560,181,640,171,720,144C800,117,880,75,960,69.3C1040,64,1120,96,1200,117.3C1280,139,1360,149,1400,154.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
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
    padding: 9rem 2rem 10rem;
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
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: center;

        @media (max-width: 992px) {
            grid-template-columns: 1fr;
        }
    }

    &__content {
        max-width: 600px;
        z-index: 5;
    }

    &__title {
        font-size: 3.5rem;
        font-weight: 800;
        color: white;
        margin: 0 0 1.5rem;
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
                height: 8px;
                width: 100%;
                bottom: -4px;
                left: 0;
                background: linear-gradient(to right, #FFC837, #FF8008);
                border-radius: 4px;
                opacity: 0.5;
            }
        }

        @media (max-width: 768px) {
            font-size: 2.8rem;
        }

        @media (max-width: 480px) {
            font-size: 2.4rem;
        }
    }

    &__subtitle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin: 0 0 2.5rem;
        max-width: 500px;
    }

    &__search-container {
        position: relative;
        margin-bottom: 2.5rem;
    }

    &__search {
        display: flex;
        max-width: 600px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        background: white;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover,
        &:focus-within {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }
    }

    &__search-input-wrapper {
        flex: 1;
        position: relative;
        background: white;
    }

    &__search-icon {
        position: absolute;
        left: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: #FF416C;
    }

    &__search-input {
        width: 100%;
        border: none;
        outline: none;
        padding: 1.4rem 1.5rem 1.4rem 3.5rem;
        font-size: 1.1rem;
        font-weight: 500;

        &::placeholder {
            color: #aaa;
            font-weight: 400;
        }
    }

    &__search-button {
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        color: white;
        border: none;
        padding: 0 2rem;
        font-weight: 600;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
            background: linear-gradient(to right, darken(#FF416C, 5%), darken(#FF4B2B, 5%));
        }

        svg {
            transition: transform 0.3s ease;
        }

        &:hover svg {
            transform: translateX(3px);
        }
    }

    &__badges {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    &__badge {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50px;
        padding: 0.7rem 1.2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease;

        &:hover {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.25);
        }

        &-icon {
            margin-right: 0.6rem;
            font-size: 1.2rem;
        }

        &-text {
            font-weight: 500;
            color: white;
            font-size: 0.95rem;
        }
    }

    &__image-container {
        position: relative;

        @media (max-width: 992px) {
            display: none;
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
        bottom: 0;
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
        z-index: 1;
    }

    &__food-icon {
        position: absolute;
        font-size: 2rem;
        opacity: 0.25;
        animation: float 10s infinite ease-in-out;

        &--1 {
            top: 20%;
            left: 10%;
            font-size: 3rem;
            animation-delay: 0s;
        }

        &--2 {
            top: 70%;
            left: 20%;
            font-size: 2.5rem;
            animation-delay: 1s;
        }

        &--3 {
            top: 30%;
            left: 75%;
            font-size: 2.8rem;
            animation-delay: 2s;
        }

        &--4 {
            top: 80%;
            left: 85%;
            font-size: 2.2rem;
            animation-delay: 3s;
        }

        &--5 {
            top: 10%;
            left: 45%;
            font-size: 2.4rem;
            animation-delay: 4s;
        }

        &--6 {
            top: 35%;
            left: 90%;
            font-size: 2rem;
            animation-delay: 5s;
        }

        &--7 {
            top: 60%;
            left: 50%;
            font-size: 2.6rem;
            animation-delay: 6s;
        }
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

@media (max-width: 768px) {
    .hero {
        padding: 7rem 1.5rem 9rem;

        &__search {
            flex-direction: column;
        }

        &__search-button {
            padding: 1rem;
            justify-content: center;
        }
    }
}
</style>
