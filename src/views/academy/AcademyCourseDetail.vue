<template>
  <div class="course-detail" v-if="course">
    <!-- Hero Section -->
    <section class="course-detail__hero">
      <div class="course-detail__hero-bg">
        <img :src="course.thumbnail" :alt="course.title" class="course-detail__hero-image" />
        <div class="course-detail__hero-overlay"></div>
      </div>

      <div class="course-detail__hero-content">
        <div class="course-detail__container">
          <div class="course-detail__breadcrumb">
            <router-link to="/academy" class="course-detail__breadcrumb-link">Academy</router-link>
            <span class="course-detail__breadcrumb-separator">→</span>
            <router-link to="/academy/courses" class="course-detail__breadcrumb-link">Courses</router-link>
            <span class="course-detail__breadcrumb-separator">→</span>
            <span class="course-detail__breadcrumb-current">{{ course.title }}</span>
          </div>

          <div class="course-detail__hero-grid">
            <div class="course-detail__hero-info">
              <div class="course-detail__badges">
                <span v-if="course.isNew" class="course-detail__badge course-detail__badge--new">New Course</span>
                <span v-if="course.isFeatured" class="course-detail__badge course-detail__badge--featured">Featured</span>
                <span class="course-detail__badge course-detail__badge--level">{{ course.level }}</span>
              </div>

              <h1 class="course-detail__title">{{ course.title }}</h1>
              <p class="course-detail__description">{{ course.description }}</p>

              <div class="course-detail__meta">
                <div class="course-detail__meta-item">
                  <span class="course-detail__meta-label">Instructor:</span>
                  <span class="course-detail__meta-value">{{ course.instructor }}</span>
                </div>
                <div class="course-detail__meta-item">
                  <span class="course-detail__meta-label">Category:</span>
                  <span class="course-detail__meta-value">{{ course.category }}</span>
                </div>
                <div class="course-detail__meta-item">
                  <span class="course-detail__meta-label">Duration:</span>
                  <span class="course-detail__meta-value">{{ course.duration }}</span>
                </div>
              </div>

              <div class="course-detail__stats">
                <div class="course-detail__stat">
                  <div class="course-detail__stat-icon">⭐</div>
                  <div class="course-detail__stat-text">
                    <span class="course-detail__stat-number">{{ course.rating }}</span>
                    <span class="course-detail__stat-label">Rating</span>
                  </div>
                </div>
                <div class="course-detail__stat">
                  <div class="course-detail__stat-icon">👥</div>
                  <div class="course-detail__stat-text">
                    <span class="course-detail__stat-number">{{ course.studentsCount }}</span>
                    <span class="course-detail__stat-label">Students</span>
                  </div>
                </div>
                <div class="course-detail__stat">
                  <div class="course-detail__stat-icon">📚</div>
                  <div class="course-detail__stat-text">
                    <span class="course-detail__stat-number">{{ course.modules.length }}</span>
                    <span class="course-detail__stat-label">Modules</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="course-detail__hero-card">
              <div class="course-detail__card">
                <div class="course-detail__card-header">
                  <h3 class="course-detail__card-title">Start Learning Today</h3>
                  <div v-if="courseProgress > 0" class="course-detail__progress-info">
                    <span class="course-detail__progress-text">{{ Math.round(courseProgress) }}% Complete</span>
                    <div class="course-detail__progress-bar">
                      <div
                        class="course-detail__progress-fill"
                        :style="{ width: `${courseProgress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="course-detail__card-actions">
                  <button
                    v-if="!isEnrolled"
                    @click="enrollInCourse"
                    class="course-detail__enroll-btn"
                  >
                    Enroll Now - Free
                  </button>
                  <button
                    v-else-if="courseProgress < 100"
                    @click="continueLearning"
                    class="course-detail__continue-btn"
                  >
                    Continue Learning
                  </button>
                  <div v-else class="course-detail__completed">
                    <div class="course-detail__completed-icon">✅</div>
                    <span class="course-detail__completed-text">Course Completed!</span>
                  </div>
                </div>

                <div class="course-detail__card-features">
                  <div class="course-detail__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                    <span>Lifetime Access</span>
                  </div>
                  <div class="course-detail__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    </svg>
                    <span>Certificate of Completion</span>
                  </div>
                  <div class="course-detail__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <span>Mobile & Desktop Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Tabs -->
    <section class="course-detail__content">
      <div class="course-detail__container">
        <div class="course-detail__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['course-detail__tab', { 'course-detail__tab--active': activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Curriculum Tab -->
        <div v-if="activeTab === 'curriculum'" class="course-detail__tab-content">
          <div class="course-detail__curriculum">
            <div class="course-detail__curriculum-header">
              <h2 class="course-detail__curriculum-title">Course Curriculum</h2>
              <p class="course-detail__curriculum-subtitle">
                {{ course.modules.length }} modules • {{ getTotalDuration() }} total length
              </p>
            </div>

            <div class="course-detail__modules">
              <div
                v-for="(module, index) in course.modules"
                :key="module.id"
                class="course-detail__module"
              >
                <div class="course-detail__module-header" @click="toggleModule(module.id)">
                  <div class="course-detail__module-info">
                    <div class="course-detail__module-number">{{ index + 1 }}</div>
                    <div class="course-detail__module-details">
                      <h3 class="course-detail__module-title">{{ module.title }}</h3>
                      <p class="course-detail__module-desc">{{ module.description }}</p>
                    </div>
                  </div>

                  <div class="course-detail__module-meta">
                    <div class="course-detail__module-type">
                      {{ getModuleTypeIcon(module.type) }} {{ formatModuleType(module.type) }}
                    </div>
                    <div class="course-detail__module-duration">{{ module.duration }}</div>
                    <div class="course-detail__module-status">
                      <div v-if="isModuleCompleted(module.id)" class="course-detail__module-completed">
                        ✅
                      </div>
                      <div v-else-if="isModuleAccessible(index)" class="course-detail__module-accessible">
                        ▶️
                      </div>
                      <div v-else class="course-detail__module-locked">
                        🔒
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="expandedModules.includes(module.id)" class="course-detail__module-content">
                  <div v-if="module.type === 'video'" class="course-detail__module-preview">
                    <div class="course-detail__video-placeholder">
                      <div class="course-detail__video-icon">🎥</div>
                      <p class="course-detail__video-text">Video content: {{ module.title }}</p>
                    </div>
                  </div>

                  <div v-else-if="module.type === 'quiz'" class="course-detail__module-preview">
                    <div class="course-detail__quiz-preview">
                      <div class="course-detail__quiz-icon">🧠</div>
                      <div class="course-detail__quiz-info">
                        <p class="course-detail__quiz-text">Interactive Quiz</p>
                        <p class="course-detail__quiz-details">
                          {{ module.quiz?.questions.length }} questions •
                          {{ module.quiz?.passingScore }}% required to pass
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="course-detail__module-actions">
                    <button
                      v-if="isModuleAccessible(index)"
                      @click="startModule(module)"
                      class="course-detail__start-module-btn"
                    >
                      {{ isModuleCompleted(module.id) ? 'Review' : 'Start' }} Module
                    </button>
                    <span v-else class="course-detail__module-locked-text">
                      Complete previous modules to unlock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="course-detail__tab-content">
          <div class="course-detail__overview">
            <div class="course-detail__overview-section">
              <h2 class="course-detail__section-title">What You'll Learn</h2>
              <div class="course-detail__learning-objectives">
                <div class="course-detail__objective">
                  ✅ Master core concepts and practical applications in {{ course.category.toLowerCase() }}
                </div>
                <div class="course-detail__objective">
                  ✅ Gain hands-on experience through interactive exercises and real-world scenarios
                </div>
                <div class="course-detail__objective">
                  ✅ Develop professional skills valued by top companies in the food service industry
                </div>
                <div class="course-detail__objective">
                  ✅ Earn a certificate that demonstrates your expertise and commitment to learning
                </div>
              </div>
            </div>

            <div class="course-detail__overview-section">
              <h2 class="course-detail__section-title">Course Tags</h2>
              <div class="course-detail__tags">
                <span
                  v-for="tag in course.tags"
                  :key="tag"
                  class="course-detail__tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="course-detail__overview-section">
              <h2 class="course-detail__section-title">Prerequisites</h2>
              <div class="course-detail__prerequisites">
                <p v-if="course.level === 'Beginner'" class="course-detail__prerequisite">
                  ✅ No prior experience required - perfect for beginners!
                </p>
                <p v-else-if="course.level === 'Intermediate'" class="course-detail__prerequisite">
                  📚 Basic understanding of {{ course.category.toLowerCase() }} concepts recommended
                </p>
                <p v-else class="course-detail__prerequisite">
                  🎓 Previous experience in {{ course.category.toLowerCase() }} or related field required
                </p>
                <p class="course-detail__prerequisite">
                  💻 Access to a computer or mobile device with internet connection
                </p>
                <p class="course-detail__prerequisite">
                  🎯 Motivation to learn and apply new skills in real-world scenarios
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="course-detail__tab-content">
          <div class="course-detail__reviews">
            <div class="course-detail__reviews-summary">
              <div class="course-detail__rating-overview">
                <div class="course-detail__rating-score">{{ course.rating }}</div>
                <div class="course-detail__rating-stars">
                  <span v-for="i in 5" :key="i" class="course-detail__star">
                    {{ i <= Math.floor(course.rating) ? '⭐' : '☆' }}
                  </span>
                </div>
                <div class="course-detail__rating-text">Based on {{ course.studentsCount }} student reviews</div>
              </div>
            </div>

            <div class="course-detail__reviews-list">
              <div class="course-detail__review" v-for="review in mockReviews" :key="review.id">
                <div class="course-detail__review-header">
                  <div class="course-detail__reviewer-avatar">
                    {{ review.name.charAt(0) }}
                  </div>
                  <div class="course-detail__reviewer-info">
                    <div class="course-detail__reviewer-name">{{ review.name }}</div>
                    <div class="course-detail__review-rating">
                      <span v-for="i in review.rating" :key="i" class="course-detail__review-star">⭐</span>
                    </div>
                  </div>
                  <div class="course-detail__review-date">{{ review.date }}</div>
                </div>
                <p class="course-detail__review-text">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Courses -->
    <section class="course-detail__related">
      <div class="course-detail__container">
        <h2 class="course-detail__related-title">Related Courses</h2>
        <div class="course-detail__related-grid">
          <div
            v-for="relatedCourse in relatedCourses"
            :key="relatedCourse.id"
            class="course-detail__related-card"
            @click="goToCourse(relatedCourse.id)"
          >
            <div class="course-detail__related-image">
              <img :src="relatedCourse.thumbnail" :alt="relatedCourse.title" />
            </div>
            <div class="course-detail__related-content">
              <h3 class="course-detail__related-name">{{ relatedCourse.title }}</h3>
              <p class="course-detail__related-instructor">by {{ relatedCourse.instructor }}</p>
              <div class="course-detail__related-meta">
                <span class="course-detail__related-rating">⭐ {{ relatedCourse.rating }}</span>
                <span class="course-detail__related-students">{{ relatedCourse.studentsCount }} students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Loading State -->
  <div v-else class="course-detail__loading">
    <div class="course-detail__loading-spinner"></div>
    <p class="course-detail__loading-text">Loading course...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAcademyStore } from '@/stores/academy';
import type { Module } from '@/types/academy';

const route = useRoute();
const router = useRouter();
const academyStore = useAcademyStore();

const activeTab = ref('curriculum');
const expandedModules = ref<number[]>([]);

const tabs = [
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'overview', label: 'Overview' },
  { id: 'reviews', label: 'Reviews' }
];

const mockReviews = [
  {
    id: 1,
    name: 'Elena García',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Excellent course! Very practical and well-structured. The instructor explains everything clearly.'
  },
  {
    id: 2,
    name: 'Miguel Torres',
    rating: 4,
    date: '1 month ago',
    comment: 'Great content and engaging modules. Helped me improve my skills significantly.'
  },
  {
    id: 3,
    name: 'Sofia Ruiz',
    rating: 5,
    date: '1 month ago',
    comment: 'Perfect for beginners! I learned so much and feel confident applying these skills at work.'
  }
];

const courseId = computed(() => parseInt(route.params.id as string));
const course = computed(() => academyStore.getCourseById(courseId.value));
const courseProgress = computed(() => academyStore.getCourseProgress(courseId.value));
const isEnrolled = computed(() =>
  academyStore.userProgress.currentCourse === courseId.value ||
  academyStore.userProgress.completedCourses.includes(courseId.value)
);

const relatedCourses = computed(() => {
  if (!course.value) return [];
  return academyStore.courses
    .filter(c => c.id !== courseId.value && c.category === course.value!.category)
    .slice(0, 3);
});

const getTotalDuration = () => {
  if (!course.value) return '0 min';
  // Simple calculation - in real app would be more sophisticated
  const totalMinutes = course.value.modules.length * 20; // Assume 20 min average per module
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getModuleTypeIcon = (type: string) => {
  const icons = {
    video: '🎥',
    quiz: '🧠',
    reading: '📖',
    practical: '🔧'
  };
  return icons[type as keyof typeof icons] || '📄';
};

const formatModuleType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const isModuleCompleted = (moduleId: number) => {
  const completedModules = academyStore.userProgress.completedModules[courseId.value] || [];
  return completedModules.includes(moduleId);
};

const isModuleAccessible = (moduleIndex: number) => {
  if (!isEnrolled.value) return false;
  if (moduleIndex === 0) return true;

  // Check if previous module is completed
  const previousModule = course.value!.modules[moduleIndex - 1];
  return isModuleCompleted(previousModule.id);
};

const toggleModule = (moduleId: number) => {
  const index = expandedModules.value.indexOf(moduleId);
  if (index > -1) {
    expandedModules.value.splice(index, 1);
  } else {
    expandedModules.value.push(moduleId);
  }
};

const enrollInCourse = () => {
  academyStore.enrollInCourse(courseId.value);

  if (window.useToast) {
    window.useToast().academy("Welcome to the course! You can now start learning 🎓", "Successfully Enrolled!");
  }
};

const continueLearning = () => {
  // Find the next incomplete module
  const completedModules = academyStore.userProgress.completedModules[courseId.value] || [];
  const nextModule = course.value!.modules.find(module => !completedModules.includes(module.id));

  if (nextModule) {
    startModule(nextModule);
  }
};

const startModule = (module: Module) => {
  // Notificación chula al empezar
  if (window.useToast) {
    window.useToast().info(`Starting: ${module.title}`, "Module Started 📖");
  }

  // Simular completar módulo después de un momento
  setTimeout(() => {
    academyStore.completeModule(courseId.value, module.id);

    if (window.useToast) {
      window.useToast().success(`Great job! You completed "${module.title}" 🎉`, "Module Completed!");
    }
  }, 1500);
};

const goToCourse = (id: number) => {
  router.push(`/academy/course/${id}`);
};

onMounted(() => {
  if (!course.value) {
    router.push('/academy/courses');
  }
});
</script>

<style lang="scss" scoped>
.course-detail {
  min-height: 100vh;
  background: #f8fafc;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__hero {
    position: relative;
    background: #1e293b;
    color: white;
    overflow: hidden;
  }

  &__hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &__hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
  }

  &__hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 65, 108, 0.8), rgba(255, 75, 43, 0.8));
  }

  &__hero-content {
    position: relative;
    z-index: 2;
    padding: 2rem 0 3rem;
  }

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
  }

  &__breadcrumb-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: white;
    }
  }

  &__breadcrumb-separator {
    color: rgba(255, 255, 255, 0.6);
  }

  &__breadcrumb-current {
    color: white;
    font-weight: 500;
  }

  &__hero-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__badges {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  &__badge {
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;

    &--new {
      background: #10b981;
      color: white;
    }

    &--featured {
      background: #f59e0b;
      color: white;
    }

    &--level {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__description {
    font-size: 1.125rem;
    line-height: 1.6;
    opacity: 0.9;
    margin: 0 0 2rem 0;
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__meta-label {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  &__meta-value {
    font-size: 1rem;
    font-weight: 600;
  }

  &__stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__stat-icon {
    font-size: 1.5rem;
  }

  &__stat-text {
    display: flex;
    flex-direction: column;
  }

  &__stat-number {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
  }

  &__card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    color: #1e293b;
  }

  &__card-header {
    margin-bottom: 1.5rem;
  }

  &__card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  &__progress-info {
    margin-top: 1rem;
  }

  &__progress-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #FF416C;
    margin-bottom: 0.5rem;
    display: block;
  }

  &__progress-bar {
    width: 100%;
    height: 6px;
    background: #f1f5f9;
    border-radius: 3px;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF416C, #FF4B2B);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  &__enroll-btn,
  &__continue-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(#FF416C, 0.3);
    }
  }

  &__completed {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #10b981;
    color: white;
    border-radius: 12px;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  &__completed-icon {
    font-size: 1.25rem;
  }

  &__card-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #64748b;

    svg {
      color: #FF416C;
      flex-shrink: 0;
    }
  }

  &__content {
    padding: 3rem 0;
  }

  &__tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e2e8f0;
  }

  &__tab {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;

    &:hover {
      color: #1e293b;
    }

    &--active {
      color: #FF416C;
      border-bottom-color: #FF416C;
    }
  }

  &__tab-content {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  &__curriculum-header {
    margin-bottom: 2rem;
  }

  &__curriculum-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__curriculum-subtitle {
    color: #64748b;
    margin: 0;
  }

  &__modules {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__module {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
  }

  &__module-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    cursor: pointer;
    background: #f8fafc;
    transition: background-color 0.3s ease;

    &:hover {
      background: #f1f5f9;
    }
  }

  &__module-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  &__module-number {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  &__module-details {
    flex: 1;
    min-width: 0;
  }

  &__module-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  &__module-desc {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    line-height: 1.4;
  }

  &__module-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }
  }

  &__module-type {
    font-size: 0.75rem;
    color: #64748b;
    background: white;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  &__module-duration {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  &__module-status {
    font-size: 1.25rem;
  }

  &__module-content {
    padding: 1.25rem;
    border-top: 1px solid #e2e8f0;
    background: white;
  }

  &__module-preview {
    margin-bottom: 1rem;
  }

  &__video-placeholder {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 2px dashed #d1d5db;
  }

  &__video-icon {
    font-size: 2rem;
  }

  &__video-text {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  &__quiz-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #fef3c7;
    border-radius: 8px;
    border: 1px solid #fbbf24;
  }

  &__quiz-icon {
    font-size: 2rem;
  }

  &__quiz-info {
    flex: 1;
  }

  &__quiz-text {
    font-size: 1rem;
    font-weight: 600;
    color: #92400e;
    margin: 0 0 0.25rem 0;
  }

  &__quiz-details {
    font-size: 0.875rem;
    color: #b45309;
    margin: 0;
  }

  &__module-actions {
    display: flex;
    justify-content: center;
  }

  &__start-module-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(#FF416C, 0.3);
    }
  }

  &__module-locked-text {
    font-size: 0.875rem;
    color: #64748b;
    font-style: italic;
  }

  &__overview-section {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  &__learning-objectives,
  &__prerequisites {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__objective,
  &__prerequisite {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.5;
    margin: 0;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__tag {
    font-size: 0.875rem;
    background: #f1f5f9;
    color: #64748b;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
  }

  &__reviews-summary {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    text-align: center;
  }

  &__rating-overview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__rating-score {
    font-size: 3rem;
    font-weight: 700;
    color: #1e293b;
  }

  &__rating-stars {
    font-size: 1.5rem;
  }

  &__rating-text {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__reviews-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__review {
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  &__review-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__reviewer-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #64748b, #475569);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  &__reviewer-info {
    flex: 1;
  }

  &__reviewer-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  &__review-rating {
    display: flex;
    gap: 0.125rem;
  }

  &__review-star {
    font-size: 0.875rem;
  }

  &__review-date {
    font-size: 0.75rem;
    color: #64748b;
  }

  &__review-text {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.5;
    margin: 0;
  }

  &__related {
    padding: 3rem 0;
    background: white;
  }

  &__related-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 2rem 0;
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  &__related-card {
    background: #f8fafc;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }

  &__related-image {
    height: 140px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &__related-card:hover &__related-image img {
    transform: scale(1.05);
  }

  &__related-content {
    padding: 1rem;
  }

  &__related-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  &__related-instructor {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 0.75rem 0;
  }

  &__related-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #64748b;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 1rem;
  }

  &__loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-top: 3px solid #FF416C;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__loading-text {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
