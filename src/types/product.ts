// Interfaz principal del producto de la API
export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  categories?: string;
}

// Respuesta de la API de OpenFoodFacts
export interface ApiResponse {
  status: number;
  status_verbose?: string;
  product?: Product;
}

// Item del historial de búsquedas
export interface SearchHistoryItem {
  product: Product;
  price: number;
  timestamp: number;
}

// Producto enriquecido con precio para la UI
export interface ProductWithPrice extends Product {
  price: number;
}
