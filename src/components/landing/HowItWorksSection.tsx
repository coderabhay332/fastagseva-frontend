import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  ChevronRight, 
  BadgeCheck, 
  FileDigit, 
  SquareChevronRight,
  CornerRightDown,
  IndianRupee
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  caption: string;
  icon: React.ElementType;
  details: string[];
  isDelivery?: boolean;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Sign Up",
    caption: "Create your account",
    icon: BadgeCheck,
    details: [
      "Provide basic contact information",
      "Verify your mobile number",
      "Set secure password"
    ]
  },
  {
    id: 2,
    title: "Apply",
    caption: "Fill application form",
    icon: FileDigit,
    details: [
      "Enter vehicle details",
      "Select FASTag bank preference",
      "Choose delivery address"
    ]
  },
  {
    id: 3,
    title: "Upload Documents",
    caption: "Submit required papers",
    icon: SquareChevronRight,
    details: [
      "Upload clear copies of RC",
      "Provide valid ID proof",
      "Submit passport-size photo",
      "Ensure all documents are legible"
    ]
  },
  {
    id: 4,
    title: "Pay",
    caption: "Complete secure payment",
    icon: BadgeCheck,
    details: [
      "Pay FASTag amount + charges",
      "Use UPI, cards, or net banking",
      "Get instant payment confirmation"
    ]
  },
  {
    id: 5,
    title: "Agent Delivers",
    caption: "Receive at your doorstep",
    icon: CornerRightDown,
    details: [
      "Agent calls to confirm delivery time",
      "FASTag delivered to your address",
      "Get installation assistance if needed"
    ],
    isDelivery: true
  }
];

const pricingData = {
  '4wheeler': {
    sbi: 400,
    idfc: 500,
    livequick: 400,
    bajaj: 500
  }
};

const deliveryFee = 100;

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeStep === null) return;

      const currentIndex = steps.findIndex(step => step.id === activeStep);
      
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        event.preventDefault();
        const prevStep = steps[currentIndex - 1];
        setActiveStep(prevStep.id);
        stepRefs.current[currentIndex - 1]?.focus();
      } else if (event.key === "ArrowRight" && currentIndex < steps.length - 1) {
        event.preventDefault();
        const nextStep = steps[currentIndex + 1];
        setActiveStep(nextStep.id);
        stepRefs.current[currentIndex + 1]?.focus();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setActiveStep(null);
      }
    };

    if (activeStep !== null) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [activeStep]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  const handleStartApplication = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      // Scroll to top or trigger apply action
      const applyElement = document.getElementById("apply");
      if (applyElement) {
        applyElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <section className="w-full bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple 5-step process to get your FASTag delivered to your doorstep
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl font-semibold mb-2 text-gray-800">4Wheeler FastTag Pricing</h3>
            <p className="text-gray-600">Choose from our partner banks</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
            {Object.entries(pricingData['4wheeler']).map(([bank, price]) => (
              <Card key={bank} className="text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border border-blue-200/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <IndianRupee className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{price}</span>
                  </div>
                  <h4 className="font-semibold capitalize text-sm text-gray-700">{bank}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Card className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <CornerRightDown className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">+ Delivery Fee: </span>
                  <div className="flex items-center ml-2">
                    <IndianRupee className="w-4 h-4 text-green-600 mr-1" />
                    <span className="font-semibold text-green-700">{deliveryFee}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop Horizontal Steps */}
        <div className="hidden lg:block mb-12">
          <div className="flex items-start justify-between relative">
            {/* Connection Lines */}
            <div className="absolute top-8 left-0 right-0 h-px bg-border z-0">
              <div className="h-full bg-gradient-to-r from-border via-primary/20 to-border"></div>
            </div>

            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <button
                  ref={(el) => { stepRefs.current[index] = el; return undefined; }}
                  onClick={() => handleStepClick(step.id)}
                  className="group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                  aria-expanded={activeStep === step.id}
                  aria-describedby={`step-${step.id}-details`}
                >
                  <Card className="w-48 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-blue-500/10 border border-blue-200/30 transform group-hover:scale-105">
                    <CardContent className="p-6 text-center">
                      {/* Step Number Badge */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg mb-4 mx-auto shadow-lg">
                        {step.id}
                      </div>

                      {/* Step Icon */}
                      <step.icon className="w-6 h-6 text-blue-600 mx-auto mb-3" />

                      {/* Step Title */}
                      <h3 className="font-semibold text-base mb-2 text-gray-800">{step.title}</h3>

                      {/* Step Caption */}
                      <p className="text-sm text-gray-600 mb-3">{step.caption}</p>

                      {/* Delivery Badge */}
                      {step.isDelivery && (
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700 bg-green-50">
                          🚚 Delivery ₹100
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </button>

                {/* Details Panel */}
                {activeStep === step.id && (
                  <div 
                    id={`step-${step.id}-details`}
                    className="absolute top-full mt-4 w-64 bg-card border rounded-lg shadow-lg p-4 z-20 animate-accordion-down"
                  >
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Vertical Steps */}
        <div className="lg:hidden mb-12">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>

            {steps.map((step, index) => (
              <div key={step.id} className="relative mb-8 last:mb-0">
                <button
                  ref={(el) => { stepRefs.current[index] = el; return undefined; }}
                  onClick={() => handleStepClick(step.id)}
                  className="flex items-start w-full text-left group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                  aria-expanded={activeStep === step.id}
                  aria-describedby={`step-${step.id}-details`}
                >
                  {/* Step Number Badge */}
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-lg relative z-10 flex-shrink-0">
                    {step.id}
                  </div>

                  {/* Step Content */}
                  <Card className="ml-6 flex-1 bg-muted/50 hover:bg-muted transition-colors group-hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <step.icon className="w-5 h-5 text-primary mr-2" />
                        <h3 className="font-semibold text-base">{step.title}</h3>
                        {step.isDelivery && (
                          <Badge variant="outline" className="text-xs ml-auto">
                            Delivery ₹100
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.caption}</p>
                    </CardContent>
                  </Card>
                </button>

                {/* Details Panel */}
                {activeStep === step.id && (
                  <div 
                    id={`step-${step.id}-details`}
                    className="ml-18 mt-4 bg-card border rounded-lg shadow-lg p-4 animate-accordion-down"
                  >
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Application CTA */}
        <div className="text-center">
          <div className="relative inline-block">
            <Button 
              onClick={handleStartApplication}
              size="lg" 
              variant="outline"
              disabled={isAnimating}
              className="relative overflow-hidden"
            >
              {isAnimating ? (
                <>
                  <span className="opacity-0">Start Application</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-primary animate-[loading_600ms_ease-in-out]"></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  Start Application
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}