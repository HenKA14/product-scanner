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
        ></div>

        {/* Overlay con marco de enfoque */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center px-6">
          {/* Título centrado */}
          <h2 className="text-white text-2xl font-semibold mb-12 text-center">
            Escanea el código de barras
          </h2>

          {/* Marco de escaneo - más grande */}
          <div className="relative w-full max-w-md aspect-[4/3]">
            {/* Fondo semitransparente alrededor */}
            <div className="absolute inset-0 -m-[9999px] bg-black/60"></div>
            
            {/* Marco con esquinas */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              {/* Esquinas blancas gruesas - Superior izquierda */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-[5px] border-l-[5px] border-white rounded-tl-3xl"></div>
              {/* Superior derecha */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-[5px] border-r-[5px] border-white rounded-tr-3xl"></div>
              {/* Inferior izquierda */}
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[5px] border-l-[5px] border-white rounded-bl-3xl"></div>
              {/* Inferior derecha */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[5px] border-r-[5px] border-white rounded-br-3xl"></div>
            </div>
          </div>

          {/* Mensaje de estado (solo si hay error) */}
          {error && (
            <div className="mt-8">
              <div className="bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-red-400 font-medium text-sm">{error}</span>
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
