// src/utils/validators.ts
import * as AddressValidators from './addressValidator'; // Si quieres re-exportar

export { AddressValidators };

/**
 * Valida si un string es un email válido.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Interfaz para el resultado de la validación de contraseña.
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback?: string;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  isLongEnough: boolean;
}

/**
 * Valida la fortaleza de una contraseña.
 */
export function checkPasswordStrength(password: string, minLength: number = 8): PasswordStrength {
  const result: PasswordStrength = {
    score: 0,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isLongEnough: password.length >= minLength,
  };

  if (result.hasLowerCase) result.score++;
  if (result.hasUpperCase) result.score++;
  if (result.hasNumber) result.score++;
  if (result.hasSymbol) result.score++;
  if (result.isLongEnough && result.score > 0) result.score++; // Bonus por longitud si ya tiene algo más

  result.score = Math.min(result.score, 4); // Limitar a 4 para un sistema de 4 niveles

  // Añadir feedback (opcional)
  if (result.score <= 1) result.feedback = "Muy débil";
  else if (result.score === 2) result.feedback = "Débil";
  else if (result.score === 3) result.feedback = "Aceptable";
  else if (result.score >= 4) result.feedback = "Fuerte";
  if (!result.isLongEnough && password.length > 0) result.feedback = `Necesita al menos ${minLength} caracteres.`;


  return result;
}

/**
 * Valida si un string no está vacío (después de quitar espacios).
 */
export function isNotEmptyString(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Valida si un valor es un número y está dentro de un rango (opcional).
 */
export function isValidNumber(
  value: any,
  min?: number,
  max?: number
): boolean {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return false;
  }
  if (min !== undefined && num < min) {
    return false;
  }
  if (max !== undefined && num > max) {
    return false;
  }
  return true;
}

/**
 * Valida un número de teléfono español (simplificado).
 * Considera formatos como 9XXXXXXXX, 6XXXXXXXX, 7XXXXXXXX y opcionalmente +34.
 */
export function isValidSpanishPhoneNumber(phone: string): boolean {
    const spanishPhoneRegex = /^(?:\+34|0034)?[679]\d{8}$/;
    return spanishPhoneRegex.test(phone.replace(/\s+/g, '')); // Quitar espacios
}
