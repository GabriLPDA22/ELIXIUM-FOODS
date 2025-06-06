<template>
  <div style="display: none;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

// Props opcionales para personalizar el scrollbar
interface Props {
  width?: string;
  thumbColor?: string;
  trackColor?: string;
  hoverColor?: string;
  borderRadius?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '8px',
  thumbColor: '#ff4550',
  trackColor: 'rgba(0, 0, 0, 0.05)',
  hoverColor: '#048a48',
  borderRadius: '10px'
});

// Función para aplicar los estilos dinámicamente
const applyScrollbarStyles = () => {
  const styleId = 'custom-scrollbar-styles';

  // Remover estilos anteriores si existen
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Crear nuevos estilos
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* ===== SCROLLBAR MODERNO ===== */

    /* Webkit browsers (Chrome, Safari, Edge) */
    ::-webkit-scrollbar {
      width: ${props.width};
      height: ${props.width};
    }

    ::-webkit-scrollbar-track {
      background: ${props.trackColor};
      border-radius: ${props.borderRadius};
      margin: 2px;
    }

    ::-webkit-scrollbar-thumb {
      background: ${props.thumbColor};
      border-radius: ${props.borderRadius};
      border: 2px solid transparent;
      background-clip: content-box;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
      opacity: 0.6;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${props.hoverColor};
      opacity: 1;
      transform: scaleY(1.1);
    }

    ::-webkit-scrollbar-thumb:active {
      background: ${props.hoverColor};
      opacity: 1;
    }

    ::-webkit-scrollbar-corner {
      background: ${props.trackColor};
    }

    /* ===== SCROLLBAR PARA FIREFOX ===== */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${props.thumbColor} ${props.trackColor};
    }

    /* ===== SCROLLBAR MEJORADO PARA CONTENEDORES ESPECÍFICOS ===== */

    /* Scrollbar para modales y overlays */
    .modal-content::-webkit-scrollbar,
    .overlay-content::-webkit-scrollbar {
      width: 6px;
    }

    .modal-content::-webkit-scrollbar-thumb,
    .overlay-content::-webkit-scrollbar-thumb {
      background: rgba(5, 175, 90, 0.3);
      border-radius: 6px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover,
    .overlay-content::-webkit-scrollbar-thumb:hover {
      background: rgba(5, 175, 90, 0.6);
    }

    /* Scrollbar para cards y contenedores pequeños */
    .card::-webkit-scrollbar,
    .sidebar::-webkit-scrollbar {
      width: 4px;
    }

    .card::-webkit-scrollbar-thumb,
    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(5, 175, 90, 0.4);
      border-radius: 4px;
    }

    /* ===== SMOOTH SCROLLING ===== */
    html {
      scroll-behavior: smooth;
    }

    /* ===== SCROLLBAR INVISIBLE PARA CIERTOS ELEMENTOS ===== */
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }

    .scrollbar-none {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* ===== ANIMACIONES PARA EL SCROLLBAR ===== */
    @media (prefers-reduced-motion: no-preference) {
      ::-webkit-scrollbar-thumb {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
    }

    /* ===== SCROLLBAR HOVER EFFECTS ===== */
    .enhanced-scroll::-webkit-scrollbar {
      width: 12px;
    }

    .enhanced-scroll::-webkit-scrollbar-track {
      background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
      border-radius: 10px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .enhanced-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #ff4550, #048a48);
      border-radius: 10px;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(5, 175, 90, 0.3);
    }

    .enhanced-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #048a48, #037a3f);
      box-shadow: 0 4px 16px rgba(5, 175, 90, 0.4);
      transform: scale(1.05);
    }

    /* ===== RESPONSIVE SCROLLBAR ===== */
    @media (max-width: 768px) {
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 6px;
      }
    }

    @media (max-width: 480px) {
      ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        border: 1px solid transparent;
      }
    }

    /* ===== DARK MODE SUPPORT ===== */
    @media (prefers-color-scheme: dark) {
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      ::-webkit-scrollbar-thumb {
        background: #ff4550;
        opacity: 0.8;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #048a48;
        opacity: 1;
      }
    }

    /* ===== ACCESIBILIDAD ===== */
    @media (prefers-reduced-motion: reduce) {
      ::-webkit-scrollbar-thumb {
        transition: none;
      }

      .enhanced-scroll::-webkit-scrollbar-thumb:hover {
        transform: none;
      }
    }

    /* ===== CLASES UTILITARIAS ===== */
    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    .scrollbar-thick::-webkit-scrollbar {
      width: 16px;
      height: 16px;
    }

    .scrollbar-primary::-webkit-scrollbar-thumb {
      background: var(--primary, #ff4550);
    }

    .scrollbar-secondary::-webkit-scrollbar-thumb {
      background: var(--secondary, #0652DD);
    }

    .scrollbar-accent::-webkit-scrollbar-thumb {
      background: var(--accent, #FFA502);
    }
  `;

  document.head.appendChild(style);
};

// Remover estilos al desmontar el componente
const removeScrollbarStyles = () => {
  const existingStyle = document.getElementById('custom-scrollbar-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
};

onMounted(() => {
  applyScrollbarStyles();
});

onUnmounted(() => {
  removeScrollbarStyles();
});

// Exportar función para usar desde otros componentes
defineExpose({
  applyScrollbarStyles,
  removeScrollbarStyles
});
</script>
