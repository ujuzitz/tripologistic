
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  Scan, 
  Camera, 
  X, 
  CheckCircle2, 
  Loader2, 
  Package, 
  AlertCircle, 
  List, 
  ChevronDown, 
  MapPin,
  Barcode,
  Info
} from 'lucide-react';
import { parseScanImage } from '../services/geminiService';

interface ScanningProps {
  mode?: 'IDLE' | 'STAGE' | 'DISPATCH' | 'RECEIVE' | 'RELEASE' | 'MOVE';
}

export const Scanning: React.FC<ScanningProps> = ({ mode = 'STAGE' }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanBatch, setScanBatch] = useState<any[]>([]);
  const [lastScan, setLastScan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!canvasRef.current || !videoRef.current) return;
    setLoading(true);
    setError(null);

    const context = canvasRef.current.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 1280, 720);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
      const base64 = dataUrl.split(',')[1];
      
      const scanResult = await parseScanImage(base64);
      
      if (scanResult) {
        // Validation logic for Duplicate Scans
        const isDuplicate = scanBatch.some(item => item.trackingNumber === scanResult.trackingNumber);
        if (isDuplicate) {
          setError(`Duplicate Scan: Package ${scanResult.trackingNumber} already in current batch.`);
          setLoading(false);
          return;
        }

        // Mock State-Machine Validation: Dispatch only if Paid
        if (mode === 'DISPATCH' && scanResult.trackingNumber?.startsWith('UNPAID')) {
          setError("Dispatch Blocked: Finance payment verification failed for waybill.");
        } else {
          setLastScan(scanResult);
          setScanBatch(prev => [scanResult, ...prev]);
        }
      } else {
        setError("OCR Error: Could not parse waybill. Please retry with better lighting.");
      }
      setLoading(false);
    }
  }, [mode, scanBatch]);

  const closeCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsScanning(false);
  };

  const handleBatchSubmit = () => {
    // Simulate auto-status update logic
    setShowStatusAlert(true);
    setTimeout(() => {
      setShowStatusAlert(false);
      setScanBatch([]);
    }, 4000);
  };

  const getModeTitle = () => {
    switch(mode) {
      case 'STAGE': return "Package Staging";
      case 'DISPATCH': return "Waybill Dispatch Confirmation";
      case 'RECEIVE': return "Warehouse Receiving";
      case 'RELEASE': return "Customer Handover";
      case 'MOVE': return "Location Assignment";
      default: return "Scanner";
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* State Machine Transition Feedback */}
        {showStatusAlert && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-500 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div className="text-xs text-emerald-800">
               <p className="font-bold uppercase tracking-widest mb-1">Batch Processed Successfully</p>
               <p>The shipment status has been automatically updated based on package scan completion.</p>
               <p className="font-mono mt-1 text-[10px] opacity-75">Audit ID: {Math.random().toString(36).substr(2, 9)}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{getModeTitle()}</h2>
                <p className="text-sm text-gray-500">Event-driven status updates powered by AI vision.</p>
              </div>
            </div>
            {isScanning && (
              <span className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase animate-pulse">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div> Camera Active
              </span>
            )}
          </div>

          {!isScanning ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                <Barcode className="w-8 h-8" />
              </div>
              <button 
                onClick={startCamera}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <Camera className="w-5 h-5" /> START SCANNING
              </button>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-black aspect-video group">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-72 h-48 border-2 border-white/30 rounded-2xl relative shadow-[0_0_0_2000px_rgba(0,0,0,0.4)]">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  <div className="absolute left-0 right-0 h-0.5 bg-blue-400 top-1/2 animate-scan-line shadow-[0_0_15px_#3b82f6]"></div>
                </div>
              </div>
              <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
                <button 
                  onClick={captureAndAnalyze}
                  disabled={loading}
                  className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold shadow-xl disabled:opacity-50 flex items-center gap-2 hover:scale-105 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                  {loading ? 'ANALYZING...' : 'CAPTURE WAYBILL'}
                </button>
                <button 
                  onClick={closeCamera}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {error && (
                <div className="absolute top-4 inset-x-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-red-500 text-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-bold leading-tight">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} width="1280" height="720" className="hidden" />
        </div>

        {/* RECEIVE Step: Location Assignment required for Received status */}
        {mode === 'RECEIVE' && lastScan && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl animate-in fade-in duration-300">
             <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Scan Rack/Bin QR code (Mandatory for Received status)" 
                className="flex-1 px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-mono text-xs"
              />
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors">
                COMPLETE RECEIPT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Batch Side Panel */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest">
              <List className="w-4 h-4 text-blue-500" /> Current Batch
            </h3>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {scanBatch.length} Items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px]">
            {scanBatch.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Scan waybills to begin.</p>
              </div>
            ) : (
              scanBatch.map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between group animate-in slide-in-from-right-2">
                  <div className="truncate pr-4">
                    <p className="text-[10px] font-bold text-gray-400 font-mono leading-none mb-1">{item.trackingNumber || 'UKNOWN'}</p>
                    <p className="text-xs font-bold text-gray-900 truncate">{item.customerName || 'Standard Client'}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))
            )}
          </div>

          {scanBatch.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <button 
                onClick={handleBatchSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                SUBMIT & UPDATE SHIPMENT
              </button>
              <div className="p-3 bg-gray-50 rounded-lg flex gap-2">
                 <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-gray-500 leading-tight">
                   Submitting will trigger a status evaluation. If all packages are processed, the waybill will auto-advance to the next phase.
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
