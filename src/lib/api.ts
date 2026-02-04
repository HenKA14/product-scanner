import { ApiResponse, Product } from '@/src/types/product';

const API_BASE_URL = 'https://world.openfoodfacts.org/api/v0';

/**
 * Busca un producto por su código de barras en la API de OpenFoodFacts
 * @param barcode Código de barras del producto (6-13 dígitos)
 * @returns Promesa con el producto encontrado o undefined si no existe
 * @throws Error si hay problemas de red o la API no responde
 */
export async function fetchProductByBarcode(barcode: string): Promise<Product | undefined> {
  try {
    const url = `${API_BASE_URL}/product/${barcode}.json`;
    console.log('🔍 Consultando API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Siempre obtener datos frescos
    });
    
    console.log('✅ Respuesta recibida:', response.status);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log('📦 Datos recibidos:', data);

    // Status 0 significa que el producto no existe
    if (data.status === 0 || !data.product) {
      console.log('❌ Producto no encontrado');
      return undefined;
    }

    // Retornar el producto con valores por defecto para campos faltantes
    const product = {
      code: barcode,
      product_name: data.product.product_name || 'Producto sin nombre',
      brands: data.product.brands || 'Marca desconocida',
      image_url: data.product.image_url || undefined,
      categories: data.product.categories || 'Sin categoría',
    };
    
    console.log('✅ Producto procesado:', product);
    return product;
  } catch (error) {
    // Re-lanzar error con mensaje más descriptivo
    if (error instanceof Error) {
      throw new Error(`Error al buscar producto: ${error.message}`);
    }
    throw new Error('Error desconocido al buscar producto');
  }
}

/**
 * Verifica si la API está disponible
 * Útil para mostrar mensajes de estado de conexión
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'HEAD',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}
