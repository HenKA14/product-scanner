'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SearchHistoryItem } from '@/src/types/product';
import { getHistory, clearHistory } from '@/src/lib/storage';
import { formatPrice, formatRelativeTime } from '@/src/lib/utils';

interface SearchHistoryProps {
  onSelectProduct: (item: SearchHistoryItem) => void;
  refreshTrigger?: number; // Para forzar actualización cuando se guarda nuevo producto
}

export default function SearchHistory({ onSelectProduct, refreshTrigger }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Cargar historial desde localStorage
  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowConfirmClear(false);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin historial</h3>
        <p className="text-sm text-gray-600">
          Tus búsquedas aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h2 className="text-lg font-semibold">Historial de Búsquedas</h2>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {history.length}/20
          </span>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
        {history.map((item, index) => (
          <button
            key={`${item.product.code}-${item.timestamp}`}
            onClick={() => onSelectProduct(item)}
            className="w-full p-4 hover:bg-blue-50 transition-colors duration-150 text-left group"
          >
            <div className="flex items-center space-x-4">
              {/* Imagen del producto */}
              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.product_name || 'Producto'}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full p-1"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg 
                      className="w-8 h-8 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {item.product.product_name || 'Producto sin nombre'}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {item.product.brands || 'Marca desconocida'}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              {/* Icono de flecha */}
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Footer con botón limpiar */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        {!showConfirmClear ? (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-150 font-medium text-sm flex items-center justify-center space-x-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
            <span>Limpiar Historial</span>
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-center text-gray-700 font-medium">
              ¿Eliminar todo el historial?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
