import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface VideoIntroProps {
  videoSrc: string;
  onComplete?: () => void;
  redirectTo?: string;
}

const VideoIntro = ({ videoSrc, onComplete, redirectTo = "/home" }: VideoIntroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      video.play().catch(console.error);
    };

    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 2) {
        setShowLogo(true);
      }
    };

    const handleEnded = () => {
      if (onComplete) {
        onComplete();
      }
      navigate(redirectTo);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [navigate, onComplete, redirectTo]);

  return (
    <div className="fixed inset-0 bg-earth-dark overflow-hidden">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cream border-t-terracotta rounded-full animate-spin" />
            <span className="text-cream font-display text-lg">Loading...</span>
          </div>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        className="video-fullscreen"
        src={videoSrc}
        muted
        playsInline
        preload="auto"
      />

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{ 
          background: 'linear-gradient(180deg, rgba(74, 63, 53, 0) 50%, rgba(74, 63, 53, 0.6) 100%)' 
        }}
      />

      {/* Logo Overlay - appears in last 2 seconds */}
      <div 
        className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-700 ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-6xl text-cream mb-2">
            The House of
          </h1>
          <h1 className="font-display text-5xl md:text-7xl text-terracotta font-bold">
            Earthmonk
          </h1>
        </div>
      </div>
    </div>
  );
};

export default VideoIntro;
