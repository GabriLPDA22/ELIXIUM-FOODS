// src/utils/priceCalculator.ts

export interface CartItem {
  id: string | number;
  price: number; // Precio unitario
  quantity: number;
  discount?: number; // Descuento porcentual para este item (ej. 0.1 para 10%)
}

export interface OrderTotals {
  subtotal: number;
  discountAmount: number;
  subtotalWithItemDiscounts: number;
  taxAmount: number;
  shippingCost: number;
  grandTotal: number;
}

const IVA_GENERAL_SPAIN = 0.21; // 21% IVA general (ejemplo)
const IVA_REDUCIDO_SPAIN = 0.10; // 10% IVA reducido para alimentos (ejemplo)

/**
 * Calcula el subtotal de los items del carrito, aplicando descuentos por item.
 */
export function calculateSubtotalWithItemDiscounts(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    const itemDiscountAmount = item.discount ? itemPrice * item.discount : 0;
    return sum + (itemPrice - itemDiscountAmount);
  }, 0);
}

/**
 * Calcula el impuesto sobre un monto.
 */
export function calculateTax(amount: number, taxRate: number = IVA_REDUCIDO_SPAIN): number {
  return amount * taxRate;
}

/**
 * Aplica un descuento general a un monto.
 */
export function applyOverallDiscount(amount: number, discountPercentage: number): { discountedAmount: number, discountValue: number } {
  const discountValue = amount * discountPercentage;
  return { discountedAmount: amount - discountValue, discountValue };
}

/**
 * Calcula todos los totales de un pedido.
 */
export function calculateOrderTotals(
  items: CartItem[],
  overallDiscountPercentage: number = 0, // Descuento sobre el subtotal
  shippingCost: number = 0,
  taxRateForItemType: (item: CartItem) => number = () => IVA_REDUCIDO_SPAIN // Función para determinar tasa de IVA por item
): OrderTotals {
  const subtotalPreDiscount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotalWithItemDiscounts = calculateSubtotalWithItemDiscounts(items);

  const overallDiscountResult = applyOverallDiscount(subtotalWithItemDiscounts, overallDiscountPercentage);
  const discountedSubtotal = overallDiscountResult.discountedAmount;
  const totalDiscountAmount = (subtotalPreDiscount - subtotalWithItemDiscounts) + overallDiscountResult.discountValue;

  // Calcular impuestos basados en el subtotal después de descuentos de item, pero antes de descuento general,
  // o según la legislación local (esto puede variar mucho).
  // Este es un ejemplo simplificado, el cálculo de IVA puede ser más complejo.
  // Aquí asumimos que el IVA se aplica sobre el precio con descuentos de ítem.
  let taxAmount = 0;
  items.forEach(item => {
      const itemSubTotal = (item.price * (1 - (item.discount || 0))) * item.quantity;
      taxAmount += calculateTax(itemSubTotal, taxRateForItemType(item));
  });


  const grandTotal = discountedSubtotal + taxAmount + shippingCost;

  return {
    subtotal: parseFloat(subtotalPreDiscount.toFixed(2)),
    discountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
    subtotalWithItemDiscounts: parseFloat(subtotalWithItemDiscounts.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    shippingCost: parseFloat(shippingCost.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
  };
}
