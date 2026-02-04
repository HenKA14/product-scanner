'use client';

import { useState } from 'react';
import BarcodeInput from '@/src/components/BarcodeInput';
import BarcodeScanner from '@/src/components/BarcodeScanner';
import ProductCard from '@/src/components/ProductCard';
import SearchHistory from '@/src/components/SearchHistory';
import LoadingState from '@/src/components/LoadingState';
import ErrorState from '@/src/components/ErrorState';
import EmptyState from '@/src/components/EmptyState';
import { fetchProductByBarcode } from '@/src/lib/api';
import { saveToHistory } from '@/src/lib/storage';
import { ProductWithPrice, SearchHistoryItem } from '@/src/types/product';
import { generateRandomPrice } from '@/src/lib/utils';

type ViewState = 'empty' | 'loading' | 'success' | 'error';

export default function HomePage() {
  const [viewState, setViewState] = useState<ViewState>('empty');
  const [currentProduct, setCurrentProduct] = useState<ProductWithPrice | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearch = async (barcode: string) => {
    console.log('🔎 Iniciando búsqueda de:', barcode);
    setViewState('loading');
    setErrorMessage('');

    try {
      const product = await fetchProductByBarcode(barcode);

      if (!product) {
        console.log('❌ No se encontró el producto');
        setViewState('error');
        setErrorMessage('Producto no encontrado');
        return;
      }

      // Generar precio simulado
      const price = generateRandomPrice();
      console.log('💰 Precio simulado generado:', price);

      // Crear producto con precio
      const productWithPrice: ProductWithPrice = {
        ...product,
        price,
      };

      // Guardar en historial
      saveToHistory(product, price);
      console.log('💾 Guardado en historial');

      // Actualizar estado
      setCurrentProduct(productWithPrice);
      setViewState('success');
      console.log('✅ Búsqueda completada exitosamente');

      // Forzar actualización del historial
      setHistoryRefresh(prev => prev + 1);

    } catch (error) {
      console.error('💥 Error al buscar producto:', error);
      setViewState('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Error al conectar con el servidor'
      );
    }
  };

  const handleSelectFromHistory = (item: SearchHistoryItem) => {
    // Cargar producto desde historial
    const productWithPrice: ProductWithPrice = {
      ...item.product,
      price: item.price,
    };

    setCurrentProduct(productWithPrice);
    setViewState('success');

    // Scroll al inicio para ver el producto
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setViewState('empty');
    setCurrentProduct(null);
    setErrorMessage('');
  };

  const handleScanSuccess = (barcode: string) => {
    console.log('📸 Código escaneado desde cámara:', barcode);
    setShowScanner(false);
    handleSearch(barcode);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Modal del escáner */}
      {showScanner && (
        <BarcodeScanner 
          onScan={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Grid responsive: 1 columna en mobile, 2 columnas en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna principal - Búsqueda y resultado */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Barra de búsqueda */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <svg 
                  className="w-7 h-7 mr-2 text-blue-600" 
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
              </h2>
              <BarcodeInput 
                onSearch={handleSearch} 
                isLoading={viewState === 'loading'} 
              />

              {/* Botón para abrir escáner de cámara */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowScanner(true)}
                  disabled={viewState === 'loading'}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  <span>Escanear con Cámara</span>
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  O usa la cámara para escanear automáticamente
                </p>
              </div>
            </div>

            {/* Contenido dinámico según estado */}
            <div className="min-h-[400px]">
              {viewState === 'empty' && <EmptyState />}
              
              {viewState === 'loading' && <LoadingState />}
              
              {viewState === 'error' && (
                <ErrorState 
                  message={errorMessage} 
                  onRetry={handleRetry} 
                />
              )}
              
              {viewState === 'success' && currentProduct && (
                <ProductCard product={currentProduct} />
              )}
            </div>

            {/* Info adicional */}
            {viewState === 'empty' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <svg 
                    className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      ¿Cómo funciona?
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ingresa un código de barras de 6 a 13 dígitos</li>
                      <li>• Consultamos la base de datos de OpenFoodFacts</li>
                      <li>• Obtienes información detallada del producto</li>
                      <li>• El precio es simulado aleatoriamente</li>
                      <li>• Tu historial se guarda automáticamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna lateral - Historial */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <SearchHistory 
                onSelectProduct={handleSelectFromHistory}
                refreshTrigger={historyRefresh}
              />
            </div>
          </div>
        </div>

        {/* Stats o features (opcional) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg 
                className="w-7 h-7 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Búsqueda Rápida</h3>
            <p className="text-sm text-gray-600">
              Resultados instantáneos desde la base de datos global
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg 
                className="w-7 h-7 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Historial Persistente</h3>
            <p className="text-sm text-gray-600">
              Tus búsquedas se guardan automáticamente (hasta 20 productos)
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg 
                className="w-7 h-7 text-purple-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Mobile First</h3>
            <p className="text-sm text-gray-600">
              Diseño optimizado para dispositivos móviles y tablets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
