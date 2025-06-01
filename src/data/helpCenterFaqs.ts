// src/data/helpCenterFaqs.ts
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  isOpen?: boolean; // Para el estado del acordeón
}

export interface FaqCategory {
  id: string;
  name: string;
  icon?: string;
}

export const faqCategories: FaqCategory[] = [
  { id: 'pedidos', name: 'Sobre tus Pedidos', icon: '📦' },
  { id: 'pagos', name: 'Pagos y Facturación', icon: '💳' },
  { id: 'cuenta', name: 'Gestión de tu Cuenta', icon: '👤' },
  { id: 'delivery', name: 'Entregas', icon: '🛵' },
  { id: 'promociones', name: 'Ofertas y Promociones', icon: '🏷️' },
  { id: 'problemas', name: 'Problemas Técnicos', icon: '⚙️' },
];

export const faqsData: FaqItem[] = [
  {
    id: 1, question: '¿Cómo puedo realizar un pedido?',
    answer: 'Puedes realizar un pedido a través de nuestra app móvil o sitio web. Simplemente busca tu restaurante favorito, añade platos a tu carrito y procede al pago. ¡Es muy fácil!',
    category: 'pedidos', keywords: ['hacer', 'nuevo', 'ordenar', 'comprar']
  },
  {
    id: 2, question: '¿Puedo modificar o cancelar mi pedido una vez realizado?',
    answer: 'Si el restaurante aún no ha comenzado a preparar tu pedido, es posible que puedas modificarlo o cancelarlo. Contacta con nuestro equipo de soporte lo antes posible a través de la sección "Ayuda" en tu pedido activo para ver las opciones disponibles.',
    category: 'pedidos', keywords: ['cambiar', 'anular', 'editar', 'cancelación']
  },
  {
    id: 3, question: '¿Qué hago si mi pedido llega incorrecto o incompleto?',
    answer: 'Lamentamos mucho cualquier inconveniente. Por favor, dirígete a la sección de "Ayuda" de tu pedido en la app y reporta el problema. Adjunta fotos si es posible. Nuestro equipo revisará tu caso y te ofrecerá una solución.',
    category: 'pedidos', keywords: ['error', 'equivocado', 'falta', 'artículo', 'mal']
  },
  {
    id: 4, question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos la mayoría de tarjetas de crédito y débito (Visa, Mastercard, American Express), así como PayPal y otros métodos de pago electrónico seguros disponibles en tu región. Puedes ver todas las opciones al finalizar tu compra.',
    category: 'pagos', keywords: ['tarjeta', 'paypal', 'efectivo', 'forma de pago']
  },
  {
    id: 5, question: '¿Es seguro introducir los datos de mi tarjeta?',
    answer: 'Sí, la seguridad de tus datos es nuestra máxima prioridad. Utilizamos encriptación SSL y cumplimos con los estándares PCI DSS para proteger toda tu información de pago.',
    category: 'pagos', keywords: ['seguridad', 'protección', 'datos bancarios']
  },
  {
    id: 6, question: '¿Cómo obtengo una factura de mi pedido?',
    answer: 'Recibirás un recibo detallado por email después de cada pedido. Si necesitas una factura con datos fiscales, puedes solicitarla a través de la sección "Mis Pedidos" en tu perfil, seleccionando el pedido correspondiente.',
    category: 'pagos', keywords: ['recibo', 'ticket', 'impuestos', 'facturación']
  },
  {
    id: 7, question: '¿Cómo puedo cambiar mi contraseña?',
    answer: 'Puedes cambiar tu contraseña desde la sección "Mi Perfil" > "Configuración de Cuenta" > "Cambiar Contraseña". Si has olvidado tu contraseña, utiliza la opción "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión.',
    category: 'cuenta', keywords: ['password', 'clave', 'olvidé', 'restablecer']
  },
  {
    id: 8, question: '¿Cómo actualizo mi dirección de entrega?',
    answer: 'Puedes gestionar tus direcciones de entrega guardadas en "Mi Perfil" > "Mis Direcciones". También puedes añadir o editar una dirección durante el proceso de finalización de un nuevo pedido.',
    category: 'cuenta', keywords: ['direcciones', 'ubicación', 'envío', 'domicilio']
  },
  {
    id: 9, question: '¿Cómo hago el seguimiento de mi pedido?',
    answer: 'Una vez que tu pedido es aceptado por el restaurante, podrás ver el estado y la ubicación del repartidor en tiempo real desde la sección "Mis Pedidos" en la app.',
    category: 'delivery', keywords: ['tracking', 'rastrear', 'repartidor', 'dónde está']
  },
  {
    id: 10, question: '¿Qué pasa si no estoy en casa cuando llega el repartidor?',
    answer: 'El repartidor intentará contactarte por teléfono. Si no logra comunicarse, seguirá las instrucciones que hayas dejado (ej. "dejar en portería") o esperará unos minutos. Si no es posible entregar el pedido, se te notificará y podrías incurrir en gastos. Te recomendamos estar atento a las notificaciones de la app.',
    category: 'delivery', keywords: ['ausente', 'no estoy', 'entrega fallida']
  },
  {
    id: 11, question: '¿Cómo utilizo un código promocional?',
    answer: 'Puedes introducir tu código promocional en la página de resumen del pedido, justo antes de confirmar el pago. Verás un campo específico para "Código de descuento" o "Cupón".',
    category: 'promociones', keywords: ['cupón', 'descuento', 'oferta', 'código']
  },
  {
    id: 12, question: 'Mi código promocional no funciona, ¿qué hago?',
    answer: 'Asegúrate de que el código esté escrito correctamente, no haya caducado y cumplas con los términos y condiciones de la promoción (ej. pedido mínimo, restaurantes específicos). Si sigue sin funcionar, contacta con nuestro equipo de soporte.',
    category: 'promociones', keywords: ['cupón inválido', 'error código', 'no aplica']
  },
  {
    id: 13, question: 'La aplicación no funciona correctamente, ¿qué puedo hacer?',
    answer: 'Primero, asegúrate de tener la última versión de la aplicación instalada y una conexión a internet estable. Prueba cerrando y volviendo a abrir la app. Si el problema persiste, reinicia tu dispositivo. Como último recurso, puedes intentar reinstalar la aplicación. Si nada de esto funciona, por favor, contacta a nuestro equipo de soporte técnico detallando el problema.',
    category: 'problemas', keywords: ['app error', 'falla', 'no carga', 'problema técnico', 'cuelga']
  },
  {
    id: 14, question: 'No puedo iniciar sesión en mi cuenta.',
    answer: 'Verifica que estés introduciendo correctamente tu email y contraseña. Si has olvidado tu contraseña, utiliza la opción "Restablecer contraseña". Asegúrate también de no tener activado el bloqueo de mayúsculas. Si sigues sin poder acceder, contacta con soporte.',
    category: 'problemas', keywords: ['login', 'acceso', 'entrar', 'contraseña olvidada', 'no puedo ingresar']
  }
];
