import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import earthmonkLogo from "@/assets/earthmonk-logo.png";

interface VideoIntroProps {
  videoSrc: string;
  onComplete?: () => void;
  redirectTo?: string;
}

const VideoIntro = ({ videoSrc, onComplete, redirectTo = "/home" }: VideoIntroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [showPreloader, setShowPreloader] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  // Minimum display time for logo preloader (2.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Transition to video when both conditions met
  useEffect(() => {
    if (videoReady && minTimeElapsed) {
      setShowPreloader(false);
      // Small delay then play video
      setTimeout(() => {
        videoRef.current?.play().catch(console.error);
      }, 500);
    }
  }, [videoReady, minTimeElapsed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoReady(true);
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
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Logo Preloader */}
      <div 
        className={`absolute inset-0 bg-background flex items-center justify-center z-30 transition-opacity duration-700 ${
          showPreloader ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6 animate-fade-in-up">
          {/* Logo Image */}
          <img 
            src={earthmonkLogo} 
            alt="The House of Earthmonk" 
            className="w-64 md:w-80 animate-pulse-subtle"
          />
          {/* Elegant Loading Bar */}
          <div className="w-32 h-0.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent animate-loading-bar" />
          </div>
        </div>
      </div>

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
          background: 'linear-gradient(180deg, rgba(26, 26, 26, 0) 50%, rgba(26, 26, 26, 0.6) 100%)' 
        }}
      />

      {/* Logo Overlay - appears in last 2 seconds */}
      <div 
        className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-700 ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img 
          src={earthmonkLogo} 
          alt="The House of Earthmonk" 
          className="w-72 md:w-96 animate-fade-in"
        />
      </div>
    </div>
  );
};

export default VideoIntro;
