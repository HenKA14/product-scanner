import Image from 'next/image';
import { ProductWithPrice } from '@/src/types/product';
import { formatPrice, withFallback } from '@/src/lib/utils';

interface ProductCardProps {
  product: ProductWithPrice;
  showAnimation?: boolean;
}

export default function ProductCard({ product, showAnimation = true }: ProductCardProps) {
  const productName = withFallback(product.product_name, 'Producto sin nombre');
  const brand = withFallback(product.brands, 'Marca desconocida');
  const category = withFallback(product.categories, 'Sin categoría');
  const imageUrl = product.image_url;

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-lg overflow-hidden
        border-2 border-gray-100
        transition-all duration-300
        hover:shadow-xl hover:border-blue-200
        ${showAnimation ? 'animate-fadeIn' : ''}
      `}
    >
      {/* Imagen del producto */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            width={400}
            height={400}
            className="object-contain h-full w-full p-4"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg 
              className="w-20 h-20 mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm">Sin imagen disponible</p>
          </div>
        )}

        {/* Badge de precio en la esquina */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xl">
          {formatPrice(product.price)}
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-6 space-y-4">
        {/* Nombre del producto */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
            {productName}
          </h2>
          <p className="text-sm text-gray-500">Código: {product.code}</p>
        </div>

        {/* Marca */}
        <div className="flex items-center space-x-2">
          <svg 
            className="w-5 h-5 text-blue-600 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
            />
          </svg>
          <div>
            <p className="text-xs text-gray-500">Marca</p>
            <p className="font-semibold text-gray-900">{brand}</p>
          </div>
        </div>

        {/* Categoría */}
        <div className="flex items-center space-x-2">
          <svg 
            className="w-5 h-5 text-purple-600 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
            />
          </svg>
          <div>
            <p className="text-xs text-gray-500">Categoría</p>
            <p className="font-semibold text-gray-900 line-clamp-1">{category}</p>
          </div>
        </div>

        {/* Precio destacado */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">Precio simulado:</span>
            <span className="text-3xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
