import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ChevronUp, PanelRight } from "lucide-react";

export default function HeroHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navigationItems = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "For Businesses", href: "#business" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="w-full">
      {/* Main Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-b border-purple-200/20 sticky top-0 z-50 backdrop-blur-md">
        <header className="w-full px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">TagSeva</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium hover:scale-105"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Login */}
            <div className="hidden md:block">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm">
                    <PanelRight className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-6 mt-8">
                    <nav className="flex flex-col gap-4">
                      {navigationItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavClick(item.href)}
                          className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>
                    
                    <Button className="w-full" onClick={handleLoginClick}>
                      Login
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="w-full px-4 pb-16 pt-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 rounded-2xl border border-purple-200/30 p-8 lg:p-12 shadow-2xl shadow-purple-500/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-800 leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">FastTag Made Simple</span> – Apply, Pay & Track with TagSeva
                  </h1>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Complete your FastTag application online with document upload, secure payment processing, and home delivery service.
                  </p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-sm font-medium text-green-800">
                      🚚 FastTag delivered to your door (+₹100 delivery fee)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="text-base px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={handleSignupClick}
                  >
                    Apply Now
                  </Button>
                  
                  <button
                    onClick={() => handleNavClick("#how-it-works")}
                    className="text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium underline underline-offset-4 hover:scale-105"
                  >
                    Learn how it works
                  </button>
                </div>
              </div>

              {/* Right Column - Illustration */}
              <div className="lg:pl-8">
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200/30 shadow-xl">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-4 shadow-lg border border-white/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <ChevronUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">FastTag Application</h3>
                        <p className="text-sm text-gray-600">Quick & Secure Process</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Application Fee</span>
                        <span className="font-medium text-gray-800">₹400</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Delivery Fee</span>
                        <span className="font-medium text-gray-800">₹100</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-800">Total Amount</span>
                        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹500</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-md p-3 border border-green-200">
                      <p className="text-xs text-green-700 font-medium">
                        ⏱️ Estimated delivery: 3-5 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}