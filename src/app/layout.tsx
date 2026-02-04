import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Scanner - Busca productos por código de barras',
  description: 'Aplicación web para escanear y buscar productos por código de barras. Obtén información detallada sobre productos con precios simulados.',
  keywords: ['escáner', 'código de barras', 'productos', 'búsqueda', 'barcode scanner'],
  authors: [{ name: 'Product Scanner Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Header global */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Logo/Icono */}
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
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
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0-3h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Product Scanner</h1>
                  <p className="text-xs md:text-sm text-blue-100">Busca productos por código de barras</p>
                </div>
              </div>
              
              {/* Badge de info */}
              <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span className="text-sm font-medium">OpenFoodFacts API</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-[calc(100vh-200px)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información importante */}
              <div>
                <h3 className="text-white font-semibold mb-3">Product Scanner</h3>
                <p className="text-sm text-gray-400">
                  Aplicación web para buscar información de productos usando códigos de barras.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Powered by OpenFoodFacts API
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Los precios mostrados son simulados y no representan valores reales de mercado.
                </p>
              </div>

              {/* Créditos */}
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-2">
                  Designed by
                </p>
                <p className="text-xl font-bold text-white">
                  HENRIQUE CARHUAPOMA
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  © 2026 Product Scanner. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
