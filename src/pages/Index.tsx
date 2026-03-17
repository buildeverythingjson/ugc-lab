import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ExampleGallery from "@/components/landing/ExampleGallery";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyUGCLab from "@/components/landing/WhyUGCLab";
import CostComparison from "@/components/landing/CostComparison";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Don't redirect logged-in users — allow them to view the landing page
  }, [user, loading, navigate]);

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
      <Footer />
    </div>
  );
};

export default Index;
