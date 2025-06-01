<template>
  <div class="faq-page">
    <header class="faq-page-header">
      <div class="container">
        <h1 class="faq-page-title">Preguntas Frecuentes</h1>
        <p class="faq-page-subtitle">Encuentra respuestas rápidas a las consultas más comunes de nuestros usuarios.</p>
      </div>
    </header>

    <main class="faq-main-content">
      <div class="container">
        <div v-if="topFaqs.length > 0" class="faq-list-condensed">
          <div v-for="faq in topFaqs" :key="faq.id" class="faq-item-condensed">
            <button @click="toggleFaq(faq)" class="faq-question-condensed" :aria-expanded="faq.isOpen">
              <span>{{ faq.question }}</span>
              <span class="faq-toggle-icon-condensed" :class="{ 'is-open': faq.isOpen }">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </button>
            <transition name="faq-answer-transition">
              <div v-show="faq.isOpen" class="faq-answer-condensed">
                <p v-html="faq.answer"></p>
              </div>
            </transition>
          </div>
        </div>
        <div v-else class="no-faqs-message">
          <p>No hay preguntas frecuentes disponibles en este momento.</p>
        </div>

        <section class="more-help-section">
          <h3>¿No encontraste lo que buscabas?</h3>
          <p>Visita nuestro Centro de Ayuda completo para más información o ponte en contacto con nosotros.</p>
          <div class="more-help-actions">
            <router-link :to="{ name: 'help-center' }" class="cta-button-outline">Visitar Centro de Ayuda</router-link>
            <router-link :to="{ name: 'contact' }" class="cta-button">Contactar Ahora</router-link>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { faqsData, type FaqItem } from '@/data/helpCenterFaqs';

const topFaqs = ref<FaqItem[]>([]);

const mostFrequentIds: number[] = [1, 4, 9, 2, 11, 3, 13]; // IDs de las preguntas más comunes

onMounted(() => {
  topFaqs.value = faqsData
    .filter(faq => mostFrequentIds.includes(faq.id))
    .map(faq => ({ ...faq, isOpen: false }))
    .sort((a, b) => mostFrequentIds.indexOf(a.id) - mostFrequentIds.indexOf(b.id)); // Ordenar según mostFrequentIds
});

const toggleFaq = (faqItem: FaqItem) => {
  faqItem.isOpen = !faqItem.isOpen;
};
</script>

<style lang="scss" scoped>
.faq-page {
  background-color: var(--background-light, #f8f9fa);
  min-height: 100vh;
  padding-bottom: 4rem;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.faq-page-header {
  padding: 2.5rem 0;
  background-color: var(--white, #fff);
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color-light, #eee);

  @media (min-width: 768px) {
    padding: 3rem 0;
    margin-bottom: 3rem;
  }
}

.faq-page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-dark, #212529);
  margin: 0 0 0.5rem 0;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.faq-page-subtitle {
  font-size: 1rem;
  color: var(--secondary, #5a5a5a);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
}

.faq-list-condensed {
  background-color: var(--white, #ffffff);
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08));
  overflow: hidden;
}

.faq-item-condensed {
  border-bottom: 1px solid var(--border-color-light, #eee);
  &:last-child {
    border-bottom: none;
  }
}

.faq-question-condensed {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-dark, #333);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: var(--background-alt, #f8f9fa);
  }
}

.faq-toggle-icon-condensed {
  transition: transform 0.3s ease-in-out;
  color: var(--medium, #757575);
  display: flex;
  align-items: center;

  &.is-open {
    transform: rotate(180deg);
    color: var(--primary, #FF416C);
  }
}

.faq-answer-condensed {
  padding: 0 1.5rem 1.25rem 1.5rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--dark-medium, #555);
  background-color: var(--background-alt, #f8f9fa);
  overflow: hidden;
  p {
    margin: 0;
  }
}

.faq-answer-transition-enter-active,
.faq-answer-transition-leave-active {
  transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, padding-top 0.35s ease-in-out, padding-bottom 0.35s ease-in-out;
  max-height: 300px;
  opacity: 1;
  padding-top: 1rem;
  padding-bottom: 1.25rem;
}
.faq-answer-transition-enter-from,
.faq-answer-transition-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top:0;
  margin-bottom:0;
}

.no-faqs-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: var(--secondary, #5a5a5a);
}

.more-help-section {
  margin-top: 3rem;
  text-align: center;
  padding: 2rem;
  background-color: var(--white, #ffffff);
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06));

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text-dark, #212529);
    margin: 0 0 0.75rem 0;
  }
  p {
    font-size: 1rem;
    color: var(--secondary, #5a5a5a);
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }
}

.more-help-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: center;
  }
}

.cta-button, .cta-button-outline {
  padding: 0.8rem 1.8rem;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: var(--border-radius-md, 8px);
  font-weight: 600;
  display: inline-block;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid transparent;
  min-width: 200px;
}

.cta-button {
  background: var(--primary, #FF416C);
  color: var(--white, #ffffff);
  border-color: var(--primary, #FF416C);
  &:hover {
    background-color: var(--primary-dark, darken(#FF416C, 10%));
    border-color: var(--primary-dark, darken(#FF416C, 10%));
    transform: translateY(-2px);
  }
}

.cta-button-outline {
  background-color: transparent;
  color: var(--primary, #FF416C);
  border-color: var(--primary, #FF416C);
  &:hover {
    background-color: rgba(var(--primary-rgb, 255,65,108), 0.08);
    color: var(--primary-dark, darken(#FF416C, 10%));
    border-color: var(--primary-dark, darken(#FF416C, 10%));
    transform: translateY(-2px);
  }
}

</style>
