<template>
  <div class="blog-page">
    <header class="blog-page-header">
      <div class="container">
        <h1 class="blog-page-title">Nuestro Rincón Culinario</h1>
        <p class="blog-page-subtitle">Descubre recetas, consejos y las últimas novedades del mundo gastronómico.</p>
      </div>
    </header>

    <main class="blog-main-content">
      <div class="container">
        <div v-if="posts.length > 0" class="blog-posts-grid">
          <BlogCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            loading="lazy"
          />
        </div>
        <div v-else class="blog-no-posts">
          <p>Próximamente encontrarás aquí nuestros artículos. ¡Vuelve pronto!</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, defineAsyncComponent, nextTick, onMounted } from 'vue';
import { blogPosts, type BlogPost } from '@/data/blogPosts';

// Lazy load del componente BlogCard
const BlogCard = defineAsyncComponent({
  loader: () => import('@/components/blog/BlogCard.vue'),
  delay: 0,
  loadingComponent: { template: '<div class="blog-card-skeleton"></div>' }
});

// Usar shallowRef para mejor performance cuando los objetos no cambian
const posts = shallowRef<BlogPost[]>([]);

// Optimizar la carga de datos
onMounted(async () => {
  // Defer la carga de posts hasta el siguiente tick para no bloquear el render inicial
  await nextTick();

  // Simular lazy loading progresivo para mejorar First Contentful Paint
  requestIdleCallback(() => {
    posts.value = blogPosts;
  }, { timeout: 100 });
});

// Preload crítico de CSS y recursos
if (typeof document !== 'undefined') {
  // Preload de la fuente si es necesaria
  const linkPreload = document.createElement('link');
  linkPreload.rel = 'preload';
  linkPreload.as = 'style';
  linkPreload.href = 'data:text/css,'; // Placeholder para CSS crítico

  // Hint de prefetch para componentes
  const linkPrefetch = document.createElement('link');
  linkPrefetch.rel = 'prefetch';
  linkPrefetch.href = '/components/blog/BlogCard.vue';
}
</script>

<style lang="scss" scoped>
.blog-page {
  background-color: var(--background-alt, #f4f7f6);
  min-height: 100vh;
  /* Optimizaciones de rendering */
  contain: layout style paint;
  will-change: auto;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  /* Optimización de compositing */
  transform: translateZ(0);

  @media (min-width: 768px) {
    padding: 0 1.5rem;
  }
}

.blog-page-header {
  background: var(--primary-gradient, linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%));
  color: var(--white, #ffffff);
  padding: 3rem 0;
  text-align: center;
  margin-bottom: 3rem;
  /* Optimizaciones GPU */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout style paint;

  @media (min-width: 768px) {
    padding: 4rem 0;
    margin-bottom: 4rem;
  }
}

.blog-page-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  /* Optimización de texto */
  font-display: swap;
  text-rendering: optimizeSpeed;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
}

.blog-page-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  /* Optimización de texto */
  font-display: swap;

  @media (min-width: 768px) {
    font-size: 1.15rem;
  }
}

.blog-main-content {
  padding-bottom: 4rem;
  /* Contenedor optimizado */
  contain: layout style;
}

.blog-posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  /* Optimización de grid */
  contain: layout;
  transform: translateZ(0);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
}

.blog-no-posts {
  text-align: center;
  padding: 3rem 0;
  font-size: 1.1rem;
  color: var(--medium, #757575);
  /* Optimización simple */
  contain: layout style paint;
}

/* Skeleton loader para BlogCard mientras carga */
.blog-card-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
  height: 300px;
  width: 100%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Optimizaciones adicionales para reduce layout shift */
@media (prefers-reduced-motion: reduce) {
  .blog-card-skeleton {
    animation: none;
    background: #f0f0f0;
  }
}

/* Critical CSS hints */
.blog-posts-grid > * {
  content-visibility: auto;
  contain-intrinsic-size: 300px;
}
</style>
