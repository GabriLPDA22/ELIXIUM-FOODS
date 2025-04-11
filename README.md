# 🍽️ Elixium Foods

<div align="center">

<img src="docs/images/logo.png" alt="Elixium Foods Logo" width="200"/>

**Deliciosa comida. Entrega rápida.**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-007acc.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38b2ac.svg)](https://tailwindcss.com/)
[![SCSS](https://img.shields.io/badge/SCSS-cc6699.svg)](https://sass-lang.com/)
[![C# API](https://img.shields.io/badge/Backend-C%23_API-512BD4.svg)](https://dotnet.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ed.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326ce5.svg)](https://kubernetes.io/)
[![AWS](https://img.shields.io/badge/AWS-FF9900.svg)](https://aws.amazon.com/)

</div>

## 📱 Vista Previa

<div align="center">
<table>
  <tr>
    <td><img src="docs/images/home-screen.webp" alt="Pantalla principal con búsqueda y entrega rápida" /></td>
    <td><img src="docs/images/categories-screen.webp" alt="Exploración por categorías gastronómicas" /></td>
    <td><img src="docs/images/restaurants-screen.webp" alt="Listado de restaurantes con filtros" /></td>
  </tr>
</table>
</div>

## ✨ Características Principalesss

- **Diseño Mobile-First:** Optimizado para dispositivos móviles con una experiencia de escritorio igualmente fluida
- **UI Moderna y Atractiva:** Interfaz limpia con un esquema de color vibrante, animaciones fluidas y microinteracciones
- **Exploración por Categorías:** Descubrimiento visual con tarjetas coloridas para cada tipo de gastronomía
- **Búsqueda Avanzada:** Filtros intuitivos por tipo de cocina, precio y popularidad
- **Entregas Rápidas:** Seguimiento en tiempo real y optimización de rutas para entregas en menos de 30 minutos
- **Personalización de Pedidos:** Opciones detalladas para adaptar cada elemento del pedido a tus preferencias
- **Pasarela de Pago Segura:** Múltiples opciones de pago con procesamiento encriptado
- **Gestión de Perfil:** Configuración de direcciones, métodos de pago y preferencias dietéticas
- **Historial y Favoritos:** Acceso a pedidos anteriores con opción de repetir los favoritos con un solo clic

## 🛠️ Stack Tecnológico

### Frontend
- **Vue.js 3:** Framework progresivo para construir interfaces de usuario
- **TypeScript:** Añade tipado estático para desarrollo más robusto
- **Pinia:** Gestión de estado para Vue 3
- **Vue Router:** Enrutamiento oficial para aplicaciones Vue.js
- **Tailwind CSS:** Framework de utilidades CSS para diseño rápido y consistente
- **SCSS con BEM:** Para estilos personalizados con arquitectura mantenible
- **Mobile-First:** Diseño optimizado desde móvil hasta escritorio

### Backend
- **C# API:** Backend robusto con .NET Core
- **Swagger:** Documentación API interactiva y fácil de usar
- **Entity Framework Core:** ORM para acceso a datos eficiente
- **SignalR:** Comunicación en tiempo real para seguimiento de pedidos

### Infraestructura
- **Docker:** Contenedores para desarrollo y despliegue consistentes
- **Kubernetes:** Orquestación de contenedores para alta disponibilidad
- **AWS:** Infraestructura cloud para escalabilidad y fiabilidad
  - EKS (Elastic Kubernetes Service)
  - RDS (Relational Database Service)
  - S3 (Simple Storage Service)
  - CloudFront para CDN

## 📂 Estructura del Proyecto

```
elixium-foods/
├── src/                        # Código fuente principal
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
└── ...
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 16+
- npm o yarn
- Docker y Docker Compose (para desarrollo local con backend)

### Instalación Frontend

```bash
# Clonar el repositorio
git clone https://github.com/your-username/elixium-foods.git
cd elixium-foods

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Ejecución con Docker (Frontend + Backend)

```bash
# Construir y ejecutar contenedores
docker-compose up -d

# La aplicación estará disponible en:
# - Frontend: http://localhost:8080
# - API Backend: http://localhost:5000
# - Swagger UI: http://localhost:5000/swagger
```

## 🌐 Despliegue

El proyecto utiliza un pipeline CI/CD con GitHub Actions para despliegue automatizado:

1. **Desarrollo:** Entorno de pruebas en AWS EKS
2. **Staging:** Validación previa a producción
3. **Producción:** Despliegue en clúster de producción AWS EKS

La infraestructura se gestiona mediante Terraform para garantizar la consistencia y reproducibilidad.

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test:unit

# Ejecutar pruebas e2e
npm run test:e2e

# Comprobar cobertura
npm run test:coverage
```

## 📝 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

## 👥 Equipo

Desarrollado con ❤️ por el equipo de Elixium Foods.

## 🙏 Agradecimientos

- [Vue.js Team](https://vuejs.org/)
- [Tailwind Labs](https://tailwindcss.com/)
- [Microsoft .NET Team](https://dotnet.microsoft.com/)
- Todos los colaboradores que han hecho posible este proyecto