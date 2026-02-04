/**
 * Genera un precio aleatorio entre el mínimo y máximo especificado
 * @param min Precio mínimo (default: 5)
 * @param max Precio máximo (default: 150)
 * @returns Precio aleatorio con dos decimales
 */
export function generateRandomPrice(min: number = 5, max: number = 150): number {
  const price = Math.random() * (max - min) + min;
  return Math.round(price * 100) / 100; // Redondear a 2 decimales
}

/**
 * Formatea un precio a formato de moneda peruana
 * @param price Precio a formatear
 * @returns String formateado (ejemplo: "S/. 45.99")
 */
export function formatPrice(price: number): string {
  return `S/. ${price.toFixed(2)}`;
}

/**
 * Valida si un código de barras tiene el formato correcto
 * @param barcode Código de barras a validar
 * @returns true si es válido (6-13 dígitos numéricos)
 */
export function isValidBarcode(barcode: string): boolean {
  const trimmed = barcode.trim();
  return /^\d{6,13}$/.test(trimmed);
}

/**
 * Formatea una fecha relativa (ejemplo: "Hace 2 minutos")
 * @param timestamp Timestamp en milisegundos
 * @returns String con tiempo relativo
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'Justo ahora';
}

/**
 * Obtiene un valor con fallback si es undefined o null
 * @param value Valor a verificar
 * @param fallback Valor por defecto
 * @returns El valor o el fallback
 */
export function withFallback<T>(value: T | undefined | null, fallback: T): T {
  return value ?? fallback;
}

/**
 * Combina clases CSS de forma condicional
 * Útil para manejar clases dinámicas en Tailwind
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
