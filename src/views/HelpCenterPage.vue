<template>
  <div class="help-center-page">
    <header class="help-center-header">
      <div class="container">
        <h1 class="help-center-title">Centro de Ayuda</h1>
        <p class="help-center-subtitle">¿Tienes preguntas? Estamos aquí para ayudarte. Encuentra respuestas rápidas a continuación.</p>
        <div class="search-bar-wrapper">
          <input
            type="search"
            v-model="searchTerm"
            placeholder="Busca ayuda (ej: 'cancelar pedido', 'métodos de pago')"
            class="search-input"
            aria-label="Buscar en el centro de ayuda"
          />
          <span class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
        </div>
      </div>
    </header>

    <main class="help-main-content">
      <div class="container">
        <div v-if="filteredFaqs.length === 0 && searchTerm" class="no-results">
          <p>No hemos encontrado resultados para "<strong>{{ searchTerm }}</strong>".</p>
          <p>Intenta con otras palabras clave o explora nuestras categorías.</p>
        </div>

        <div v-for="category in faqCategories" :key="category.id" class="faq-category-section">
          <div v-if="faqsByCategory(category.id).length > 0">
            <h2 class="category-title">
              <span class="category-icon" v-if="category.icon">{{ category.icon }}</span>
              {{ category.name }}
            </h2>
            <ul class="faq-list">
              <li v-for="faq in faqsByCategory(category.id)" :key="faq.id" class="faq-item">
                <button @click="toggleFaq(faq)" class="faq-question" :aria-expanded="faq.isOpen">
                  <span>{{ faq.question }}</span>
                  <span class="faq-toggle-icon" :class="{ 'is-open': faq.isOpen }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </button>
                <transition name="faq-answer-transition">
                  <div v-show="faq.isOpen" class="faq-answer">
                    <p v-html="faq.answer"></p>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>

        <section class="still-need-help">
          <h3>¿Aún necesitas ayuda?</h3>
          <p>Si no encontraste la respuesta a tu pregunta, nuestro equipo de soporte está listo para asistirte.</p>
          <router-link :to="{ name: 'contact' }" class="cta-button contact-support-btn">
            Contactar con Soporte
          </router-link>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { faqCategories, faqsData, type FaqItem, type FaqCategory } from '@/data/helpCenterFaqs';

const searchTerm = ref('');
const allFaqs = ref<FaqItem[]>([]);

onMounted(() => {
  allFaqs.value = faqsData.map(faq => ({ ...faq, isOpen: false }));
});

const normalizeText = (text: string) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const filteredFaqs = computed(() => {
  if (!searchTerm.value.trim()) {
    return allFaqs.value;
  }
  const normalizedSearchTerm = normalizeText(searchTerm.value);
  return allFaqs.value.filter(faq =>
    normalizeText(faq.question).includes(normalizedSearchTerm) ||
    normalizeText(faq.answer).includes(normalizedSearchTerm) ||
    faq.keywords.some(keyword => normalizeText(keyword).includes(normalizedSearchTerm))
  );
});

const faqsByCategory = (categoryId: string) => {
  return filteredFaqs.value.filter(faq => faq.category === categoryId);
};

const toggleFaq = (faqItem: FaqItem) => {
  faqItem.isOpen = !faqItem.isOpen;
};
</script>

<style lang="scss" scoped>
.help-center-page {
  background-color: var(--background-alt, #f8f9fa);
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.help-center-header {
  background: var(--primary-gradient, linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%));
  color: var(--white, #ffffff);
  padding: 2.5rem 0 3.5rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 3rem 0 4rem;
  }
}

.help-center-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.help-center-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 1.5rem auto;

  @media (min-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
}

.search-bar-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.9rem 1.25rem 0.9rem 3rem;
  font-size: 1rem;
  border-radius: 50px;
  border: 1px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: 0 4px 15px rgba(var(--primary-rgb, 255,65,108), 0.3), 0 0 0 2px rgba(var(--primary-rgb, 255,65,108), 0.5);
  }
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--medium, #757575);
  pointer-events: none;
}

.help-main-content {
  padding: 2rem 0 3rem;
  @media (min-width: 768px) {
    padding: 3rem 0 4rem;
  }
}

.no-results {
  text-align: center;
  padding: 2rem;
  margin: 1rem auto;
  background-color: var(--white, #fff);
  border-radius: var(--border-radius-md, 8px);
  box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.05));
  color: var(--dark-medium, #555);
  p {
    margin-bottom: 0.5rem;
  }
}

.faq-category-section {
  margin-bottom: 2.5rem;
  background-color: var(--white, #ffffff);
  padding: 1.5rem;
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08));

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark, #333);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.category-icon {
  font-size: 1.5rem;
}

.faq-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.faq-item {
  border-bottom: 1px solid var(--border-color-light, #eee);
  &:last-child {
    border-bottom: none;
  }
}

.faq-question {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-gray, #444);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary, #FF416C);
  }

  @media (min-width: 768px) {
    font-size: 1.05rem;
    padding: 1.25rem 0;
  }
}

.faq-toggle-icon {
  transition: transform 0.3s ease-in-out;
  color: var(--medium, #757575);
  display: flex;
  align-items: center;

  &.is-open {
    transform: rotate(180deg);
    color: var(--primary, #FF416C);
  }
}

.faq-answer {
  padding: 0 0 1.25rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--dark-medium, #555);
  overflow: hidden;
  p {
    margin: 0;
  }
}

.faq-answer-transition-enter-active,
.faq-answer-transition-leave-active {
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out 0.1s;
  max-height: 500px; // Ajusta si tus respuestas son más largas
  opacity: 1;
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


.still-need-help {
  margin-top: 3rem;
  text-align: center;
  padding: 2rem;
  background-color: var(--white, #ffffff);
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08));

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--dark, #333);
    margin: 0 0 0.75rem 0;
  }
  p {
    font-size: 1rem;
    color: var(--medium, #757575);
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
}

.cta-button.contact-support-btn {
  background: var(--primary, #FF416C);
  color: var(--white, #ffffff);
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  text-decoration: none;
  border-radius: var(--border-radius-md, 8px);
  font-weight: 600;
  display: inline-block;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border: none;

  &:hover {
    background-color: var(--primary-dark, darken(#FF416C, 10%));
    transform: translateY(-2px);
  }
}
</style>
