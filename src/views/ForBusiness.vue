<template>
  <div class="for-business-page">
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">Haz Crecer Tu Restaurante con <span class="highlight">Elixium Foods</span></h1>
        <p class="hero-subtitle">
          Asóciate con nosotros y lleva tus deliciosos platos a miles de nuevos clientes.
          Te ofrecemos la tecnología y el alcance para expandir tu negocio.
        </p>
        <router-link :to="{ name: 'business-register' }" class="cta-button hero-cta">
          Registra tu Restaurante Ahora
        </router-link>
      </div>
    </section>

    <section class="benefits-section">
      <div class="container">
        <h2 class="section-title">¿Por Qué Unirte a Elixium Foods?</h2>
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 class="benefit-title">Más Clientes, Más Ventas</h3>
            <p class="benefit-description">
              Accede a nuestra creciente comunidad de usuarios hambrientos y aumenta tus ingresos diarios.
            </p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 class="benefit-title">Tecnología Intuitiva</h3>
            <p class="benefit-description">
              Gestiona pedidos, menús y horarios fácilmente con nuestra plataforma para negocios, simple y potente.
            </p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 class="benefit-title">Marketing y Visibilidad</h3>
            <p class="benefit-description">
              Destaca en tu zona y benefíciate de nuestras campañas de marketing para atraer más miradas a tu cocina.
            </p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                </path>
              </svg>
            </div>
            <h3 class="benefit-title">Soporte Dedicado</h3>
            <p class="benefit-description">
              Nuestro equipo de expertos está listo para ayudarte en cada paso, desde la configuración hasta la
              optimización.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">Empezar es Muy Fácil</h2>
        <div class="steps-container">
          <div class="step-item">
            <div class="step-number">1</div>
            <h3 class="step-title">Regístrate</h3>
            <p class="step-description">Completa un breve formulario con los datos de tu negocio. ¡Solo te tomará unos
              minutos!</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item">
            <div class="step-number">2</div>
            <h3 class="step-title">Configura tu Perfil</h3>
            <p class="step-description">Sube tu menú, fotos atractivas de tus platos y define tus horarios de apertura.
            </p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item">
            <div class="step-number">3</div>
            <h3 class="step-title">¡Empieza a Vender!</h3>
            <p class="step-description">Una vez aprobado, comenzarás a recibir pedidos y a ver crecer tu clientela.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta-section">
      <div class="container">
        <h2 class="section-title">¿Listo para Dar el Siguiente Paso?</h2>
        <p class="final-cta-subtitle">
          Únete a la red de restaurantes que ya están triunfando con Elixium Foods.
        </p>
        <router-link :to="{ name: 'business-register' }" class="cta-button final-cta">
          Quiero Unirme
        </router-link>
        <p class="contact-link">
          ¿Tienes preguntas? <router-link :to="{ name: 'contact' }">Contáctanos</router-link>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Por ahora, esta página es principalmente informativa, así que el script es mínimo.
// Podrías añadir lógica si tienes un formulario de contacto directo en esta página.
</script>

<style lang="scss" scoped>
// Usaremos las variables CSS globales que definiste en App.vue
// :root { --primary: #FF416C; ... }

.for-business-page {
  color: var(--dark);
}

.container {
  width: 100%;
  max-width: 1200px; // Un ancho común para contenido centrado
  margin: 0 auto;
  padding: 0 1.5rem;
}

// Sección Hero
.hero-section {
  background: var(--primary-gradient);
  color: var(--white);
  padding: 5rem 0;
  text-align: center;

  .hero-title {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.2;

    .highlight {
      // Podrías usar un color de acento o simplemente el contraste del blanco
    }

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  .hero-subtitle {
    font-size: 1.2rem;
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto 2.5rem auto;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1.1rem;

      .submission-success {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 3rem 1.5rem; // Mayor padding general

        .success-icon {
          width: 80px; // Círculo contenedor del icono más grande
          height: 80px;
          border-radius: 50%;
          background-color: rgba(var(--success), 0.12); // Un fondo suave para el círculo del icono
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.75rem; // Más espacio debajo del icono
          animation: success-pop-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; // Animación de entrada

          svg {
            color: var(--success); // El icono en sí mantiene el color de éxito
            width: 48px; // Tamaño del SVG dentro del círculo
            height: 48px;
          }
        }

        .success-title {
          font-size: 2rem; // Título más grande y destacado
          font-weight: 700;
          color: var(--dark); // Puedes cambiarlo a var(--success) si prefieres el título en verde
          margin-bottom: 1rem;

          @media (max-width: 768px) {
            font-size: 1.75rem;
          }
        }

        .success-message {
          font-size: 1rem;
          color: var(--medium);
          margin-bottom: 2.5rem; // Más espacio antes del botón de volver
          line-height: 1.65;
          max-width: 550px; // Limitar el ancho del texto para mejor legibilidad
        }

        .cta-button.back-home-btn {
          // Hereda los estilos de .cta-button, podemos ajustar aquí si es necesario
          padding: 0.85rem 2.2rem; // Padding consistente para el botón
          font-size: 1rem;
          // El estilo de fondo y color ya lo tienes definido en tu .cta-button,
          // si no, puedes añadirlo aquí:
          // background-color: var(--primary);
          // color: var(--white);
          // &:hover {
          //   background-color: var(--primary-dark);
          // }
        }
      }

      // Animación para el icono
      @keyframes success-pop-in {
        0% {
          transform: scale(0.4);
          opacity: 0;
        }

        60% {
          transform: scale(1.1);
          opacity: 1;
        }

        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
  }
}

.cta-button {
  display: inline-block;
  background-color: var(--white);
  color: var(--primary);
  padding: 0.9rem 2.2rem;
  border-radius: var(--border-radius-xl); // Muy redondeado
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
    background-color: #fdfdfd;
  }
}

// Títulos de Sección Genéricos
.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 0.75rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 4px;
    background: var(--primary-gradient);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
}

// Sección de Beneficios
.benefits-section {
  padding: 4rem 0;
  background-color: var(--light); // Fondo claro para contraste
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.benefit-item {
  background-color: var(--white);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  text-align: center;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
}

.benefit-icon {
  margin-bottom: 1rem;

  svg {
    width: 48px;
    height: 48px;
    color: var(--primary);
  }
}

.benefit-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.75rem;
}

.benefit-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--medium);
}

// Sección Cómo Funciona
.how-it-works-section {
  padding: 4rem 0;
  background-color: var(--white);
}

.steps-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  position: relative;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
}

.step-item {
  flex: 1;
  text-align: center;
  padding: 1.5rem;
  max-width: 350px; // Para que no se estiren demasiado en pantallas anchas
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.step-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--medium);
}

.step-connector {
  // Para la línea conectora en desktop
  flex-grow: 0.5;
  align-self: center;
  height: 2px;
  background-color: var(--medium);
  opacity: 0.3;
  margin: 0 1rem; // Espacio alrededor del conector
  margin-top: -3rem; // Para alinear con los números

  @media (max-width: 992px) {
    width: 2px;
    height: 40px;
    margin-top: 0;
    margin-bottom: 1rem;
  }
}


// Sección CTA Final
.final-cta-section {
  padding: 5rem 0;
  background-color: var(--dark);
  color: var(--white);
  text-align: center;

  .section-title {
    color: var(--white);

    &::after {
      background: var(--white); // La línea bajo el título también blanca
    }
  }

  .final-cta-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 2rem auto;
    opacity: 0.8;
  }

  .cta-button.final-cta {
    background-color: var(--primary);
    color: var(--white);

    &:hover {
      background-color: var(--primary-dark);
    }
  }

  .contact-link {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    opacity: 0.7;

    a {
      color: var(--primary-light, #ff7fab); // Un color de acento claro para el enlace
      text-decoration: underline;

      &:hover {
        color: var(--white);
      }
    }
  }
}
</style>
