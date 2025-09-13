import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Workflow, 
  PanelsLeftBottom, 
  Columns2, 
  StepBack, 
  PanelTop,
  ChevronsRight,
  SquareChevronRight
} from 'lucide-react';

type StepStatus = 'pending' | 'in-progress' | 'complete';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: StepStatus;
}

const userSteps: Step[] = [
  {
    id: 'signup',
    title: 'Sign Up',
    description: 'Create account with mobile number and basic details',
    icon: <PanelTop className="h-4 w-4" />,
    status: 'pending'
  },
  {
    id: 'vehicle',
    title: 'Add Vehicle',
    description: 'Enter vehicle registration number and type',
    icon: <Workflow className="h-4 w-4" />,
    status: 'pending'
  },
  {
    id: 'documents',
    title: 'Upload Documents',
    description: 'Submit RC, ID proof, and vehicle photos',
    icon: <PanelsLeftBottom className="h-4 w-4" />,
    status: 'pending'
  },
  {
    id: 'payment',
    title: 'Pay Fee',
    description: 'Complete ₹100 payment for processing and delivery',
    icon: <Columns2 className="h-4 w-4" />,
    status: 'pending'
  },
  {
    id: 'track',
    title: 'Track Application',
    description: 'Monitor real-time status updates via dashboard',
    icon: <ChevronsRight className="h-4 w-4" />,
    status: 'pending'
  },
  {
    id: 'receive',
    title: 'Receive FastTag',
    description: 'Get FastTag delivered to registered address',
    icon: <SquareChevronRight className="h-4 w-4" />,
    status: 'pending'
  }
];

const getStatusColor = (status: StepStatus): string => {
  switch (status) {
    case 'complete':
      return 'bg-primary text-primary-foreground';
    case 'in-progress':
      return 'bg-chart-5 text-foreground';
    case 'pending':
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusText = (status: StepStatus): string => {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in-progress':
      return 'In Progress';
    case 'pending':
    default:
      return 'Pending';
  }
};

export default function UserJourneySection() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [userStepStatuses, setUserStepStatuses] = useState<Step[]>(userSteps);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const toggleStepExpansion = useCallback((stepId: string) => {
    setExpandedStep(prev => prev === stepId ? null : stepId);
  }, []);

  const simulateProgress = useCallback(async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);

    // Reset all to pending
    setUserStepStatuses(prev => prev.map(step => ({ ...step, status: 'pending' as StepStatus })));

    // Simulate progress through each step
    for (let i = 0; i < userSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserStepStatuses(prev => prev.map((step, index) => ({
        ...step,
        status: index < i ? 'complete' as StepStatus : 
                index === i ? 'in-progress' as StepStatus : 
                'pending' as StepStatus
      })));
    }

    // Final completion
    await new Promise(resolve => setTimeout(resolve, 800));
    setUserStepStatuses(prev => prev.map(step => ({ ...step, status: 'complete' as StepStatus })));
    
    setIsSimulating(false);
  }, []);

  const generatePrintSummary = (): string => {
    let summary = `TagSeva User Journey Summary\n`;
    summary += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    userStepStatuses.forEach((step, index) => {
      summary += `${index + 1}. ${step.title}\n`;
      summary += `   ${step.description}\n`;
      summary += `   Status: ${getStatusText(step.status)}\n\n`;
    });
    
    return summary;
  };

  return (
    <section className="w-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold text-gray-800">
            User <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="text-gray-600">
            Simple workflow for FastTag application
          </p>
        </div>

        {/* User Flow */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-heading text-gray-800">
                <Workflow className="h-5 w-5 text-blue-600" />
                FastTag Application Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userStepStatuses.map((step, index) => (
                <div
                  key={step.id}
                  className="group border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:border-purple-300/50 hover:bg-purple-50/30"
                  onClick={() => toggleStepExpansion(step.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleStepExpansion(step.id);
                    }
                  }}
                  aria-expanded={expandedStep === step.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {index + 1}. {step.title}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(step.status)} text-xs`}
                        >
                          {getStatusText(step.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {expandedStep === step.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={simulateProgress} 
            disabled={isSimulating}
            variant="outline"
            className="flex items-center gap-2"
          >
            <StepBack className="h-4 w-4" />
            {isSimulating ? 'Simulating...' : 'Simulate Progress'}
          </Button>

          <Dialog open={showPrintModal} onOpenChange={setShowPrintModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PanelsLeftBottom className="h-4 w-4" />
                Print Summary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  User Journey Summary
                </DialogTitle>
                <DialogDescription>
                  Printable workflow summary for the FastTag application process
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-mono">
                  {generatePrintSummary()}
                </pre>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPrintModal(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.print();
                    }
                  }}
                >
                  Print
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}