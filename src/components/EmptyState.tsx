interface EmptyStateProps {
  showExamples?: boolean;
}

export default function EmptyState({ showExamples = true }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Icono ilustrativo */}
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
        <svg 
          className="w-12 h-12 text-blue-600" 
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
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900">
          Escanea o ingresa un código de barras
        </h3>
        <p className="text-gray-600">
          Busca productos por su código de barras y descubre información detallada 
          sobre ellos.
        </p>
      </div>

      {showExamples && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl max-w-md">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">
            📦 Códigos de prueba
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">Coca Cola</span>
              <code className="font-mono text-blue-600 font-medium">7501055363803</code>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">Nutella</span>
              <code className="font-mono text-blue-600 font-medium">3017620422003</code>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">Coca Cola Light</span>
              <code className="font-mono text-blue-600 font-medium">5449000000996</code>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones de uso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">1️⃣</span>
          </div>
          <p className="text-sm text-gray-600">Ingresa el código de barras</p>
        </div>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">2️⃣</span>
          </div>
          <p className="text-sm text-gray-600">Haz clic en buscar</p>
        </div>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">3️⃣</span>
          </div>
          <p className="text-sm text-gray-600">Descubre información del producto</p>
        </div>
      </div>
    </div>
  );
}
