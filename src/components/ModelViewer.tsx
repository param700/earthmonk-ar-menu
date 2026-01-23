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
    if (e.touches.length === 2) {
      touchStartDistance.current = getTouchDistance(e.touches);
      touchStartAngle.current = getTouchAngle(e.touches);
      const modelViewer = modelViewerRef.current as any;
      if (modelViewer) {
        const currentScale = modelViewer.scale?.split(' ')[0];
        initialScale.current = currentScale ? parseFloat(currentScale) : 1;
        const orientation = modelViewer.orientation?.split(' ') || ['0deg', '0deg', '0deg'];
        initialRotation.current = parseFloat(orientation[1]) || 0;
      }
    }
  }, [getTouchDistance, getTouchAngle]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && isInAR) {
      e.preventDefault();
      const modelViewer = modelViewerRef.current as any;
      if (!modelViewer) return;

      // Pinch to scale
      const currentDistance = getTouchDistance(e.touches);
      const scaleRatio = currentDistance / touchStartDistance.current;
      const newScale = Math.max(0.1, Math.min(3, initialScale.current * scaleRatio));
      modelViewer.scale = `${newScale} ${newScale} ${newScale}`;

      // Two-finger rotate
      const currentAngle = getTouchAngle(e.touches);
      const angleDelta = currentAngle - touchStartAngle.current;
      const newRotation = initialRotation.current + angleDelta;
      modelViewer.orientation = `0deg ${newRotation}deg 0deg`;
    }
  }, [isInAR, getTouchDistance, getTouchAngle]);

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
        // Hide hint after 4 seconds
        setTimeout(() => setShowGestureHint(false), 4000);
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

    return () => {
      modelViewer.removeEventListener('touchstart', handleTouchStart as EventListener);
      modelViewer.removeEventListener('touchmove', handleTouchMove as EventListener);
    };
  }, [isInAR, handleTouchStart, handleTouchMove]);

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
