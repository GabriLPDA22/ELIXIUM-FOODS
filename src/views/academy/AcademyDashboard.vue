<template>
  <div class="academy-dashboard">
    <!-- Hero Section -->
    <section class="academy-dashboard__hero">
      <div class="academy-dashboard__hero-bg">
        <div class="academy-dashboard__hero-content">
          <div class="academy-dashboard__welcome">
            <h1 class="academy-dashboard__title">
              Welcome back, <span class="academy-dashboard__name">{{ userName }}</span>! 👋
            </h1>
            <p class="academy-dashboard__subtitle">
              Ready to level up your skills today?
            </p>
          </div>

          <div class="academy-dashboard__stats-grid">
            <div class="academy-dashboard__stat-card">
              <div class="academy-dashboard__stat-icon">🎓</div>
              <div class="academy-dashboard__stat-info">
                <span class="academy-dashboard__stat-number">{{ completedCoursesCount }}</span>
                <span class="academy-dashboard__stat-label">Courses Completed</span>
              </div>
            </div>

            <div class="academy-dashboard__stat-card">
              <div class="academy-dashboard__stat-icon">⭐</div>
              <div class="academy-dashboard__stat-info">
                <span class="academy-dashboard__stat-number">{{ userProgress.points }}</span>
                <span class="academy-dashboard__stat-label">Total Points</span>
              </div>
            </div>

            <div class="academy-dashboard__stat-card">
              <div class="academy-dashboard__stat-icon">🔥</div>
              <div class="academy-dashboard__stat-info">
                <span class="academy-dashboard__stat-number">{{ userProgress.streak }}</span>
                <span class="academy-dashboard__stat-label">Day Streak</span>
              </div>
            </div>

            <div class="academy-dashboard__stat-card">
              <div class="academy-dashboard__stat-icon">🏆</div>
              <div class="academy-dashboard__stat-info">
                <span class="academy-dashboard__stat-number">{{ unlockedBadges.length }}</span>
                <span class="academy-dashboard__stat-label">Badges Earned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Section -->
    <section class="academy-dashboard__progress">
      <div class="academy-dashboard__container">
        <div class="academy-dashboard__progress-grid">
          <!-- Level Progress -->
          <div class="academy-dashboard__progress-card">
            <div class="academy-dashboard__progress-header">
              <h3 class="academy-dashboard__progress-title">Your Learning Journey</h3>
              <span class="academy-dashboard__level-badge">{{ currentLevel }}</span>
            </div>

            <div class="academy-dashboard__level-progress">
              <div class="academy-dashboard__level-bar">
                <div
                  class="academy-dashboard__level-fill"
                  :style="{ width: `${nextLevelProgress.progress}%` }"
                ></div>
              </div>
              <div class="academy-dashboard__level-info">
                <span class="academy-dashboard__level-current">{{ currentLevel }}</span>
                <span class="academy-dashboard__level-next">{{ nextLevelProgress.nextLevel }}</span>
              </div>
              <p class="academy-dashboard__level-text">
                {{ nextLevelProgress.pointsToNext > 0
                  ? `${nextLevelProgress.pointsToNext} points to reach ${nextLevelProgress.nextLevel}`
                  : 'You\'ve reached the highest level!' }}
              </p>
            </div>
          </div>

          <!-- Current Course -->
          <div class="academy-dashboard__progress-card" v-if="currentCourse">
            <div class="academy-dashboard__progress-header">
              <h3 class="academy-dashboard__progress-title">Continue Learning</h3>
              <button class="academy-dashboard__continue-btn" @click="continueCourse">
                Continue →
              </button>
            </div>

            <div class="academy-dashboard__current-course">
              <div class="academy-dashboard__course-thumbnail">
                <img :src="currentCourse.thumbnail" :alt="currentCourse.title" />
              </div>
              <div class="academy-dashboard__course-info">
                <h4 class="academy-dashboard__course-title">{{ currentCourse.title }}</h4>
                <p class="academy-dashboard__course-category">{{ currentCourse.category }}</p>
                <div class="academy-dashboard__course-progress">
                  <div class="academy-dashboard__progress-bar">
                    <div
                      class="academy-dashboard__progress-fill"
                      :style="{ width: `${currentCourseProgress}%` }"
                    ></div>
                  </div>
                  <span class="academy-dashboard__progress-text">{{ Math.round(currentCourseProgress) }}% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="academy-dashboard__quick-actions">
      <div class="academy-dashboard__container">
        <h2 class="academy-dashboard__section-title">Quick Actions</h2>

        <div class="academy-dashboard__actions-grid">
          <router-link to="/academy/courses" class="academy-dashboard__action-card">
            <div class="academy-dashboard__action-icon">📚</div>
            <h3 class="academy-dashboard__action-title">Browse Courses</h3>
            <p class="academy-dashboard__action-desc">Explore our course catalog</p>
          </router-link>

          <router-link to="/academy/achievements" class="academy-dashboard__action-card">
            <div class="academy-dashboard__action-icon">🏆</div>
            <h3 class="academy-dashboard__action-title">Achievements</h3>
            <p class="academy-dashboard__action-desc">View your badges & certificates</p>
          </router-link>

          <router-link to="/academy/leaderboard" class="academy-dashboard__action-card">
            <div class="academy-dashboard__action-icon">📊</div>
            <h3 class="academy-dashboard__action-title">Leaderboard</h3>
            <p class="academy-dashboard__action-desc">See top performers</p>
          </router-link>

          <button class="academy-dashboard__action-card" @click="takeQuickAssessment">
            <div class="academy-dashboard__action-icon">🧠</div>
            <h3 class="academy-dashboard__action-title">Quick Assessment</h3>
            <p class="academy-dashboard__action-desc">Test your knowledge</p>
          </button>
        </div>
      </div>
    </section>

    <!-- Recommended Courses -->
    <section class="academy-dashboard__recommended">
      <div class="academy-dashboard__container">
        <div class="academy-dashboard__section-header">
          <h2 class="academy-dashboard__section-title">Recommended for You</h2>
          <router-link to="/academy/courses" class="academy-dashboard__view-all">
            View All →
          </router-link>
        </div>

        <div class="academy-dashboard__courses-grid">
          <div
            v-for="course in recommendedCourses"
            :key="course.id"
            class="academy-dashboard__course-card"
            @click="goToCourse(course.id)"
          >
            <div class="academy-dashboard__course-image">
              <img :src="course.thumbnail" :alt="course.title" />
              <div class="academy-dashboard__course-level">{{ course.level }}</div>
            </div>
            <div class="academy-dashboard__course-content">
              <h3 class="academy-dashboard__course-name">{{ course.title }}</h3>
              <p class="academy-dashboard__course-instructor">by {{ course.instructor }}</p>
              <div class="academy-dashboard__course-meta">
                <span class="academy-dashboard__course-duration">{{ course.duration }}</span>
                <div class="academy-dashboard__course-rating">
                  <span class="academy-dashboard__rating-star">⭐</span>
                  <span class="academy-dashboard__rating-value">{{ course.rating }}</span>
                </div>
              </div>
              <div class="academy-dashboard__course-tags">
                <span
                  v-for="tag in course.tags.slice(0, 2)"
                  :key="tag"
                  class="academy-dashboard__course-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="academy-dashboard__activity">
      <div class="academy-dashboard__container">
        <h2 class="academy-dashboard__section-title">Recent Activity</h2>

        <div class="academy-dashboard__activity-list">
          <div
            v-for="activity in recentActivity"
            :key="activity.title"
            class="academy-dashboard__activity-item"
          >
            <div class="academy-dashboard__activity-icon">{{ activity.icon }}</div>
            <div class="academy-dashboard__activity-content">
              <p class="academy-dashboard__activity-title">{{ activity.title }}</p>
              <span class="academy-dashboard__activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAcademyStore } from '@/stores/academy';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const academyStore = useAcademyStore();
const authStore = useAuthStore();

const userName = computed(() => authStore.user?.firstName || 'Learner');
const userProgress = computed(() => academyStore.userProgress);
const completedCoursesCount = computed(() => academyStore.completedCoursesCount);
const currentLevel = computed(() => academyStore.currentLevel);
const nextLevelProgress = computed(() => academyStore.nextLevelProgress);
const unlockedBadges = computed(() => academyStore.unlockedBadges);
const recentActivity = computed(() => academyStore.recentActivity);
const recommendedCourses = computed(() => academyStore.getRecommendedCourses());

const currentCourse = computed(() => {
  if (userProgress.value.currentCourse) {
    return academyStore.getCourseById(userProgress.value.currentCourse);
  }
  return null;
});

const currentCourseProgress = computed(() => {
  if (userProgress.value.currentCourse) {
    return academyStore.getCourseProgress(userProgress.value.currentCourse);
  }
  return 0;
});

const continueCourse = () => {
  if (userProgress.value.currentCourse) {
    router.push(`/academy/course/${userProgress.value.currentCourse}`);
  }
};

const goToCourse = (courseId: number) => {
  router.push(`/academy/course/${courseId}`);
};

const takeQuickAssessment = () => {
  // Simulamos un quick assessment - en producción esto abriría un modal con preguntas
  const assessmentQuestions = [
    "What's the most important factor in customer service?",
    "How do you handle difficult customers?",
    "What makes a great team leader?"
  ];

  const randomQuestion = assessmentQuestions[Math.floor(Math.random() * assessmentQuestions.length)];

  // Usar el sistema de toast
  if (window.useToast) {
    window.useToast().academy(
      `Quick question: "${randomQuestion}" - Complete courses to unlock full assessments!`,
      "🧠 Quick Assessment"
    );
  }

  // Dar puntos por intentar el assessment
  setTimeout(() => {
    academyStore.userProgress.points += 25;
    if (window.useToast) {
      window.useToast().success("You earned 25 points for taking the quick assessment!", "Points Earned! 🎉");
    }
  }, 2000);
};

onMounted(() => {
  academyStore.updateStreak();
});
</script>

<style lang="scss" scoped>
.academy-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);

  &__hero {
    position: relative;
    overflow: hidden;
    margin-bottom: 2rem;
  }

  &__hero-bg {
    background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%);
    padding: 2rem 1rem 3rem;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
      opacity: 0.3;
    }
  }

  &__hero-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  &__welcome {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 0.5rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__name {
    background: linear-gradient(45deg, #fff, #fef3c7);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }

  &__stat-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.25);
    }
  }

  &__stat-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  &__stat-info {
    display: flex;
    flex-direction: column;
  }

  &__stat-number {
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.25rem;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__progress {
    margin-bottom: 3rem;
  }

  &__progress-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__progress-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f1f5f9;
  }

  &__progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__progress-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__level-badge {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__continue-btn {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(#FF416C, 0.3);
    }
  }

  &__level-progress {
    margin-top: 1rem;
  }

  &__level-bar {
    width: 100%;
    height: 8px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  &__level-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF416C, #FF4B2B);
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  &__level-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  &__level-text {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  &__current-course {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__course-thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__course-info {
    flex: 1;
    min-width: 0;
  }

  &__course-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  &__course-category {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 0.75rem 0;
  }

  &__course-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__progress-bar {
    flex: 1;
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

  &__progress-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    white-space: nowrap;
  }

  &__quick-actions {
    margin-bottom: 3rem;
  }

  &__section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 1.5rem 0;
  }

  &__actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  &__action-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
    border: 1px solid #f1f5f9;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    text-align: left;
    display: block;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      border-color: #e2e8f0;
    }
  }

  &__action-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  &__action-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__action-desc {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    line-height: 1.4;
  }

  &__recommended {
    margin-bottom: 3rem;
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__view-all {
    color: #FF416C;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    transition: color 0.3s ease;

    &:hover {
      color: #FF4B2B;
    }
  }

  &__courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  &__course-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #f1f5f9;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
  }

  &__course-image {
    position: relative;
    height: 160px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &__course-card:hover &__course-image img {
    transform: scale(1.05);
  }

  &__course-level {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  &__course-content {
    padding: 1.25rem;
  }

  &__course-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  &__course-instructor {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 1rem 0;
  }

  &__course-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__course-duration {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__course-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__rating-star {
    font-size: 0.875rem;
  }

  &__rating-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__course-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__course-tag {
    font-size: 0.75rem;
    background: #f8fafc;
    color: #64748b;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  &__activity {
    margin-bottom: 2rem;
  }

  &__activity-list {
    background: white;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    overflow: hidden;
  }

  &__activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f8fafc;

    &:last-child {
      border-bottom: none;
    }
  }

  &__activity-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  &__activity-content {
    flex: 1;
  }

  &__activity-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  &__activity-time {
    font-size: 0.75rem;
    color: #64748b;
  }
}
</style>
