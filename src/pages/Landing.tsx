import HeroHeader from "../components/landing/HeroHeader";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import UserJourneySection from "../components/landing/UserJourneySection";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header - Full-bleed with sticky navigation */}
      <HeroHeader />
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <section id="features" className="py-20 lg:py-24">
          <FeaturesSection />
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-24">
          <HowItWorksSection />
        </section>
        
        {/* User Journey Section */}
        <section id="business" className="py-20 lg:py-24">
          <UserJourneySection />
        </section>
      </div>
      
      {/* Footer - Full-width */}
      <Footer />
    </main>
  );
}


