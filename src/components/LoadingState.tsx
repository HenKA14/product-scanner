export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Spinner animado */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-900">Buscando producto...</p>
        <p className="text-sm text-gray-500">Consultando base de datos</p>
      </div>

      {/* Skeleton del producto (opcional, para mejor UX) */}
      <div className="w-full max-w-md mt-6 space-y-4 animate-pulse">
        <div className="bg-gray-200 h-48 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}
