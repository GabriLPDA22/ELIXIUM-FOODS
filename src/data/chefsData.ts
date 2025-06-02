// src/data/chefsData.ts
export interface Chef {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  experience: string;
  location: string;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  bio: string;
  signature_dishes: string[];
  achievements: string[];
  social: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  restaurant_affiliations: string[];
  featured: boolean;
}

export interface ChefCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const chefCategories: ChefCategory[] = [
  {
    id: 'internacional',
    name: 'Cocina Internacional',
    icon: '🌍',
    description: 'Chefs especializados en fusión y cocinas del mundo'
  },
  {
    id: 'tradicional',
    name: 'Cocina Tradicional',
    icon: '🥘',
    description: 'Maestros de la gastronomía española y regional'
  },
  {
    id: 'pasteleria',
    name: 'Pastelería & Postres',
    icon: '🍰',
    description: 'Expertos en dulces y creaciones artesanales'
  },
  {
    id: 'vegano',
    name: 'Cocina Vegana',
    icon: '🌱',
    description: 'Innovadores en alimentación plant-based'
  },
  {
    id: 'molecular',
    name: 'Gastronomía Molecular',
    icon: '⚗️',
    description: 'Pioneros en técnicas culinarias vanguardistas'
  }
];

export const chefsData: Chef[] = [
  {
    id: 'chef001',
    name: 'Chef María Delgado',
    slug: 'maria-delgado',
    specialty: 'Cocina Mediterránea Moderna',
    experience: '15 años',
    location: 'Madrid, España',
    rating: 4.9,
    totalReviews: 324,
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Chef María Delgado combina la tradición mediterránea con técnicas contemporáneas para crear experiencias culinarias únicas. Formada en Le Cordon Bleu París, ha trabajado en restaurantes con estrella Michelin en España y Francia.',
    signature_dishes: [
      'Paella de Mariscos Deconstruida',
      'Gazpacho de Remolacha con Caviar de Aceitunas',
      'Arroz Meloso de Bogavante y Azafrán',
      'Tarta de Limón con Merengue de Albahaca'
    ],
    achievements: [
      'Estrella Michelin 2022 - Restaurante Alameda',
      'Chef Revelación Nacional 2020',
      'Mejor Cocina Mediterránea - Premios Gastronómicos 2021',
      'Autora del libro "Mediterráneo en Evolución"'
    ],
    social: {
      instagram: '@chefmariadelgado',
      tiktok: '@maridelgadochef',
      youtube: 'Chef María Delgado'
    },
    restaurant_affiliations: [
      'Restaurante Alameda (Madrid)',
      'Bistró Mare Nostrum (Valencia)'
    ],
    featured: true
  },
  {
    id: 'chef002',
    name: 'Chef Alejandro Ruiz',
    slug: 'alejandro-ruiz',
    specialty: 'Cocina Japonesa Fusión',
    experience: '12 años',
    location: 'Barcelona, España',
    rating: 4.8,
    totalReviews: 289,
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Especialista en la fusión entre la tradición japonesa y los sabores mediterráneos. Formado en Tokio y con experiencia en los mejores restaurantes de sushi de Europa.',
    signature_dishes: [
      'Nigiri de Atún Rojo con Tomate Confitado',
      'Ramen de Jamón Ibérico y Miso',
      'Tempura de Verduras de Temporada',
      'Mochi de Manchego y Membrillo'
    ],
    achievements: [
      'Mejor Chef de Fusión 2021',
      'Sol Repsol 2020',
      'Champion World Sushi Cup Barcelona 2019'
    ],
    social: {
      instagram: '@aleruiz_sushi',
      tiktok: '@sushialejandro'
    },
    restaurant_affiliations: [
      'Sakura Fusión (Barcelona)',
      'Nikkei Barcelona'
    ],
    featured: true
  },
  {
    id: 'chef003',
    name: 'Chef Isabella Fontana',
    slug: 'isabella-fontana',
    specialty: 'Pastelería Artesanal',
    experience: '10 años',
    location: 'Sevilla, España',
    rating: 4.9,
    totalReviews: 412,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0c1d18b3308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Maestra pastelera especializada en postres artesanales y técnicas francesas. Su enfoque creativo y su pasión por los ingredientes locales la han convertido en una referencia en el mundo de la repostería.',
    signature_dishes: [
      'Tarta de Chocolate y Café con Oro Comestible',
      'Macarons de Azahar y Pistachos',
      'Croissant de Almendras y Miel de Romero',
      'Torrija Moderna con Helado de Vainilla'
    ],
    achievements: [
      'Mejor Pastelera de España 2022',
      'Medalla de Oro - Campeonato Mundial de Pastelería',
      'Autora de "Dulces Secretos del Sur"'
    ],
    social: {
      instagram: '@isabella_pastry',
      youtube: 'Isabella Fontana Pastry'
    },
    restaurant_affiliations: [
      'Dolce Isabella (Sevilla)',
      'Confitería Artesanal Fontana'
    ],
    featured: true
  },
  {
    id: 'chef004',
    name: 'Chef David Moreno',
    slug: 'david-moreno',
    specialty: 'Cocina Vegana Gourmet',
    experience: '8 años',
    location: 'Valencia, España',
    rating: 4.7,
    totalReviews: 198,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Pionero en la cocina vegana gourmet en España. David transforma ingredientes vegetales en obras maestras culinarias que sorprenden tanto a veganos como a omnívoros.',
    signature_dishes: [
      'Ceviche de Coliflor con Leche de Tigre Vegana',
      'Risotto de Quinoa con Setas de Temporada',
      'Burger de Lentejas Rojas y Quinoa',
      'Cheesecake Vegano de Matcha y Coco'
    ],
    achievements: [
      'Mejor Restaurante Vegano de España 2021',
      'Chef Sostenible del Año 2020',
      'Embajador de Alimentación Plant-Based'
    ],
    social: {
      instagram: '@davidmoreno_vegan',
      tiktok: '@vegangorumet',
      youtube: 'David Moreno Vegan'
    },
    restaurant_affiliations: [
      'Green Garden (Valencia)',
      'Plant-Based Paradise'
    ],
    featured: false
  },
  {
    id: 'chef005',
    name: 'Chef Roberto Sánchez',
    slug: 'roberto-sanchez',
    specialty: 'Gastronomía Molecular',
    experience: '14 años',
    location: 'Bilbao, España',
    rating: 4.8,
    totalReviews: 156,
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Experto en gastronomía molecular y técnicas culinarias vanguardistas. Roberto crea experiencias sensoriales únicas que desafían los límites de la cocina tradicional.',
    signature_dishes: [
      'Esferificación de Aceitunas con Anchoas',
      'Caviar de Balsámico y Aceite de Oliva',
      'Aire de Limón con Esencia de Albahaca',
      'Chocolate que Cambia de Sabor'
    ],
    achievements: [
      'Premio Innovación Culinaria 2021',
      'Colaborador en El Celler de Can Roca',
      'Pionero en Técnicas de Nitrógeno Líquido'
    ],
    social: {
      instagram: '@robertomolecular',
      youtube: 'Roberto Molecular Chef'
    },
    restaurant_affiliations: [
      'Laboratorio Gastronómico (Bilbao)',
      'Molecular Experience'
    ],
    featured: false
  },
  {
    id: 'chef006',
    name: 'Chef Carmen Vega',
    slug: 'carmen-vega',
    specialty: 'Cocina Tradicional Andaluza',
    experience: '20 años',
    location: 'Granada, España',
    rating: 4.9,
    totalReviews: 387,
    imageUrl: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Guardiana de las tradiciones culinarias andaluzas, Carmen Vega ha dedicado su vida a preservar y reinventar los sabores más auténticos del sur de España.',
    signature_dishes: [
      'Gazpacho de la Abuela con Toque Moderno',
      'Flamenquín de Cerdo Ibérico',
      'Pescaíto Frito de la Bahía',
      'Torrijas de Miel de Caña'
    ],
    achievements: [
      'Embajadora de la Cocina Andaluza',
      'Mejor Restaurante Tradicional 2020',
      'Autora de "Sabores de Andalucía"'
    ],
    social: {
      instagram: '@carmenvega_andaluza'
    },
    restaurant_affiliations: [
      'Casa Carmen (Granada)',
      'Taberna Los Sabores'
    ],
    featured: true
  }
];
