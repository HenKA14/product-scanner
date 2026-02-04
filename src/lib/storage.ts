import { SearchHistoryItem, Product } from '@/src/types/product';

const STORAGE_KEY = 'product-scanner-history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Verifica si localStorage está disponible
 * Importante para SSR/SSG en Next.js
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene el historial completo de búsquedas desde localStorage
 * @returns Array de items del historial (más recientes primero)
 */
export function getHistory(): SearchHistoryItem[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Validar que sea un array
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Ordenar por timestamp descendente (más recientes primero)
    return parsed.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error al leer historial:', error);
    return [];
  }
}

/**
 * Guarda un nuevo producto en el historial
 * Implementa FIFO: si hay más de 20 items, elimina el más antiguo
 * Si el producto ya existe (mismo código), actualiza el timestamp y precio
 * 
 * @param product Producto a guardar
 * @param price Precio generado para el producto
 */
export function saveToHistory(product: Product, price: number): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage no disponible');
    return;
  }

  try {
    let history = getHistory();

    // Verificar si el producto ya existe en el historial
    const existingIndex = history.findIndex(item => item.product.code === product.code);

    const newItem: SearchHistoryItem = {
      product,
      price,
      timestamp: Date.now(),
    };

    if (existingIndex !== -1) {
      // Si existe, actualizar el item (nuevo timestamp y precio)
      history[existingIndex] = newItem;
    } else {
      // Si no existe, agregar al inicio
      history.unshift(newItem);
    }

    // Limitar a MAX_HISTORY_ITEMS (FIFO - eliminar los más antiguos)
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    // Guardar en localStorage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error al guardar en historial:', error);
  }
}

/**
 * Limpia completamente el historial de búsquedas
 */
export function clearHistory(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar historial:', error);
  }
}

/**
 * Elimina un item específico del historial por código de producto
 * @param productCode Código del producto a eliminar
 */
export function removeFromHistory(productCode: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const history = getHistory();
    const filtered = history.filter(item => item.product.code !== productCode);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error al eliminar del historial:', error);
  }
}

/**
 * Obtiene el número de items en el historial
 * @returns Cantidad de productos guardados
 */
export function getHistoryCount(): number {
  return getHistory().length;
}
