<template>
  <div class="careers-page">
    <section class="hero-section-careers">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1 class="hero-title-careers">Tu Talento, Nuestro Ingrediente Secreto</h1>
        <p class="hero-subtitle-careers">Únete a Elixium Foods y ayúdanos a redefinir la experiencia gastronómica a
          domicilio. Buscamos personas apasionadas, creativas y con ganas de cambiar el mundo, bocado a bocado.</p>
        <a href="#job-openings-section" class="cta-button hero-cta-careers">Ver Ofertas de Empleo</a>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title">¿Por Qué Elixium Foods?</h2>
        <p class="section-subtitle">Somos más que una empresa de delivery, somos una comunidad que valora:</p>
        <div class="values-grid">
          <div v-for="value in companyValuesData" :key="value.title" class="value-card">
            <div class="value-icon">{{ value.icon }}</div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="departments-section">
      <div class="container">
        <h2 class="section-title">Áreas Donde Puedes Brillar</h2>
        <div class="departments-grid">
          <div class="department-item tech"><span>Tecnología</span></div>
          <div class="department-item marketing"><span>Marketing</span></div>
          <div class="department-item operations"><span>Operaciones</span></div>
          <div class="department-item product"><span>Producto y Diseño</span></div>
          <div class="department-item sales"><span>Comercial</span></div>
          <div class="department-item support"><span>Soporte</span></div>
        </div>
      </div>
    </section>

    <section id="job-openings-section" class="job-openings-section">
      <div class="container">
        <h2 class="section-title">Únete a la Aventura: Ofertas Actuales</h2>
        <div v-if="paginatedJobs.length > 0" class="job-list">
          <div v-for="job in paginatedJobs" :key="job.id" class="job-card">
            <div class="job-card-header">
              <h3 class="job-title">{{ job.title }}</h3>
              <span class="job-department-tag">{{ job.department }}</span>
            </div>
            <div class="job-meta">
              <span class="job-location">📍 {{ job.location }}</span>
              <span class="job-type">🕒 {{ job.type }}</span>
            </div>
            <p class="job-short-description">{{ job.shortDescription }}</p>
            <div class="job-card-footer">
              <button @click="showJobDetails(job)" class="cta-button-outline job-details-btn">Ver Detalles</button>
            </div>
          </div>
        </div>
        <div v-else-if="allJobs.length > 0 && paginatedJobs.length === 0" class="no-jobs">
          <p>No hay más ofertas en esta página. Prueba en la página anterior.</p>
        </div>
        <div v-else class="no-jobs">
          <p>Actualmente no tenemos vacantes abiertas, ¡pero siempre estamos buscando talento! Envíanos tu CV a <a
              href="mailto:talento@elixiumfoods.com">talento@elixiumfoods.com</a>.</p>
        </div>

        <div v-if="totalPages > 1" class="pagination-controls">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn prev-btn">
            Anterior
          </button>
          <span v-for="pageNumber in pageNumbers" :key="pageNumber">
            <button v-if="pageNumber !== '...'" @click="changePage(pageNumber as number)"
              :class="['pagination-btn', { active: currentPage === pageNumber }]">
              {{ pageNumber }}
            </button>
            <span v-else class="pagination-ellipsis">...</span>
          </span>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="pagination-btn next-btn">
            Siguiente
          </button>
        </div>
      </div>
    </section>

    <div v-if="selectedJob" class="job-modal-overlay" @click.self="closeJobDetails">
      <div class="job-modal-content">
        <button class="modal-close-btn" @click="closeJobDetails">&times;</button>

        <div v-if="!showApplicationForm && !applicationSubmittedMessage">
          <h2 class="modal-job-title">{{ selectedJob.title }}</h2>
          <span class="modal-job-department">{{ selectedJob.department }}</span>
          <div class="modal-job-meta">
            <span>📍 {{ selectedJob.location }}</span>
            <span>🕒 {{ selectedJob.type }}</span>
          </div>
          <div class="modal-section">
            <h4>Descripción del Puesto:</h4>
            <p>{{ selectedJob.shortDescription }}</p>
          </div>
          <div v-if="selectedJob.responsibilities && selectedJob.responsibilities.length" class="modal-section">
            <h4>Responsabilidades Clave:</h4>
            <ul>
              <li v-for="resp in selectedJob.responsibilities" :key="resp">{{ resp }}</li>
            </ul>
          </div>
          <div v-if="selectedJob.qualifications && selectedJob.qualifications.length" class="modal-section">
            <h4>Qué Buscamos en Ti:</h4>
            <ul>
              <li v-for="qual in selectedJob.qualifications" :key="qual">{{ qual }}</li>
            </ul>
          </div>
          <button @click="handleApplyClick" class="cta-button job-apply-btn modal-apply-btn">Aplicar a esta
            oferta</button>
        </div>

        <div v-if="showApplicationForm && !applicationSubmittedMessage" class="application-form-section">
          <h3 class="application-form-title">Aplicar para: {{ selectedJob.title }}</h3>
          <form @submit.prevent="submitApplication">
            <div class="form-group-modal">
              <label for="applicantName">Nombre Completo <span class="required">*</span></label>
              <input type="text" id="applicantName" v-model="applicantName" required class="form-input-modal">
            </div>
            <div class="form-group-modal">
              <label for="applicantEmail">Email <span class="required">*</span></label>
              <input type="email" id="applicantEmail" v-model="applicantEmail" required class="form-input-modal">
            </div>
            <div class="form-group-modal">
              <label for="applicantCoverLetter">Carta de Presentación (Opcional)</label>
              <textarea id="applicantCoverLetter" v-model="applicantCoverLetter" rows="4"
                class="form-textarea-modal"></textarea>
            </div>
            <div class="form-group-modal">
              <label for="applicantCV">Adjuntar CV (PDF, DOCX) <span class="required">*</span></label>
              <input type="file" id="applicantCV" @change="handleCVUpload" accept=".pdf,.doc,.docx" required
                class="form-input-file-modal">
              <span v-if="applicantCVFile" class="file-name-display">{{ applicantCVFile.name }}</span>
            </div>
            <button type="submit" class="cta-button submit-application-btn">Enviar Solicitud</button>
            <button type="button" @click="cancelApplication"
              class="cta-button-outline cancel-application-btn">Cancelar</button>
          </form>
        </div>

        <div v-if="applicationSubmittedMessage" class="application-success-message">
          <div class="success-icon-inline">🎉</div>
          <h3>¡Solicitud Enviada!</h3>
          <p>{{ applicationSubmittedMessage }}</p>
          <button @click="closeJobDetails" class="cta-button">Cerrar</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { jobOpenings, companyValues as companyValuesData, type JobOpening } from '@/data/careersData';

const allJobs = ref<JobOpening[]>([]);
const selectedJob = ref<JobOpening | null>(null);

const showApplicationForm = ref(false);
const applicantName = ref('');
const applicantEmail = ref('');
const applicantCoverLetter = ref('');
const applicantCVFile = ref<File | null>(null);
const applicationSubmittedMessage = ref('');

const currentPage = ref(1);
const itemsPerPage = ref(5);

onMounted(() => {
  allJobs.value = jobOpenings;
});

const totalPages = computed(() => Math.ceil(allJobs.value.length / itemsPerPage.value));
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allJobs.value.slice(start, end);
});

const pageNumbers = computed(() => {
  const delta = 2;
  const left = currentPage.value - delta;
  const right = currentPage.value + delta + 1;
  const range = [];
  const rangeWithDots = [];

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= left && i < right)) {
      range.push(i);
    }
  }

  let l;
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    const jobSection = document.getElementById('job-openings-section');
    if (jobSection) {
      jobSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const showJobDetails = (job: JobOpening) => {
  selectedJob.value = job;
  showApplicationForm.value = false;
  applicationSubmittedMessage.value = '';
  document.body.style.overflow = 'hidden';
};

const closeJobDetails = () => {
  selectedJob.value = null;
  showApplicationForm.value = false;
  applicationSubmittedMessage.value = '';
  applicantName.value = '';
  applicantEmail.value = '';
  applicantCoverLetter.value = '';
  applicantCVFile.value = null;
  document.body.style.overflow = '';
};

const handleApplyClick = () => {
  showApplicationForm.value = true;
};

const cancelApplication = () => {
  showApplicationForm.value = false;
  applicantName.value = '';
  applicantEmail.value = '';
  applicantCoverLetter.value = '';
  applicantCVFile.value = null;
};

const handleCVUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    applicantCVFile.value = target.files[0];
  } else {
    applicantCVFile.value = null;
  }
};

const submitApplication = () => {
  if (!applicantName.value || !applicantEmail.value || !applicantCVFile.value) {
    alert('Por favor, completa todos los campos obligatorios (Nombre, Email y CV).');
    return;
  }
  console.log('Solicitud enviada:', {
    jobId: selectedJob.value?.id,
    jobTitle: selectedJob.value?.title,
    name: applicantName.value,
    email: applicantEmail.value,
    coverLetter: applicantCoverLetter.value,
    cv: applicantCVFile.value?.name
  });

  applicationSubmittedMessage.value = `Tu solicitud para "${selectedJob.value?.title}" ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.`;
  showApplicationForm.value = false;
};
</script>

<style lang="scss" scoped>
// --- Estilos Base y Hero (sin cambios significativos, ya eran buenos) ---
.careers-page {
  background-color: var(--background-light, #f8f9fa);
  color: var(--text-dark, #212529);
}

.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 1.5rem;
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text-dark, #212529);
  position: relative;
  padding-bottom: 0.75rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 4px;
    background: var(--primary-gradient, linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%));
    border-radius: 2px;
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
  }
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: var(--secondary, #5a5a5a);
  max-width: 700px;
  margin: -1rem auto 2.5rem auto;
  line-height: 1.6;

  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }
}

.hero-section-careers {
  position: relative;
  height: 70vh;
  min-height: 450px;
  background-image: url('https://picsum.photos/seed/teamculture/1600/900');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-light, #f8f9fa);
  padding: 2rem 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title-careers {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
}

.hero-subtitle-careers {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 2rem auto;
  line-height: 1.7;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
}

.cta-button {
  display: inline-block;
  background: var(--primary-gradient, linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%));
  color: var(--white, #ffffff) !important;
  padding: 0.9rem 2.2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb, 255, 65, 108), 0.3);
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 6px 20px rgba(var(--primary-rgb, 255, 65, 108), 0.4);
  }

  @media (min-width: 768px) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
}

.cta-button-outline {
  background: transparent;
  color: var(--primary, #FF416C) !important;
  border: 2px solid var(--primary, #FF416C);
  padding: 0.9rem 2.2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: none;
  cursor: pointer;

  &:hover {
    background: rgba(var(--primary-rgb, 255, 65, 108), 0.05);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(var(--primary-rgb, 255, 65, 108), 0.1);
  }

  @media (min-width: 768px) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
}


// --- Values Section (sin cambios) ---
.values-section {
  padding: 3rem 0;
  background-color: var(--white, #ffffff);

  @media (min-width: 768px) {
    padding: 4rem 0;
  }
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.value-card {
  background-color: var(--background-light, #f8f9fa);
  padding: 2rem 1.5rem;
  border-radius: var(--border-radius-lg, 12px);
  text-align: center;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.07));
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg, 0 8px 20px rgba(0, 0, 0, 0.1));
  }
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.value-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark, #212529);
  margin-bottom: 0.5rem;
}

.value-description {
  font-size: 0.95rem;
  color: var(--secondary, #5a5a5a);
  line-height: 1.6;
}

// --- Departments Section (sin cambios) ---
.departments-section {
  padding: 3rem 0;

  @media (min-width: 768px) {
    padding: 4rem 0;
  }
}

.departments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.department-item {
  padding: 2.5rem 1rem;
  border-radius: var(--border-radius-md, 8px);
  color: var(--white, #fff);
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.1));

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: scale(1.05);
  }

  &.tech {
    background-image: url('https://picsum.photos/seed/devteam/400/300');
  }

  &.marketing {
    background-image: url('https://picsum.photos/seed/marketingteam/400/300');
  }

  &.operations {
    background-image: url('https://picsum.photos/seed/logisticsteam/400/300');
  }

  &.product {
    background-image: url('https://picsum.photos/seed/designteam/400/300');
  }

  &.sales {
    background-image: url('https://picsum.photos/seed/salesteam/400/300');
  }

  &.support {
    background-image: url('https://picsum.photos/seed/supportteam/400/300');
  }
}

// --- Job Openings Section (actualizado con paginación) ---
.job-openings-section {
  padding: 3rem 0;
  background-color: var(--white, #ffffff);

  @media (min-width: 768px) {
    padding: 4rem 0;
  }
}

.job-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.job-card {
  background-color: var(--background-light, #f8f9fa);
  padding: 1.5rem;
  border-radius: var(--border-radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.07));
  transition: box-shadow 0.3s ease, border-left-color 0.3s ease;
  border-left: 5px solid transparent;

  &:hover {
    box-shadow: var(--shadow-lg, 0 8px 20px rgba(0, 0, 0, 0.1));
    border-left-color: var(--primary, #FF416C);
  }
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark, #212529);
  margin: 0;
}

.job-department-tag {
  background-color: rgba(var(--primary-rgb, 255, 65, 108), 0.1);
  color: var(--primary, #FF416C);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--secondary, #5a5a5a);
  margin-bottom: 1rem;
}

.job-short-description {
  font-size: 0.95rem;
  color: var(--text-dark, #313539);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.job-card-footer {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.job-details-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
}

.no-jobs {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: var(--secondary, #5a5a5a);

  a {
    color: var(--primary, #FF416C);
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.pagination-btn {
  background-color: var(--white, #fff);
  border: 1px solid var(--border-color, #ddd);
  color: var(--primary, #FF416C);
  padding: 0.5rem 0.9rem;
  border-radius: var(--border-radius-md, 8px);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    background-color: rgba(var(--primary-rgb, 255, 65, 108), 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.active {
    background-color: var(--primary, #FF416C);
    color: var(--white, #fff);
    border-color: var(--primary, #FF416C);
  }
}

.pagination-ellipsis {
  color: var(--medium, #757575);
  padding: 0 0.25rem;
}

.prev-btn,
.next-btn {
  font-weight: 600;
}

// --- Job Modal (actualizado con formulario de aplicación) ---
.job-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.job-modal-content {
  background-color: var(--white, #ffffff);
  padding: 2rem;
  border-radius: var(--border-radius-lg, 12px);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: fadeInModal 0.3s ease-out;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
}

@keyframes fadeInModal {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--medium, #757575);
  cursor: pointer;
  line-height: 1;
  padding: 0.5rem;

  &:hover {
    color: var(--dark, #333);
  }
}

.modal-job-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark, #212529);
  margin: 0 0 0.25rem 0;
}

.modal-job-department {
  display: inline-block;
  background-color: rgba(var(--primary-rgb, 255, 65, 108), 0.1);
  color: var(--primary, #FF416C);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.modal-job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: var(--secondary, #5a5a5a);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color-light, #eee);
}

.modal-section {
  margin-bottom: 1.5rem;

  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-dark, #212529);
    margin: 0 0 0.75rem 0;
  }

  p,
  ul {
    font-size: 0.95rem;
    color: var(--secondary, #5a5a5a);
    line-height: 1.7;
  }

  ul {
    list-style: disc;
    padding-left: 1.25rem;

    li {
      margin-bottom: 0.4rem;
    }
  }
}

.job-apply-btn.modal-apply-btn {
  margin-top: 1.5rem;
  width: 100%;
  text-align: center;
}

.application-form-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color-light, #eee);
}

.application-form-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-dark, #212529);
}

.form-group-modal {
  margin-bottom: 1.25rem;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--dark, #333);
    margin-bottom: 0.4rem;

    .required {
      color: var(--primary, #FF416C);
    }
  }
}

.form-input-modal,
.form-textarea-modal {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: var(--border-radius-md, 8px);
  background-color: var(--white, #fff);
  color: var(--dark, #333);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary, #FF416C);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb, 255, 65, 108), 0.2);
  }
}

.form-input-file-modal {
  display: block;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: var(--secondary, #5a5a5a);
}

/* Estilo básico, se puede mejorar */
.file-name-display {
  font-size: 0.85rem;
  color: var(--medium, #757575);
  margin-top: 0.25rem;
  display: block;
}

.submit-application-btn {
  width: 100%;
  margin-bottom: 0.75rem;
}

.cancel-application-btn {
  width: 100%;
}

.application-success-message {
  text-align: center;
  padding: 2rem 0;

  .success-icon-inline {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.6rem;
    color: var(--success, green);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 1rem;
    color: var(--dark-medium, #555);
    margin-bottom: 1.5rem;
  }
}
</style>
