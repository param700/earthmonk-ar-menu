import VideoIntro from "@/components/VideoIntro";
import { INTRO_VIDEO_PATH } from "@/data/menuData";

const Index = () => {
  // Uses Cloudinary path if uploaded, falls back to local video
  const videoSrc = INTRO_VIDEO_PATH.startsWith("earthmonk/") 
    ? INTRO_VIDEO_PATH 
    : "/videos/earthmonk-intro.mp4";

  return (
    <VideoIntro 
      videoSrc={videoSrc} 
      redirectTo="/home"
    />
  );
};

export default Index;
