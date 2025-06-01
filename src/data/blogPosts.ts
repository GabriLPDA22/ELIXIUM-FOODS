// src/data/blogPosts.ts
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  publicationDate: string;
  author: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  contentHtml: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'desmitificando-la-dieta-keto-que-es-y-como-empezar',
    title: 'Desmitificando la Dieta Keto: ¿Qué Es y Cómo Empezar?',
    publicationDate: '2025-06-01',
    author: 'Dr. Nutri Consejos',
    imageUrl: 'https://picsum.photos/seed/ketodiet/1200/800',
    imageAlt: 'Plato con alimentos keto: aguacate, salmón, huevos y verduras de hoja verde',
    category: 'Dietas y Nutrición',
    tags: ['keto', 'dieta cetogénica', 'low carb', 'nutrición', 'pérdida de peso', 'salud'],
    readTime: '9 min',
    excerpt: 'La dieta Keto es muy popular, pero ¿en qué consiste realmente? Te explicamos sus bases, beneficios potenciales y cómo encontrar opciones keto en tu app de delivery favorita.',
    contentHtml: `
      <p>La dieta cetogénica, o dieta Keto, ha ganado una enorme popularidad en los últimos años, principalmente por sus promesas de pérdida de peso rápida y mejora de ciertos marcadores de salud. Pero, ¿qué hay detrás de este enfoque nutricional y cómo funciona?</p>
      <img src="https://picsum.photos/seed/avocadosalmon/800/500" alt="Aguacate y salmón, alimentos clave en la dieta keto" style="width:100%;border-radius:8px;margin:1.5rem 0;">

      <h2>¿Qué es la Dieta Keto?</h2>
      <p>La dieta Keto es un plan de alimentación <strong>muy bajo en carbohidratos, alto en grasas y moderado en proteínas</strong>. El objetivo principal es inducir un estado metabólico llamado <strong>cetosis</strong>.</p>
      <p>En una dieta estándar, nuestro cuerpo utiliza la glucosa (proveniente de los carbohidratos) como principal fuente de energía. Cuando reduces drásticamente la ingesta de carbohidratos (generalmente a menos de 20-50 gramos al día), el cuerpo se ve obligado a buscar una fuente de combustible alternativa.</p>

      <h2>¿Cómo Funciona la Cetosis?</h2>
      <p>Una vez que las reservas de glucosa se agotan, el hígado comienza a descomponer las grasas (tanto las que consumes como las almacenadas en tu cuerpo) en unas moléculas llamadas <strong>cetonas</strong>. Estas cetonas se convierten entonces en la principal fuente de energía para el cerebro y el resto del cuerpo.</p>
      <p>Alcanzar un estado de cetosis nutricional puede tardar desde unos pocos días hasta una semana, dependiendo de la persona y su metabolismo.</p>

      <h2>Alimentos Permitidos y a Evitar en Keto</h2>
      <p>Para seguir una dieta Keto, te centrarás en:</p>
      <ul>
        <li><strong>Grasas saludables:</strong> Aguacates, aceite de oliva, aceite de coco, mantequilla, frutos secos y semillas (con moderación), pescados grasos.</li>
        <li><strong>Proteínas:</strong> Carnes rojas, aves, pescado, huevos, mariscos.</li>
        <li><strong>Vegetales bajos en carbohidratos:</strong> Principalmente verduras de hoja verde (espinacas, lechuga, kale), brócoli, coliflor, calabacín, pimientos.</li>
        <li><strong>Lácteos altos en grasa:</strong> Quesos curados, nata para montar (crema de leche), yogur griego entero (con moderación y sin azúcar).</li>
      </ul>
      <p>Debes evitar o limitar estrictamente:</p>
      <ul>
        <li><strong>Azúcares:</strong> Refrescos, dulces, bollería, zumos de frutas, miel, siropes.</li>
        <li><strong>Cereales y granos:</strong> Trigo, arroz, maíz, avena, pasta, pan.</li>
        <li><strong>Legumbres:</strong> Lentejas, garbanzos, judías (frijoles).</li>
        <li><strong>Tubérculos:</strong> Patatas, batatas (camotes), zanahorias (con moderación).</li>
        <li><strong>Frutas altas en azúcar:</strong> Plátanos, uvas, mangos (se permiten bayas como fresas o arándanos en pequeñas cantidades).</li>
        <li><strong>Alimentos procesados "bajos en grasa" o "dietéticos":</strong> Suelen ser altos en carbohidratos y azúcares.</li>
      </ul>
      <img src="https://picsum.photos/seed/ketomeal/800/500" alt="Ejemplo de comida keto lista para pedir" style="width:100%;border-radius:8px;margin:1.5rem 0;">
      <h2>Beneficios Potenciales de la Dieta Keto</h2>
      <ul>
        <li><strong>Pérdida de peso:</strong> Es uno de los beneficios más buscados, a menudo debido a la reducción del apetito y la quema de grasa.</li>
        <li><strong>Mejora del control del azúcar en sangre:</strong> Puede ser beneficiosa para personas con diabetes tipo 2 o resistencia a la insulina.</li>
        <li><strong>Aumento de la energía y claridad mental:</strong> Algunas personas reportan niveles de energía más estables y mayor concentración una vez adaptadas.</li>
        <li><strong>Posibles beneficios neurológicos:</strong> Se investiga su uso en condiciones como la epilepsia y otras enfermedades neurodegenerativas.</li>
      </ul>
      <h2>Consideraciones Importantes</h2>
      <p>Aunque la dieta Keto puede ofrecer beneficios, no es adecuada para todos. Es importante considerar:</p>
      <ul>
        <li><strong>"Gripe Keto":</strong> Síntomas como dolor de cabeza, fatiga o irritabilidad que pueden aparecer durante la fase de adaptación.</li>
        <li><strong>Restricciones sociales y adherencia:</strong> Puede ser difícil de seguir a largo plazo y en situaciones sociales.</li>
        <li><strong>Necesidad de planificación:</strong> Para asegurar un aporte adecuado de nutrientes y evitar deficiencias.</li>
        <li><strong>Contraindicaciones:</strong> No se recomienda para personas con ciertas condiciones médicas (problemas pancreáticos, hepáticos, renales, etc.) o mujeres embarazadas/lactantes sin supervisión médica.</li>
      </ul>
      <blockquote style="border-left: 4px solid var(--primary); margin: 1.5rem 0; padding: 1rem 1.5rem; background-color: var(--light-gray, #f9f9f9); font-style: italic;">
        "Antes de iniciar cualquier dieta restrictiva como la Keto, es fundamental consultar con un profesional de la salud o un dietista-nutricionista."
      </blockquote>
      <h2>Encontrando Opciones Keto en tu Delivery</h2>
      <p>¡Buenas noticias! Cada vez más restaurantes ofrecen opciones Keto o adaptables. Busca platos como:</p>
      <ul>
        <li>Ensaladas abundantes con proteínas (pollo, salmón) y aderezos grasos (evita los dulces).</li>
        <li>Carnes o pescados a la parrilla o al horno con guarnición de verduras bajas en carbohidratos.</li>
        <li>Revueltos o tortillas de huevo con aguacate y queso.</li>
        <li>Algunos lugares incluso ofrecen "panes" o "bases de pizza" hechos con harina de almendras o coliflor.</li>
      </ul>
      <p>Filtra por "Keto" o "Bajo en carbohidratos" en tu app de delivery favorita, o revisa bien los ingredientes de los platos. ¡Disfrutar de Keto a domicilio es posible!</p>
    `
  },
  {
    id: 2,
    slug: 'meal-prep-inteligente-con-ayuda-de-tu-delivery',
    title: 'Meal Prep Inteligente: Pide tus Bases y Ahorra Tiempo en la Cocina',
    publicationDate: '2025-05-22',
    author: 'Organiza Chef',
    imageUrl: 'https://picsum.photos/seed/mealprep/1200/800',
    imageAlt: 'Contenedores de meal prep con pollo, quinoa y vegetales listos para la semana',
    category: 'Estilo de Vida Saludable',
    tags: ['meal prep', 'comida saludable', 'delivery', 'organización', 'ahorro de tiempo'],
    readTime: '6 min',
    excerpt: '¿Sin tiempo para cocinar pero quieres comer sano? Descubre cómo tu app de delivery puede ser tu gran aliada para un meal prep semanal fácil y delicioso.',
    contentHtml: `
      <p>El meal prep o preparación de comidas semanales es una estrategia fantástica para mantener una alimentación saludable, ahorrar dinero y reducir el estrés de pensar "¿qué como hoy?". Pero seamos honestos, a veces incluso la preparación inicial puede parecer abrumadora.</p>
      <img src="https://picsum.photos/seed/ingredientsdelivery/800/500" alt="Ingredientes frescos y bases cocinadas llegando en un pedido de delivery" style="width:100%;border-radius:8px;margin:1.5rem 0;">
      <h2>¿Por Qué el Meal Prep?</h2>
      <ul>
        <li><strong>Ahorro de tiempo:</strong> Dedicas unas horas un día y tienes comidas listas para varios días.</li>
        <li><strong>Alimentación más saludable:</strong> Controlas los ingredientes y las porciones, evitando opciones menos sanas de último minuto.</li>
        <li><strong>Menos estrés:</strong> La decisión de qué comer ya está tomada.</li>
        <li><strong>Ahorro económico:</strong> Sueles gastar menos que comiendo fuera o pidiendo impulsivamente.</li>
      </ul>
      <h2>Tu App de Delivery al Rescate del Meal Prep</h2>
      <p>Aquí es donde la tecnología puede simplificar aún más las cosas. ¿Sabías que puedes usar tu servicio de entrega de comida para potenciar tu meal prep?</p>
      <h3>1. Pide Proteínas Cocinadas:</h3>
      <p>Muchos restaurantes ofrecen pollo a la parrilla, salmón al horno, carne desmenuzada o tofu/tempeh ya listos. Pide una buena cantidad y tendrás la base proteica para varias comidas.</p>
      <h3>2. Carbohidratos Complejos Listos:</h3>
      <p>Arroz integral, quinoa, couscous integral... son excelentes bases que puedes pedir ya cocinadas. ¡Adiós a esperar a que se cuezan!</p>
      <h3>3. Verduras Asadas o al Vapor:</h3>
      <p>Una guarnición de verduras asadas o al vapor es perfecta. Pide una porción grande y divídela para tus tuppers.</p>
      <h3>4. Ensaladas Base o Toppings:</h3>
      <p>Puedes pedir ensaladas grandes sin aderezar o toppings específicos como frutos secos, semillas, o quesos para enriquecer tus preparaciones.</p>
      <img src="https://picsum.photos/seed/healthytupper/800/500" alt="Tupper de comida saludable y colorida" style="width:100%;border-radius:8px;margin:1.5rem 0;">
      <h2>Ideas para Combinar tus Pedidos de Delivery en Meals Semanales:</h2>
      <ul>
        <li><strong>Bowl Energético:</strong> Base de quinoa pedida + pollo a la parrilla pedido + añade en casa aguacate fresco, tomate cherry y un puñado de espinacas. Aderezo: aceite de oliva y limón.</li>
        <li><strong>Wrap Rápido:</strong> Tortilla integral (de tu despensa) + carne desmenuzada pedida + añade hojas de lechuga, pimiento en tiras y un poco de hummus.</li>
        <li><strong>Salteado Express:</strong> Verduras asadas pedidas + tofu pedido + añade un poco de salsa de soja y jengibre rallado. Sirve con arroz integral pedido.</li>
      </ul>
      <blockquote style="border-left: 4px solid var(--primary); margin: 1.5rem 0; padding: 1rem 1.5rem; background-color: var(--light-gray, #f9f9f9); font-style: italic;">
      "La clave está en pedir componentes versátiles que puedas mezclar y combinar de diferentes maneras a lo largo de la semana."
      </blockquote>
      <p>Así, reduces drásticamente el tiempo en la cocina, pero sigues teniendo el control sobre la composición final de tus platos. ¡Prueba este enfoque de "meal prep asistido" y disfruta de más tiempo libre y comidas deliciosas y saludables!</p>
    `
  },
  {
    id: 3,
    slug: 'top-5-almuerzos-saludables-para-pedir-en-la-oficina',
    title: 'Top 5 Almuerzos Saludables y Rápidos para Pedir en la Oficina',
    publicationDate: '2025-05-10',
    author: 'WorkWell Eats',
    imageUrl: 'https://picsum.photos/seed/officelunch/1200/800',
    imageAlt: 'Persona disfrutando de un almuerzo saludable en su escritorio de oficina',
    category: 'Comida y Trabajo',
    tags: ['almuerzo saludable', 'oficina', 'delivery rápido', 'comida equilibrada', 'productividad'],
    readTime: '5 min',
    excerpt: 'Mantén tu energía y concentración durante la jornada laboral con estas opciones de almuerzo saludable que puedes pedir directamente a tu oficina. ¡Adiós a las comidas pesadas!',
    contentHtml: `
      <p>La hora del almuerzo en la oficina puede ser un desafío. Entre el poco tiempo y las opciones a veces limitadas, es fácil caer en comidas rápidas poco saludables que nos dejan somnolientos por la tarde. ¡Pero no tiene por qué ser así! Gracias a los servicios de delivery, acceder a almuerzos nutritivos y deliciosos es más fácil que nunca.</p>

      <h2>¿Qué Hace a un Almuerzo de Oficina "Saludable"?</h2>
      <p>Un buen almuerzo laboral debería:</p>
      <ul>
        <li><strong>Ser Equilibrado:</strong> Combinar proteínas magras, carbohidratos complejos y grasas saludables.</li>
        <li><strong>Proporcionar Energía Sostenida:</strong> Para evitar el bajón de media tarde.</li>
        <li><strong>Ser Fácil de Digerir:</strong> Para no sentirte pesado.</li>
        <li><strong>Ser Sabroso:</strong> ¡Porque comer sano no tiene que ser aburrido!</li>
      </ul>
      <img src="https://picsum.photos/seed/saladbowl/800/500" alt="Bowl de ensalada colorida y apetitosa" style="width:100%;border-radius:8px;margin:1.5rem 0;">

      <h2>Nuestro Top 5 de Almuerzos Saludables para Pedir:</h2>
      <h3>1. Ensalada Completa con Proteína</h3>
      <p>Una base de hojas verdes variadas, vegetales frescos y crujientes, una buena porción de proteína (pollo a la parrilla, salmón, atún, tofu, garbanzos) y un aderezo ligero a base de aceite de oliva o yogur. Pide el aderezo aparte para que no se ablande la ensalada.</p>

      <h3>2. Poke Bowl o Buddha Bowl</h3>
      <p>Estos bowls son una explosión de sabor y nutrientes. Suelen llevar una base de arroz integral o quinoa, proteína (pescado crudo marinado en el poke, o legumbres/tofu en el Buddha), aguacate, edamame, algas, y vegetales variados. Son frescos, saciantes y muy personalizables.</p>

      <h3>3. Wraps Integrales Vegetarianos o con Pollo</h3>
      <p>Un wrap relleno de hummus, muchos vegetales (zanahoria rallada, pepino, pimiento, espinacas), y quizás algo de queso feta o pollo desmenuzado. Elige tortillas integrales para un extra de fibra.</p>
      <img src="https://picsum.photos/seed/healthywrap/800/500" alt="Wrap integral relleno de vegetales frescos" style="width:100%;border-radius:8px;margin:1.5rem 0;">

      <h3>4. Sopas o Cremas de Verduras (con un "extra")</h3>
      <p>Especialmente reconfortantes en días fríos. Una crema de calabaza, lentejas, o una sopa minestrone. Acompáñala con una pequeña porción de pan integral o unos croutons caseros si el restaurante los ofrece, o añade unos frutos secos para un toque crujiente y más saciedad.</p>

      <h3>5. Salmón o Pescado Blanco al Horno con Verduras Asadas</h3>
      <p>Una opción más contundente pero muy saludable. El pescado aporta proteínas de calidad y omega-3. Las verduras asadas (brócoli, espárragos, pimientos) son la guarnición perfecta. Asegúrate que no venga con salsas muy pesadas o cremosas.</p>

      <blockquote style="border-left: 4px solid var(--primary); margin: 1.5rem 0; padding: 1rem 1.5rem; background-color: var(--light-gray, #f9f9f9); font-style: italic;">
      "Pide de forma inteligente: revisa los ingredientes, opta por métodos de cocción saludables (parrilla, horno, vapor) y no dudes en pedir modificaciones si es posible."
      </blockquote>
      <p>Con estas ideas, tus almuerzos en la oficina pueden ser un momento delicioso y saludable que te ayude a rendir al máximo. ¡Explora las opciones en tu app de delivery y descubre tus nuevos favoritos!</p>
    `
  }
];
