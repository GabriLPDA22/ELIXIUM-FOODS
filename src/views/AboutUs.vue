<!-- src/views/About.vue -->
<template>
  <div class="about-view">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="about-hero__background"></div>
      <div class="about-hero__overlay"></div>
      <div class="container">
        <div class="about-hero__content">
          <span class="about-hero__badge">🌱 Comprometidos con lo Local</span>
          <h1 class="about-hero__title">Más que comida,<br>es <span class="highlight">comunidad</span></h1>
          <p class="about-hero__subtitle">
            Conectamos corazones hambrientos con sabores auténticos de nuestra tierra,
            impulsando la economía local y cuidando nuestro planeta, un pedido a la vez
          </p>
          <div class="about-hero__stats-mini">
            <div class="stat-mini">
              <span class="number">100%</span>
              <span class="label">Restaurantes Locales</span>
            </div>
            <div class="stat-mini">
              <span class="number">KM 0</span>
              <span class="label">Productos Frescos</span>
            </div>
            <div class="stat-mini">
              <span class="number">🌍</span>
              <span class="label">Impacto Positivo</span>
            </div>
          </div>
          <div class="about-hero__scroll">
            <span>Descubre nuestro compromiso</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Why We're Different Section -->
    <section class="about-difference">
      <div class="container">
        <div class="about-difference__header">
          <span class="section-badge">💡 Nuestra Diferencia</span>
          <h2 class="section-title">¿Por qué elegir Elixium Foods?</h2>
          <p class="section-subtitle">
            Mientras otros se enfocan en velocidad, nosotros nos enfocamos en <strong>valores</strong>
          </p>
        </div>

        <div class="about-difference__grid">
          <div class="difference-card difference-card--featured">
            <div class="difference-card__icon">🏪</div>
            <h3>100% Restaurantes Locales</h3>
            <p>
              No encontrarás grandes cadenas aquí. Cada restaurante es un negocio familiar
              o local que conoce tu barrio y pone amor en cada plato.
              <strong>Cuando pides con nosotros, apoyas directamente a tu comunidad.</strong>
            </p>
            <div class="difference-card__impact">
              <span class="impact-label">Impacto real:</span>
              <span class="impact-value">€180,000 generados para comercios locales</span>
            </div>
          </div>

          <div class="difference-card">
            <div class="difference-card__icon">🌱</div>
            <h3>Productos KM 0</h3>
            <p>
              Exigimos a nuestros socios que prioricen ingredientes locales y de temporada.
              Menos transporte = menos emisiones + más frescura + más sabor auténtico.
            </p>
            <div class="difference-card__impact">
              <span class="impact-label">Reducción CO2:</span>
              <span class="impact-value">2.3 toneladas anuales</span>
            </div>
          </div>

          <div class="difference-card">
            <div class="difference-card__icon">🤝</div>
            <h3>Economía Circular</h3>
            <p>
              Cada euro que gastas se queda en tu comunidad. Los restaurantes compran a proveedores
              locales, crean empleo local y reinvierten en el barrio.
            </p>
            <div class="difference-card__impact">
              <span class="impact-label">Empleos creados:</span>
              <span class="impact-value">47 puestos de trabajo</span>
            </div>
          </div>

          <div class="difference-card">
            <div class="difference-card__icon">♻️</div>
            <h3>Packaging Sostenible</h3>
            <p>
              Colaboramos solo con restaurantes comprometidos con envases
              biodegradables, compostables o reutilizables. Tu comida y el planeta, en armonía.
            </p>
            <div class="difference-card__impact">
              <span class="impact-label">Plástico evitado:</span>
              <span class="impact-value">1.2 toneladas/año</span>
            </div>
          </div>

          <div class="difference-card">
            <div class="difference-card__icon">💚</div>
            <h3>Precio Justo</h3>
            <p>
              Cobramos las comisiones más bajas del mercado (12% vs 30% de la competencia)
              para que los restaurantes puedan mantener precios justos y calidad alta.
            </p>
            <div class="difference-card__impact">
              <span class="impact-label">Ahorro promedio:</span>
              <span class="impact-value">18% menos que otros</span>
            </div>
          </div>

          <div class="difference-card">
            <div class="difference-card__icon">🎯</div>
            <h3>Transparencia Total</h3>
            <p>
              Mostramos de dónde vienen los ingredientes, qué porcentaje se queda en el restaurante
              y el impacto medioambiental de cada pedido. Sin letra pequeña.
            </p>
            <div class="difference-card__impact">
              <span class="impact-label">Confianza:</span>
              <span class="impact-value">98% satisfacción transparencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Environmental Impact Section -->
    <section class="about-impact">
      <div class="container">
        <div class="about-impact__content">
          <div class="about-impact__text">
            <span class="section-badge">🌍 Impacto Real</span>
            <h2 class="section-title">Cada pedido cuenta</h2>
            <p class="impact-description">
              No es solo comida. Cada vez que eliges Elixium Foods, estás votando por:
            </p>
            <ul class="impact-list">
              <li>✅ Menos emisiones de CO2 por transporte corto</li>
              <li>✅ Más empleos en tu comunidad</li>
              <li>✅ Preservación de recetas tradicionales</li>
              <li>✅ Menos desperdicio alimentario</li>
              <li>✅ Fortalecimiento del tejido social local</li>
            </ul>
            <div class="impact-quote">
              <blockquote>
                "Si queremos cambiar el mundo, empecemos por cambiar cómo comemos"
              </blockquote>
              <cite>- Filosofía Elixium Foods</cite>
            </div>
          </div>
          <div class="about-impact__visual">
            <div class="impact-circle">
              <div class="impact-circle__inner">
                <span class="impact-circle__number">2,847</span>
                <span class="impact-circle__label">Pedidos que apoyan lo local</span>
              </div>
            </div>
            <div class="impact-stats">
              <div class="impact-stat">
                <span class="impact-stat__icon">🌱</span>
                <span class="impact-stat__value">23%</span>
                <span class="impact-stat__label">Menos huella carbono</span>
              </div>
              <div class="impact-stat">
                <span class="impact-stat__icon">💼</span>
                <span class="impact-stat__value">47</span>
                <span class="impact-stat__label">Empleos locales</span>
              </div>
              <div class="impact-stat">
                <span class="impact-stat__icon">❤️</span>
                <span class="impact-stat__value">€180K</span>
                <span class="impact-stat__label">En la economía local</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="about-story">
      <div class="container">
        <div class="about-story__grid">
          <div class="about-story__content">
            <span class="section-badge">📖 Nuestra Historia</span>
            <h2 class="section-title">Todo empezó con una pregunta</h2>
            <p class="about-story__text">
              <em>"¿Por qué las apps de comida solo benefician a las grandes corporaciones?"</em>
            </p>
            <p class="about-story__text">
              Veíamos cómo los restaurantes del barrio luchaban contra comisiones abusivas
              del 30%, mientras perdían su identidad compitiendo con cadenas.
              <strong>Decidimos ser parte de la solución, no del problema.</strong>
            </p>
            <p class="about-story__text">
              Elixium Foods nació para democratizar el delivery, conectar personas con
              sabores auténticos y demostrar que se puede hacer negocio siendo sostenible
              y socialmente responsable.
            </p>
            <div class="about-story__mission">
              <h3>Nuestra misión es simple:</h3>
              <p>"Que cada comida cuente una historia de tu territorio"</p>
            </div>
          </div>
          <div class="about-story__image">
            <img
              src="https://images.unsplash.com/photo-1584799580661-53b7c6b99430?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGRlbGl2ZXJ5fGVufDB8fDB8fHww"
              alt="Restaurante local asociado" class="about-story__img" />
            <div class="about-story__overlay-text">
              <span>"Apoyamos lo que hace único a cada lugar"</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="about-features">
      <div class="container">
        <div class="about-features__header">
          <span class="section-badge">💎 Nuestros Servicios</span>
          <h2 class="section-title">Todo lo que necesitas en una sola plataforma</h2>
          <p class="section-subtitle">Tecnología avanzada al servicio de la comunidad local</p>
        </div>
        <div class="about-features__grid">
          <div class="about-features__item">
            <div class="about-features__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 class="about-features__item-title">Cuenta Personal</h3>
            <p class="about-features__item-text">
              Crea tu perfil personalizado, guarda tus direcciones favoritas y accede rápidamente a tus pedidos
              anteriores.
            </p>
          </div>
          <div class="about-features__item">
            <div class="about-features__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path>
                <path d="M20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path>
                <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 5H6"></path>
              </svg>
            </div>
            <h3 class="about-features__item-title">Carrito Inteligente</h3>
            <p class="about-features__item-text">
              Añade tus platos favoritos, personaliza tu pedido y calcula automáticamente costos de envío y totales.
            </p>
          </div>
          <div class="about-features__item">
            <div class="about-features__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h3 class="about-features__item-title">Pagos Seguros</h3>
            <p class="about-features__item-text">
              Múltiples métodos de pago disponibles con transacciones encriptadas y totalmente seguras.
            </p>
          </div>
          <div class="about-features__item">
            <div class="about-features__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="3"></circle>
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                </path>
              </svg>
            </div>
            <h3 class="about-features__item-title">Seguimiento en Vivo</h3>
            <p class="about-features__item-text">
              Monitorea tu pedido en tiempo real desde la cocina hasta tu puerta con actualizaciones constantes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="about-tech">
      <div class="container">
        <div class="about-tech__header">
          <span class="section-badge">⚡ Nuestra Tecnología</span>
          <h2 class="section-title">Innovación y calidad en cada línea de código</h2>
          <p class="section-subtitle">Tecnología ética que potencia el comercio local</p>
        </div>
        <div class="about-tech__grid">
          <div class="about-tech__item">
            <div class="about-tech__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"></path>
                <path d="M2 7l10 5 10-5"></path>
                <path d="M12 12v10"></path>
              </svg>
            </div>
            <h3 class="about-tech__item-title">Frontend Moderno</h3>
            <p class="about-tech__item-text">
              Interfaz rápida y responsive desarrollada con Vue.js, ofreciendo una experiencia fluida en cualquier
              dispositivo.
            </p>
          </div>
          <div class="about-tech__item">
            <div class="about-tech__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 class="about-tech__item-title">Backend Robusto</h3>
            <p class="about-tech__item-text">
              API segura y escalable construida con ASP.NET Core, garantizando rendimiento y confiabilidad.
            </p>
          </div>
          <div class="about-tech__item">
            <div class="about-tech__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <h3 class="about-tech__item-title">Datos Seguros</h3>
            <p class="about-tech__item-text">
              Base de datos optimizada que protege tu información personal y garantiza transacciones seguras.
            </p>
          </div>
          <div class="about-tech__item">
            <div class="about-tech__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 class="about-tech__item-title">Experiencia Completa</h3>
            <p class="about-tech__item-text">
              Plataforma integral con carrito inteligente, pagos seguros y seguimiento de pedidos en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="about-developer">
      <div class="container">
        <div class="about-developer__header">
          <span class="section-badge">💎 Nuestros Valores</span>
          <h2 class="section-title">Los principios que guían cada decisión que tomamos</h2>
          <p class="section-subtitle">Comprometidos con el cambio desde la acción</p>
        </div>
        <div class="about-developer__content">
          <div class="about-developer__text">
            <div class="about-developer__card">
              <h3 class="about-developer__card-title">Innovación Constante</h3>
              <p class="about-developer__card-text">
                Desarrollamos constantemente nuevas funcionalidades y mejoras para
                ofrecerte la mejor experiencia de pedido online del mercado.
              </p>
            </div>
            <div class="about-developer__card">
              <h3 class="about-developer__card-title">Apoyo Local</h3>
              <p class="about-developer__card-text">
                Impulsamos el negocio local conectando restaurantes de barrio con nuevos clientes,
                creando una comunidad gastronómica sólida y próspera.
              </p>
            </div>
            <div class="about-developer__card">
              <h3 class="about-developer__card-title">Transparencia Total</h3>
              <p class="about-developer__card-text">
                Sin sorpresas ni costes ocultos. Precios claros, tiempos de entrega precisos
                y información completa sobre cada restaurante y plato.
              </p>
            </div>
          </div>
          <div class="about-developer__stats">
            <div class="about-developer__stat">
              <span class="about-developer__stat-number">30min</span>
              <span class="about-developer__stat-label">Tiempo Promedio Entrega</span>
            </div>
            <div class="about-developer__stat">
              <span class="about-developer__stat-number">24/7</span>
              <span class="about-developer__stat-label">Soporte al Cliente</span>
            </div>
            <div class="about-developer__stat">
              <span class="about-developer__stat-number">98%</span>
              <span class="about-developer__stat-label">Satisfacción Cliente</span>
            </div>
            <div class="about-developer__stat">
              <span class="about-developer__stat-number">2.50€</span>
              <span class="about-developer__stat-label">Envío Desde*</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="about-testimonials">
      <div class="container">
        <div class="about-testimonials__header">
          <span class="section-badge">💬 Voces Reales</span>
          <h2 class="section-title">Lo que dice nuestra comunidad</h2>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p>"Desde que trabajo con Elixium, mis ventas subieron 40% y puedo seguir usando ingredientes de mi huerta
                familiar. Ellos entienden que somos más que un negocio."</p>
            </div>
            <div class="testimonial-card__author">
              <div class="author-avatar">👨‍🍳</div>
              <div class="author-info">
                <span class="author-name">Carlos Mendoza</span>
                <span class="author-role">Dueño de "La Cocina de Carlos"</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p>"Me encanta saber que mis pedidos apoyan al restaurante familiar de mi barrio y que los ingredientes
                vienen de granjas cercanas. Se nota en el sabor y en mi conciencia."</p>
            </div>
            <div class="testimonial-card__author">
              <div class="author-avatar">👩</div>
              <div class="author-info">
                <span class="author-name">María González</span>
                <span class="author-role">Cliente desde 2023</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p>"Como proveedora local, ver cómo Elixium conecta mis verduras directamente con los restaurantes del
                barrio me llena de orgullo. Es economía circular real."</p>
            </div>
            <div class="testimonial-card__author">
              <div class="author-avatar">🌾</div>
              <div class="author-info">
                <span class="author-name">Ana Torres</span>
                <span class="author-role">Huerta Orgánica "El Brote"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="about-team">
      <div class="container">
        <div class="about-team__header">
          <span class="section-badge">👥 El Equipo</span>
          <h2 class="section-title">Las personas detrás del cambio</h2>
          <p class="section-subtitle">Jóvenes emprendedores comprometidos con transformar el sector</p>
        </div>
        <div class="about-team__grid">
          <div class="about-team__member">
            <div class="about-team__member-image">
              <img src="../../Images/Abuelo.jpg" alt="CEO" />
            </div>
            <h3 class="about-team__member-name">Presi Martínez</h3>
            <p class="about-team__member-role">CEO & Fundador</p>
            <p class="about-team__member-bio">
              Ex-consultor que dejó las grandes corporaciones para crear impacto real.
              Su obsesión: que cada euro cuente para la comunidad.
            </p>
            <div class="member-values">
              <span class="value-tag">Sostenibilidad</span>
              <span class="value-tag">Impacto Social</span>
            </div>
          </div>
          <div class="about-team__member">
            <div class="about-team__member-image">
              <img src="../../Images/BigBoss.jpg" alt="CTO" />
            </div>
            <h3 class="about-team__member-name">Francisco Villa</h3>
            <p class="about-team__member-role">CTO & Co-fundador</p>
            <p class="about-team__member-bio">
              Desarrollador full-stack apasionado por crear tecnología que sirva a las personas,
              no al revés. Cree en el poder transformador del código ético.
            </p>
            <div class="member-values">
              <span class="value-tag">Innovación</span>
              <span class="value-tag">Transparencia</span>
            </div>
          </div>
          <div class="about-team__member">
            <div class="about-team__member-image">
              <img src="../../Images/Claudia.png" alt="IA Assistant" />
            </div>
            <h3 class="about-team__member-name">Claude</h3>
            <p class="about-team__member-role">Asistente IA Ético</p>
            <p class="about-team__member-bio">
              IA diseñada con valores humanos para optimizar la experiencia sin sacrificar
              la privacidad ni promover consumismo irresponsable.
            </p>
            <div class="member-values">
              <span class="value-tag">IA Responsable</span>
              <span class="value-tag">Privacidad</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="about-cta">
      <div class="container">
        <div class="about-cta__content">
          <span class="cta-badge">🚀 Únete al Movimiento</span>
          <h2 class="about-cta__title">Cada pedido es un voto por el futuro que queremos</h2>
          <p class="about-cta__text">
            No es solo comida a domicilio. Es apoyar a tu vecino, cuidar el planeta
            y construir una economía más justa, un plato a la vez.
          </p>
          <div class="about-cta__buttons">
            <router-link to="/restaurants" class="about-cta__button about-cta__button--primary">
              <span>Pide con Propósito</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </router-link>
            <router-link to="/register" class="about-cta__button about-cta__button--secondary">
              Crear Cuenta Gratuita
            </router-link>
          </div>
          <div class="about-cta__guarantee">
            <span class="guarantee-icon">🌱</span>
            <span>Garantía 100%: Tu primer pedido apoya directamente un negocio local</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Animación de scroll suave para el indicador
  const scrollIndicator = document.querySelector('.about-hero__scroll');
  scrollIndicator?.addEventListener('click', () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  });

  // Animación de números cuando entran en viewport
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.impact-circle, .impact-stat').forEach(el => {
    observer.observe(el);
  });
});
</script>

<style lang="scss" scoped>
// Variables
$primary: #FF416C;
$primary-gradient: linear-gradient(135deg, #FF416C, #FF4B2B);
$secondary: #0652DD;
$success: #27AE60;
$accent: #FFA502;
$dark: #1e293b;
$light: #f8fafc;
$white: #ffffff;
$text: #1e293b;
$text-light: #64748b;
$text-muted: #94a3b8;
$border: #e2e8f0;
$border-radius: 16px;
$transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
$shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 25px 60px rgba(0, 0, 0, 0.15);

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
}

.about-view {
  min-height: 100vh;
  background-color: $light;
}

// Utility classes
.section-badge {
  display: inline-block;
  background: rgba($primary, 0.1);
  color: $primary;
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: $dark;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.875rem;
  }
}

.section-subtitle {
  font-size: 1.25rem;
  color: $text-light;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.highlight {
  background: $primary-gradient;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

// Hero Section
.about-hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: white;

  &__background {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(#FF416C, 0.85) 0%, rgba(#FF4B2B, 0.65) 100%);
  }

  &__content {
    position: relative;
    z-index: 5;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  &__badge {
    display: inline-block;
    background: rgba(white, 0.2);
    backdrop-filter: blur(10px);
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    margin-bottom: 2rem;
    font-weight: 600;
    border: 1px solid rgba(white, 0.3);
  }

  &__title {
    font-size: 4.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    line-height: 1.1;

    @media (max-width: 768px) {
      font-size: 3.5rem;
    }

    @media (max-width: 480px) {
      font-size: 2.75rem;
    }
  }

  &__subtitle {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    line-height: 1.6;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  &__stats-mini {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .stat-mini {
      text-align: center;

      .number {
        display: block;
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 0.25rem;
      }

      .label {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }

  &__scroll {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    animation: float 3s ease-in-out infinite;

    span {
      font-weight: 500;
      opacity: 0.8;
    }

    svg {
      animation: bounce 2s infinite;
    }
  }

  &__wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 0;
  }
}

// Difference Section
.about-difference {
  padding: 8rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 5rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
}

.difference-card {
  background: white;
  padding: 2.5rem;
  border-radius: $border-radius;
  box-shadow: $shadow;
  transition: $transition;
  border: 1px solid $border;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: $primary-gradient;
  }

  &--featured {
    background: linear-gradient(135deg, rgba($primary, 0.05), rgba($success, 0.05));
    border: 2px solid $primary;
    transform: scale(1.02);

    &::before {
      height: 6px;
    }
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-lg;
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    display: block;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: $dark;
  }

  p {
    color: $text-light;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  &__impact {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: rgba($success, 0.05);
    border-radius: 8px;
    border-left: 4px solid $success;

    .impact-label {
      font-size: 0.8rem;
      color: $text-muted;
      font-weight: 500;
    }

    .impact-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: $success;
    }
  }
}

// Impact Section
.about-impact {
  padding: 8rem 0;
  background: linear-gradient(135deg, $light 0%, rgba($primary, 0.02) 100%);

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  &__text {
    .impact-description {
      font-size: 1.25rem;
      color: $text-light;
      margin-bottom: 2rem;
    }
  }
}

.impact-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;

  li {
    padding: 0.75rem 0;
    font-size: 1.1rem;
    color: $text-light;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}

.impact-quote {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: $border-radius;
  border-left: 6px solid $primary;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);

  blockquote {
    font-size: 1.25rem;
    font-style: italic;
    color: $dark;
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  cite {
    color: $primary;
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.impact-circle {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto 3rem;

  &__inner {
    position: absolute;
    inset: 20px;
    background: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow;
    border: 6px solid transparent;
    background-clip: padding-box;

    &::before {
      content: '';
      position: absolute;
      inset: -6px;
      background: $primary-gradient;
      border-radius: 50%;
      z-index: -1;
      animation: rotate 10s linear infinite;
    }
  }

  &__number {
    font-size: 3rem;
    font-weight: 800;
    background: $primary-gradient;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 0.5rem;
  }

  &__label {
    font-size: 0.9rem;
    color: $text-light;
    text-align: center;
    font-weight: 600;
  }
}

.impact-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.impact-stat {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  &__icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  &__value {
    display: block;
    font-size: 1.75rem;
    font-weight: 800;
    color: $primary;
    margin-bottom: 0.25rem;
  }

  &__label {
    font-size: 0.85rem;
    color: $text-light;
    font-weight: 500;
  }
}

// Story Section
.about-story {
  padding: 8rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  &__text {
    font-size: 1.15rem;
    line-height: 1.8;
    color: $text-light;
    margin-bottom: 1.5rem;

    em {
      font-size: 1.3rem;
      color: $primary;
      font-weight: 600;
      display: block;
      margin-bottom: 1rem;
    }

    strong {
      color: $dark;
    }
  }

  &__mission {
    margin-top: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, rgba($primary, 0.05), rgba($success, 0.05));
    border-radius: $border-radius;
    border: 2px solid rgba($primary, 0.1);

    h3 {
      font-size: 1.25rem;
      color: $dark;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.5rem;
      font-weight: 600;
      background: $primary-gradient;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin: 0;
      line-height: 1.4;
    }
  }

  &__image {
    position: relative;

    @media (max-width: 992px) {
      order: -1;
    }
  }

  &__img {
    width: 100%;
    border-radius: $border-radius;
    box-shadow: $shadow-lg;
  }

  &__overlay-text {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    background: rgba(white, 0.95);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    span {
      font-weight: 600;
      color: $dark;
      font-size: 1.1rem;
    }
  }
}

// Features Section
.about-features {
  padding: 8rem 0;
  background-color: white;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 4rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    text-align: center;
    padding: 2.5rem 2rem;
    background-color: $light;
    border-radius: $border-radius;
    transition: $transition;
    border: 1px solid $border;

    &:hover {
      transform: translateY(-10px);
      box-shadow: $shadow-lg;
      background-color: white;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $secondary, #12CBC4);
    border-radius: 20px;
    margin-bottom: 1.5rem;
    color: white;
  }

  &__item-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: $dark;
  }

  &__item-text {
    color: $text-light;
    line-height: 1.6;
  }
}

// Developer Section (Values)
.about-developer {
  padding: 8rem 0;
  background-color: white;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 4rem;
  }

  &__content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: start;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  &__text {
    display: grid;
    gap: 2rem;
  }

  &__card {
    padding: 2rem;
    background-color: $light;
    border-radius: $border-radius;
    border-left: 4px solid $primary;
    transition: $transition;

    &:hover {
      transform: translateX(5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }
  }

  &__card-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: $dark;
  }

  &__card-text {
    color: $text-light;
    line-height: 1.6;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;

    @media (max-width: 992px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__stat {
    text-align: center;
    padding: 1.5rem;
    background-color: $light;
    border-radius: $border-radius;
    transition: $transition;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }

    &-number {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      background: $primary-gradient;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 0.5rem;
    }

    &-label {
      font-size: 0.85rem;
      color: $text-light;
      font-weight: 500;
    }
  }
}

// Testimonials Section

// Tech Stack Section
.about-tech {
  padding: 8rem 0;
  background-color: $light;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 4rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    text-align: center;
    padding: 2.5rem 2rem;
    background-color: white;
    border-radius: $border-radius;
    transition: $transition;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-10px);
      box-shadow: $shadow-lg;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: $primary-gradient;
    border-radius: 20px;
    margin-bottom: 1.5rem;
    color: white;
  }

  &__item-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: $dark;
  }

  &__item-text {
    color: $text-light;
    line-height: 1.6;
  }
}

.about-testimonials {
  padding: 8rem 0;
  background: $light;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 4rem;
  }
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: white;
  padding: 2.5rem;
  border-radius: $border-radius;
  box-shadow: $shadow;
  transition: $transition;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-lg;
  }

  &__content {
    margin-bottom: 2rem;

    p {
      font-size: 1.1rem;
      line-height: 1.7;
      color: $text-light;
      font-style: italic;
      margin: 0;
    }
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .author-avatar {
    width: 50px;
    height: 50px;
    background: $primary-gradient;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .author-info {
    .author-name {
      display: block;
      font-weight: 700;
      color: $dark;
      margin-bottom: 0.25rem;
    }

    .author-role {
      font-size: 0.9rem;
      color: $text-muted;
    }
  }
}

// Team Section
.about-team {
  padding: 8rem 0;
  background: white;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 4rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin: 0 auto;
    }
  }

  &__member {
    text-align: center;
    background: $light;
    padding: 2.5rem;
    border-radius: $border-radius;
    transition: $transition;

    &:hover {
      transform: translateY(-10px);
      box-shadow: $shadow-lg;
    }
  }

  &__member-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 1.5rem;
    border: 6px solid white;
    box-shadow: $shadow;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__member-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: $dark;
  }

  &__member-role {
    color: $primary;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  &__member-bio {
    color: $text-light;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .member-values {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;

    .value-tag {
      background: rgba($primary, 0.1);
      color: $primary;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }
}

// CTA Section
.about-cta {
  padding: 8rem 0;
  background: $primary-gradient;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    padding: 5rem 0;
  }

  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-badge {
    background: rgba(white, 0.2);
    color: white;
    border: 1px solid rgba(white, 0.3);
  }

  &__title {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 2rem 0 1.5rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  &__text {
    font-size: 1.25rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  &__buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 3rem;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 2.5rem;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    transition: $transition;
    font-size: 1.1rem;

    &--primary {
      background-color: white;
      color: $primary;

      &:hover {
        background-color: rgba(white, 0.9);
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      }
    }

    &--secondary {
      background-color: transparent;
      color: white;
      border: 2px solid white;

      &:hover {
        background-color: rgba(white, 0.1);
        transform: translateY(-5px);
      }
    }
  }

  &__guarantee {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(white, 0.1);
    padding: 1rem 1.5rem;
    border-radius: 50px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(white, 0.2);

    .guarantee-icon {
      font-size: 1.25rem;
    }

    span:last-child {
      font-weight: 500;
      opacity: 0.9;
    }
  }
}

// Animations
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

// Animation triggers
.animate {
  .impact-circle__number {
    animation: countUp 2s ease-out;
  }

  .impact-stat__value {
    animation: countUp 1.5s ease-out;
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
