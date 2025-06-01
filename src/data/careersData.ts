// src/data/careersData.ts
export interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: string
  slug: string
  shortDescription: string
  responsibilities?: string[]
  qualifications?: string[]
}

export const jobOpenings: JobOpening[] = [
  {
    id: 'fsd001',
    title: 'Desarrollador/a Full Stack (Node.js & Vue.js)',
    department: 'Tecnología',
    location: 'Madrid, España (Híbrido)',
    type: 'Jornada Completa',
    slug: 'desarrollador-full-stack-madrid',
    shortDescription:
      'Buscamos un/a crack del desarrollo Full Stack para crear soluciones innovadoras que revolucionarán la forma en que la gente disfruta de la comida.',
    responsibilities: [
      'Diseñar, desarrollar y mantener aplicaciones web escalables y de alto rendimiento.',
      'Colaborar estrechamente con diseñadores UX/UI y product managers.',
      'Escribir código limpio, testeable y eficiente.',
      'Participar activamente en la mejora continua de nuestros procesos y tecnologías.',
    ],
    qualifications: [
      'Experiencia sólida con Node.js, Express/NestJS.',
      'Dominio de Vue.js (Vue 2/3), Vuex/Pinia, Vue Router.',
      'Conocimiento de bases de datos (SQL y NoSQL).',
      'Experiencia con Docker, Kubernetes y CI/CD es un plus.',
      'Pasión por la tecnología y el sector foodtech.',
    ],
  },
  {
    id: 'mkt002',
    title: 'Especialista en Marketing Digital y SEO',
    department: 'Marketing',
    location: 'Barcelona, España (Presencial)',
    type: 'Jornada Completa',
    slug: 'especialista-marketing-digital-seo-barcelona',
    shortDescription:
      '¿Te apasiona el marketing digital? Únete para potenciar nuestra presencia online y atraer a miles de amantes de la buena comida.',
    responsibilities: [
      'Desarrollar e implementar estrategias de SEO y SEM.',
      'Gestionar campañas de publicidad online (Google Ads, Social Ads).',
      'Analizar métricas y optimizar el rendimiento de las campañas.',
      'Crear contenido atractivo y optimizado para nuestros canales digitales.',
    ],
    qualifications: [
      'Experiencia demostrable en marketing digital, SEO/SEM.',
      'Dominio de herramientas como Google Analytics, Google Ads, SEMrush/Ahrefs.',
      'Excelentes habilidades de comunicación y redacción creativa.',
      'Capacidad analítica y orientación a resultados.',
    ],
  },
  {
    id: 'ops003',
    title: 'Coordinador/a de Operaciones Logísticas',
    department: 'Operaciones',
    location: 'Valencia, España (Híbrido)',
    type: 'Jornada Completa',
    slug: 'coordinador-operaciones-logisticas-valencia',
    shortDescription:
      'Buscamos una persona organizada para asegurar que nuestra cadena de entrega funcione a la perfección, garantizando la satisfacción de todos.',
    responsibilities: [
      'Supervisar y optimizar las rutas de entrega.',
      'Gestionar la flota de repartidores y solucionar incidencias en tiempo real.',
      'Analizar datos operativos para mejorar la eficiencia y reducir costes.',
      'Colaborar con restaurantes y equipo de soporte para garantizar una experiencia excelente.',
    ],
    qualifications: [
      'Experiencia en logística, preferiblemente en el sector delivery o última milla.',
      'Capacidad para trabajar bajo presión y tomar decisiones rápidas.',
      'Habilidades analíticas y dominio de herramientas ofimáticas.',
      'Excelentes dotes de comunicación y liderazgo.',
    ],
  },
  {
    id: 'intern001',
    title: 'Prácticas en Experiencia de Usuario (UX/UI)',
    department: 'Producto y Diseño',
    location: 'Remoto (España)',
    type: 'Prácticas (6 meses)',
    slug: 'practicas-ux-ui-remoto',
    shortDescription:
      '¡Tu oportunidad para aprender y crecer! Ayúdanos a diseñar interfaces intuitivas y experiencias memorables para nuestros usuarios.',
    responsibilities: [
      'Colaborar en la investigación de usuarios y análisis de necesidades.',
      'Participar en la creación de wireframes, prototipos y flujos de usuario.',
      'Asistir en la realización de pruebas de usabilidad.',
      'Trabajar de la mano con desarrolladores para asegurar la correcta implementación de los diseños.',
    ],
    qualifications: [
      'Estudiante de últimos cursos o recién graduado/a en Diseño, Interacción Persona-Ordenador o similar.',
      'Portfolio con proyectos de diseño UX/UI (académicos o personales).',
      'Conocimiento de herramientas como Figma, Sketch o Adobe XD.',
      'Gran atención al detalle y ganas de aprender.',
    ],
  },
  {
    id: 'cs004',
    title: 'Agente de Soporte al Cliente (Fines de Semana)',
    department: 'Soporte',
    location: 'Remoto (España)',
    type: 'Media Jornada',
    slug: 'agente-soporte-cliente-findesemana',
    shortDescription:
      'Sé la voz amigable de Elixium Foods. Ayuda a nuestros clientes y restaurantes a resolver sus dudas y problemas con una sonrisa.',
    responsibilities: [
      'Atender consultas y resolver incidencias de clientes y restaurantes por chat, email y teléfono.',
      'Proporcionar información clara y precisa sobre nuestros servicios.',
      'Registrar interacciones y escalar casos complejos cuando sea necesario.',
      'Contribuir a la mejora continua de nuestros procesos de soporte.',
    ],
    qualifications: [
      'Excelentes habilidades de comunicación oral y escrita en español (inglés es un plus).',
      'Experiencia previa en atención al cliente o roles similares.',
      'Empatía, paciencia y una fuerte orientación a la resolución de problemas.',
      'Disponibilidad para trabajar fines de semana y festivos.',
    ],
  },
  {
    id: 'data005',
    title: 'Analista de Datos Junior',
    department: 'Tecnología',
    location: 'Madrid, España (Híbrido)',
    type: 'Jornada Completa',
    slug: 'analista-datos-junior-madrid',
    shortDescription:
      'Transforma datos en insights. Ayuda a Elixium Foods a tomar decisiones estratégicas basadas en análisis rigurosos y visualizaciones claras.',
    responsibilities: [
      'Recopilar, limpiar y analizar grandes volúmenes de datos.',
      'Desarrollar dashboards e informes para diferentes áreas de la empresa.',
      'Identificar tendencias, patrones y oportunidades de mejora.',
      'Presentar hallazgos y recomendaciones de forma clara y concisa.',
    ],
    qualifications: [
      'Grado en Estadística, Matemáticas, Ingeniería Informática o similar.',
      'Conocimientos de SQL y Python/R para análisis de datos.',
      'Experiencia con herramientas de visualización como Tableau, Power BI o Google Data Studio.',
      'Capacidad analítica y atención al detalle.',
    ],
  },
  {
    id: 'bd006',
    title: 'Ejecutivo/a de Cuentas (Restaurantes)',
    department: 'Comercial',
    location: 'Sevilla, España (Presencial)',
    type: 'Jornada Completa',
    slug: 'ejecutivo-cuentas-restaurantes-sevilla',
    shortDescription:
      'Construye relaciones sólidas con los mejores restaurantes de Sevilla y ayúdales a crecer con nuestra plataforma.',
    responsibilities: [
      'Identificar y captar nuevos restaurantes para unirse a la plataforma.',
      'Gestionar y mantener la relación con la cartera de restaurantes asignada.',
      'Negociar condiciones comerciales y asegurar la satisfacción del partner.',
      'Proporcionar formación y soporte sobre el uso de nuestras herramientas.',
    ],
    qualifications: [
      'Experiencia en ventas B2B, preferiblemente en el sector HORECA o tecnológico.',
      'Excelentes habilidades de negociación y comunicación interpersonal.',
      'Orientación a objetivos y proactividad.',
      'Conocimiento del mercado de restauración local.',
    ],
  },
  {
    id: 'sm007',
    title: 'Social Media & Content Creator',
    department: 'Marketing',
    location: 'Remoto (España)',
    type: 'Jornada Completa',
    slug: 'social-media-content-creator-remoto',
    shortDescription:
      'Crea contenido irresistible y gestiona nuestras redes sociales para conectar con nuestra comunidad y hacer crecer nuestra marca.',
    responsibilities: [
      'Desarrollar y ejecutar la estrategia de contenido para redes sociales (Instagram, TikTok, Twitter, etc.).',
      'Crear posts, vídeos cortos, stories y otros formatos de contenido visualmente atractivos.',
      'Gestionar la comunidad online, interactuando con seguidores y respondiendo comentarios.',
      'Analizar el rendimiento de las publicaciones y campañas.',
    ],
    qualifications: [
      'Experiencia demostrable como Social Media Manager y creador/a de contenido.',
      'Dominio de herramientas de diseño gráfico y edición de vídeo (Canva, Adobe Creative Suite, CapCut, etc.).',
      'Excelente redacción creativa y conocimiento de las tendencias en redes sociales.',
      'Pasión por la comida y la cultura digital.',
    ],
  },
  {
    id: 'be008',
    title: 'Desarrollador/a Backend Junior (Python/Django)',
    department: 'Tecnología',
    location: 'Madrid, España (Híbrido)',
    type: 'Jornada Completa',
    slug: 'desarrollador-backend-junior-python-madrid',
    shortDescription:
      'Si estás empezando tu carrera en backend y te apasiona Python, ¡esta es tu oportunidad! Aprende y crece con nosotros.',
    responsibilities: [
      'Participar en el desarrollo y mantenimiento de nuestras APIs y servicios backend.',
      'Escribir código Python limpio y eficiente utilizando el framework Django.',
      'Colaborar en la integración con bases de datos y servicios de terceros.',
      'Aprender y aplicar buenas prácticas de desarrollo de software.',
    ],
    qualifications: [
      'Conocimientos sólidos de Python y Django (o Flask).',
      'Comprensión de los principios RESTful API y bases de datos relacionales.',
      'Familiaridad con Git y metodologías ágiles.',
      'Muchas ganas de aprender y contribuir al equipo.',
    ],
  },
  {
    id: 'hr009',
    title: 'Especialista en Adquisición de Talento',
    department: 'Recursos Humanos',
    location: 'Madrid, España (Híbrido)',
    type: 'Jornada Completa',
    slug: 'especialista-adquisicion-talento-madrid',
    shortDescription:
      'Encuentra y atrae al mejor talento para Elixium Foods. Serás clave en nuestro crecimiento y en la construcción de un equipo excepcional.',
    responsibilities: [
      'Gestionar el ciclo completo de reclutamiento y selección para diversas posiciones.',
      'Publicar ofertas de empleo en diferentes plataformas y realizar búsqueda activa de candidatos.',
      'Realizar entrevistas y evaluar a los candidatos.',
      'Colaborar en la mejora de la marca empleadora y la experiencia del candidato.',
    ],
    qualifications: [
      'Experiencia previa en reclutamiento, idealmente en perfiles tecnológicos o del sector digital.',
      'Conocimiento de diferentes técnicas de sourcing y herramientas de reclutamiento.',
      'Excelentes habilidades de comunicación y evaluación de personas.',
      'Proactividad y capacidad para gestionar múltiples procesos simultáneamente.',
    ],
  },
  {
    id: 'devops010',
    title: 'Ingeniero/a DevOps (Experiencia en AWS)',
    department: 'Tecnología e Infraestructura',
    location: 'Remoto (España)',
    type: 'Jornada Completa',
    slug: 'ingeniero-devops-aws',
    shortDescription:
      'Automatiza, optimiza y escala nuestra infraestructura en AWS, asegurando la máxima disponibilidad y rendimiento de nuestros servicios.',
    responsibilities: [
      'Diseñar, implementar y gestionar pipelines de CI/CD.',
      'Gestionar y automatizar la infraestructura en AWS (EC2, S3, RDS, ECS/EKS, Lambda, CloudFormation/Terraform).',
      'Monitorizar el rendimiento del sistema y la disponibilidad de las aplicaciones.',
      'Colaborar con los equipos de desarrollo para mejorar la fiabilidad y escalabilidad.',
      'Implementar y mantener prácticas de seguridad en la nube (Security Groups, IAM, WAF).',
    ],
    qualifications: [
      'Experiencia demostrable como Ingeniero DevOps o rol similar.',
      'Profundo conocimiento de servicios de AWS (Certificación AWS es un plus).',
      'Experiencia con herramientas de CI/CD (Jenkins, GitLab CI, GitHub Actions).',
      'Dominio de scripting (Python, Bash).',
      'Experiencia con herramientas de IaC (Terraform, CloudFormation).',
      'Conocimientos de contenedores (Docker, Kubernetes) y orquestación.',
    ],
  },
  {
    id: 'sysadmin011',
    title: 'Administrador/a de Sistemas Cloud (Linux & AWS)',
    department: 'Tecnología e Infraestructura',
    location: 'Barcelona, España (Híbrido)',
    type: 'Jornada Completa',
    slug: 'admin-sistemas-cloud-linux-aws',
    shortDescription:
      'Administra y mantén nuestra robusta infraestructura de servidores Linux en AWS, garantizando la estabilidad y seguridad de nuestros sistemas críticos.',
    responsibilities: [
      'Administración, configuración y mantenimiento de servidores Linux (Debian/Ubuntu, RHEL/CentOS) en AWS.',
      'Gestión de parches de seguridad, actualizaciones y copias de seguridad (AWS Backup).',
      'Monitorización de sistemas (CloudWatch, Prometheus, Grafana) y resolución proactiva de incidencias.',
      'Automatización de tareas de administración de sistemas mediante scripting.',
      'Asegurar el cumplimiento de las políticas de seguridad y las mejores prácticas de la industria.',
    ],
    qualifications: [
      'Sólida experiencia en administración de sistemas Linux.',
      'Experiencia con servicios clave de AWS (EC2, VPC, S3, IAM, Route 53, RDS).',
      'Conocimientos avanzados de scripting (Bash, Python).',
      'Familiaridad con herramientas de monitorización y logging centralizado.',
      'Comprensión profunda de redes TCP/IP, firewalls y seguridad de sistemas.',
    ],
  },
  {
    id: 'cloudarch012',
    title: 'Arquitecto/a de Soluciones Cloud (Foco en AWS)',
    department: 'Tecnología Estratégica',
    location: 'Remoto (España)',
    type: 'Jornada Completa',
    slug: 'arquitecto-soluciones-cloud-aws',
    shortDescription:
      'Lidera el diseño y la evolución de nuestra arquitectura en AWS. Define soluciones escalables, resilientes y coste-eficientes para el futuro de Elixium Foods.',
    responsibilities: [
      'Diseñar arquitecturas de soluciones técnicas nativas en la nube AWS que cumplan con los requisitos de negocio, seguridad, coste y rendimiento.',
      'Evaluar y seleccionar los servicios de AWS más adecuados para cada necesidad (serverless, contenedores, bases de datos, IA/ML, etc.).',
      'Definir y promover estándares y buenas prácticas de arquitectura cloud en toda la organización.',
      'Proporcionar guía técnica y mentoría a los equipos de desarrollo e infraestructura.',
      'Realizar pruebas de concepto y mantenerse actualizado con las últimas tendencias y servicios de AWS.',
    ],
    qualifications: [
      'Amplia experiencia como Arquitecto/a de Soluciones o rol similar, con un fuerte enfoque en AWS.',
      'Profundo conocimiento de un amplio espectro de servicios de AWS y cómo se integran para formar soluciones complejas.',
      'Certificación AWS Certified Solutions Architect - Professional (muy valorable).',
      'Capacidad para traducir requisitos de negocio complejos en soluciones técnicas robustas y escalables.',
      'Excelentes habilidades de comunicación, presentación y liderazgo técnico.',
    ],
  },
]

export const companyValues = [
  // Mantengo los mismos valores de empresa
  {
    icon: '🚀',
    title: 'Innovación Constante',
    description: 'Desafiamos lo convencional para crear el futuro de la comida a domicilio.',
  },
  {
    icon: '🤝',
    title: 'Equipo Unido',
    description: 'Colaboramos con pasión, respeto y mucha diversión. ¡Somos una familia!',
  },
  {
    icon: '🌍',
    title: 'Impacto Real',
    description: 'Conectamos personas con sus sabores favoritos, apoyando a negocios locales.',
  },
  {
    icon: '💡',
    title: 'Crecimiento Profesional',
    description:
      'Te ofrecemos oportunidades para aprender, crecer y desarrollar tu potencial al máximo.',
  },
  {
    icon: '💚',
    title: 'Cultura Positiva',
    description: 'Fomentamos un ambiente de trabajo flexible, inclusivo y donde cada voz cuenta.',
  },
]
