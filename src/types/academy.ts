// types/academy.ts
export interface Course {
  id: number;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string;
  modules: Module[];
  thumbnail: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading' | 'practical';
  videoUrl?: string;
  content?: string;
  quiz?: Quiz;
}

export interface Quiz {
  id: number;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  userId: string;
  completedCourses: number[];
  completedModules: { [courseId: number]: number[] };
  currentCourse?: number;
  currentModule?: number;
  points: number;
  level: UserLevel;
  badges: Badge[];
  certificates: Certificate[];
  streak: number;
  lastActivity: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Certificate {
  id: string;
  courseId: number;
  courseName: string;
  completedAt: string;
  score: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: string;
}

export type CourseCategory =
  | 'Leadership'
  | 'Operations'
  | 'Customer Service'
  | 'Technology'
  | 'Business Development'
  | 'Food Safety'
  | 'Marketing';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type UserLevel = 'Rookie' | 'Explorer' | 'Professional' | 'Expert' | 'Master';

// Mock Data
export const coursesData: Course[] = [
  {
    id: 1,
    title: "Delivery Excellence Mastery",
    description: "Master the art of efficient delivery operations and customer satisfaction in the food delivery industry.",
    category: "Operations",
    level: "Beginner",
    duration: "2 weeks",
    instructor: "Carlos Rodríguez",
    rating: 4.8,
    studentsCount: 1247,
    thumbnail: "/images/courses/delivery-excellence.jpg",
    tags: ["🚚 Logistics", "⭐ Customer Focus", "📱 Technology"],
    isNew: true,
    modules: [
      {
        id: 1,
        title: "Introduction to Delivery Operations",
        description: "Understanding the fundamentals of food delivery systems",
        duration: "15 min",
        type: "video",
        videoUrl: "/videos/intro-delivery.mp4"
      },
      {
        id: 2,
        title: "Route Optimization Techniques",
        description: "Learn how to optimize delivery routes for maximum efficiency",
        duration: "25 min",
        type: "video",
        videoUrl: "/videos/route-optimization.mp4"
      },
      {
        id: 3,
        title: "Customer Communication Best Practices",
        description: "Master professional communication with customers",
        duration: "20 min",
        type: "reading",
        content: "Effective customer communication..."
      },
      {
        id: 4,
        title: "Module 1 Assessment",
        description: "Test your knowledge on delivery basics",
        duration: "10 min",
        type: "quiz",
        quiz: {
          id: 1,
          passingScore: 80,
          questions: [
            {
              id: 1,
              question: "What is the most important factor in delivery efficiency?",
              options: ["Speed", "Route planning", "Vehicle type", "Time of day"],
              correctAnswer: 1,
              explanation: "Route planning is crucial for optimal delivery efficiency and customer satisfaction."
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    title: "Leadership in Food Service",
    description: "Develop essential leadership skills for managing teams in the fast-paced food service environment.",
    category: "Leadership",
    level: "Intermediate",
    duration: "3 weeks",
    instructor: "María González",
    rating: 4.9,
    studentsCount: 892,
    thumbnail: "/images/courses/leadership.jpg",
    tags: ["👥 Team Building", "🎯 Strategy", "💬 Communication"],
    isFeatured: true,
    modules: [
      {
        id: 1,
        title: "Foundations of Food Service Leadership",
        description: "Core principles of leading in food service",
        duration: "30 min",
        type: "video"
      },
      {
        id: 2,
        title: "Team Motivation Strategies",
        description: "How to keep your team motivated during busy periods",
        duration: "25 min",
        type: "video"
      },
      {
        id: 3,
        title: "Conflict Resolution",
        description: "Managing conflicts in high-pressure environments",
        duration: "35 min",
        type: "practical"
      }
    ]
  },
  {
    id: 3,
    title: "Customer Experience Excellence",
    description: "Create exceptional customer experiences that drive loyalty and business growth.",
    category: "Customer Service",
    level: "Beginner",
    duration: "1 week",
    instructor: "Ana López",
    rating: 4.7,
    studentsCount: 1584,
    thumbnail: "/images/courses/customer-experience.jpg",
    tags: ["😊 Satisfaction", "🔄 Retention", "📞 Support"],
    modules: [
      {
        id: 1,
        title: "Understanding Customer Needs",
        description: "Identifying and addressing customer expectations",
        duration: "20 min",
        type: "video"
      },
      {
        id: 2,
        title: "Handling Complaints Professionally",
        description: "Turn complaints into opportunities",
        duration: "30 min",
        type: "video"
      }
    ]
  },
  {
    id: 4,
    title: "Food Safety & Hygiene Standards",
    description: "Comprehensive training on food safety protocols and hygiene standards for food service professionals.",
    category: "Food Safety",
    level: "Beginner",
    duration: "1 week",
    instructor: "Dr. Roberto Sánchez",
    rating: 4.9,
    studentsCount: 2156,
    thumbnail: "/images/courses/food-safety.jpg",
    tags: ["🧼 Hygiene", "✅ Compliance", "🛡️ Safety"],
    modules: [
      {
        id: 1,
        title: "Food Safety Fundamentals",
        description: "Basic principles of food safety",
        duration: "25 min",
        type: "video"
      }
    ]
  },
  {
    id: 5,
    title: "Digital Marketing for Restaurants",
    description: "Learn modern marketing strategies to boost restaurant visibility and customer acquisition.",
    category: "Marketing",
    level: "Advanced",
    duration: "4 weeks",
    instructor: "Lucía Fernández",
    rating: 4.6,
    studentsCount: 634,
    thumbnail: "/images/courses/digital-marketing.jpg",
    tags: ["📱 Social Media", "📊 Analytics", "🎯 Targeting"],
    modules: [
      {
        id: 1,
        title: "Social Media Strategy",
        description: "Building an effective social media presence",
        duration: "40 min",
        type: "video"
      }
    ]
  },
  {
    id: 6,
    title: "Tech Skills for Food Service",
    description: "Essential technology skills for modern food service operations.",
    category: "Technology",
    level: "Intermediate",
    duration: "2 weeks",
    instructor: "Diego Martín",
    rating: 4.5,
    studentsCount: 758,
    thumbnail: "/images/courses/tech-skills.jpg",
    tags: ["💻 Software", "📱 Apps", "🔧 Tools"],
    modules: [
      {
        id: 1,
        title: "POS Systems Mastery",
        description: "Efficient use of point-of-sale systems",
        duration: "35 min",
        type: "practical"
      }
    ]
  }
];

export const badgesData: Badge[] = [
  {
    id: "first-course",
    title: "First Steps",
    description: "Complete your first course",
    icon: "🎯",
    unlockedAt: "",
    rarity: "common"
  },
  {
    id: "speed-learner",
    title: "Speed Learner",
    description: "Complete a course in under 3 days",
    icon: "⚡",
    unlockedAt: "",
    rarity: "rare"
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    description: "Get 100% on all quizzes in a course",
    icon: "🏆",
    unlockedAt: "",
    rarity: "epic"
  },
  {
    id: "knowledge-master",
    title: "Knowledge Master",
    description: "Complete 10 courses",
    icon: "👑",
    unlockedAt: "",
    rarity: "legendary"
  },
  {
    id: "streak-week",
    title: "Weekly Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    unlockedAt: "",
    rarity: "rare"
  }
];

export const achievementsData: Achievement[] = [
  {
    id: "courses-completed",
    title: "Course Completionist",
    description: "Complete courses to unlock rewards",
    icon: "📚",
    progress: 0,
    target: 5,
    reward: "Certificate Badge"
  },
  {
    id: "points-earned",
    title: "Point Collector",
    description: "Earn points through learning activities",
    icon: "⭐",
    progress: 0,
    target: 1000,
    reward: "Bonus Learning Path"
  },
  {
    id: "quiz-master",
    title: "Quiz Champion",
    description: "Excel in course assessments",
    icon: "🧠",
    progress: 0,
    target: 20,
    reward: "Expert Badge"
  }
];
