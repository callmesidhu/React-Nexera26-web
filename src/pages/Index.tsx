import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VisionSection from "@/components/VisionSection";
import HUDPanelSection from "@/components/HUDPanelSection";
import ImmersiveSection from "../components/ImmersiveSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import CountdownReveal from "@/components/CountdownReveal";
import Landing from "@/components/Landing";

const Index = () => {
  return (
    <PageTransition>
      <GridBackground />
      <Navbar />
      <main className="relative z-10 overflow-clip bg-background">
        <Landing />
        <HeroSection />
        <VisionSection />
        <HorizontalScrollSection />
        <div className="relative w-full">
          <div className="sticky top-0 z-0 flex h-screen w-full flex-col justify-center overflow-hidden bg-background">
            <HUDPanelSection />
          </div>
          <div className="relative z-10 bg-background shadow-[0_-30px_60px_rgba(0,0,0,0.9)]">
            <CountdownReveal />
          </div> 
        </div>
        {/* <ImmersiveSection /> */}
        <CTASection />
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Index;