# 🍽️ Elixium Foods

<div align="center">

<img src="docs/images/logo.png" alt="Elixium Foods Logo" width="200"/>

### **Deliciosa comida. Entrega rápida.**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883.svg?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38b2ac.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SCSS](https://img.shields.io/badge/SCSS-BEM-cc6699.svg?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
<br/>
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET-Core-512BD4.svg?style=for-the-badge&logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

</div>

<p align="center">
  <a href="#-características-destacadas">Características</a> •
  <a href="#-capturas-de-pantalla">Capturas</a> •
  <a href="#-stack-tecnológico">Stack</a> •
  <a href="#-instalación-rápida">Instalación</a> •
  <a href="#-arquitectura">Arquitectura</a> •
  <a href="#-equipo">Equipo</a>
</p>

---

## 📱 Capturas de Pantalla

<div align="center">
<table>
  <tr>
    <td><img src="docs/images/home-screen.webp" alt="Pantalla principal con búsqueda y entrega rápida" width="100%"/></td>
    <td><img src="docs/images/categories-screen.webp" alt="Exploración por categorías gastronómicas" width="100%"/></td>
    <td><img src="docs/images/restaurants-screen.webp" alt="Listado de restaurantes con filtros" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Home</strong></td>
    <td align="center"><strong>Categorías</strong></td>
    <td align="center"><strong>Restaurantes</strong></td>
  </tr>
</table>
</div>

## ✨ Características Destacadas

- 🚀 **Diseño Mobile-First Explosivo**: Experiencia fluida en cualquier dispositivo con transiciones elegantes
  
- 🎨 **UI Premium y Cautivadora**: Esquema de color vibrante, componentes personalizados y microinteracciones sofisticadas

- 🔍 **Descubrimiento Intuitivo**: Sistema de exploración por categorías con tarjetas visualmente distintivas
  
- ⚡ **Entregas Ultra-rápidas**: Algoritmos de optimización de rutas para entregas garantizadas en 30 minutos o menos

- 🛒 **Checkout Simplificado**: Proceso de compra optimizado para maximizar conversiones

- 👤 **Personalización Avanzada**: Adapta cada aspecto de tu pedido según tus preferencias específicas

- 🔐 **Seguridad Inquebrantable**: Pasarela de pago con encriptación de extremo a extremo

- 📊 **Analíticas en Tiempo Real**: Seguimiento detallado de cada fase de tu pedido

- 🌟 **Sistema de Fidelización**: Recompensas exclusivas para clientes recurrentes

## 🛠️ Stack Tecnológico

Elixium Foods implementa una arquitectura moderna y escalable utilizando las tecnologías más potentes del mercado:

### Frontend
- **Vue.js 3**: Framework progresivo para interfaces de usuario con Composition API
- **TypeScript**: Tipado estático para un desarrollo más robusto y mantenible
- **Pinia**: Gestión de estado para Vue 3 con soporte completo para TypeScript
- **Vue Router**: Enrutamiento oficial para aplicaciones Vue.js
- **Tailwind CSS**: Framework de utilidades CSS para diseño rápido y consistente
- **SCSS con BEM**: Estilos personalizados con arquitectura mantenible

### Backend
- **ASP.NET Core**: Framework de alto rendimiento para APIs RESTful
- **Entity Framework Core**: ORM para acceso a datos eficiente y tipado
- **PostgreSQL**: Base de datos relacional robusta y escalable
- **Swagger**: Documentación API interactiva y fácil de usar

### DevOps & Infraestructura
- **Docker**: Contenedores para desarrollo y despliegue consistentes
- **GitHub Actions**: CI/CD automatizado con flujos de trabajo personalizables
- **Vitest**: Framework de testing rápido y nativo de Vue
- **AWS**: Infraestructura cloud para escalabilidad y fiabilidad

## 📋 Arquitectura

Elixium Foods implementa una arquitectura de servicios escalable con las siguientes características:

- **Separación Frontend-Backend**: API RESTful con comunicación stateless
- **Base de Datos Optimizada**: PostgreSQL con esquemas eficientes para alta demanda
- **Cache Distribuida**: Mejoras de rendimiento para consultas frecuentes
- **Seguridad por Diseño**: Implementación de mejores prácticas en cada capa de la aplicación

## 🚀 Instalación Rápida

### Requisitos Previos

- Node.js 16+ y npm/yarn
- Docker y Docker Compose
- .NET 6+

### Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/your-username/elixium-foods.git
cd elixium-foods

# 2. Instalar dependencias frontend
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar entorno de desarrollo completo (frontend + backend + db)
docker-compose up -d

# 5. ¡Listo! Accede a:
#    - Frontend: http://localhost:8080
#    - API Backend: http://localhost:5000
#    - Swagger UI: http://localhost:5000/swagger
```

### Estructura del Proyecto

```
elixium-foods/
├── src/                        # Código fuente frontend
│   ├── assets/                 # Recursos estáticos (imágenes, estilos)
│   │   └── styles/             # Archivos SCSS globales
│   ├── components/             # Componentes reutilizables
│   │   ├── common/             # Componentes de UI básicos
│   │   ├── feature/            # Componentes específicos de funcionalidad 
│   │   └── layout/             # Componentes de estructura página
│   ├── composables/            # Lógica reutilizable con Composition API
│   ├── constants/              # Valores constantes y configuración
│   ├── router/                 # Configuración de rutas
│   ├── services/               # Servicios para comunicación API
│   ├── store/                  # Estado global (Pinia)
│   ├── types/                  # Definiciones de tipos TypeScript
│   ├── utils/                  # Funciones utilitarias
│   └── views/                  # Componentes a nivel de página
├── server/                     # Backend ASP.NET Core
│   ├── Elixium.API/            # Proyecto principal API
│   ├── Elixium.Core/           # Lógica de negocio
│   ├── Elixium.Data/           # Acceso a datos y migraciones
│   └── Elixium.Tests/          # Pruebas de la API
└── ...
```

## 📊 Pipeline CI/CD

El proyecto utiliza GitHub Actions para implementar un pipeline de integración y despliegue continuo:

1. **Verificación de Código**:
   - Lint y formateo automático
   - Análisis estático y detección de vulnerabilidades
   - Pruebas unitarias con Vitest

2. **Construcción y Empaquetado**:
   - Compilación optimizada del frontend
   - Build de la API .NET
   - Generación de imágenes Docker

3. **Despliegue Progresivo**:
   - Entorno de desarrollo para pruebas funcionales
   - Entorno de producción con verificación de salud

## 🧪 Pruebas Automatizadas

```bash
# Ejecutar pruebas unitarias frontend
npm run test:unit

# Ejecutar pruebas unitarias backend
cd server
dotnet test
```

## 👥 Equipo

Desarrollado con ❤️ por un equipo de profesionales apasionados por la tecnología y la gastronomía.

## 📄 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

## 🙌 Contribuciones

¡Las contribuciones son bienvenidas! Revisa nuestras [guías de contribución](CONTRIBUTING.md) para comenzar.

## 🌟 Inspiración y Agradecimientos

- [Vue.js Team](https://vuejs.org/)
- [Tailwind Labs](https://tailwindcss.com/)
- [Microsoft .NET Team](https://dotnet.microsoft.com/)
- [PostgreSQL Team](https://www.postgresql.org/)
- Todos los colaboradores y early adopters que han hecho Elixium Foods posible

---

<div align="center">
  <p>Elixium Foods © 2023-2025 • Deliciosa comida. Entrega rápida.</p>
  
  <a href="https://twitter.com/"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"/></a>
  <a href="https://instagram.com/"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"/></a>
  <a href="https://linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
</div>
