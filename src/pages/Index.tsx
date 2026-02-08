import VideoIntro from "@/components/VideoIntro";
import { INTRO_VIDEO_PATH } from "@/data/menuData";

const Index = () => {
  // Pass Cloudinary public ID directly to VideoIntro
  const videoSrc = INTRO_VIDEO_PATH;

  return (
    <VideoIntro 
      videoSrc={videoSrc} 
      redirectTo="/home"
    />
  );
};

export default Index;
