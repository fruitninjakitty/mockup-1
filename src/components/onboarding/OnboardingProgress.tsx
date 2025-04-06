
import { ChevronLeft } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  showBackButton: boolean;
  onBack: () => void;
}

export default function OnboardingProgress({ 
  currentStep, 
  totalSteps,
  showBackButton,
  onBack
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center px-4 py-2">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="p-2 mr-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
