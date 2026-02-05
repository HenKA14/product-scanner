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

    const initScanner = async () => {
      await startScanner();
    };

    initScanner();

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode('barcode-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // Cámara trasera
        {
          fps: 30, // Aumentado a 30 fps para detección más rápida
          qrbox: { width: 350, height: 180 }, // Área más grande
          aspectRatio: 1.777778,
          disableFlip: false,
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
      {/* Header simple estilo Saga Falabella */}
      <div className="absolute top-0 left-0 right-0 z-20 safe-area-top">
        <div className="flex items-center justify-between p-4">
          {/* Botón atrás */}
          <button
            onClick={handleClose}
            className="p-2 text-white active:opacity-70 transition-opacity"
            aria-label="Cerrar escáner"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center space-x-4">
            {/* Botón flash */}
            <button
              onClick={toggleFlash}
              className={`p-2 transition-opacity active:opacity-70 ${flashEnabled ? 'text-yellow-400' : 'text-white'}`}
              aria-label={flashEnabled ? 'Desactivar flash' : 'Activar flash'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d={flashEnabled ? "M6 18L18 6M6 6l12 12" : "M13 10V3L4 14h7v7l9-11h-7z"} 
                />
              </svg>
            </button>

            {/* Botón ayuda */}
            <button
              className="p-2 text-white active:opacity-70 transition-opacity"
              aria-label="Ayuda"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Área de escaneo - Pantalla completa con cámara */}
      <div className="relative w-full h-full">
        <div 
          id="barcode-reader" 
          className="absolute inset-0 w-full h-full"
          style={{ 
            filter: 'brightness(1.1) contrast(1.1)',
            backgroundColor: '#000'
          }}
        ></div>

        {/* Overlay minimalista - SOLO las esquinas, sin fondo opaco */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center px-4">
          {/* Título centrado */}
          <h2 className="text-white text-xl font-semibold mb-8 text-center bg-black/50 backdrop-blur-sm px-6 py-2 rounded-full">
            Escanea el código de barras
          </h2>

          {/* Marco de escaneo - MÁS GRANDE y sin overlay opaco */}
          <div className="relative w-full max-w-lg" style={{ aspectRatio: '16/10' }}>
            {/* SOLO las esquinas, sin fondo opaco */}
            <div className="absolute inset-0 rounded-2xl">
              {/* Esquinas blancas gruesas - Superior izquierda */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-[6px] border-l-[6px] border-white rounded-tl-2xl shadow-lg"></div>
              {/* Superior derecha */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-[6px] border-r-[6px] border-white rounded-tr-2xl shadow-lg"></div>
              {/* Inferior izquierda */}
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[6px] border-l-[6px] border-white rounded-bl-2xl shadow-lg"></div>
              {/* Inferior derecha */}
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[6px] border-r-[6px] border-white rounded-br-2xl shadow-lg"></div>
              
              {/* Línea de escaneo horizontal animada */}
              {isScanning && (
                <div className="absolute inset-x-4 top-1/2 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse shadow-lg shadow-green-400/50"></div>
              )}
            </div>
          </div>

          {/* Mensaje de estado (solo si hay error) */}
          {error && (
            <div className="mt-8">
              <div className="bg-red-500/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-white font-medium text-sm">{error}</span>
              </div>
            </div>
          )}
          
          {/* Indicador de escaneo activo */}
          {isScanning && !error && (
            <div className="mt-6">
              <div className="bg-green-500/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm">Escaneando...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón inferior para ingresar manualmente */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 safe-area-bottom">
        <button
          onClick={handleClose}
          className="w-full py-4 px-8 border-2 border-white/80 text-white rounded-full font-medium text-base active:bg-white/10 transition-colors"
        >
          Ingresar código manualmente
        </button>
      </div>
    </div>
  );
}
