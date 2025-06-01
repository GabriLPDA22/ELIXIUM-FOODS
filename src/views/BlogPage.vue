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
          <BlogCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
        <div v-else class="blog-no-posts">
          <p>Próximamente encontrarás aquí nuestros artículos. ¡Vuelve pronto!</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BlogCard from '@/components/blog/BlogCard.vue';
import { blogPosts, type BlogPost } from '@/data/blogPosts';

const posts = ref<BlogPost[]>([]);

onMounted(() => {
  posts.value = blogPosts;
});
</script>

<style lang="scss" scoped>
.blog-page {
  background-color: var(--background-alt, #f4f7f6); // Un color de fondo suave para la página
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem; // Mobile padding
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

  @media (min-width: 768px) {
    font-size: 3rem;
  }
}

.blog-page-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;

  @media (min-width: 768px) {
    font-size: 1.15rem;
  }
}

.blog-main-content {
  padding-bottom: 4rem;
}

.blog-posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

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
}
</style>
