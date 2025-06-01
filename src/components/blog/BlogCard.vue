<template>
  <article class="blog-card">
    <router-link :to="{ name: 'blog-post-detail', params: { slug: post.slug } }" class="blog-card-link">
      <div class="blog-card-image-wrapper">
        <img :src="post.imageUrl" :alt="post.imageAlt" class="blog-card-image" loading="lazy">
        <span class="blog-card-category">{{ post.category }}</span>
      </div>
      <div class="blog-card-content">
        <header class="blog-card-header">
          <h2 class="blog-card-title">{{ post.title }}</h2>
          <div class="blog-card-meta">
            <span class="blog-card-author">{{ post.author }}</span>
            <span class="blog-card-separator">|</span>
            <time :datetime="post.publicationDate" class="blog-card-date">{{ formatDate(post.publicationDate) }}</time>
          </div>
        </header>
        <p class="blog-card-excerpt">{{ post.excerpt }}</p>
        <div class="blog-card-footer">
          <span class="blog-card-read-time">{{ post.readTime }} de lectura</span>
          <span class="blog-card-arrow">&rarr;</span>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { type BlogPost } from '@/data/blogPosts';

interface Props {
  post: BlogPost;
}
const props = defineProps<Props>();

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};
</script>

<style lang="scss" scoped>
.blog-card {
  background-color: var(--white, #ffffff);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
}

.blog-card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.blog-card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 60%; /* Aspect ratio 5:3 */
  overflow: hidden;
}

.blog-card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.blog-card:hover .blog-card-image {
  transform: scale(1.05);
}

.blog-card-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--primary, #FF416C);
  color: var(--white, #ffffff);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.blog-card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.blog-card-header {
  margin-bottom: 0.75rem;
}

.blog-card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--dark, #333);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.blog-card-meta {
  font-size: 0.8rem;
  color: var(--medium, #757575);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.blog-card-author,
.blog-card-date {
}

.blog-card-separator {
  opacity: 0.5;
}

.blog-card-excerpt {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--dark-medium, #555);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.blog-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--primary, #FF416C);
  font-weight: 600;
  margin-top: auto;
}

.blog-card-arrow {
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-card-arrow {
  transform: translateX(4px);
}
</style>
