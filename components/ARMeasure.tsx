import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Measurement } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface ARMeasureProps {
  addMeasurement: (measurement: Partial<Omit<Measurement, 'id'>>) => void;
  setCurrentView: (view: View) => void;
}

// Standard credit card width in cm
const CREDIT_CARD_WIDTH_CM = 8.56;

const ARMeasure: React.FC<ARMeasureProps> = ({ addMeasurement, setCurrentView }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [step, setStep] = useState<'idle' | 'calibrating' | 'measuring' | 'result'>('idle');
  const [isCameraInitializing, setIsCameraInitializing] = useState(true);
  const [pixelsPerCm, setPixelsPerCm] = useState<number | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [measuredCm, setMeasuredCm] = useState<number | null>(null);
  const [calibrationWidth, setCalibrationWidth] = useState(150); // initial pixel width
  const [error, setError] = useState<string | null>(null);

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
    cleanupCamera();
    setError(null);
    setIsCameraInitializing(true);
    setStep('calibrating'); // Go directly to the view with the video element
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Camera access is required. Please allow camera permissions in your browser settings.");
      setStep('idle');
    }
  };

  useEffect(() => {
    return () => cleanupCamera();
  }, [cleanupCamera]);
  
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = gridSize; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
      }
      for (let y = gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
      }
  };
  
  const drawLoupe = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, point: { x: number; y: number }) => {
    const loupeRadius = 60;
    const magnification = 2;
    const sourceRadius = loupeRadius / magnification;

    // Calculate position for the loupe, offset from the point
    const loupeX = point.x;
    const loupeY = point.y - loupeRadius - 20; // Position above the point

    ctx.save();
    
    // Create circular clipping path for the loupe
    ctx.beginPath();
    ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.clip();

    // Draw magnified video content inside the circle
    ctx.drawImage(
      video,
      point.x - sourceRadius,
      point.y - sourceRadius,
      sourceRadius * 2,
      sourceRadius * 2,
      loupeX - loupeRadius,
      loupeY - loupeRadius,
      loupeRadius * 2,
      loupeRadius * 2
    );
    
    ctx.restore();

    // Draw crosshairs inside the loupe
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(loupeX - 10, loupeY);
    ctx.lineTo(loupeX + 10, loupeY);
    ctx.moveTo(loupeX, loupeY - 10);
    ctx.lineTo(loupeX, loupeY + 10);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video && (step === 'measuring' || step === 'result')) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      if(ctx){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (step === 'measuring') {
              drawGrid(ctx, canvas.width, canvas.height);
          }

          ctx.strokeStyle = '#ec4899';
          ctx.fillStyle = '#ec4899';
          ctx.lineWidth = 3;

          points.forEach(p => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
              ctx.fill();
          });

          if (points.length === 2) {
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              ctx.lineTo(points[1].x, points[1].y);
              ctx.stroke();
          }

          // Show loupe for the last placed point
          if (points.length > 0) {
              drawLoupe(ctx, video, points[points.length - 1]);
          }
      }
    }
  }, [points, step]);

  const handleCalibrate = () => {
    setPixelsPerCm(calibrationWidth / CREDIT_CARD_WIDTH_CM);
    setPoints([]);
    setStep('measuring');
  };

  const handleMeasureClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (points.length >= 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoints = [...points, { x, y }];
    setPoints(newPoints);

    if (newPoints.length === 2) {
      const pixelDist = Math.sqrt(Math.pow(newPoints[1].x - newPoints[0].x, 2) + Math.pow(newPoints[1].y - newPoints[0].y, 2));
      if (pixelsPerCm) {
        const cm = pixelDist / pixelsPerCm;
        setMeasuredCm(cm);
        setTimeout(() => setStep('result'), 500); // Short delay to show the final line
      }
    }
  };
  
  const handleSave = () => {
    if(measuredCm) {
      addMeasurement({
        date: new Date().toISOString(),
        circumference: parseFloat(measuredCm.toFixed(1)),
      });
      setCurrentView(View.Measurements);
      handleCancel();
    }
  };
  
  const handleCancel = () => {
    setPoints([]);
    setMeasuredCm(null);
    setPixelsPerCm(null);
    setCalibrationWidth(150);
    setIsCameraInitializing(true);
    setStep('idle');
    cleanupCamera();
  };

  const handleMeasureAgain = () => {
    setPoints([]);
    setMeasuredCm(null);
    setStep('measuring');
  };

  const handleRecalibrate = () => {
    setPoints([]);
    setMeasuredCm(null);
    setPixelsPerCm(null);
    setCalibrationWidth(150);
    setIsCameraInitializing(true);
    setStep('calibrating');
  };

  const renderContent = () => {
    switch (step) {
      case 'calibrating':
        return (
          <Card className="!p-0 overflow-hidden">
            <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-gray-900">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                onCanPlay={() => setIsCameraInitializing(false)}
                className="w-full h-full object-cover" 
              />
              {isCameraInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                    <svg className="animate-spin h-10 w-10 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-4 text-lg font-semibold text-white">Starting camera...</p>
                </div>
              )}
              <div className={`absolute inset-0 flex flex-col items-center justify-between bg-black/60 text-white p-4 transition-opacity duration-500 ${isCameraInitializing ? 'opacity-0' : 'opacity-100'}`}>
                {/* Top: Instructions */}
                <div className="w-full text-center bg-black/50 p-3 rounded-lg">
                  <h3 className="text-xl font-bold">Step 1: Calibrate</h3>
                  <p className="mt-1 text-sm text-gray-200">Align the guides with a credit card.</p>
                </div>
                
                {/* Middle: Alignment Box */}
                <div className="relative flex-grow flex items-center justify-center w-full">
                  <div 
                    style={{ width: `${calibrationWidth}px`, height: `${calibrationWidth * 0.63}px` }} 
                    className="relative transition-all"
                  >
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-pink-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-pink-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-pink-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-pink-400 rounded-br-lg"></div>
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                       <span className="text-white font-semibold">Align Card Here</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom: Controls */}
                <div className="w-full max-w-xs bg-black/50 p-4 rounded-lg">
                  <label htmlFor="calibration-slider" className="text-center text-sm mb-2 text-gray-200 block font-medium">Adjust Size to Fit Card</label>
                  <div className="flex items-center space-x-3">
                    <Button onClick={() => setCalibrationWidth(w => Math.max(50, w - 2))} variant="secondary" className="!px-3 !py-1 !text-lg">-</Button>
                    <input 
                      id="calibration-slider"
                      type="range" 
                      min="50" 
                      max="300" 
                      value={calibrationWidth} 
                      onChange={(e) => setCalibrationWidth(Number(e.target.value))} 
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      aria-label="Calibration slider"
                    />
                    <Button onClick={() => setCalibrationWidth(w => Math.min(300, w + 2))} variant="secondary" className="!px-3 !py-1 !text-lg">+</Button>
                  </div>
                  <Button onClick={handleCalibrate} className="mt-4 w-full">Confirm Calibration</Button>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'measuring':
        return (
          <Card className="!p-0 overflow-hidden">
            <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-gray-900 cursor-crosshair" onClick={handleMeasureClick}>
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              
              <div className="absolute top-0 inset-x-0 p-4 text-center bg-black/50 text-white font-semibold text-lg drop-shadow-md pointer-events-none">
                 <p className="font-bold text-xl">Step 2: Measure</p>
                 <p>{points.length === 0 ? 'Use the grid for alignment. Tap the top of your uterus (fundus).' : points.length === 1 ? 'Now, tap your pubic bone.' : 'Measurement complete!'}</p>
              </div>

              {points.length > 0 && (
                <div className="absolute bottom-4 left-4">
                  <Button onClick={(e) => { e.stopPropagation(); setPoints([]); }} variant="secondary">Reset Points</Button>
                </div>
              )}
            </div>
          </Card>
        );
      case 'result':
        return (
            <Card className="!p-0 overflow-hidden">
                 <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-gray-900">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover brightness-50" />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                 </div>
                 <div className="p-6 text-center">
                    <p className="text-lg text-gray-600">Measured Fundal Height:</p>
                    <p className="text-5xl font-bold text-pink-600 my-2">{measuredCm?.toFixed(1)} cm</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 mt-6">
                        <Button onClick={handleSave} className="w-full sm:w-auto">Save Measurement</Button>
                        <Button onClick={handleMeasureAgain} variant="secondary" className="w-full sm:w-auto">Measure Again</Button>
                        <Button onClick={handleRecalibrate} variant="secondary" className="w-full sm:w-auto">Recalibrate</Button>
                    </div>
                </div>
            </Card>
        );
      case 'idle':
      default:
        return (
          <Card className="text-center">
            <RulerIcon className="w-16 h-16 mx-auto text-pink-500" />
            <h2 className="text-2xl font-bold mt-4">AR Fundal Height Measurement</h2>
            <p className="mt-2 text-gray-600">Use your camera to measure your fundal height. This feature requires a quick calibration with a standard-sized object (like a credit card) for accuracy.</p>
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm text-left">
              <strong>Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice or measurements. Consult your healthcare provider for accurate assessments.
            </div>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            <Button onClick={startCamera} className="mt-6">Start Measurement</Button>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">AR Measurement</h1>
        {(step !== 'idle') && <Button onClick={handleCancel} variant="secondary">Cancel</Button>}
      </div>
      {renderContent()}
    </div>
  );
};


const RulerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
);

export default ARMeasure;