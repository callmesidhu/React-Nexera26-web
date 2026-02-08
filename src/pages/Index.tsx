import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VisionSection from "@/components/VisionSection";
import HUDPanelSection from "@/components/HUDPanelSection";
import ImmersiveSection from "@/components/ImmersiveSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import GridBackground from "@/components/GridBackground";

const Index = () => {
  return (
    <PageTransition>
      <GridBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <VisionSection />
        <HUDPanelSection />
        <ImmersiveSection />
        <CTASection />
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Index;
