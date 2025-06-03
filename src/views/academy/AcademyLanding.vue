<template>
  <div class="academy-landing">
    <!-- Hero Section -->
    <section class="academy-landing__hero">
      <div class="academy-landing__hero-bg">
        <div class="academy-landing__hero-gradient"></div>
        <div class="academy-landing__hero-pattern"></div>
      </div>

      <div class="academy-landing__container">
        <div class="academy-landing__hero-content">
          <div class="academy-landing__hero-text">
            <div class="academy-landing__hero-badge">
              <span class="academy-landing__badge-icon">🚀</span>
              <span class="academy-landing__badge-text">New Learning Platform</span>
            </div>

            <h1 class="academy-landing__hero-title">
              Level Up Your Career with
              <span class="academy-landing__hero-highlight">Elixium Academy</span>
            </h1>

            <p class="academy-landing__hero-subtitle">
              Master essential skills, earn valuable certificates, and advance your career in the food service industry through our comprehensive learning platform.
            </p>

            <div class="academy-landing__hero-stats">
              <div class="academy-landing__stat">
                <span class="academy-landing__stat-number">500+</span>
                <span class="academy-landing__stat-label">Students Enrolled</span>
              </div>
              <div class="academy-landing__stat">
                <span class="academy-landing__stat-number">15+</span>
                <span class="academy-landing__stat-label">Expert-Led Courses</span>
              </div>
              <div class="academy-landing__stat">
                <span class="academy-landing__stat-number">95%</span>
                <span class="academy-landing__stat-label">Completion Rate</span>
              </div>
            </div>

            <div class="academy-landing__hero-actions">
              <router-link to="/academy/courses" class="academy-landing__cta-primary">
                Start Learning Today
              </router-link>
              <button @click="scrollToFeatures" class="academy-landing__cta-secondary">
                Learn More
              </button>
            </div>
          </div>

          <div class="academy-landing__hero-visual">
            <div class="academy-landing__hero-card">
              <div class="academy-landing__card-header">
                <div class="academy-landing__card-avatar">
                  <div class="academy-landing__avatar-placeholder">EG</div>
                </div>
                <div class="academy-landing__card-info">
                  <span class="academy-landing__card-name">Elena García</span>
                  <span class="academy-landing__card-role">Operations Manager</span>
                </div>
                <div class="academy-landing__card-badge">🏆</div>
              </div>

              <div class="academy-landing__card-content">
                <h4 class="academy-landing__card-title">Leadership Excellence</h4>
                <div class="academy-landing__card-progress">
                  <div class="academy-landing__progress-bar">
                    <div class="academy-landing__progress-fill" style="width: 85%"></div>
                  </div>
                  <span class="academy-landing__progress-text">85% Complete</span>
                </div>
                <div class="academy-landing__card-achievements">
                  <span class="academy-landing__achievement">⭐ Expert Level</span>
                  <span class="academy-landing__achievement">🎓 5 Certificates</span>
                </div>
              </div>
            </div>

            <div class="academy-landing__floating-elements">
              <div class="academy-landing__floating-badge academy-landing__floating-badge--1">
                <span class="academy-landing__floating-icon">🚀</span>
                <span class="academy-landing__floating-text">+250 Points</span>
              </div>
              <div class="academy-landing__floating-badge academy-landing__floating-badge--2">
                <span class="academy-landing__floating-icon">🏆</span>
                <span class="academy-landing__floating-text">New Badge</span>
              </div>
              <div class="academy-landing__floating-badge academy-landing__floating-badge--3">
                <span class="academy-landing__floating-icon">🔥</span>
                <span class="academy-landing__floating-text">7 Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="academy-landing__features" ref="featuresSection">
      <div class="academy-landing__container">
        <div class="academy-landing__section-header">
          <h2 class="academy-landing__section-title">Why Choose Elixium Academy?</h2>
          <p class="academy-landing__section-subtitle">
            Experience a modern, engaging learning platform designed for food service professionals
          </p>
        </div>

        <div class="academy-landing__features-grid">
          <div class="academy-landing__feature-card">
            <div class="academy-landing__feature-icon">🎯</div>
            <h3 class="academy-landing__feature-title">Skill-Focused Learning</h3>
            <p class="academy-landing__feature-description">
              Master specific competencies that directly impact your job performance and career advancement opportunities.
            </p>
            <div class="academy-landing__feature-highlight">
              Real-world applications
            </div>
          </div>

          <div class="academy-landing__feature-card">
            <div class="academy-landing__feature-icon">🏆</div>
            <h3 class="academy-landing__feature-title">Gamified Experience</h3>
            <p class="academy-landing__feature-description">
              Earn points, unlock badges, and compete with colleagues in a fun and motivating learning environment.
            </p>
            <div class="academy-landing__feature-highlight">
              Stay motivated
            </div>
          </div>

          <div class="academy-landing__feature-card">
            <div class="academy-landing__feature-icon">📱</div>
            <h3 class="academy-landing__feature-title">Mobile-First Design</h3>
            <p class="academy-landing__feature-description">
              Learn anywhere, anytime with our responsive platform optimized for mobile devices and busy schedules.
            </p>
            <div class="academy-landing__feature-highlight">
              Learn on-the-go
            </div>
          </div>

          <div class="academy-landing__feature-card">
            <div class="academy-landing__feature-icon">👥</div>
            <h3 class="academy-landing__feature-title">Expert Instructors</h3>
            <p class="academy-landing__feature-description">
              Learn from industry veterans with years of experience in food service operations and management.
            </p>
            <div class="academy-landing__feature-highlight">
              Industry expertise
            </div>
          </div>

          <div class="academy-landing__feature-card">
            <div class="academy-landing__feature-icon">🎓</div>
            <h3 class="academy-landing__feature-title">Official Certificates</h3>
            <p class="academy-landing__feature-description">
              Earn recognized certificates that showcase your achievements to current and future employers.
            </p>
            <div class="academy-landing__feature-highlight">
              Career advancement
            </div>
          </div>

          <div class="academy-landing__feature-card">
            <div class="academy-landing__feature-icon">📊</div>
            <h3 class="academy-landing__feature-title">Progress Tracking</h3>
            <p class="academy-landing__feature-description">
              Monitor your learning journey with detailed analytics and personalized recommendations.
            </p>
            <div class="academy-landing__feature-highlight">
              Data-driven insights
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Course Categories -->
    <section class="academy-landing__categories">
      <div class="academy-landing__container">
        <div class="academy-landing__section-header">
          <h2 class="academy-landing__section-title">Explore Course Categories</h2>
          <p class="academy-landing__section-subtitle">
            Discover learning paths tailored to different roles and career goals
          </p>
        </div>

        <div class="academy-landing__categories-grid">
          <div
            v-for="category in courseCategories"
            :key="category.id"
            class="academy-landing__category-card"
            @click="goToCategory(category.slug)"
          >
            <div class="academy-landing__category-icon">{{ category.icon }}</div>
            <h3 class="academy-landing__category-title">{{ category.title }}</h3>
            <p class="academy-landing__category-description">{{ category.description }}</p>
            <div class="academy-landing__category-meta">
              <span class="academy-landing__category-courses">{{ category.courseCount }} courses</span>
              <span class="academy-landing__category-duration">{{ category.duration }}</span>
            </div>
            <div class="academy-landing__category-skills">
              <span
                v-for="skill in category.skills.slice(0, 3)"
                :key="skill"
                class="academy-landing__skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="academy-landing__testimonials">
      <div class="academy-landing__container">
        <div class="academy-landing__section-header">
          <h2 class="academy-landing__section-title">Success Stories</h2>
          <p class="academy-landing__section-subtitle">
            See how Elixium Academy has transformed careers across our organization
          </p>
        </div>

        <div class="academy-landing__testimonials-grid">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="academy-landing__testimonial-card"
          >
            <div class="academy-landing__testimonial-header">
              <div class="academy-landing__testimonial-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
              </div>
              <div class="academy-landing__testimonial-info">
                <h4 class="academy-landing__testimonial-name">{{ testimonial.name }}</h4>
                <p class="academy-landing__testimonial-role">{{ testimonial.role }}</p>
                <div class="academy-landing__testimonial-rating">
                  <span v-for="i in 5" :key="i" class="academy-landing__star">⭐</span>
                </div>
              </div>
            </div>

            <blockquote class="academy-landing__testimonial-quote">
              "{{ testimonial.quote }}"
            </blockquote>

            <div class="academy-landing__testimonial-achievement">
              <span class="academy-landing__achievement-icon">{{ testimonial.achievement.icon }}</span>
              <span class="academy-landing__achievement-text">{{ testimonial.achievement.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learning Stats -->
    <section class="academy-landing__stats">
      <div class="academy-landing__container">
        <div class="academy-landing__stats-grid">
          <div class="academy-landing__stat-card">
            <div class="academy-landing__stat-icon">👥</div>
            <div class="academy-landing__stat-content">
              <span class="academy-landing__stat-number" ref="studentsCounter">0</span>
              <span class="academy-landing__stat-label">Active Students</span>
              <span class="academy-landing__stat-description">Learning and growing every day</span>
            </div>
          </div>

          <div class="academy-landing__stat-card">
            <div class="academy-landing__stat-icon">🎓</div>
            <div class="academy-landing__stat-content">
              <span class="academy-landing__stat-number" ref="certificatesCounter">0</span>
              <span class="academy-landing__stat-label">Certificates Earned</span>
              <span class="academy-landing__stat-description">Professional achievements unlocked</span>
            </div>
          </div>

          <div class="academy-landing__stat-card">
            <div class="academy-landing__stat-icon">⏱️</div>
            <div class="academy-landing__stat-content">
              <span class="academy-landing__stat-number" ref="hoursCounter">0</span>
              <span class="academy-landing__stat-label">Learning Hours</span>
              <span class="academy-landing__stat-description">Time invested in growth</span>
            </div>
          </div>

          <div class="academy-landing__stat-card">
            <div class="academy-landing__stat-icon">📈</div>
            <div class="academy-landing__stat-content">
              <span class="academy-landing__stat-number" ref="promotionsCounter">0</span>
              <span class="academy-landing__stat-label">Career Promotions</span>
              <span class="academy-landing__stat-description">Success stories and counting</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="academy-landing__cta">
      <div class="academy-landing__container">
        <div class="academy-landing__cta-content">
          <div class="academy-landing__cta-text">
            <h2 class="academy-landing__cta-title">Ready to Transform Your Career?</h2>
            <p class="academy-landing__cta-subtitle">
              Join hundreds of colleagues who are already advancing their skills and climbing the career ladder with Elixium Academy.
            </p>
            <div class="academy-landing__cta-features">
              <div class="academy-landing__cta-feature">
                <span class="academy-landing__cta-feature-icon">✅</span>
                <span class="academy-landing__cta-feature-text">Free for all employees</span>
              </div>
              <div class="academy-landing__cta-feature">
                <span class="academy-landing__cta-feature-icon">✅</span>
                <span class="academy-landing__cta-feature-text">Learn at your own pace</span>
              </div>
              <div class="academy-landing__cta-feature">
                <span class="academy-landing__cta-feature-icon">✅</span>
                <span class="academy-landing__cta-feature-text">Earn recognized certificates</span>
              </div>
            </div>
          </div>

          <div class="academy-landing__cta-actions">
            <router-link to="/academy/courses" class="academy-landing__cta-primary">
              Get Started Now
            </router-link>
            <router-link to="/academy" class="academy-landing__cta-secondary">
              View Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const featuresSection = ref<HTMLElement>();

// Animation counters
const studentsCounter = ref<HTMLElement>();
const certificatesCounter = ref<HTMLElement>();
const hoursCounter = ref<HTMLElement>();
const promotionsCounter = ref<HTMLElement>();

const courseCategories = [
  {
    id: 1,
    title: 'Leadership & Management',
    description: 'Develop essential leadership skills for managing teams and operations effectively',
    icon: '👑',
    slug: 'Leadership',
    courseCount: 5,
    duration: '2-4 weeks',
    skills: ['Team Building', 'Decision Making', 'Communication', 'Strategy']
  },
  {
    id: 2,
    title: 'Operations Excellence',
    description: 'Master operational processes and efficiency optimization techniques',
    icon: '⚙️',
    slug: 'Operations',
    courseCount: 4,
    duration: '1-3 weeks',
    skills: ['Process Optimization', 'Quality Control', 'Logistics', 'Analytics']
  },
  {
    id: 3,
    title: 'Customer Experience',
    description: 'Create exceptional customer experiences that drive loyalty and growth',
    icon: '😊',
    slug: 'Customer Service',
    courseCount: 3,
    duration: '1-2 weeks',
    skills: ['Service Excellence', 'Problem Solving', 'Communication', 'Empathy']
  },
  {
    id: 4,
    title: 'Technology & Innovation',
    description: 'Stay ahead with the latest technology trends and digital tools',
    icon: '💻',
    slug: 'Technology',
    courseCount: 3,
    duration: '2-3 weeks',
    skills: ['Digital Tools', 'Software Proficiency', 'Innovation', 'Automation']
  },
  {
    id: 5,
    title: 'Food Safety & Compliance',
    description: 'Ensure the highest standards of food safety and regulatory compliance',
    icon: '🛡️',
    slug: 'Food Safety',
    courseCount: 2,
    duration: '1 week',
    skills: ['HACCP', 'Hygiene Standards', 'Regulations', 'Risk Management']
  },
  {
    id: 6,
    title: 'Marketing & Growth',
    description: 'Learn modern marketing strategies to drive business growth',
    icon: '📈',
    slug: 'Marketing',
    courseCount: 3,
    duration: '2-4 weeks',
    skills: ['Digital Marketing', 'Brand Management', 'Customer Acquisition', 'Analytics']
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    role: 'Senior Operations Manager',
    avatar: 'CR',
    quote: 'The Leadership course completely transformed how I manage my team. I\'ve seen a 40% improvement in team efficiency since applying what I learned.',
    achievement: {
      icon: '📈',
      text: 'Promoted to Senior Manager'
    }
  },
  {
    id: 2,
    name: 'María González',
    role: 'Customer Experience Lead',
    avatar: 'MG',
    quote: 'Elixium Academy helped me develop skills I never knew I needed. The customer service training directly led to our highest satisfaction scores ever.',
    achievement: {
      icon: '⭐',
      text: '98% Customer Satisfaction'
    }
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'Technology Coordinator',
    avatar: 'DC',
    quote: 'The tech courses are incredibly practical. I implemented new systems that reduced our processing time by 30% and got recognition from senior management.',
    achievement: {
      icon: '🚀',
      text: 'Led Digital Transformation'
    }
  }
];

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const goToCategory = (categorySlug: string) => {
  router.push(`/academy/courses?category=${categorySlug}`);
};

const animateCounter = (element: HTMLElement, target: number, suffix: string = '') => {
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + suffix;
    }
  };

  updateCounter();
};

const observeStats = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Start counter animations
        if (studentsCounter.value) animateCounter(studentsCounter.value, 487);
        if (certificatesCounter.value) animateCounter(certificatesCounter.value, 1250);
        if (hoursCounter.value) animateCounter(hoursCounter.value, 3420);
        if (promotionsCounter.value) animateCounter(promotionsCounter.value, 156);

        observer.disconnect();
      }
    });
  });

  if (studentsCounter.value) {
    observer.observe(studentsCounter.value.closest('.academy-landing__stats')!);
  }
};

onMounted(() => {
  observeStats();
});
</script>

<style lang="scss" scoped>
.academy-landing {
  overflow-x: hidden;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    color: white;
    overflow: hidden;
  }

  &__hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  &__hero-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 50%, #8B5CF6 100%);
  }

  &__hero-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hero-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(255,255,255,0.08)"/><circle cx="50" cy="10" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="1" fill="rgba(255,255,255,0.06)"/></pattern></defs><rect width="100" height="100" fill="url(%23hero-grain)"/></svg>') repeat;
    opacity: 0.4;
  }

  &__hero-content {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }
  }

  &__hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }

  &__badge-icon {
    font-size: 1rem;
  }

  &__hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1.5rem 0;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  &__hero-highlight {
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__hero-subtitle {
    font-size: 1.25rem;
    line-height: 1.6;
    opacity: 0.9;
    margin: 0 0 2rem 0;

    @media (max-width: 768px) {
      font-size: 1.125rem;
    }
  }

  &__hero-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      justify-content: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__stat-number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  &__stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  &__hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__cta-primary,
  &__cta-secondary {
    padding: 1rem 2rem;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
    font-family: inherit;
  }

  &__cta-primary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
    }
  }

  &__cta-secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__hero-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
      order: -1;
    }
  }

  &__hero-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    max-width: 300px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  &__card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__card-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__avatar-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #64748b, #475569);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    border-radius: 50%;
  }

  &__card-info {
    flex: 1;
  }

  &__card-name {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.125rem;
  }

  &__card-role {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  &__card-badge {
    font-size: 1.25rem;
  }

  &__card-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  &__card-progress {
    margin-bottom: 1rem;
  }

  &__progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  &__progress-text {
    font-size: 0.75rem;
    opacity: 0.8;
  }

  &__card-achievements {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__achievement {
    font-size: 0.75rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &__floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  &__floating-badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    animation: float 6s ease-in-out infinite;

    &--1 {
      top: 10%;
      right: 10%;
      animation-delay: 0s;
    }

    &--2 {
      top: 60%;
      left: -10%;
      animation-delay: 2s;
    }

    &--3 {
      bottom: 20%;
      right: -5%;
      animation-delay: 4s;
    }
  }

  &__floating-icon {
    font-size: 1rem;
  }

  &__features {
    padding: 5rem 0;
    background: white;
  }

  &__section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  &__section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 1rem 0;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__section-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    margin: 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  &__features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  &__feature-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #FF416C, #FF4B2B);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
      border-color: #FF416C;

      &::before {
        transform: scaleX(1);
      }
    }
  }

  &__feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  &__feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  &__feature-description {
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  &__feature-highlight {
    display: inline-block;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 0.375rem 1rem;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__categories {
    padding: 5rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  &__categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  &__category-card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
      border-color: #FF416C;
    }
  }

  &__category-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  &__category-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  &__category-description {
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  &__category-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #64748b;
  }

  &__category-skills {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__skill-tag {
    background: #f1f5f9;
    color: #64748b;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
    border: 1px solid #e2e8f0;
  }

  &__testimonials {
    padding: 5rem 0;
    background: white;
  }

  &__testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  &__testimonial-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    }
  }

  &__testimonial-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__testimonial-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e2e8f0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .academy-landing__avatar-placeholder {
      font-size: 18px;
      background: linear-gradient(135deg, #FF416C, #FF4B2B);
    }
  }

  &__testimonial-info {
    flex: 1;
  }

  &__testimonial-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  &__testimonial-role {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 0.5rem 0;
  }

  &__testimonial-rating {
    display: flex;
    gap: 0.125rem;
  }

  &__star {
    font-size: 0.875rem;
  }

  &__testimonial-quote {
    font-size: 1rem;
    line-height: 1.6;
    color: #374151;
    margin: 0 0 1.5rem 0;
    font-style: italic;
  }

  &__testimonial-achievement {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: 1px solid #3b82f6;
    border-radius: 12px;
    padding: 0.75rem 1rem;
  }

  &__achievement-icon {
    font-size: 1.25rem;
  }

  &__achievement-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__stats {
    padding: 5rem 0;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  &__stat-card {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &__stat-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  &__stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__stat-number {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
  }

  &__stat-label {
    font-size: 1.125rem;
    font-weight: 600;
    opacity: 0.9;
  }

  &__stat-description {
    font-size: 0.875rem;
    opacity: 0.7;
  }

  &__cta {
    padding: 5rem 0;
    background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%);
    color: white;
  }

  &__cta-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }
  }

  &__cta-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__cta-subtitle {
    font-size: 1.125rem;
    opacity: 0.9;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  &__cta-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__cta-feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__cta-feature-icon {
    font-size: 1.125rem;
  }

  &__cta-feature-text {
    font-size: 1rem;
  }

  &__cta-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
