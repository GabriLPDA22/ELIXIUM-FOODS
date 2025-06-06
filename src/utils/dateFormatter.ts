// src/utils/dateFormatter.ts

/**
 * Formatea una fecha a 'dd/mm/yyyy'.
 */
export function formatDateToDMY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha a 'yyyy-mm-dd'.
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formatea una fecha a un formato largo en español.
 * Ejemplo: "1 de junio de 2025"
 */
export function formatDateToLongSpanish(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Formatea una fecha y hora a un formato legible.
 * Ejemplo: "1 de junio de 2025, 14:30"
 */
export function formatDateTimeReadable(date: Date): string {
  const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  const formattedDate = date.toLocaleDateString('es-ES', dateOptions);
  const formattedTime = date.toLocaleTimeString('es-ES', timeOptions);
  return `${formattedDate}, ${formattedTime}`;
}

/**
 * Formatea la hora de una fecha a HH:MM.
 */
export function formatTimeToHM(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
