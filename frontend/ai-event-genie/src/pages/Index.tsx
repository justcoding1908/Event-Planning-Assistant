import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ChatbotSection from "@/components/ChatbotSection";
import FeaturesSection from "@/components/FeaturesSection";
import BudgetTrackerSection from "@/components/BudgetTrackerSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ChatbotSection />
      <FeaturesSection />
      <BudgetTrackerSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
};

export default Index;
