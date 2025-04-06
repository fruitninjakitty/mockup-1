
import { Button } from "@/components/ui/button";

interface OnboardingWelcomeProps {
  onContinue: () => void;
}

export default function OnboardingWelcome({ onContinue }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full flex flex-col items-center animate-fade-up">
        <h1 className="text-4xl font-bold text-center mb-4">It's great to see you!</h1>
        <p className="text-xl text-center text-gray-600 mb-12">Let's start learning.</p>
        
        <Button 
          onClick={onContinue} 
          className="w-full max-w-xs bg-gray-800 hover:bg-gray-700 text-white py-6 rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
