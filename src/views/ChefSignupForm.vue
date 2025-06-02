<!-- views/ChefSignupForm.vue -->
<template>
  <div class="chef-signup">
    <!-- Hero Section -->
    <section class="chef-signup__hero">
      <div class="chef-signup__hero-bg">
        <div class="chef-signup__floating-element chef-signup__floating-element--1">👨‍🍳</div>
        <div class="chef-signup__floating-element chef-signup__floating-element--2">🍽️</div>
        <div class="chef-signup__floating-element chef-signup__floating-element--3">⭐</div>
        <div class="chef-signup__floating-element chef-signup__floating-element--4">🔥</div>
        <div class="chef-signup__floating-element chef-signup__floating-element--5">👩‍🍳</div>
      </div>

      <div class="container">
        <div class="chef-signup__hero-content">
          <h1 class="chef-signup__title">
            Únete como <span class="chef-signup__title-highlight">Chef Partner</span>
          </h1>
          <p class="chef-signup__subtitle">
            Comparte tu talento culinario con miles de amantes de la buena comida.
            Impulsa tu carrera y haz crecer tu negocio con nosotros.
          </p>

          <div class="chef-signup__stats">
            <div class="chef-signup__stat">
              <div class="chef-signup__stat-number">1,200+</div>
              <div class="chef-signup__stat-label">Chefs registrados</div>
            </div>
            <div class="chef-signup__stat">
              <div class="chef-signup__stat-number">50k+</div>
              <div class="chef-signup__stat-label">Pedidos mensuales</div>
            </div>
            <div class="chef-signup__stat">
              <div class="chef-signup__stat-number">4.8⭐</div>
              <div class="chef-signup__stat-label">Valoración media</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section class="chef-signup__form-section">
      <div class="container">
        <div class="chef-signup__form-container">
          <!-- Progress Steps -->
          <div class="chef-signup__progress">
            <div class="chef-signup__steps">
              <div
                v-for="(step, index) in steps"
                :key="index"
                :class="[
                  'chef-signup__step',
                  { 'chef-signup__step--active': currentStep === index + 1 },
                  { 'chef-signup__step--completed': currentStep > index + 1 }
                ]"
              >
                <div class="chef-signup__step-number">{{ index + 1 }}</div>
                <div class="chef-signup__step-label">{{ step.label }}</div>
              </div>
            </div>
          </div>

          <!-- Form Steps -->
          <form @submit.prevent="handleSubmit" class="chef-signup__form">
            <!-- Step 1: Información Personal -->
            <div v-if="currentStep === 1" class="chef-signup__step-content">
              <h2 class="chef-signup__step-title">Información Personal</h2>

              <div class="chef-signup__form-grid">
                <div class="chef-signup__form-group">
                  <label class="chef-signup__label">Nombre completo *</label>
                  <input
                    v-model="formData.fullName"
                    type="text"
                    class="chef-signup__input"
                    placeholder="Chef María González"
                    required
                  >
                </div>

                <div class="chef-signup__form-group">
                  <label class="chef-signup__label">Email *</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="chef-signup__input"
                    placeholder="maria@ejemplo.com"
                    required
                  >
                </div>

                <div class="chef-signup__form-group">
                  <label class="chef-signup__label">Teléfono *</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="chef-signup__input"
                    placeholder="+34 600 123 456"
                    required
                  >
                </div>

                <div class="chef-signup__form-group">
                  <label class="chef-signup__label">Ciudad *</label>
                  <select v-model="formData.city" class="chef-signup__select" required>
                    <option value="">Selecciona tu ciudad</option>
                    <option value="madrid">Madrid</option>
                    <option value="barcelona">Barcelona</option>
                    <option value="valencia">Valencia</option>
                    <option value="sevilla">Sevilla</option>
                    <option value="zaragoza">Zaragoza</option>
                    <option value="bilbao">Bilbao</option>
                    <option value="granada">Granada</option>
                    <option value="otro">Otra ciudad</option>
                  </select>
                </div>
              </div>

              <!-- Photo Upload -->
              <div class="chef-signup__photo-section">
                <label class="chef-signup__label">Foto de perfil</label>
                <div class="chef-signup__photo-upload">
                  <div v-if="!profileImagePreview" class="chef-signup__photo-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <p>Añadir foto profesional</p>
                  </div>
                  <img v-else :src="profileImagePreview" alt="Vista previa" class="chef-signup__photo-preview">
                  <input
                    @change="handleImageUpload"
                    type="file"
                    accept="image/*"
                    class="chef-signup__photo-input"
                  >
                </div>
              </div>
            </div>

            <!-- Step 2: Experiencia Profesional -->
            <div v-if="currentStep === 2" class="chef-signup__step-content">
              <h2 class="chef-signup__step-title">Experiencia Profesional</h2>

              <div class="chef-signup__form-grid">
                <div class="chef-signup__form-group chef-signup__form-group--full">
                  <label class="chef-signup__label">Especialidad culinaria *</label>
                  <select v-model="formData.specialty" class="chef-signup__select" required>
                    <option value="">Selecciona tu especialidad</option>
                    <option value="mediterranea">Cocina Mediterránea</option>
                    <option value="japonesa">Cocina Japonesa</option>
                    <option value="italiana">Cocina Italiana</option>
                    <option value="francesa">Cocina Francesa</option>
                    <option value="mexicana">Cocina Mexicana</option>
                    <option value="vegana">Cocina Vegana</option>
                    <option value="pasteleria">Pastelería</option>
                    <option value="molecular">Gastronomía Molecular</option>
                    <option value="tradicional">Cocina Tradicional Española</option>
                    <option value="fusion">Cocina Fusión</option>
                    <option value="otra">Otra especialidad</option>
                  </select>
                </div>

                <div class="chef-signup__form-group">
                  <label class="chef-signup__label">Años de experiencia *</label>
                  <select v-model="formData.experience" class="chef-signup__select" required>
                    <option value="">Selecciona</option>
                    <option value="1-3">1-3 años</option>
                    <option value="4-7">4-7 años</option>
                    <option value="8-12">8-12 años</option>
                    <option value="13-20">13-20 años</option>
                    <option value="20+">Más de 20 años</option>
                  </select>
                </div>

                <div class="chef-signup__form-group">
                  <label class="chef-signup__label">Formación principal</label>
                  <input
                    v-model="formData.education"
                    type="text"
                    class="chef-signup__input"
                    placeholder="Ej: Le Cordon Bleu, Basque Culinary Center..."
                  >
                </div>
              </div>

              <div class="chef-signup__form-group chef-signup__form-group--full">
                <label class="chef-signup__label">Describe tu experiencia y enfoque culinario</label>
                <textarea
                  v-model="formData.bio"
                  class="chef-signup__textarea"
                  rows="4"
                  placeholder="Cuéntanos sobre tu experiencia, tu filosofía culinaria y lo que te hace único como chef..."
                ></textarea>
              </div>

              <!-- Current Restaurant -->
              <div class="chef-signup__form-group chef-signup__form-group--full">
                <label class="chef-signup__label">Restaurante actual (opcional)</label>
                <input
                  v-model="formData.currentRestaurant"
                  type="text"
                  class="chef-signup__input"
                  placeholder="Nombre del restaurante donde trabajas actualmente"
                >
              </div>
            </div>

            <!-- Step 3: Portfolio -->
            <div v-if="currentStep === 3" class="chef-signup__step-content">
              <h2 class="chef-signup__step-title">Tu Portfolio Culinario</h2>

              <!-- Signature Dishes -->
              <div class="chef-signup__form-group chef-signup__form-group--full">
                <label class="chef-signup__label">Platos signature (hasta 4)</label>
                <div class="chef-signup__signature-dishes">
                  <div
                    v-for="(dish, index) in formData.signatureDishes"
                    :key="index"
                    class="chef-signup__signature-dish"
                  >
                    <input
                      v-model="formData.signatureDishes[index]"
                      type="text"
                      class="chef-signup__input"
                      :placeholder="`Plato ${index + 1}`"
                    >
                    <button
                      v-if="formData.signatureDishes.length > 1"
                      @click="removeDish(index)"
                      type="button"
                      class="chef-signup__remove-dish"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <button
                    v-if="formData.signatureDishes.length < 4"
                    @click="addDish"
                    type="button"
                    class="chef-signup__add-dish"
                  >
                    + Añadir plato
                  </button>
                </div>
              </div>

              <!-- Achievements -->
              <div class="chef-signup__form-group chef-signup__form-group--full">
                <label class="chef-signup__label">Logros y reconocimientos</label>
                <div class="chef-signup__achievements">
                  <div
                    v-for="(achievement, index) in formData.achievements"
                    :key="index"
                    class="chef-signup__achievement"
                  >
                    <input
                      v-model="formData.achievements[index]"
                      type="text"
                      class="chef-signup__input"
                      :placeholder="`Logro ${index + 1}`"
                    >
                    <button
                      v-if="formData.achievements.length > 1"
                      @click="removeAchievement(index)"
                      type="button"
                      class="chef-signup__remove-achievement"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <button
                    v-if="formData.achievements.length < 5"
                    @click="addAchievement"
                    type="button"
                    class="chef-signup__add-achievement"
                  >
                    + Añadir logro
                  </button>
                </div>
              </div>

              <!-- Social Media -->
              <div class="chef-signup__social-section">
                <h3 class="chef-signup__section-title">Redes sociales (opcional)</h3>
                <div class="chef-signup__form-grid">
                  <div class="chef-signup__form-group">
                    <label class="chef-signup__label">Instagram</label>
                    <input
                      v-model="formData.social.instagram"
                      type="text"
                      class="chef-signup__input"
                      placeholder="@tu_usuario"
                    >
                  </div>
                  <div class="chef-signup__form-group">
                    <label class="chef-signup__label">TikTok</label>
                    <input
                      v-model="formData.social.tiktok"
                      type="text"
                      class="chef-signup__input"
                      placeholder="@tu_usuario"
                    >
                  </div>
                  <div class="chef-signup__form-group chef-signup__form-group--full">
                    <label class="chef-signup__label">YouTube</label>
                    <input
                      v-model="formData.social.youtube"
                      type="text"
                      class="chef-signup__input"
                      placeholder="Nombre del canal"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="chef-signup__form-actions">
              <button
                v-if="currentStep > 1"
                @click="previousStep"
                type="button"
                class="chef-signup__btn chef-signup__btn--secondary"
              >
                Anterior
              </button>

              <button
                v-if="currentStep < 3"
                @click="nextStep"
                type="button"
                class="chef-signup__btn chef-signup__btn--primary"
              >
                Siguiente
              </button>

              <button
                v-if="currentStep === 3"
                type="submit"
                :disabled="submitting"
                class="chef-signup__btn chef-signup__btn--primary chef-signup__btn--submit"
              >
                <span v-if="!submitting">Enviar solicitud</span>
                <span v-else>Enviando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="chef-signup__benefits">
      <div class="container">
        <h2 class="chef-signup__benefits-title">¿Por qué unirte como Chef Partner?</h2>
        <div class="chef-signup__benefits-grid">
          <div class="chef-signup__benefit">
            <div class="chef-signup__benefit-icon">💰</div>
            <h3 class="chef-signup__benefit-title">Ingresos adicionales</h3>
            <p class="chef-signup__benefit-text">Genera ingresos extra compartiendo tus recetas y conocimientos</p>
          </div>
          <div class="chef-signup__benefit">
            <div class="chef-signup__benefit-icon">👥</div>
            <h3 class="chef-signup__benefit-title">Amplía tu audiencia</h3>
            <p class="chef-signup__benefit-text">Llega a miles de personas que aman la buena comida</p>
          </div>
          <div class="chef-signup__benefit">
            <div class="chef-signup__benefit-icon">📈</div>
            <h3 class="chef-signup__benefit-title">Haz crecer tu marca</h3>
            <p class="chef-signup__benefit-text">Construye tu reputación y posiciónate como experto</p>
          </div>
          <div class="chef-signup__benefit">
            <div class="chef-signup__benefit-icon">🤝</div>
            <h3 class="chef-signup__benefit-title">Red de contactos</h3>
            <p class="chef-signup__benefit-text">Conecta con otros chefs y profesionales del sector</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const currentStep = ref(1);
const submitting = ref(false);
const profileImagePreview = ref(null);

const steps = [
  { label: 'Información Personal' },
  { label: 'Experiencia' },
  { label: 'Portfolio' }
];

const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  city: '',
  profileImage: null,
  specialty: '',
  experience: '',
  education: '',
  bio: '',
  currentRestaurant: '',
  signatureDishes: [''],
  achievements: [''],
  social: {
    instagram: '',
    tiktok: '',
    youtube: ''
  }
});

// Methods
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.profileImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addDish = () => {
  if (formData.signatureDishes.length < 4) {
    formData.signatureDishes.push('');
  }
};

const removeDish = (index) => {
  if (formData.signatureDishes.length > 1) {
    formData.signatureDishes.splice(index, 1);
  }
};

const addAchievement = () => {
  if (formData.achievements.length < 5) {
    formData.achievements.push('');
  }
};

const removeAchievement = (index) => {
  if (formData.achievements.length > 1) {
    formData.achievements.splice(index, 1);
  }
};

const handleSubmit = async () => {
  submitting.value = true;

  try {
    // Aquí iría la lógica para enviar el formulario al backend
    console.log('Enviando formulario:', formData);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mostrar mensaje de éxito y redirigir
    alert('¡Solicitud enviada correctamente! Te contactaremos pronto.');
    router.push('/chefs');

  } catch (error) {
    console.error('Error al enviar formulario:', error);
    alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.chef-signup {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

// Hero Section
.chef-signup__hero {
  position: relative;
  padding: 4rem 0 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  color: white;

  &-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  &-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
}

.chef-signup__floating-element {
  position: absolute;
  font-size: 2rem;
  opacity: 0.15;
  animation: float 12s infinite ease-in-out;

  &--1 { top: 15%; left: 10%; animation-delay: 0s; }
  &--2 { top: 70%; left: 15%; animation-delay: 2s; }
  &--3 { top: 25%; left: 80%; animation-delay: 4s; }
  &--4 { top: 60%; left: 85%; animation-delay: 6s; }
  &--5 { top: 40%; left: 50%; animation-delay: 8s; }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    opacity: 0.1;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.chef-signup__title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;

  &-highlight {
    background: linear-gradient(45deg, #FFD700, #FFA500);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
}

.chef-signup__subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.chef-signup__stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.chef-signup__stat {
  text-align: center;

  &-number {
    font-size: 2rem;
    font-weight: 800;
    color: #FFD700;
  }

  &-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
}

// Form Section
.chef-signup__form-section {
  padding: 4rem 0;
}

.chef-signup__form-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

// Progress Steps
.chef-signup__progress {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.chef-signup__steps {
  display: flex;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto;
}

.chef-signup__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  opacity: 0.6;
  transition: all 0.3s ease;

  &--active, &--completed {
    opacity: 1;
  }

  &-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }

  &--active &-number {
    background: #FFD700;
    color: #333;
  }

  &--completed &-number {
    background: #4CAF50;
  }

  &-label {
    font-size: 0.8rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }
}

// Form Styles
.chef-signup__form {
  padding: 2rem;
}

.chef-signup__step-content {
  margin-bottom: 2rem;
}

.chef-signup__step-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.chef-signup__form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.chef-signup__form-group {
  &--full {
    grid-column: 1 / -1;
  }
}

.chef-signup__label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.chef-signup__input,
.chef-signup__select,
.chef-signup__textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
}

.chef-signup__textarea {
  resize: vertical;
  min-height: 100px;
}

// Photo Upload
.chef-signup__photo-section {
  margin-bottom: 1.5rem;
}

.chef-signup__photo-upload {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px dashed #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #667eea;
  }
}

.chef-signup__photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  text-align: center;

  p {
    margin: 0.5rem 0 0 0;
    font-size: 0.8rem;
  }
}

.chef-signup__photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chef-signup__photo-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

// Signature Dishes & Achievements
.chef-signup__signature-dishes,
.chef-signup__achievements {
  space-y: 1rem;
}

.chef-signup__signature-dish,
.chef-signup__achievement {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.chef-signup__remove-dish,
.chef-signup__remove-achievement {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
  }
}

.chef-signup__add-dish,
.chef-signup__add-achievement {
  background: none;
  border: 2px dashed #667eea;
  color: #667eea;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
}

// Social Section
.chef-signup__social-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.chef-signup__section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

// Form Actions
.chef-signup__form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.chef-signup__btn {
  padding: 0.8rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  &--secondary {
    background: #f8fafc;
    color: #64748b;
    border: 2px solid #e2e8f0;

    &:hover {
      background: #f1f5f9;
    }
  }

  &--submit {
    min-width: 150px;
  }
}

// Benefits Section
.chef-signup__benefits {
  padding: 4rem 0;
  background: #f8fafc;
}

.chef-signup__benefits-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 3rem;
}

.chef-signup__benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.chef-signup__benefit {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  &-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  &-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }

  &-text {
    color: #64748b;
    line-height: 1.6;
  }
}
</style>
