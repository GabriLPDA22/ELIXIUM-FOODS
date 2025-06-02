// src/data/categoriesData.ts
export interface CategoryInfo {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
  description: string;
  benefits: string[];
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  stats: {
    value: string;
    label: string;
  }[];
  commitment: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export const categoriesData: CategoryInfo[] = [
  {
    id: 'restaurants',
    title: 'Restaurantes Locales',
    icon: '🏪',
    subtitle: 'Sabores auténticos de tu comunidad',
    description: 'Descubre los tesoros gastronómicos de tu barrio. Cada restaurante en nuestra plataforma es un negocio familiar o local comprometido con ingredientes frescos, recetas tradicionales y el amor por la buena comida.',
    benefits: [
      'Apoyas directamente a familias de tu comunidad',
      'Ingredientes frescos y de temporada',
      'Recetas tradicionales y auténticas',
      'Menor huella de carbono por proximidad',
      'Precios justos sin intermediarios abusivos',
      'Trato personalizado y cercano'
    ],
    features: [
      {
        icon: '🌱',
        title: 'Productos KM 0',
        description: 'Ingredientes locales que viajan menos de 100km desde su origen hasta tu plato'
      },
      {
        icon: '👨‍🍳',
        title: 'Cocineros Locales',
        description: 'Chefs y cocineros de tu zona que conocen los sabores tradicionales'
      },
      {
        icon: '💚',
        title: 'Impacto Positivo',
        description: 'Cada pedido genera 3x más valor económico local que las grandes cadenas'
      },
      {
        icon: '🏆',
        title: 'Calidad Garantizada',
        description: 'Selección rigurosa basada en calidad, frescura y compromiso local'
      }
    ],
    stats: [
      { value: '25+', label: 'Restaurantes Locales' },
      { value: '100%', label: 'Negocios Familiares' },
      { value: '12%', label: 'Comisión vs 30% otros' },
      { value: '4.8★', label: 'Satisfacción Media' }
    ],
    commitment: 'Nos comprometemos a que el 85% de los ingredientes de nuestros restaurantes provengan de proveedores locales en un radio de 50km.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ctaText: 'Explorar Restaurantes',
    ctaLink: '/restaurants'
  },
  {
    id: 'delivery',
    title: 'Delivery Sostenible',
    icon: '🚴‍♂️',
    subtitle: 'Entregas que cuidan el planeta',
    description: 'Nuestro servicio de delivery está diseñado para minimizar el impacto ambiental mientras maximizamos la eficiencia. Repartidores locales, rutas optimizadas y packaging eco-friendly.',
    benefits: [
      'Repartidores de tu zona que conocen las calles',
      'Rutas optimizadas para reducir emisiones',
      'Packaging 100% biodegradable o reutilizable',
      'Tiempos de entrega más precisos',
      'Empleos locales dignos y bien remunerados',
      'Opciones de entrega en bicicleta y vehículos eléctricos'
    ],
    features: [
      {
        icon: '🌍',
        title: 'Huella Carbono Mínima',
        description: 'Entregas en un radio de 5km con vehículos eco-friendly y rutas inteligentes'
      },
      {
        icon: '📦',
        title: 'Packaging Verde',
        description: 'Solo trabajamos con restaurantes que usan envases compostables o reutilizables'
      },
      {
        icon: '⚡',
        title: 'Entregas Rápidas',
        description: 'Promedio de 25 minutos gracias a la proximidad de nuestros socios'
      },
      {
        icon: '👥',
        title: 'Repartidores Locales',
        description: 'Equipo de delivery de tu barrio con condiciones laborales justas'
      }
    ],
    stats: [
      { value: '25min', label: 'Tiempo Promedio' },
      { value: '95%', label: 'Entregas Puntuales' },
      { value: '23%', label: 'Menos CO2' },
      { value: '100%', label: 'Packaging Sostenible' }
    ],
    commitment: 'Para 2025 conseguiremos que el 80% de nuestras entregas sean neutras en carbono usando solo vehículos eléctricos y bicicletas.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ctaText: 'Ver Zonas de Entrega',
    ctaLink: '/delivery-zones'
  },
  {
    id: 'chefs',
    title: 'Chefs de la Comunidad',
    icon: '👨‍🍳',
    subtitle: 'Los artistas culinarios de tu barrio',
    description: 'Conoce a los talentosos chefs y cocineros que dan vida a cada plato. Desde abuelas con recetas familiares hasta jóvenes innovadores, todos unidos por la pasión de cocinar con productos locales.',
    benefits: [
      'Recetas transmitidas de generación en generación',
      'Innovación culinaria con ingredientes locales',
      'Trato directo con quien cocina tu comida',
      'Personalización de platos según gustos',
      'Apoyo a emprendedores gastronómicos locales',
      'Transparencia total sobre ingredientes y preparación'
    ],
    features: [
      {
        icon: '📚',
        title: 'Tradición Familiar',
        description: 'Chefs que preservan recetas tradicionales usando técnicas ancestrales'
      },
      {
        icon: '🎨',
        title: 'Creatividad Local',
        description: 'Innovación culinaria usando productos de temporada de la región'
      },
      {
        icon: '🤝',
        title: 'Conexión Directa',
        description: 'Comunicación directa con el chef para personalizar tu experiencia'
      },
      {
        icon: '🏅',
        title: 'Maestría Artesanal',
        description: 'Cada plato es una obra de arte hecha con pasión y dedicación'
      }
    ],
    stats: [
      { value: '47', label: 'Chefs Locales' },
      { value: '15+', label: 'Años Experiencia Media' },
      { value: '89%', label: 'Ingredientes Locales' },
      { value: '4.9★', label: 'Valoración Chefs' }
    ],
    commitment: 'Apoyamos a chefs locales ofreciendo formación en sostenibilidad, técnicas de aprovechamiento y conexión con proveedores de la zona.',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ctaText: 'Conocer Nuestros Chefs',
    ctaLink: '/chefs'
  }
];
