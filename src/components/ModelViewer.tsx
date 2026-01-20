import { useEffect, useRef, useState } from "react";
import { RotateCcw, Move3D, Smartphone } from "lucide-react";

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
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string;
          exposure?: string;
          'environment-image'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          poster?: string;
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
        // Trigger AR after a short delay
        setTimeout(() => {
          (modelViewer as any).activateAR?.();
        }, 500);
      }
    };

    modelViewer.addEventListener('load', handleLoad);
    return () => modelViewer.removeEventListener('load', handleLoad);
  }, [startInAr, arSupported]);

  const handleResetView = () => {
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer) {
      modelViewer.cameraOrbit = 'auto auto auto';
      modelViewer.fieldOfView = 'auto';
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

      {/* Model Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={modelSrc}
        ios-src={arSrc}
        alt={`3D model of ${itemName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate={autoRotate}
        shadow-intensity="1"
        exposure="0.8"
        loading="eager"
        poster={posterImage}
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: 'hsl(var(--card))',
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
