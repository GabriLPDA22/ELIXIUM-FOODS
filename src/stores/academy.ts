// stores/academy.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Course,
  UserProgress,
  Badge,
  Achievement,
  Certificate,
  CourseCategory,
  CourseLevel,
  UserLevel
} from '@/types/academy';
import { coursesData, badgesData, achievementsData } from '@/types/academy';

export const useAcademyStore = defineStore('academy', () => {
  // State
  const courses = ref<Course[]>(coursesData);
  const userProgress = ref<UserProgress>(getUserProgressFromStorage());
  const availableBadges = ref<Badge[]>(badgesData);
  const achievements = ref<Achievement[]>(achievementsData);
  const isLoading = ref(false);

  // Getters
  const completedCoursesCount = computed(() => userProgress.value.completedCourses.length);

  const currentLevel = computed(() => {
    const points = userProgress.value.points;
    if (points < 500) return 'Rookie';
    if (points < 1500) return 'Explorer';
    if (points < 3000) return 'Professional';
    if (points < 5000) return 'Expert';
    return 'Master';
  });

  const nextLevelProgress = computed(() => {
    const points = userProgress.value.points;
    const levels = [
      { level: 'Rookie', min: 0, max: 499 },
      { level: 'Explorer', min: 500, max: 1499 },
      { level: 'Professional', min: 1500, max: 2999 },
      { level: 'Expert', min: 3000, max: 4999 },
      { level: 'Master', min: 5000, max: Infinity }
    ];

    const currentLevelData = levels.find(l => points >= l.min && points <= l.max);
    if (!currentLevelData || currentLevelData.level === 'Master') {
      return { progress: 100, pointsToNext: 0, nextLevel: 'Master' };
    }

    const nextLevel = levels.find(l => l.min > currentLevelData.max);
    const progressInLevel = points - currentLevelData.min;
    const totalPointsInLevel = currentLevelData.max - currentLevelData.min + 1;
    const progressPercentage = (progressInLevel / totalPointsInLevel) * 100;

    return {
      progress: Math.min(progressPercentage, 100),
      pointsToNext: nextLevel ? nextLevel.min - points : 0,
      nextLevel: nextLevel?.level || 'Master'
    };
  });

  const featuredCourses = computed(() =>
    courses.value.filter(course => course.isFeatured)
  );

  const newCourses = computed(() =>
    courses.value.filter(course => course.isNew)
  );

  const coursesByCategory = computed(() => {
    const grouped: { [key: string]: Course[] } = {};
    courses.value.forEach(course => {
      if (!grouped[course.category]) {
        grouped[course.category] = [];
      }
      grouped[course.category].push(course);
    });
    return grouped;
  });

  const unlockedBadges = computed(() =>
    userProgress.value.badges.filter(badge => badge.unlockedAt)
  );

  const recentActivity = computed(() => {
    const activities = [];

    // Recent completions
    userProgress.value.completedCourses.slice(-3).forEach(courseId => {
      const course = courses.value.find(c => c.id === courseId);
      if (course) {
        activities.push({
          type: 'course_completed',
          title: `Completed "${course.title}"`,
          icon: '🎓',
          time: 'Recently'
        });
      }
    });

    // Recent badges
    userProgress.value.badges.slice(-2).forEach(badge => {
      activities.push({
        type: 'badge_earned',
        title: `Earned "${badge.title}" badge`,
        icon: badge.icon,
        time: badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Recently'
      });
    });

    return activities.slice(0, 5);
  });

  // Actions
  function getUserProgressFromStorage(): UserProgress {
    if (typeof window === 'undefined') {
      return getDefaultUserProgress();
    }

    const stored = localStorage.getItem('elixium-academy-progress');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getDefaultUserProgress();
      }
    }
    return getDefaultUserProgress();
  }

  function getDefaultUserProgress(): UserProgress {
    return {
      userId: 'user-123',
      completedCourses: [1],
      completedModules: { 1: [1, 2] },
      currentCourse: 2,
      currentModule: 1,
      points: 350,
      level: 'Rookie',
      badges: [
        {
          id: 'first-course',
          title: 'First Steps',
          description: 'Complete your first course',
          icon: '🎯',
          unlockedAt: new Date().toISOString(),
          rarity: 'common'
        }
      ],
      certificates: [
        {
          id: 'cert-1',
          courseId: 1,
          courseName: 'Delivery Excellence Mastery',
          completedAt: new Date().toISOString(),
          score: 95
        }
      ],
      streak: 5,
      lastActivity: new Date().toISOString()
    };
  }

  function saveProgressToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('elixium-academy-progress', JSON.stringify(userProgress.value));
    }
  }

  function completeModule(courseId: number, moduleId: number) {
    if (!userProgress.value.completedModules[courseId]) {
      userProgress.value.completedModules[courseId] = [];
    }

    if (!userProgress.value.completedModules[courseId].includes(moduleId)) {
      userProgress.value.completedModules[courseId].push(moduleId);
      userProgress.value.points += 50; // Points per module

      // Check if course is completed
      const course = courses.value.find(c => c.id === courseId);
      if (course && userProgress.value.completedModules[courseId].length === course.modules.length) {
        completeCourse(courseId);
      }

      checkForNewBadges();
      saveProgressToStorage();
    }
  }

  function completeCourse(courseId: number) {
    if (!userProgress.value.completedCourses.includes(courseId)) {
      userProgress.value.completedCourses.push(courseId);
      userProgress.value.points += 200; // Bonus points for course completion

      const course = courses.value.find(c => c.id === courseId);
      if (course) {
        // Add certificate
        const certificate: Certificate = {
          id: `cert-${courseId}`,
          courseId,
          courseName: course.title,
          completedAt: new Date().toISOString(),
          score: 85 + Math.floor(Math.random() * 15) // Random score 85-100
        };
        userProgress.value.certificates.push(certificate);
      }

      checkForNewBadges();
      saveProgressToStorage();
    }
  }

  function checkForNewBadges() {
    const newBadges: Badge[] = [];

    // Check for "First Steps" badge
    if (userProgress.value.completedCourses.length >= 1 &&
        !userProgress.value.badges.find(b => b.id === 'first-course')) {
      newBadges.push({
        ...availableBadges.value.find(b => b.id === 'first-course')!,
        unlockedAt: new Date().toISOString()
      });
    }

    // Check for "Knowledge Master" badge
    if (userProgress.value.completedCourses.length >= 10 &&
        !userProgress.value.badges.find(b => b.id === 'knowledge-master')) {
      newBadges.push({
        ...availableBadges.value.find(b => b.id === 'knowledge-master')!,
        unlockedAt: new Date().toISOString()
      });
    }

    // Check for "Weekly Warrior" badge
    if (userProgress.value.streak >= 7 &&
        !userProgress.value.badges.find(b => b.id === 'streak-week')) {
      newBadges.push({
        ...availableBadges.value.find(b => b.id === 'streak-week')!,
        unlockedAt: new Date().toISOString()
      });
    }

    if (newBadges.length > 0) {
      userProgress.value.badges.push(...newBadges);
      return newBadges; // Return for showing notifications
    }
    return [];
  }

  function enrollInCourse(courseId: number) {
    userProgress.value.currentCourse = courseId;
    userProgress.value.currentModule = 1;
    saveProgressToStorage();
  }

  function getCourseProgress(courseId: number) {
    const course = courses.value.find(c => c.id === courseId);
    if (!course) return 0;

    const completedModules = userProgress.value.completedModules[courseId]?.length || 0;
    return (completedModules / course.modules.length) * 100;
  }

  function getFilteredCourses(category?: CourseCategory, level?: CourseLevel, search?: string) {
    let filtered = courses.value;

    if (category) {
      filtered = filtered.filter(course => course.category === category);
    }

    if (level) {
      filtered = filtered.filter(course => course.level === level);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }

  function updateStreak() {
    const today = new Date().toDateString();
    const lastActivity = new Date(userProgress.value.lastActivity).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActivity === today) {
      // Already updated today
      return;
    } else if (lastActivity === yesterday) {
      // Continue streak
      userProgress.value.streak += 1;
    } else {
      // Reset streak
      userProgress.value.streak = 1;
    }

    userProgress.value.lastActivity = new Date().toISOString();
    saveProgressToStorage();
  }

  function getCourseById(id: number) {
    return courses.value.find(course => course.id === id);
  }

  function getRecommendedCourses() {
    const completed = userProgress.value.completedCourses;
    const currentLevel = userProgress.value.level;

    return courses.value
      .filter(course => !completed.includes(course.id))
      .filter(course => {
        // Recommend courses based on current level
        if (currentLevel === 'Rookie') return course.level === 'Beginner';
        if (currentLevel === 'Explorer') return ['Beginner', 'Intermediate'].includes(course.level);
        return true; // Advanced users can see all
      })
      .slice(0, 4);
  }

  return {
    // State
    courses,
    userProgress,
    availableBadges,
    achievements,
    isLoading,

    // Getters
    completedCoursesCount,
    currentLevel,
    nextLevelProgress,
    featuredCourses,
    newCourses,
    coursesByCategory,
    unlockedBadges,
    recentActivity,

    // Actions
    completeModule,
    completeCourse,
    enrollInCourse,
    getCourseProgress,
    getFilteredCourses,
    updateStreak,
    getCourseById,
    getRecommendedCourses,
    checkForNewBadges
  };
});
