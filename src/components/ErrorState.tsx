interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  message = 'Producto no encontrado',
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Icono de error */}
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-red-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
        <p className="text-sm text-gray-600 max-w-md">
          No pudimos encontrar información sobre este producto. 
          Verifica el código e intenta nuevamente.
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Intentar de nuevo
        </button>
      )}

      {/* Sugerencia de códigos de prueba */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-md">
        <p className="text-xs text-gray-600 text-center">
          <strong>Códigos de prueba:</strong><br />
          7501055363803 • 3017620422003 • 5449000000996
        </p>
      </div>
    </div>
  );
}
