// src/data/deliveryZonesData.ts - IMÁGENES OPTIMIZADAS
export interface DeliveryZone {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  postalCodes: string[];
  deliveryFee: number;
  freeDeliveryMinimum: number;
  estimatedTime: {
    min: number;
    max: number;
  };
  active: boolean;
  coverage: 'complete' | 'partial' | 'limited';
  specialNotes?: string;
  landmarks: string[];
  restaurantCount: number;
  popularCuisines: string[];
  mapCoordinates: {
    lat: number;
    lng: number;
    radius: number; // en km
  };
}

export interface CityInfo {
  id: string;
  name: string;
  province: string;
  totalZones: number;
  totalRestaurants: number;
  featured: boolean;
  imageUrl: string;
  description: string;
  status: 'active' | 'coming_soon' | 'planned';
  launchDate?: string;
}

export const cityInfo: CityInfo[] = [
  {
    id: 'zaragoza',
    name: 'Zaragoza',
    province: 'Aragón',
    totalZones: 12,
    totalRestaurants: 280,
    featured: true,
    status: 'active',
    imageUrl: 'https://media.istockphoto.com/id/1270026219/de/foto/alfonso-i-stra%C3%9Fe-in-saragossa-spanien.jpg?b=1&s=612x612&w=0&k=20&c=G8PpPV0v3fuIyofENP65OU9GcqbgdcSXvTjwPJ6VbWs=',
    description: 'Capital maña con sabores únicos y tradición gastronómica milenaria'
  },
  {
    id: 'huesca',
    name: 'Huesca',
    province: 'Aragón',
    totalZones: 4,
    totalRestaurants: 65,
    featured: false,
    status: 'coming_soon',
    launchDate: '2025-09-01',
    imageUrl: 'https://media.istockphoto.com/id/462434593/es/foto/catedral-de-saint-mary-huesca-comunidad-aut%C3%B3noma-de-arag%C3%B3n.jpg?b=1&s=612x612&w=0&k=20&c=qQGDPkuk6A62yhiBOsqojCcXWuI1BtHtDM6hqOdysYQ=',
    description: 'Próximamente en la bella ciudad altoaragonesa'
  },
  {
    id: 'teruel',
    name: 'Teruel',
    province: 'Aragón',
    totalZones: 3,
    totalRestaurants: 45,
    featured: false,
    status: 'coming_soon',
    launchDate: '2025-11-01',
    imageUrl: 'https://media.istockphoto.com/id/1007255148/es/foto/valderrobres-en-puesta-de-sol-reflejada-en-el-r%C3%ADo.jpg?b=1&s=612x612&w=0&k=20&c=BX6WlIoeqWGIdlkUXTw-njtzQloI7O_sIJLXHJxdziU=',
    description: 'Jamón, ternasco y tradición mudéjar próximamente'
  },
  {
    id: 'pamplona',
    name: 'Pamplona',
    province: 'Navarra',
    totalZones: 6,
    totalRestaurants: 85,
    featured: false,
    status: 'planned',
    // Casco histórico de Pamplona - imagen optimizada
    imageUrl: 'https://media.istockphoto.com/id/1325961586/es/foto/calle-estafeta-en-pamplona-espa%C3%B1a.jpg?b=1&s=612x612&w=0&k=20&c=toaCtAWjAXfQCX9AzgyhxtRlatk95rdClWGy8Jxe64M=',
    description: 'Expansión planificada a la capital navarra'
  },
  {
    id: 'logrono',
    name: 'Logroño',
    province: 'La Rioja',
    totalZones: 5,
    totalRestaurants: 70,
    featured: false,
    status: 'planned',
    // Calle Laurel de Logroño (zona de pinchos) - imagen optimizada
    imageUrl: 'https://media.istockphoto.com/id/939317686/es/foto/calle-de-logro%C3%B1o-espa%C3%B1a.jpg?b=1&s=612x612&w=0&k=20&c=3re5yHQmKSTeBiBdUtzEfLSGYoZamidusufK7BRtmv0=',
    description: 'Capital del vino, próxima en nuestros planes'
  }
];

export const deliveryZones: DeliveryZone[] = [
  // ZARAGOZA - CENTRO Y CASCO HISTÓRICO
  {
    id: 'zaragoza-centro',
    name: 'Centro Histórico',
    slug: 'zaragoza-centro',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50001', '50003', '50004'],
    deliveryFee: 2.50,
    freeDeliveryMinimum: 15.00,
    estimatedTime: { min: 20, max: 35 },
    active: true,
    coverage: 'complete',
    landmarks: ['Basílica del Pilar', 'Plaza del Pilar', 'Catedral del Salvador', 'Palacio de la Aljafería', 'Calle Alfonso I'],
    restaurantCount: 65,
    popularCuisines: ['Aragonesa', 'Tapas', 'Cordero', 'Ternasco', 'Migas'],
    mapCoordinates: { lat: 41.6561, lng: -0.8773, radius: 2.5 }
  },

  // UNIVERSIDAD
  {
    id: 'zaragoza-universidad',
    name: 'Universidad',
    slug: 'zaragoza-universidad',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50009', '50018'],
    deliveryFee: 2.80,
    freeDeliveryMinimum: 16.00,
    estimatedTime: { min: 25, max: 40 },
    active: true,
    coverage: 'complete',
    landmarks: ['Campus San Francisco', 'Paraninfo', 'Plaza San Francisco', 'Calle Doctor Cerrada'],
    restaurantCount: 42,
    popularCuisines: ['Internacional', 'Pizza', 'Kebab', 'Burguer', 'Asiática', 'Estudiantes'],
    mapCoordinates: { lat: 41.6439, lng: -0.8896, radius: 2.2 }
  },

  // DELICIAS
  {
    id: 'zaragoza-delicias',
    name: 'Delicias',
    slug: 'zaragoza-delicias',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50007', '50017'],
    deliveryFee: 3.00,
    freeDeliveryMinimum: 17.00,
    estimatedTime: { min: 30, max: 45 },
    active: true,
    coverage: 'complete',
    landmarks: ['Estación Delicias', 'Parque de los Valores', 'Centro Comercial Augusta', 'Avenida Navarra'],
    restaurantCount: 38,
    popularCuisines: ['Familiar', 'Española', 'Italiana', 'China', 'Comida Casera'],
    mapCoordinates: { lat: 41.6388, lng: -0.9209, radius: 3.8 }
  },

  // ROMAREDA
  {
    id: 'zaragoza-romareda',
    name: 'Romareda',
    slug: 'zaragoza-romareda',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50006', '50010'],
    deliveryFee: 2.90,
    freeDeliveryMinimum: 16.50,
    estimatedTime: { min: 25, max: 40 },
    active: true,
    coverage: 'complete',
    landmarks: ['Estadio La Romareda', 'Parque Grande', 'Avenida de Madrid', 'Plaza Roma'],
    restaurantCount: 31,
    popularCuisines: ['Deportiva', 'Carnes', 'Parrilla', 'Tex-Mex', 'Cervecería'],
    mapCoordinates: { lat: 41.6340, lng: -0.8518, radius: 2.8 }
  },

  // ACTUR
  {
    id: 'zaragoza-actur',
    name: 'Actur',
    slug: 'zaragoza-actur',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50015'],
    deliveryFee: 3.20,
    freeDeliveryMinimum: 18.00,
    estimatedTime: { min: 30, max: 45 },
    active: true,
    coverage: 'complete',
    landmarks: ['Centro Comercial Grancasa', 'Parque del Agua', 'Vía Hispanidad', 'Plaza de la Memoria'],
    restaurantCount: 25,
    popularCuisines: ['Familiar', 'Pizza', 'China', 'Hamburguesas', 'Heladerías'],
    mapCoordinates: { lat: 41.6892, lng: -0.8591, radius: 3.5 }
  },

  // SAN JOSÉ
  {
    id: 'zaragoza-san-jose',
    name: 'San José',
    slug: 'zaragoza-san-jose',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50008'],
    deliveryFee: 2.70,
    freeDeliveryMinimum: 15.50,
    estimatedTime: { min: 25, max: 40 },
    active: true,
    coverage: 'complete',
    landmarks: ['Plaza San José', 'Mercado Central', 'Calle Manifestación', 'Plaza de los Sitios'],
    restaurantCount: 35,
    popularCuisines: ['Tradicional', 'Mariscos', 'Asados', 'Tapeo', 'Vinos'],
    mapCoordinates: { lat: 41.6525, lng: -0.8901, radius: 2.0 }
  },

  // TORRERO
  {
    id: 'zaragoza-torrero',
    name: 'Torrero',
    slug: 'zaragoza-torrero',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50005'],
    deliveryFee: 3.10,
    freeDeliveryMinimum: 17.50,
    estimatedTime: { min: 30, max: 45 },
    active: true,
    coverage: 'complete',
    landmarks: ['Cementerio de Torrero', 'Parque de Torrero', 'Avenida de los Pirineos'],
    restaurantCount: 22,
    popularCuisines: ['Parrillas', 'Asadores', 'Familiar', 'Pollos Asados', 'Comida para llevar'],
    mapCoordinates: { lat: 41.6195, lng: -0.8564, radius: 2.7 }
  },

  // LAS FUENTES
  {
    id: 'zaragoza-las-fuentes',
    name: 'Las Fuentes',
    slug: 'zaragoza-las-fuentes',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50011'],
    deliveryFee: 3.30,
    freeDeliveryMinimum: 18.50,
    estimatedTime: { min: 35, max: 50 },
    active: true,
    coverage: 'partial',
    landmarks: ['Avenida de Cataluña', 'Centro Comercial Independencia', 'Parque de las Fuentes'],
    restaurantCount: 18,
    popularCuisines: ['Vecinal', 'Comida Casera', 'Bocadillos', 'Cafeterías', 'Dulces'],
    mapCoordinates: { lat: 41.6778, lng: -0.8345, radius: 3.2 }
  },

  // ALMOZARA
  {
    id: 'zaragoza-almozara',
    name: 'Almozara',
    slug: 'zaragoza-almozara',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50003', '50014'],
    deliveryFee: 2.80,
    freeDeliveryMinimum: 16.00,
    estimatedTime: { min: 25, max: 40 },
    active: true,
    coverage: 'complete',
    landmarks: ['Puente de Hierro', 'Parque del Agua', 'Expo Zaragoza', 'Pabellón Puente'],
    restaurantCount: 28,
    popularCuisines: ['Moderna', 'Fusión', 'Brunch', 'Cafeterías Especiales', 'Internacional'],
    mapCoordinates: { lat: 41.6714, lng: -0.8512, radius: 2.8 }
  },

  // SANTA ISABEL
  {
    id: 'zaragoza-santa-isabel',
    name: 'Santa Isabel',
    slug: 'zaragoza-santa-isabel',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50016'],
    deliveryFee: 3.40,
    freeDeliveryMinimum: 19.00,
    estimatedTime: { min: 35, max: 50 },
    active: true,
    coverage: 'partial',
    specialNotes: 'Zona en expansión - cobertura parcial en algunas calles',
    landmarks: ['Avenida de Compromiso de Caspe', 'Parque de Santa Isabel', 'Centro de Salud Santa Isabel'],
    restaurantCount: 15,
    popularCuisines: ['Familiar', 'Pollos', 'Pizza a Domicilio', 'Menús del día'],
    mapCoordinates: { lat: 41.6102, lng: -0.8892, radius: 2.5 }
  },

  // VALDEFIERRO
  {
    id: 'zaragoza-valdefierro',
    name: 'Valdefierro',
    slug: 'zaragoza-valdefierro',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50012'],
    deliveryFee: 3.50,
    freeDeliveryMinimum: 20.00,
    estimatedTime: { min: 40, max: 55 },
    active: true,
    coverage: 'limited',
    specialNotes: 'Zona residencial - horarios limitados de entrega',
    landmarks: ['Bulevar de Valdefierro', 'Centro Cívico Valdefierro', 'Parque de Valdefierro'],
    restaurantCount: 12,
    popularCuisines: ['Familiar', 'Pizza', 'China', 'Kebab', 'Comida Rápida'],
    mapCoordinates: { lat: 41.6015, lng: -0.9156, radius: 2.2 }
  },

  // OLIVER
  {
    id: 'zaragoza-oliver',
    name: 'Oliver',
    slug: 'zaragoza-oliver',
    city: 'Zaragoza',
    province: 'Aragón',
    postalCodes: ['50013'],
    deliveryFee: 3.60,
    freeDeliveryMinimum: 20.50,
    estimatedTime: { min: 40, max: 55 },
    active: true,
    coverage: 'limited',
    specialNotes: 'Barrio en desarrollo - ampliando cobertura gradualmente',
    landmarks: ['Parque Oliver', 'Centro Comercial Montecanal', 'Avenida de Montañana'],
    restaurantCount: 10,
    popularCuisines: ['Comida Rápida', 'Pizza', 'Hamburgueserías', 'Helados', 'Cafeterías'],
    mapCoordinates: { lat: 41.6892, lng: -0.8234, radius: 2.8 }
  }
];
