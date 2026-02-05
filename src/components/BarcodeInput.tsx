'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { isValidBarcode } from '@/src/lib/utils';

interface BarcodeInputProps {
  onSearch: (barcode: string) => void;
  onOpenScanner?: () => void;
  isLoading?: boolean;
}

export default function BarcodeInput({ onSearch, onOpenScanner, isLoading = false }: BarcodeInputProps) {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    setBarcode(value);
    
    // Limpiar error al escribir
    if (error) {
      setError('');
    }

    // Validar en tiempo real
    if (value && !isValidBarcode(value)) {
      if (value.length < 6) {
        setError('Mínimo 6 dígitos');
      } else if (value.length > 13) {
        setError('Máximo 13 dígitos');
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!barcode.trim()) {
      setError('Ingresa un código de barras');
      return;
    }

    if (!isValidBarcode(barcode)) {
      setError('Código inválido (6-13 dígitos)');
      return;
    }

    // Llamar a la función de búsqueda
    onSearch(barcode.trim());
    
    // Opcional: limpiar input después de búsqueda
    // setBarcode('');
  };

  const isValid = barcode.trim() && isValidBarcode(barcode);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="relative">
        <div className="relative">
          {/* Icono de código de barras */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0-3h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
              />
            </svg>
          </div>

          <input
            type="text"
            value={barcode}
            onChange={handleChange}
            placeholder="Ingresa código de barras"
            maxLength={13}
            disabled={isLoading}
            className={`
              w-full pl-12 pr-20 py-3 text-lg
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          />

          {/* Botón de cámara dentro del input */}
          {onOpenScanner && !isLoading && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Abrir escáner de cámara"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </button>
          )}

          {/* Indicador de validez */}
          {barcode && !error && isValid && !isLoading && (
            <div className="absolute inset-y-0 right-12 pr-4 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-green-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg 
              className="w-4 h-4 mr-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {error}
          </p>
        )}

        {/* Contador de dígitos */}
        <p className="mt-1 text-xs text-gray-500 text-right">
          {barcode.length}/13 dígitos
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold text-lg
          transition-all duration-200
          ${isValid && !isLoading
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Buscando...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            Buscar Producto
          </span>
        )}
      </button>
    </form>
  );
}
