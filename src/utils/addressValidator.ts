// src/utils/addressValidator.ts

export interface Address {
  street: string;
  number?: string;
  floorApartment?: string; // Piso, puerta, etc.
  city: string;
  postalCode: string;
  province?: string;
  country: string;
}

export function isValidPostalCode(postalCode: string, countryCode: string = 'ES'): boolean {
  if (countryCode === 'ES') {
    const spanishPostalCodeRegex = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/; // CP español de 5 dígitos
    return spanishPostalCodeRegex.test(postalCode);
  }
  // Añadir lógica para otros países si es necesario
  return true; // Validación genérica si no es España
}

export function isStreetValid(street: string): boolean {
  return street.trim().length > 3; // Ejemplo simple: más de 3 caracteres
}

export function isCityValid(city: string): boolean {
  return city.trim().length > 2;
}

export function isCountryValid(country: string): boolean {
  return country.trim().length > 1;
}

export function validateAddress(address: Address): { isValid: boolean; errors: Partial<Record<keyof Address, string>> } {
  const errors: Partial<Record<keyof Address, string>> = {};

  if (!isStreetValid(address.street)) {
    errors.street = 'La calle no es válida.';
  }
  if (!isCityValid(address.city)) {
    errors.city = 'La ciudad no es válida.';
  }
  if (!isValidPostalCode(address.postalCode, address.country)) {
    errors.postalCode = 'El código postal no es válido para el país seleccionado.';
  }
  if (!isCountryValid(address.country)) {
    errors.country = 'El país no es válido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
