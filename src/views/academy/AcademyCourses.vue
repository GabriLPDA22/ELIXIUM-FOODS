<template>
  <div class="academy-courses">
    <!-- Header -->
    <section class="academy-courses__header">
      <div class="academy-courses__container">
        <div class="academy-courses__hero">
          <h1 class="academy-courses__title">Course Catalog</h1>
          <p class="academy-courses__subtitle">
            Expand your skills with our comprehensive learning programs
          </p>
        </div>

        <!-- Search and Filters -->
        <div class="academy-courses__filters">
          <div class="academy-courses__search-container">
            <div class="academy-courses__search-input-wrapper">
              <svg class="academy-courses__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search courses, skills, instructors..."
                class="academy-courses__search-input"
                @input="handleSearch"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="academy-courses__search-clear"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="academy-courses__filter-tabs">
            <button
              v-for="category in categories"
              :key="category"
              :class="['academy-courses__filter-tab', { 'academy-courses__filter-tab--active': selectedCategory === category }]"
              @click="setCategory(category)"
            >
              {{ category }}
            </button>
          </div>

          <div class="academy-courses__filter-controls">
            <select v-model="selectedLevel" class="academy-courses__filter-select">
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              :class="['academy-courses__filter-toggle', { 'academy-courses__filter-toggle--active': showNewOnly }]"
              @click="toggleNewOnly"
            >
              🆕 New Courses
            </button>

            <button
              :class="['academy-courses__filter-toggle', { 'academy-courses__filter-toggle--active': showFeaturedOnly }]"
              @click="toggleFeaturedOnly"
            >
              ⭐ Featured
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="academy-courses__results">
      <div class="academy-courses__container">
        <div class="academy-courses__results-header">
          <div class="academy-courses__results-info">
            <h2 class="academy-courses__results-title">
              {{ getResultsTitle() }}
            </h2>
            <p class="academy-courses__results-count">
              {{ filteredCourses.length }} course{{ filteredCourses.length !== 1 ? 's' : '' }} found
            </p>
          </div>

          <div class="academy-courses__sort-container">
            <select v-model="sortBy" class="academy-courses__sort-select">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        <!-- Course Grid -->
        <div v-if="filteredCourses.length > 0" class="academy-courses__grid">
          <div
            v-for="course in paginatedCourses"
            :key="course.id"
            class="academy-courses__course-card"
            @click="goToCourse(course.id)"
          >
            <div class="academy-courses__course-image">
              <img :src="course.thumbnail" :alt="course.title" />
              <div class="academy-courses__course-badges">
                <span v-if="course.isNew" class="academy-courses__course-badge academy-courses__course-badge--new">
                  New
                </span>
                <span v-if="course.isFeatured" class="academy-courses__course-badge academy-courses__course-badge--featured">
                  Featured
                </span>
              </div>
              <div class="academy-courses__course-level">{{ course.level }}</div>
            </div>

            <div class="academy-courses__course-content">
              <div class="academy-courses__course-header">
                <h3 class="academy-courses__course-title">{{ course.title }}</h3>
                <span class="academy-courses__course-category">{{ course.category }}</span>
              </div>

              <p class="academy-courses__course-description">{{ course.description }}</p>

              <div class="academy-courses__course-instructor">
                <span class="academy-courses__instructor-label">by</span>
                <span class="academy-courses__instructor-name">{{ course.instructor }}</span>
              </div>

              <div class="academy-courses__course-meta">
                <div class="academy-courses__course-stats">
                  <div class="academy-courses__stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>{{ course.duration }}</span>
                  </div>
                  <div class="academy-courses__stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ course.studentsCount }} students</span>
                  </div>
                </div>

                <div class="academy-courses__course-rating">
                  <span class="academy-courses__rating-star">⭐</span>
                  <span class="academy-courses__rating-value">{{ course.rating }}</span>
                </div>
              </div>

              <div class="academy-courses__course-tags">
                <span
                  v-for="tag in course.tags.slice(0, 3)"
                  :key="tag"
                  class="academy-courses__course-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="academy-courses__course-actions">
                <button
                  class="academy-courses__enroll-btn"
                  @click.stop="enrollInCourse(course.id)"
                  :disabled="isEnrolled(course.id)"
                >
                  {{ isEnrolled(course.id) ? 'Enrolled ✓' : 'Enroll Now' }}
                </button>

                <div v-if="getCourseProgress(course.id) > 0" class="academy-courses__progress">
                  <div class="academy-courses__progress-bar">
                    <div
                      class="academy-courses__progress-fill"
                      :style="{ width: `${getCourseProgress(course.id)}%` }"
                    ></div>
                  </div>
                  <span class="academy-courses__progress-text">
                    {{ Math.round(getCourseProgress(course.id)) }}% complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="academy-courses__empty">
          <div class="academy-courses__empty-icon">🔍</div>
          <h3 class="academy-courses__empty-title">No courses found</h3>
          <p class="academy-courses__empty-message">
            Try adjusting your search or filter criteria
          </p>
          <button @click="clearAllFilters" class="academy-courses__clear-filters">
            Clear All Filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="academy-courses__pagination">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="academy-courses__page-btn academy-courses__page-btn--prev"
          >
            ← Previous
          </button>

          <div class="academy-courses__page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['academy-courses__page-btn', { 'academy-courses__page-btn--active': page === currentPage }]"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="academy-courses__page-btn academy-courses__page-btn--next"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAcademyStore } from '@/stores/academy';
import type { CourseCategory, CourseLevel } from '@/types/academy';

const router = useRouter();
const academyStore = useAcademyStore();

// Reactive state
const searchQuery = ref('');
const selectedCategory = ref<CourseCategory | ''>('');
const selectedLevel = ref<CourseLevel | ''>('');
const showNewOnly = ref(false);
const showFeaturedOnly = ref(false);
const sortBy = ref('popular');
const currentPage = ref(1);
const coursesPerPage = 9;

// Categories for filter tabs
const categories = computed(() => ['All', ...Array.from(new Set(academyStore.courses.map(c => c.category)))]);

// Filtered and sorted courses
const filteredCourses = computed(() => {
  let courses = academyStore.getFilteredCourses(
    selectedCategory.value || undefined,
    selectedLevel.value || undefined,
    searchQuery.value
  );

  if (showNewOnly.value) {
    courses = courses.filter(course => course.isNew);
  }

  if (showFeaturedOnly.value) {
    courses = courses.filter(course => course.isFeatured);
  }

  // Sort courses
  switch (sortBy.value) {
    case 'newest':
      courses = courses.filter(c => c.isNew).concat(courses.filter(c => !c.isNew));
      break;
    case 'rating':
      courses = courses.sort((a, b) => b.rating - a.rating);
      break;
    case 'title':
      courses = courses.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'popular':
    default:
      courses = courses.sort((a, b) => b.studentsCount - a.studentsCount);
      break;
  }

  return courses;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredCourses.value.length / coursesPerPage));

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  const end = start + coursesPerPage;
  return filteredCourses.value.slice(start, end);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, '...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...', total);
    }
  }

  return pages;
});

// Methods
const handleSearch = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const setCategory = (category: string) => {
  selectedCategory.value = category === 'All' ? '' : category as CourseCategory;
  currentPage.value = 1;
};

const toggleNewOnly = () => {
  showNewOnly.value = !showNewOnly.value;
  currentPage.value = 1;
};

const toggleFeaturedOnly = () => {
  showFeaturedOnly.value = !showFeaturedOnly.value;
  currentPage.value = 1;
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedLevel.value = '';
  showNewOnly.value = false;
  showFeaturedOnly.value = false;
  currentPage.value = 1;
};

const getResultsTitle = () => {
  if (searchQuery.value) {
    return `Search results for "${searchQuery.value}"`;
  }
  if (selectedCategory.value) {
    return `${selectedCategory.value} Courses`;
  }
  if (showNewOnly.value) {
    return 'New Courses';
  }
  if (showFeaturedOnly.value) {
    return 'Featured Courses';
  }
  return 'All Courses';
};

const goToCourse = (courseId: number) => {
  router.push(`/academy/course/${courseId}`);
};

const enrollInCourse = (courseId: number) => {
  academyStore.enrollInCourse(courseId);

  // Notificación chula
  if (window.useToast) {
    window.useToast().success("You're now enrolled! Start learning today 🚀", "Successfully Enrolled!");
  }
};

const isEnrolled = (courseId: number) => {
  return academyStore.userProgress.currentCourse === courseId ||
         academyStore.userProgress.completedCourses.includes(courseId);
};

const getCourseProgress = (courseId: number) => {
  return academyStore.getCourseProgress(courseId);
};

// Reset page when filters change
watch([selectedLevel, showNewOnly, showFeaturedOnly], () => {
  currentPage.value = 1;
});
</script>

<style lang="scss" scoped>
.academy-courses {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__header {
    background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%);
    padding: 2rem 0 3rem;
    color: white;
  }

  &__hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
  }

  &__filters {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__search-container {
    margin-bottom: 1.5rem;
  }

  &__search-input-wrapper {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
  }

  &__search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
  }

  &__search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.25);
    }
  }

  &__search-clear {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }

  &__filter-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__filter-tab {
    padding: 0.5rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    background: transparent;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
    }

    &--active {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.6);
    }
  }

  &__filter-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }

  &__filter-select {
    padding: 0.5rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.875rem;
    outline: none;
    cursor: pointer;

    option {
      background: #1e293b;
      color: white;
    }
  }

  &__filter-toggle {
    padding: 0.5rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    background: transparent;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &--active {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.6);
    }
  }

  &__results {
    padding: 2rem 0;
  }

  &__results-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__results-info {
    flex: 1;
  }

  &__results-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  &__results-count {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  &__sort-container {
    flex-shrink: 0;
  }

  &__sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    font-size: 0.875rem;
    outline: none;
    cursor: pointer;
    min-width: 150px;

    &:focus {
      border-color: #FF416C;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
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
    height: 200px;
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

  &__course-badges {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  &__course-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
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
    padding: 1.5rem;
  }

  &__course-header {
    margin-bottom: 0.75rem;
  }

  &__course-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  &__course-category {
    font-size: 0.875rem;
    color: #FF416C;
    font-weight: 500;
  }

  &__course-description {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.5;
    margin: 0 0 1rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__course-instructor {
    margin-bottom: 1rem;
  }

  &__instructor-label {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__instructor-name {
    font-size: 0.875rem;
    color: #1e293b;
    font-weight: 500;
    margin-left: 0.25rem;
  }

  &__course-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  &__course-stats {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: #64748b;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__course-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  &__rating-star {
    font-size: 1rem;
  }

  &__rating-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
  }

  &__course-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  &__course-tag {
    font-size: 0.75rem;
    background: #f8fafc;
    color: #64748b;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  &__course-actions {
    border-top: 1px solid #f1f5f9;
    padding-top: 1rem;
  }

  &__enroll-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 0.75rem;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(#FF416C, 0.3);
    }

    &:disabled {
      background: #e2e8f0;
      color: #64748b;
      cursor: not-allowed;
    }
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__progress-bar {
    flex: 1;
    height: 4px;
    background: #f1f5f9;
    border-radius: 2px;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF416C, #FF4B2B);
    border-radius: 2px;
    transition: width 0.5s ease;
  }

  &__progress-text {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
  }

  &__empty {
    text-align: center;
    padding: 3rem 1rem;
  }

  &__empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  &__empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__empty-message {
    font-size: 1rem;
    color: #64748b;
    margin: 0 0 1.5rem 0;
  }

  &__clear-filters {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
    }
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem 0;
  }

  &__page-btn {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;

    &:hover:not(:disabled) {
      border-color: #FF416C;
      color: #FF416C;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--active {
      background: linear-gradient(135deg, #FF416C, #FF4B2B);
      color: white;
      border-color: transparent;
    }

    &--prev,
    &--next {
      padding: 0.5rem 1rem;
      font-weight: 500;
    }
  }

  &__page-numbers {
    display: flex;
    gap: 0.25rem;
  }
}
</style>
