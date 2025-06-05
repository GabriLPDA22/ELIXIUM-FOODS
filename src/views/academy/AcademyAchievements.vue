<template>
  <div class="academy-achievements">
    <!-- Header -->
    <section class="academy-achievements__header">
      <div class="academy-achievements__container">
        <div class="academy-achievements__hero">
          <h1 class="academy-achievements__title">Your Achievements</h1>
          <p class="academy-achievements__subtitle">
            Track your learning progress and celebrate your milestones
          </p>
        </div>

        <!-- Overview Stats -->
        <div class="academy-achievements__overview">
          <div class="academy-achievements__stat-card">
            <div class="academy-achievements__stat-icon">🏆</div>
            <div class="academy-achievements__stat-content">
              <span class="academy-achievements__stat-number">{{ unlockedBadges.length }}</span>
              <span class="academy-achievements__stat-label">Badges Earned</span>
            </div>
          </div>

          <div class="academy-achievements__stat-card">
            <div class="academy-achievements__stat-icon">🎓</div>
            <div class="academy-achievements__stat-content">
              <span class="academy-achievements__stat-number">{{ userProgress.certificates.length }}</span>
              <span class="academy-achievements__stat-label">Certificates</span>
            </div>
          </div>

          <div class="academy-achievements__stat-card">
            <div class="academy-achievements__stat-icon">⭐</div>
            <div class="academy-achievements__stat-content">
              <span class="academy-achievements__stat-number">{{ userProgress.points }}</span>
              <span class="academy-achievements__stat-label">Total Points</span>
            </div>
          </div>

          <div class="academy-achievements__stat-card">
            <div class="academy-achievements__stat-icon">🔥</div>
            <div class="academy-achievements__stat-content">
              <span class="academy-achievements__stat-number">{{ userProgress.streak }}</span>
              <span class="academy-achievements__stat-label">Day Streak</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Tabs -->
    <section class="academy-achievements__content">
      <div class="academy-achievements__container">
        <div class="academy-achievements__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['academy-achievements__tab', { 'academy-achievements__tab--active': activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- Badges Tab -->
        <div v-if="activeTab === 'badges'" class="academy-achievements__tab-content">
          <div class="academy-achievements__badges-section">
            <div class="academy-achievements__section-header">
              <h2 class="academy-achievements__section-title">Achievement Badges</h2>
              <p class="academy-achievements__section-subtitle">
                Unlock badges by completing courses and reaching milestones
              </p>
            </div>

            <!-- Badges Grid -->
            <div class="academy-achievements__badges-grid">
              <div
                v-for="badge in allBadges"
                :key="badge.id"
                :class="[
                  'academy-achievements__badge-card',
                  {
                    'academy-achievements__badge-card--unlocked': isBadgeUnlocked(badge.id),
                    'academy-achievements__badge-card--locked': !isBadgeUnlocked(badge.id),
                    [`academy-achievements__badge-card--${badge.rarity}`]: true
                  }
                ]"
              >
                <div class="academy-achievements__badge-icon">
                  {{ isBadgeUnlocked(badge.id) ? badge.icon : '🔒' }}
                </div>

                <div class="academy-achievements__badge-content">
                  <h3 class="academy-achievements__badge-title">
                    {{ isBadgeUnlocked(badge.id) ? badge.title : '???' }}
                  </h3>
                  <p class="academy-achievements__badge-description">
                    {{ isBadgeUnlocked(badge.id) ? badge.description : 'Keep learning to unlock this badge!' }}
                  </p>

                  <div class="academy-achievements__badge-rarity">
                    <span class="academy-achievements__rarity-label">{{ formatRarity(badge.rarity) }}</span>
                  </div>

                  <div v-if="isBadgeUnlocked(badge.id)" class="academy-achievements__badge-date">
                    <span class="academy-achievements__earned-label">Earned on</span>
                    <span class="academy-achievements__earned-date">
                      {{ formatDate(getBadgeUnlockDate(badge.id)) }}
                    </span>
                  </div>
                </div>

                <div v-if="isBadgeUnlocked(badge.id)" class="academy-achievements__badge-shine"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates Tab -->
        <div v-if="activeTab === 'certificates'" class="academy-achievements__tab-content">
          <div class="academy-achievements__certificates-section">
            <div class="academy-achievements__section-header">
              <h2 class="academy-achievements__section-title">Course Certificates</h2>
              <p class="academy-achievements__section-subtitle">
                Professional certificates for completed courses
              </p>
            </div>

            <div v-if="userProgress.certificates.length > 0" class="academy-achievements__certificates-grid">
              <div
                v-for="certificate in userProgress.certificates"
                :key="certificate.id"
                class="academy-achievements__certificate-card"
              >
                <div class="academy-achievements__certificate-header">
                  <div class="academy-achievements__certificate-icon">🎓</div>
                  <div class="academy-achievements__certificate-badge">Certificate</div>
                </div>

                <div class="academy-achievements__certificate-content">
                  <h3 class="academy-achievements__certificate-title">{{ certificate.courseName }}</h3>
                  <div class="academy-achievements__certificate-score">
                    <span class="academy-achievements__score-label">Final Score:</span>
                    <span class="academy-achievements__score-value">{{ certificate.score }}%</span>
                  </div>
                  <div class="academy-achievements__certificate-date">
                    <span class="academy-achievements__completed-label">Completed on</span>
                    <span class="academy-achievements__completed-date">
                      {{ formatDate(certificate.completedAt) }}
                    </span>
                  </div>
                </div>

                <div class="academy-achievements__certificate-actions">
                  <button
                    @click="downloadCertificate(certificate)"
                    class="academy-achievements__download-btn"
                  >
                    📥 Download PDF
                  </button>
                  <button
                    @click="shareCertificate(certificate)"
                    class="academy-achievements__share-btn"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="academy-achievements__empty-certificates">
              <div class="academy-achievements__empty-icon">🎓</div>
              <h3 class="academy-achievements__empty-title">No certificates yet</h3>
              <p class="academy-achievements__empty-message">
                Complete your first course to earn a certificate!
              </p>
              <router-link to="/academy/courses" class="academy-achievements__browse-courses">
                Browse Courses
              </router-link>
            </div>
          </div>
        </div>

        <!-- Progress Tab -->
        <div v-if="activeTab === 'progress'" class="academy-achievements__tab-content">
          <div class="academy-achievements__progress-section">
            <div class="academy-achievements__section-header">
              <h2 class="academy-achievements__section-title">Learning Progress</h2>
              <p class="academy-achievements__section-subtitle">
                Track your advancement and set new goals
              </p>
            </div>

            <!-- Level Progress -->
            <div class="academy-achievements__level-card">
              <div class="academy-achievements__level-header">
                <h3 class="academy-achievements__level-title">Current Level</h3>
                <span class="academy-achievements__current-level">{{ currentLevel }}</span>
              </div>

              <div class="academy-achievements__level-progress">
                <div class="academy-achievements__level-bar">
                  <div
                    class="academy-achievements__level-fill"
                    :style="{ width: `${nextLevelProgress.progress}%` }"
                  ></div>
                </div>
                <div class="academy-achievements__level-info">
                  <span class="academy-achievements__current-points">{{ userProgress.points }} points</span>
                  <span class="academy-achievements__next-level">{{ nextLevelProgress.nextLevel }}</span>
                </div>
                <p class="academy-achievements__level-description">
                  {{ nextLevelProgress.pointsToNext > 0
                    ? `${nextLevelProgress.pointsToNext} points needed to reach ${nextLevelProgress.nextLevel}`
                    : 'You\'ve reached the highest level! Keep learning to maintain your streak.' }}
                </p>
              </div>
            </div>

            <!-- Achievements Progress -->
            <div class="academy-achievements__achievements-progress">
              <h3 class="academy-achievements__progress-title">Achievement Goals</h3>
              <div class="academy-achievements__goals-grid">
                <div
                  v-for="achievement in achievements"
                  :key="achievement.id"
                  class="academy-achievements__goal-card"
                >
                  <div class="academy-achievements__goal-icon">{{ achievement.icon }}</div>
                  <div class="academy-achievements__goal-content">
                    <h4 class="academy-achievements__goal-title">{{ achievement.title }}</h4>
                    <p class="academy-achievements__goal-description">{{ achievement.description }}</p>

                    <div class="academy-achievements__goal-progress">
                      <div class="academy-achievements__goal-bar">
                        <div
                          class="academy-achievements__goal-fill"
                          :style="{ width: `${(achievement.progress / achievement.target) * 100}%` }"
                        ></div>
                      </div>
                      <span class="academy-achievements__goal-text">
                        {{ achievement.progress }} / {{ achievement.target }}
                      </span>
                    </div>

                    <div class="academy-achievements__goal-reward">
                      <span class="academy-achievements__reward-label">Reward:</span>
                      <span class="academy-achievements__reward-value">{{ achievement.reward }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="academy-achievements__recent-activity">
              <h3 class="academy-achievements__activity-title">Recent Achievements</h3>
              <div class="academy-achievements__activity-list">
                <div
                  v-for="activity in recentActivity.slice(0, 5)"
                  :key="activity.title"
                  class="academy-achievements__activity-item"
                >
                  <div class="academy-achievements__activity-icon">{{ activity.icon }}</div>
                  <div class="academy-achievements__activity-content">
                    <p class="academy-achievements__activity-title">{{ activity.title }}</p>
                    <span class="academy-achievements__activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="academy-achievements__cta">
      <div class="academy-achievements__container">
        <div class="academy-achievements__cta-content">
          <h2 class="academy-achievements__cta-title">Ready to Earn More Achievements?</h2>
          <p class="academy-achievements__cta-subtitle">
            Continue your learning journey and unlock new badges and certificates
          </p>
          <div class="academy-achievements__cta-actions">
            <router-link to="/academy/courses" class="academy-achievements__cta-primary">
              Browse Courses
            </router-link>
            <router-link to="/academy" class="academy-achievements__cta-secondary">
              Back to Dashboard
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

const activeTab = ref('badges');

const tabs = [
  { id: 'badges', label: 'Badges', icon: '🏆' },
  { id: 'certificates', label: 'Certificates', icon: '🎓' },
  { id: 'progress', label: 'Progress', icon: '📊' }
];

const userProgress = computed(() => academyStore.userProgress);
const unlockedBadges = computed(() => academyStore.unlockedBadges);
const currentLevel = computed(() => academyStore.currentLevel);
const nextLevelProgress = computed(() => academyStore.nextLevelProgress);
const achievements = computed(() => academyStore.achievements);
const recentActivity = computed(() => academyStore.recentActivity);
const allBadges = computed(() => academyStore.availableBadges);

const isBadgeUnlocked = (badgeId: string) => {
  return unlockedBadges.value.some(badge => badge.id === badgeId);
};

const getBadgeUnlockDate = (badgeId: string) => {
  const badge = unlockedBadges.value.find(b => b.id === badgeId);
  return badge?.unlockedAt || '';
};

const formatRarity = (rarity: string) => {
  const rarityMap = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary'
  };
  return rarityMap[rarity as keyof typeof rarityMap] || rarity;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const downloadCertificate = (certificate: any) => {
  if (window.useToast) {
    window.useToast().success(`Your "${certificate.courseName}" certificate is downloading! 📜`, "Certificate Downloaded!");
  }
};
const shareCertificate = (certificate: any) => {
  // Simulate sharing
  if (navigator.share) {
    navigator.share({
      title: `I completed ${certificate.courseName}!`,
      text: `I just earned a certificate in ${certificate.courseName} with a score of ${certificate.score}%! 🎓`,
      url: window.location.href
    });
  } else {
    // Fallback: copy to clipboard
    const shareText = `I just earned a certificate in ${certificate.courseName} with a score of ${certificate.score}%! 🎓`;
    navigator.clipboard.writeText(shareText);

    if (window.useToast) {
      window.useToast().success("Share text copied to clipboard! 📋", "Ready to Share!");
    }
  }
};
</script>

<style lang="scss" scoped>
.academy-achievements {
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

  &__overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
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

  &__stat-content {
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

  &__content {
    padding: 3rem 0;
  }

  &__tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e2e8f0;
    overflow-x: auto;
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
    white-space: nowrap;

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

  &__section-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  &__section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__section-subtitle {
    color: #64748b;
    margin: 0;
  }

  &__badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  &__badge-card {
    position: relative;
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.3s ease;
    overflow: hidden;

    &--unlocked {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 2px solid #10b981;
      transform: scale(1);

      &:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 30px rgba(16, 185, 129, 0.2);
      }

      &.academy-achievements__badge-card--rare {
        border-color: #3b82f6;
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      }

      &.academy-achievements__badge-card--epic {
        border-color: #8b5cf6;
        background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
      }

      &.academy-achievements__badge-card--legendary {
        border-color: #f59e0b;
        background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
      }
    }

    &--locked {
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
      opacity: 0.7;

      &:hover {
        background: #e2e8f0;
      }
    }
  }

  &__badge-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  &__badge-content {
    text-align: center;
  }

  &__badge-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__badge-description {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0 0 1rem 0;
  }

  &__badge-rarity {
    margin-bottom: 1rem;
  }

  &__rarity-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    background: #e2e8f0;
    color: #64748b;
  }

  &__badge-card--unlocked {
    .academy-achievements__rarity-label {
      background: #10b981;
      color: white;
    }

    &.academy-achievements__badge-card--rare .academy-achievements__rarity-label {
      background: #3b82f6;
    }

    &.academy-achievements__badge-card--epic .academy-achievements__rarity-label {
      background: #8b5cf6;
    }

    &.academy-achievements__badge-card--legendary .academy-achievements__rarity-label {
      background: #f59e0b;
    }
  }

  &__badge-date {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__earned-label {
    font-size: 0.75rem;
    color: #64748b;
  }

  &__earned-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__badge-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  &__certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  &__certificate-card {
    background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
    border: 2px solid #10b981;
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.15);
    }
  }

  &__certificate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__certificate-icon {
    font-size: 2rem;
  }

  &__certificate-badge {
    background: #10b981;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__certificate-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
    line-height: 1.3;
  }

  &__certificate-score {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &__score-label {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__score-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #10b981;
  }

  &__certificate-date {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__completed-label {
    font-size: 0.875rem;
    color: #64748b;
  }

  &__completed-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  &__certificate-actions {
    display: flex;
    gap: 0.75rem;
  }

  &__download-btn,
  &__share-btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  &__download-btn {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(#FF416C, 0.3);
    }
  }

  &__share-btn {
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #e2e8f0;
      color: #1e293b;
    }
  }

  &__empty-certificates {
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
    color: #64748b;
    margin: 0 0 1.5rem 0;
  }

  &__browse-courses {
    display: inline-block;
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(#FF416C, 0.3);
    }
  }

  &__level-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px solid #3b82f6;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  &__level-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__level-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  &__current-level {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
  }

  &__level-bar {
    width: 100%;
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  &__level-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 6px;
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

  &__level-description {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  &__progress-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1.5rem 0;
  }

  &__goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  &__goal-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
  }

  &__goal-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  &__goal-content {
    flex: 1;
  }

  &__goal-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__goal-description {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 1rem 0;
    line-height: 1.4;
  }

  &__goal-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  &__goal-bar {
    flex: 1;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  &__goal-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF416C, #FF4B2B);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  &__goal-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    white-space: nowrap;
  }

  &__goal-reward {
    display: flex;
    gap: 0.5rem;
  }

  &__reward-label {
    font-size: 0.75rem;
    color: #64748b;
  }

  &__reward-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: #FF416C;
  }

  &__activity-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  &__activity-list {
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  &__activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;

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

  &__cta {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    padding: 3rem 0;
    color: white;
    text-align: center;
  }

  &__cta-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  &__cta-subtitle {
    font-size: 1.125rem;
    opacity: 0.9;
    margin: 0 0 2rem 0;
  }

  &__cta-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__cta-primary,
  &__cta-secondary {
    padding: 0.875rem 2rem;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  &__cta-primary {
    background: linear-gradient(135deg, #FF416C, #FF4B2B);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(#FF416C, 0.3);
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
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(0%) translateY(0%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}
</style>
