'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // Cámara trasera
        {
          fps: 10,
          qrbox: { width: 280, height: 140 },
          aspectRatio: 1.777778,
          formatsToSupport: [
            8, 9, 12, 13, 14, 5, 6, 7, 11, 0
          ],
        },
        (decodedText) => {
          console.log('📸 Código escaneado:', decodedText);
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignorar errores de escaneo continuo
        }
      );

      setIsScanning(true);
      setError('');
    } catch (err) {
      console.error('Error al iniciar escáner:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error al detener escáner:', err);
      }
    }
  };

  const handleScanSuccess = async (barcode: string) => {
    await stopScanner();
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    onScan(barcode);
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const toggleFlash = async () => {
    // Nota: La API de flash no está ampliamente soportada aún
    setFlashEnabled(!flashEnabled);
    // Implementación de flash requiere API avanzada de getUserMedia
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header minimalista */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-white font-semibold text-lg">Escanear Código</h2>

          <button
            onClick={toggleFlash}
            className={`p-2 rounded-full transition-colors ${flashEnabled ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de escaneo - Pantalla completa */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          id="barcode-reader" 
          className="absolute inset-0 w-full h-full"
        ></div>

        {/* Overlay con marco de enfoque */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Fondo semitransparente */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Marco central transparente */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-52">
              {/* Recorte transparente */}
              <div className="absolute inset-0 border-2 border-white/80 rounded-2xl shadow-2xl">
                {/* Esquinas decorativas - Superior izquierda */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                {/* Esquina superior derecha */}
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                {/* Esquina inferior izquierda */}
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                {/* Esquina inferior derecha */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>

                {/* Línea de escaneo animada */}
                {isScanning && (
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 bg-gradient-to-t from-black/90 to-transparent">
        {isScanning ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-3 bg-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Buscando código de barras...</span>
            </div>
            <p className="text-white/80 text-sm">
              Coloca el código dentro del marco
            </p>
            <p className="text-white/60 text-xs mt-2">
              Asegúrate de tener buena iluminación
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-2 bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-400 font-medium text-sm">{error}</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-white/60 text-sm">Iniciando cámara...</span>
          </div>
        )}
      </div>
    </div>
  );
}
