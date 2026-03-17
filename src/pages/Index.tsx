import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ExampleGallery from "@/components/landing/ExampleGallery";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyUGCLab from "@/components/landing/WhyUGCLab";
import CostComparison from "@/components/landing/CostComparison";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ExampleGallery />
      <HowItWorks />
      <WhyUGCLab />
      <CostComparison />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
