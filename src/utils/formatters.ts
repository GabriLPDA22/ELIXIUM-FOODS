// src/utils/formatters.ts
import * as DateFormatters from './dateFormatter'; // Si quieres re-exportar

export { DateFormatters }; // Así podrías acceder como Formatters.Date.formatDateToDMY(...)

/**
 * Formatea un número como moneda en Euros.
 * Ejemplo: 1234.5 => "1.234,50 €"
 */
export function formatCurrencyEUR(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Capitaliza la primera letra de un string.
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Trunca un string a una longitud máxima, añadiendo puntos suspensivos.
 */
export function truncateString(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Formatea un número con separadores de miles (para España).
 * Ejemplo: 1234567.89 => "1.234.567,89"
 */
export function formatNumberES(num: number, decimalPlaces: number = 2): string {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(num);
}
