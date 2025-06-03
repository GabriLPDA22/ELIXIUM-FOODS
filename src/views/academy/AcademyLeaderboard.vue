<template>
  <div class="academy-leaderboard">
    <!-- Header -->
    <section class="academy-leaderboard__header">
      <div class="academy-leaderboard__container">
        <div class="academy-leaderboard__hero">
          <h1 class="academy-leaderboard__title">🏆 Leaderboard</h1>
          <p class="academy-leaderboard__subtitle">
            See how you rank against other learners in the Elixium Academy
          </p>
        </div>

        <!-- Filter Controls -->
        <div class="academy-leaderboard__filters">
          <div class="academy-leaderboard__filter-group">
            <label class="academy-leaderboard__filter-label">Time Period:</label>
            <select v-model="selectedPeriod" class="academy-leaderboard__filter-select">
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>

          <div class="academy-leaderboard__filter-group">
            <label class="academy-leaderboard__filter-label">Category:</label>
            <select v-model="selectedCategory" class="academy-leaderboard__filter-select">
              <option value="all">All Categories</option>
              <option value="points">Points</option>
              <option value="courses">Courses Completed</option>
              <option value="streak">Learning Streak</option>
              <option value="badges">Badges Earned</option>
            </select>
          </div>

          <div class="academy-leaderboard__filter-group">
            <label class="academy-leaderboard__filter-label">Department:</label>
            <select v-model="selectedDepartment" class="academy-leaderboard__filter-select">
              <option value="all">All Departments</option>
              <option value="operations">Operations</option>
              <option value="customer-service">Customer Service</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="delivery">Delivery Team</option>
              <option value="management">Management</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Top 3 Podium -->
    <section class="academy-leaderboard__podium">
      <div class="academy-leaderboard__container">
        <div class="academy-leaderboard__podium-wrapper">
          <!-- 2nd Place -->
          <div class="academy-leaderboard__podium-position academy-leaderboard__podium-position--second">
            <div class="academy-leaderboard__podium-rank">2</div>
            <div class="academy-leaderboard__podium-avatar">
              <img :src="topLearners[1]?.avatar || '/api/placeholder/80/80'" :alt="topLearners[1]?.name" />
              <div class="academy-leaderboard__podium-medal academy-leaderboard__podium-medal--silver">🥈</div>
            </div>
            <div class="academy-leaderboard__podium-info">
              <h3 class="academy-leaderboard__podium-name">{{ topLearners[1]?.name }}</h3>
              <p class="academy-leaderboard__podium-department">{{ topLearners[1]?.department }}</p>
              <div class="academy-leaderboard__podium-score">
                {{ formatScore(topLearners[1]?.score) }}
              </div>
            </div>
          </div>

          <!-- 1st Place -->
          <div class="academy-leaderboard__podium-position academy-leaderboard__podium-position--first">
            <div class="academy-leaderboard__podium-rank">1</div>
            <div class="academy-leaderboard__podium-avatar">
              <img :src="topLearners[0]?.avatar || '/api/placeholder/100/100'" :alt="topLearners[0]?.name" />
              <div class="academy-leaderboard__podium-medal academy-leaderboard__podium-medal--gold">👑</div>
            </div>
            <div class="academy-leaderboard__podium-info">
              <h3 class="academy-leaderboard__podium-name">{{ topLearners[0]?.name }}</h3>
              <p class="academy-leaderboard__podium-department">{{ topLearners[0]?.department }}</p>
              <div class="academy-leaderboard__podium-score">
                {{ formatScore(topLearners[0]?.score) }}
              </div>
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="academy-leaderboard__podium-position academy-leaderboard__podium-position--third">
            <div class="academy-leaderboard__podium-rank">3</div>
            <div class="academy-leaderboard__podium-avatar">
              <img :src="topLearners[2]?.avatar || '/api/placeholder/70/70'" :alt="topLearners[2]?.name" />
              <div class="academy-leaderboard__podium-medal academy-leaderboard__podium-medal--bronze">🥉</div>
            </div>
            <div class="academy-leaderboard__podium-info">
              <h3 class="academy-leaderboard__podium-name">{{ topLearners[2]?.name }}</h3>
              <p class="academy-leaderboard__podium-department">{{ topLearners[2]?.department }}</p>
              <div class="academy-leaderboard__podium-score">
                {{ formatScore(topLearners[2]?.score) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Your Position -->
    <section class="academy-leaderboard__your-position">
      <div class="academy-leaderboard__container">
        <div class="academy-leaderboard__your-card">
          <div class="academy-leaderboard__your-header">
            <h2 class="academy-leaderboard__your-title">Your Position</h2>
            <div class="academy-leaderboard__your-rank">#{{ currentUserRank }}</div>
          </div>

          <div class="academy-leaderboard__your-content">
            <div class="academy-leaderboard__your-avatar">
              <img :src="currentUser.avatar" :alt="currentUser.name" />
            </div>
            <div class="academy-leaderboard__your-info">
              <h3 class="academy-leaderboard__your-name">{{ currentUser.name }}</h3>
              <p class="academy-leaderboard__your-department">{{ currentUser.department }}</p>
              <div class="academy-leaderboard__your-stats">
                <div class="academy-leaderboard__your-stat">
                  <span class="academy-leaderboard__stat-label">Score:</span>
                  <span class="academy-leaderboard__stat-value">{{ formatScore(currentUser.score) }}</span>
                </div>
                <div class="academy-leaderboard__your-stat">
                  <span class="academy-leaderboard__stat-label">Level:</span>
                  <span class="academy-leaderboard__stat-value">{{ currentUser.level }}</span>
                </div>
              </div>
            </div>
            <div class="academy-leaderboard__your-progress">
              <div class="academy-leaderboard__progress-info">
                <span class="academy-leaderboard__progress-text">
                  {{ getProgressToNext() }}
                </span>
              </div>
              <div class="academy-leaderboard__progress-bar">
                <div
                  class="academy-leaderboard__progress-fill"
                  :style="{ width: `${getProgressPercentage()}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Full Leaderboard -->
    <section class="academy-leaderboard__full-list">
      <div class="academy-leaderboard__container">
        <div class="academy-leaderboard__list-header">
          <h2 class="academy-leaderboard__list-title">Full Rankings</h2>
          <div class="academy-leaderboard__list-info">
            Showing {{ filteredLeaderboard.length }} learners
          </div>
        </div>

        <div class="academy-leaderboard__table-wrapper">
          <table class="academy-leaderboard__table">
            <thead class="academy-leaderboard__table-head">
              <tr>
                <th class="academy-leaderboard__table-header">Rank</th>
                <th class="academy-leaderboard__table-header">Learner</th>
                <th class="academy-leaderboard__table-header">Department</th>
                <th class="academy-leaderboard__table-header">Score</th>
                <th class="academy-leaderboard__table-header">Level</th>
                <th class="academy-leaderboard__table-header">Achievements</th>
              </tr>
            </thead>
            <tbody class="academy-leaderboard__table-body">
              <tr
                v-for="(learner, index) in paginatedLeaderboard"
                :key="learner.id"
                :class="[
                  'academy-leaderboard__table-row',
                  { 'academy-leaderboard__table-row--current': learner.id === currentUser.id }
                ]"
              >
                <td class="academy-leaderboard__table-cell academy-leaderboard__table-cell--rank">
                  <div class="academy-leaderboard__rank-badge">
                    {{ startIndex + index + 1 }}
                  </div>
                </td>

                <td class="academy-leaderboard__table-cell academy-leaderboard__table-cell--learner">
                  <div class="academy-leaderboard__learner-info">
                    <div class="academy-leaderboard__learner-avatar">
                      <img :src="learner.avatar" :alt="learner.name" />
                      <div v-if="learner.isOnline" class="academy-leaderboard__online-indicator"></div>
                    </div>
                    <div class="academy-leaderboard__learner-details">
                      <div class="academy-leaderboard__learner-name">{{ learner.name }}</div>
                      <div class="academy-leaderboard__learner-streak">
                        🔥 {{ learner.streak }} day streak
                      </div>
                    </div>
                  </div>
                </td>

                <td class="academy-leaderboard__table-cell">
                  <span class="academy-leaderboard__department-tag">{{ learner.department }}</span>
                </td>

                <td class="academy-leaderboard__table-cell academy-leaderboard__table-cell--score">
                  <div class="academy-leaderboard__score-display">
                    {{ formatScore(learner.score) }}
                  </div>
                </td>

                <td class="academy-leaderboard__table-cell">
                  <span class="academy-leaderboard__level-badge">{{ learner.level }}</span>
                </td>

                <td class="academy-leaderboard__table-cell academy-leaderboard__table-cell--achievements">
                  <div class="academy-leaderboard__achievements">
                    <div class="academy-leaderboard__achievement-item">
                      <span class="academy-leaderboard__achievement-icon">🎓</span>
                      <span class="academy-leaderboard__achievement-count">{{ learner.coursesCompleted }}</span>
                    </div>
                    <div class="academy-leaderboard__achievement-item">
                      <span class="academy-leaderboard__achievement-icon">🏆</span>
                      <span class="academy-leaderboard__achievement-count">{{ learner.badgesEarned }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="academy-leaderboard__pagination">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="academy-leaderboard__page-btn academy-leaderboard__page-btn--prev"
          >
            ← Previous
          </button>

          <div class="academy-leaderboard__page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['academy-leaderboard__page-btn', { 'academy-leaderboard__page-btn--active': page === currentPage }]"
              @click="currentPage = page"
              :disabled="typeof page === 'string'"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="academy-leaderboard__page-btn academy-leaderboard__page-btn--next"
          >
            Next →
          </button>
        </div>
      </div>
    </section>

    <!-- Competition Banner -->
    <section class="academy-leaderboard__competition">
      <div class="academy-leaderboard__container">
        <div class="academy-leaderboard__competition-card">
          <div class="academy-leaderboard__competition-icon">🎯</div>
          <div class="academy-leaderboard__competition-content">
            <h3 class="academy-leaderboard__competition-title">Monthly Learning Challenge</h3>
            <p class="academy-leaderboard__competition-description">
              Complete 5 courses this month and earn the "Monthly Champion" badge plus exclusive rewards!
            </p>
            <div class="academy-leaderboard__competition-progress">
              <span class="academy-leaderboard__competition-text">{{ getCurrentMonthProgress() }} courses completed</span>
              <div class="academy-leaderboard__competition-bar">
                <div
                  class="academy-leaderboard__competition-fill"
                  :style="{ width: `${(getCurrentMonthProgress() / 5) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
          <div class="academy-leaderboard__competition-cta">
            <router-link to="/academy/courses" class="academy-leaderboard__competition-btn">
              Join Challenge
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAcademyStore } from '@/stores/academy';

const academyStore = useAcademyStore();

// Reactive state
const selectedPeriod = ref('all');
const selectedCategory = ref('all');
const selectedDepartment = ref('all');
const currentPage = ref(1);
const itemsPerPage = 15;

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: 1,
    name: 'Elena García',
    department: 'Operations',
    score: 4850,
    level: 'Expert',
    coursesCompleted: 12,
    badgesEarned: 8,
    streak: 28,
    avatar: '/api/placeholder/50/50',
    isOnline: true
  },
  {
    id: 2,
    name: 'Miguel Torres',
    department: 'Customer Service',
    score: 4620,
    level: 'Professional',
    coursesCompleted: 11,
    badgesEarned: 7,
    streak: 15,
    avatar: '/api/placeholder/50/50',
    isOnline: false
  },
  {
    id: 3,
    name: 'Sofia Ruiz',
    department: 'Kitchen Staff',
    score: 4380,
    level: 'Professional',
    coursesCompleted: 10,
    badgesEarned: 6,
    streak: 22,
    avatar: '/api/placeholder/50/50',
    isOnline: true
  },
  {
    id: 4,
    name: 'Carlos López',
    department: 'Delivery Team',
    score: 4150,
    level: 'Professional',
    coursesCompleted: 9,
    badgesEarned: 5,
    streak: 12,
    avatar: '/api/placeholder/50/50',
    isOnline: true
  },
  {
    id: 5,
    name: 'Ana Martínez',
    department: 'Management',
    score: 3980,
    level: 'Explorer',
    coursesCompleted: 8,
    badgesEarned: 4,
    streak: 8,
    avatar: '/api/placeholder/50/50',
    isOnline: false
  },
  // Current user (you)
  {
    id: 'current',
    name: 'You',
    department: 'Operations',
    score: 3750,
    level: 'Explorer',
    coursesCompleted: 7,
    badgesEarned: 3,
    streak: 5,
    avatar: '/api/placeholder/50/50',
    isOnline: true
  }
];

// Add more mock data
for (let i = 6; i <= 50; i++) {
  if (i === 6) continue; // Skip because current user is at position 6
  mockLeaderboard.push({
    id: i,
    name: `Learner ${i}`,
    department: ['Operations', 'Customer Service', 'Kitchen Staff', 'Delivery Team', 'Management'][i % 5],
    score: Math.max(1000, 4000 - (i * 50) + Math.floor(Math.random() * 200)),
    level: ['Rookie', 'Explorer', 'Professional', 'Expert'][Math.floor(i / 12)],
    coursesCompleted: Math.max(1, Math.floor(Math.random() * 10)),
    badgesEarned: Math.max(1, Math.floor(Math.random() * 6)),
    streak: Math.floor(Math.random() * 30),
    avatar: '/api/placeholder/50/50',
    isOnline: Math.random() > 0.5
  });
}

const currentUser = computed(() => mockLeaderboard.find(l => l.id === 'current')!);
const currentUserRank = computed(() =>
  mockLeaderboard.findIndex(l => l.id === 'current') + 1
);

const topLearners = computed(() => mockLeaderboard.slice(0, 3));

const filteredLeaderboard = computed(() => {
  let filtered = [...mockLeaderboard];

  if (selectedDepartment.value !== 'all') {
    filtered = filtered.filter(learner =>
      learner.department.toLowerCase().replace(' ', '-') === selectedDepartment.value
    );
  }

  // Sort by selected category
  switch (selectedCategory.value) {
    case 'courses':
      filtered.sort((a, b) => b.coursesCompleted - a.coursesCompleted);
      break;
    case 'streak':
      filtered.sort((a, b) => b.streak - a.streak);
      break;
    case 'badges':
      filtered.sort((a, b) => b.badgesEarned - a.badgesEarned);
      break;
    case 'points':
    default:
      filtered.sort((a, b) => b.score - a.score);
      break;
  }

  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredLeaderboard.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);

const paginatedLeaderboard = computed(() => {
  const start = startIndex.value;
  const end = start + itemsPerPage;
  return filteredLeaderboard.value.slice(start, end);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages: (number | string)[] = [];

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

const formatScore = (score: number) => {
  return score.toLocaleString() + ' pts';
};

const getProgressToNext = () => {
  const currentRank = currentUserRank.value;
  if (currentRank === 1) return 'You\'re #1! 🏆';

  const nextUser = filteredLeaderboard.value[currentRank - 2];
  const pointsNeeded = nextUser.score - currentUser.value.score;
  return `${pointsNeeded} points to rank #${currentRank - 1}`;
};

const getProgressPercentage = () => {
  const currentRank = currentUserRank.value;
  if (currentRank === 1) return 100;

  const nextUser = filteredLeaderboard.value[currentRank - 2];
  const currentScore = currentUser.value.score;
  const nextScore = nextUser.score;
  const prevScore = currentRank < filteredLeaderboard.value.length
    ? filteredLeaderboard.value[currentRank].score
    : 0;

  const progress = ((currentScore - prevScore) / (nextScore - prevScore)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

const getCurrentMonthProgress = () => {
  // Simulate current month progress
  return academyStore.userProgress.completedCourses.length % 5;
};
</script>

<style lang="scss" scoped>
.academy-leaderboard {
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
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0.9;
  }

  &__filter-select {
    padding: 0.5rem 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.875rem;
    outline: none;
    cursor: pointer;
    min-width: 150px;

    option {
      background: #1e293b;
      color: white;
    }

    &:focus {
      border-color: rgba(255, 255, 255, 0.6);
    }
  }

  &__podium {
    padding: 3rem 0;
    background: white;
  }

  &__podium-wrapper {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 2rem;
    flex-wrap: wrap;
  }

  &__podium-position {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 1.5rem;
    border-radius: 20px;
    transition: all 0.3s ease;

    &--first {
      order: 2;
      background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
      border: 3px solid #f59e0b;
      transform: scale(1.1);
      z-index: 3;

      .academy-leaderboard__podium-avatar {
        width: 100px;
        height: 100px;
      }
    }

    &--second {
      order: 1;
      background: linear-gradient(135deg, #f3f4f6 0%, #9ca3af 100%);
      border: 3px solid #6b7280;
      z-index: 2;

      .academy-leaderboard__podium-avatar {
        width: 80px;
        height: 80px;
      }
    }

    &--third {
      order: 3;
      background: linear-gradient(135deg, #fed7aa 0%, #f97316 100%);
      border: 3px solid #ea580c;
      z-index: 1;

      .academy-leaderboard__podium-avatar {
        width: 70px;
        height: 70px;
      }
    }

    &:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
  }

  &__podium-rank {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background: #1e293b;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
  }

  &__podium-avatar {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__podium-medal {
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 1.5rem;
    background: white;
    border-radius: 50%;
    padding: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &__podium-info {
    text-align: center;
  }

  &__podium-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  &__podium-department {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 0.75rem 0;
  }

  &__podium-score {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
  }

  &__your-position {
    padding: 2rem 0;
  }

  &__your-card {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: 2px solid #3b82f6;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  }

  &__your-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__your-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__your-rank {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 1.125rem;
    font-weight: 700;
  }

  &__your-content {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  &__your-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__your-info {
    flex: 1;
    min-width: 200px;
  }

  &__your-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }

  &__your-department {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 0.75rem 0;
  }

  &__your-stats {
    display: flex;
    gap: 1rem;
  }

  &__your-stat {
    display: flex;
    gap: 0.25rem;
  }

  &__stat-label {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__stat-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
  }

  &__your-progress {
    min-width: 200px;
    flex-grow: 1;
  }

  &__progress-info {
    margin-bottom: 0.5rem;
  }

  &__progress-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #3b82f6;
  }

  &__progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  &__full-list {
    padding: 2rem 0;
  }

  &__list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__list-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  &__list-info {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__table-wrapper {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f1f5f9;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__table-head {
    background: #f8fafc;
  }

  &__table-header {
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e2e8f0;
  }

  &__table-row {
    transition: all 0.3s ease;
    border-bottom: 1px solid #f1f5f9;

    &:hover {
      background: #f8fafc;
    }

    &--current {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border-color: #3b82f6;

      &:hover {
        background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__table-cell {
    padding: 1rem;
    vertical-align: middle;

    &--rank {
      width: 80px;
    }

    &--learner {
      min-width: 200px;
    }

    &--score {
      text-align: right;
    }

    &--achievements {
      width: 120px;
    }
  }

  &__rank-badge {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #64748b, #475569);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__learner-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__learner-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__online-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background: #10b981;
    border: 2px solid white;
    border-radius: 50%;
  }

  &__learner-details {
    flex: 1;
  }

  &__learner-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.125rem;
  }

  &__learner-streak {
    font-size: 0.75rem;
    color: #64748b;
  }

  &__department-tag {
    font-size: 0.75rem;
    background: #f1f5f9;
    color: #64748b;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  &__score-display {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  &__level-badge {
    font-size: 0.75rem;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-weight: 500;
  }

  &__achievements {
    display: flex;
    gap: 0.5rem;
  }

  &__achievement-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__achievement-icon {
    font-size: 0.875rem;
  }

  &__achievement-count {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
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

  &__competition {
    padding: 2rem 0;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  }

  &__competition-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    flex-wrap: wrap;
  }

  &__competition-icon {
    font-size: 3rem;
    flex-shrink: 0;
  }

  &__competition-content {
    flex: 1;
    min-width: 300px;
  }

  &__competition-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  &__competition-description {
    opacity: 0.9;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }

  &__competition-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__competition-text {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  &__competition-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
  }

  &__competition-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  &__competition-cta {
    flex-shrink: 0;
  }

  &__competition-btn {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 0.875rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(#FF416C, 0.3);
    }
  }
}
</style>
