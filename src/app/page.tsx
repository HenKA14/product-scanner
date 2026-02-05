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
        {/* Grid responsive: ajusta automáticamente según si hay historial */}
        <div className={`grid gap-8 ${historyRefresh > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          
          {/* Columna principal - Búsqueda y resultado */}
          <div className={`space-y-6 ${historyRefresh > 0 ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'}`}>
            
            {/* Mostrar input de búsqueda solo si NO hay producto exitoso */}
            {viewState !== 'success' && (
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
                  onOpenScanner={() => setShowScanner(true)}
                  isLoading={viewState === 'loading'} 
                />
              </div>
            )}

            {/* Si hay producto exitoso, mostrar barra simple arriba */}
            {viewState === 'success' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Producto encontrado</p>
                      <p className="text-xs text-gray-500 truncate">Código: {currentProduct?.code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setShowScanner(true)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Escanear con cámara"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Buscar otro</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

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

          {/* Columna lateral - Historial (solo mostrar si hay búsquedas) */}
          {historyRefresh > 0 && (
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                <SearchHistory 
                  onSelectProduct={handleSelectFromHistory}
                  refreshTrigger={historyRefresh}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
