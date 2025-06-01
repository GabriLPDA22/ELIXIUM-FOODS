<template>
  <div class="blog-post-detail-page" v-if="post">
    <article class="post-article">
      <header class="post-header">
        <div class="post-header-image-wrapper">
          <img :src="post.imageUrl" :alt="post.imageAlt" class="post-header-image" />
        </div>
        <div class="container post-header-content">
          <span class="post-category">{{ post.category }}</span>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="post-author">Por {{ post.author }}</span>
            <span class="post-meta-separator">&bull;</span>
            <time :datetime="post.publicationDate" class="post-date">{{ formatDate(post.publicationDate) }}</time>
            <span class="post-meta-separator">&bull;</span>
            <span class="post-read-time">{{ post.readTime }} de lectura</span>
          </div>
        </div>
      </header>

      <div class="post-body-container container">
        <div class="post-content" v-html="post.contentHtml"></div>

        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
        </div>
      </div>

      <section class="related-posts-section container" v-if="relatedPosts.length > 0">
        <h2 class="related-posts-title">También te podría interesar</h2>
        <div class="blog-posts-grid related-posts-grid">
          <BlogCard v-for="relatedPost in relatedPosts" :key="relatedPost.id" :post="relatedPost" />
        </div>
      </section>

      <div class="back-to-blog-link container">
        <router-link :to="{ name: 'blog' }">&larr; Volver al Blog</router-link>
      </div>

    </article>
  </div>
  <div v-else class="post-not-found container">
    <p>Artículo no encontrado.</p>
    <router-link :to="{ name: 'blog' }">Volver al Blog</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { blogPosts, type BlogPost } from '@/data/blogPosts';
import BlogCard from '@/components/blog/BlogCard.vue';

const route = useRoute();
const post = ref<BlogPost | undefined>(undefined);
const relatedPosts = ref<BlogPost[]>([]);

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const loadPostData = (slug: string | string[]) => {
  const currentSlug = Array.isArray(slug) ? slug[0] : slug;
  post.value = blogPosts.find(p => p.slug === currentSlug);

  if (post.value) {
    relatedPosts.value = blogPosts.filter(
      p => p.id !== post.value?.id && p.category === post.value?.category
    ).slice(0, 2); // Máximo 2 relacionados de la misma categoría
     if (relatedPosts.value.length < 2) {
        const additionalPosts = blogPosts.filter(
            p => p.id !== post.value?.id && !relatedPosts.value.find(rp => rp.id === p.id)
        ).slice(0, 2 - relatedPosts.value.length);
        relatedPosts.value.push(...additionalPosts);
    }
  } else {
    relatedPosts.value = [];
  }
};

onMounted(() => {
  loadPostData(route.params.slug);
});

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadPostData(newSlug);
  }
});

</script>

<style lang="scss" scoped>
.blog-post-detail-page {
  background-color: var(--white, #ffffff);
  padding-bottom: 3rem;
}

.container {
  width: 100%;
  max-width: 800px; // Contenido principal más estrecho para legibilidad
  margin: 0 auto;
  padding: 0 1rem;
}

.post-header {
  margin-bottom: 2rem;
  position: relative;
}

.post-header-image-wrapper {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  background-color: var(--light-gray, #e0e0e0);

  @media (min-width: 768px) {
    max-height: 600px;
  }
}

.post-header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-header-content {
  position: relative; // Para que se superponga si se desea, o simplemente después
  padding-top: 1.5rem; // Espacio si no hay superposición de imagen
  background-color: var(--white, #ffffff); // Asegura que el texto sea legible
  margin-top: -4rem; // Tira del contenido hacia arriba sobre la imagen (ajusta según sea necesario)
  padding: 2rem;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -5px 15px rgba(0,0,0,0.05);
  max-width: 900px; // Un poco más ancho para el header

   @media (max-width: 767px) {
    margin-top: -2rem;
    padding: 1.5rem;
  }
}

.post-category {
  display: inline-block;
  background-color: var(--primary, #FF416C);
  color: var(--white, #ffffff);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--dark, #333);
  margin: 0 0 1rem 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 2.8rem;
  }
}

.post-meta {
  font-size: 0.9rem;
  color: var(--medium, #757575);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem 0.75rem;
}

.post-meta-separator {
  opacity: 0.7;
}


.post-body-container {
  padding-top: 1rem; // Espacio después del header superpuesto
}

.post-content {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--dark-gray, #333);

  ::v-deep(h2) {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 2.5rem 0 1rem;
    line-height: 1.3;
  }
  ::v-deep(h3) {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 2rem 0 0.75rem;
    line-height: 1.4;
  }
  ::v-deep(p) {
    margin-bottom: 1.25rem;
  }
  ::v-deep(ul), ::v-deep(ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }
  ::v-deep(li) {
    margin-bottom: 0.5rem;
  }
  ::v-deep(a) {
    color: var(--primary, #FF416C);
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
  ::v-deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5rem 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  ::v-deep(blockquote) {
    border-left: 4px solid var(--primary, #FF416C);
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    background-color: var(--background-alt, #f4f7f6);
    font-style: italic;
    color: var(--dark-medium, #555);
    p {
      margin-bottom: 0;
    }
  }
}

.post-tags {
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.post-tag {
  background-color: var(--light, #eef2f5);
  color: var(--primary, #FF416C);
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: var(--primary, #FF416C);
    color: var(--white, #ffffff);
  }
}

.related-posts-section {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
}

.related-posts-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark, #333);
  margin-bottom: 2rem;
  text-align: center;
}

.related-posts-grid {
   display: grid;
  grid-template-columns: 1fr; // Mobile first
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 2 columnas en tabletas
    gap: 2rem;
  }
}


.back-to-blog-link {
  margin-top: 3rem;
  text-align: center;
  a {
    color: var(--primary, #FF416C);
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: var(--light-gray-hover, #f0f0f0);
    }
  }
}

.post-not-found {
  text-align: center;
  padding: 4rem 1rem;
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
  a {
    color: var(--primary, #FF416C);
    font-weight: 600;
  }
}

</style>
