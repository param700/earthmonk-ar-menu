import VideoIntro from "@/components/VideoIntro";

const Index = () => {
  return (
    <VideoIntro 
      videoSrc="/videos/earthmonk-intro.mp4?v=2" 
      redirectTo="/home"
    />
  );
};

export default Index;
