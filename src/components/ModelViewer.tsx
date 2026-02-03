import { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw, Move3D, Smartphone } from "lucide-react";
import { getRawFileUrl } from "@/lib/cloudinary";

// Extend Window type for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: 'auto' | 'fixed';
          'ar-placement'?: 'floor' | 'wall';
          'xr-environment'?: boolean;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string;
          exposure?: string;
          'environment-image'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          poster?: string;
          'interaction-prompt'?: 'auto' | 'none';
          'interaction-prompt-style'?: 'wiggle' | 'basic';
          scale?: string;
          orientation?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface ModelViewerProps {
  modelSrc: string;
  arSrc?: string;
  itemName: string;
  posterImage?: string;
  startInAr?: boolean;
}

const ModelViewer = ({ modelSrc, arSrc, itemName, posterImage, startInAr }: ModelViewerProps) => {
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [arSupported, setArSupported] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInAR, setIsInAR] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(false);

  // Gesture tracking refs
  const touchStartDistance = useRef<number>(0);
  const touchStartAngle = useRef<number>(0);
  const initialScale = useRef<number>(1);
  const initialRotation = useRef<number>(0);

  // Target values (what we're moving toward)
  const targetScale = useRef<number>(1);
  const targetRotation = useRef<number>(0);
  const targetPositionX = useRef<number>(0);
  const targetPositionZ = useRef<number>(0);

  // Current values (what's applied to the model)
  const currentScale = useRef<number>(1);
  const currentRotation = useRef<number>(0);
  const currentPositionX = useRef<number>(0);
  const currentPositionZ = useRef<number>(0);

  // Single finger drag tracking
  const singleTouchStart = useRef<{ x: number; y: number } | null>(null);
  const initialPositionX = useRef<number>(0);
  const initialPositionZ = useRef<number>(0);

  // Threshold to prevent constant property updates (causes black model)
  const CHANGE_THRESHOLD = 0.001;

  // Lerp function for smooth interpolation
  const lerp = (current: number, target: number, factor: number): number => {
    return current + (target - current) * factor;
  };

  // Convert Public IDs to Cloudinary URLs
  const modelUrl = getRawFileUrl(modelSrc);
  const arUrl = arSrc ? getRawFileUrl(arSrc) : undefined;

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate angle between two touch points
  const getTouchAngle = useCallback((touches: TouchList): number => {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      // Single finger - prepare for drag
      singleTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialPositionX.current = targetPositionX.current;
      initialPositionZ.current = targetPositionZ.current;
    } else if (e.touches.length === 2) {
      // Two fingers - prepare for pinch/rotate
      singleTouchStart.current = null; // Cancel drag
      touchStartDistance.current = getTouchDistance(e.touches);
      touchStartAngle.current = getTouchAngle(e.touches);
      initialScale.current = targetScale.current;
      initialRotation.current = targetRotation.current;
    }
  }, [getTouchDistance, getTouchAngle]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isInAR) return;
    e.preventDefault();

    if (e.touches.length === 1 && singleTouchStart.current) {
      // Single finger drag - move model (doubled sensitivity for faster response)
      const dragSensitivity = 0.02;
      const deltaX = (e.touches[0].clientX - singleTouchStart.current.x) * dragSensitivity;
      const deltaZ = (e.touches[0].clientY - singleTouchStart.current.y) * dragSensitivity;

      targetPositionX.current = initialPositionX.current + deltaX;
      targetPositionZ.current = initialPositionZ.current + deltaZ;
    } else if (e.touches.length === 2) {
      // Two finger pinch + rotate
      const currentDistance = getTouchDistance(e.touches);
      const scaleRatio = currentDistance / touchStartDistance.current;
      targetScale.current = Math.max(0.1, Math.min(3, initialScale.current * scaleRatio));

      const currentAngle = getTouchAngle(e.touches);
      const angleDelta = (currentAngle - touchStartAngle.current) * 0.5; // Reduced sensitivity
      targetRotation.current = initialRotation.current + angleDelta;
    }
  }, [isInAR, getTouchDistance, getTouchAngle]);

  // Handle touch end to properly reset gesture state
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) {
      // All fingers lifted - reset single touch tracking
      singleTouchStart.current = null;
    } else if (e.touches.length === 1) {
      // One finger remains after lifting second - start new single touch
      singleTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialPositionX.current = targetPositionX.current;
      initialPositionZ.current = targetPositionZ.current;
    }
  }, []);

  useEffect(() => {
    // Load model-viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(script);

    // Check AR support
    const checkARSupport = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      setArSupported(isIOS || isAndroid);
    };
    checkARSupport();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      setIsLoading(false);
      if (startInAr && arSupported) {
        setTimeout(() => {
          (modelViewer as any).activateAR?.();
        }, 500);
      }
    };

    const handleArStatus = (event: any) => {
      const status = event.detail.status;
      const inAR = status === 'session-started';
      setIsInAR(inAR);
      
      if (inAR) {
        setShowGestureHint(true);
        setTimeout(() => setShowGestureHint(false), 4000);
      } else {
        // Exiting AR - reset all gesture state to prevent stale values
        targetScale.current = 1;
        targetRotation.current = 0;
        currentScale.current = 1;
        currentRotation.current = 0;
        targetPositionX.current = 0;
        targetPositionZ.current = 0;
        currentPositionX.current = 0;
        currentPositionZ.current = 0;
        
        // Reset model to default state
        const mv = modelViewerRef.current as any;
        if (mv) {
          mv.scale = '1 1 1';
          mv.orientation = '0deg 0deg 0deg';
        }
      }
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('ar-status', handleArStatus);
    
    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('ar-status', handleArStatus);
    };
  }, [startInAr, arSupported]);

  // Attach touch event listeners when in AR
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !isInAR) return;

    modelViewer.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    modelViewer.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    modelViewer.addEventListener('touchend', handleTouchEnd as EventListener, { passive: false });

    return () => {
      modelViewer.removeEventListener('touchstart', handleTouchStart as EventListener);
      modelViewer.removeEventListener('touchmove', handleTouchMove as EventListener);
      modelViewer.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [isInAR, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Smooth animation loop for AR gestures
  useEffect(() => {
    if (!isInAR) return;

    let animationId: number;
    const smoothingFactor = 0.2; // Increased for faster, more fluid interpolation

    const animate = () => {
      const modelViewer = modelViewerRef.current as any;
      if (!modelViewer) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Smooth scale - only update if changed significantly (prevents black model)
      const newScale = lerp(currentScale.current, targetScale.current, smoothingFactor);
      if (Math.abs(newScale - currentScale.current) > CHANGE_THRESHOLD) {
        currentScale.current = newScale;
        modelViewer.scale = `${newScale} ${newScale} ${newScale}`;
      }

      // Smooth rotation - only update if changed significantly
      const newRotation = lerp(currentRotation.current, targetRotation.current, smoothingFactor);
      if (Math.abs(newRotation - currentRotation.current) > CHANGE_THRESHOLD) {
        currentRotation.current = newRotation;
        modelViewer.orientation = `0deg ${newRotation}deg 0deg`;
      }

      // Smooth position - apply via cameraTarget to actually move the model
      const newPosX = lerp(currentPositionX.current, targetPositionX.current, smoothingFactor);
      const newPosZ = lerp(currentPositionZ.current, targetPositionZ.current, smoothingFactor);
      
      if (Math.abs(newPosX - currentPositionX.current) > CHANGE_THRESHOLD ||
          Math.abs(newPosZ - currentPositionZ.current) > CHANGE_THRESHOLD) {
        currentPositionX.current = newPosX;
        currentPositionZ.current = newPosZ;
        
        // Apply position to the 3D model via camera-target offset
        try {
          modelViewer.cameraTarget = `${newPosX}m 0m ${newPosZ}m`;
        } catch (e) {
          // Fallback - position tracking only
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isInAR]);

  const handleResetView = () => {
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer) {
      modelViewer.cameraOrbit = 'auto auto auto';
      modelViewer.fieldOfView = 'auto';
      modelViewer.scale = '1 1 1';
      modelViewer.orientation = '0deg 0deg 0deg';
    }
  };

  const handleActivateAR = () => {
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer) {
      modelViewer.activateAR();
    }
  };

  return (
    <div className="model-viewer-container relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-muted border-t-terracotta rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Loading 3D Model...</span>
          </div>
        </div>
      )}

      {/* AR Gesture Hint */}
      {showGestureHint && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-3 rounded-full text-sm z-50 animate-fade-in backdrop-blur-sm">
          <span className="font-medium">Drag to move</span>
          <span className="mx-2 opacity-50">•</span>
          <span className="font-medium">Pinch to scale</span>
          <span className="mx-2 opacity-50">•</span>
          <span className="font-medium">Two fingers to rotate</span>
        </div>
      )}

      {/* Model Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ios-src={arUrl}
        alt={`3D model of ${itemName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        xr-environment
        environment-image="neutral"
        camera-controls
        auto-rotate={autoRotate}
        shadow-intensity="1"
        exposure="0.8"
        loading="eager"
        poster={posterImage}
        interaction-prompt="auto"
        interaction-prompt-style="wiggle"
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: 'hsl(var(--card))',
          touchAction: 'none',
        }}
      />

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex gap-2">
          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            className="bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-soft hover:bg-card transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-5 h-5 text-sage" />
          </button>

          {/* Toggle Auto-Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-3 rounded-full shadow-soft transition-colors ${
              autoRotate 
                ? 'bg-sage text-cream' 
                : 'bg-card/90 backdrop-blur-sm text-sage hover:bg-card'
            }`}
            title={autoRotate ? 'Stop Rotation' : 'Start Rotation'}
          >
            <Move3D className="w-5 h-5" />
          </button>
        </div>

        {/* AR Button */}
        {arSupported && (
          <button
            onClick={handleActivateAR}
            className="btn-primary gap-2 px-5"
          >
            <Smartphone className="w-5 h-5" />
            View in AR
          </button>
        )}
      </div>

      {/* AR Not Supported Message */}
      {!arSupported && (
        <div className="absolute bottom-4 right-4 bg-muted/90 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-muted-foreground text-sm">AR requires mobile device</span>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
