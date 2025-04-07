
import { Button } from "@/components/ui/button";

interface OnboardingWelcomeProps {
  onContinue: () => void;
}

export default function OnboardingWelcome({ onContinue }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 bg-topography">
      <div className="max-w-md w-full flex flex-col items-center animate-fade-up bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#43bc88]">It's great to see you!</h1>
        <p className="text-xl text-center text-gray-600 mb-12">Let's start learning.</p>
        
        <Button 
          onClick={onContinue} 
          className="w-full max-w-xs bg-[#43bc88] hover:bg-[#3ba677] text-white py-6 rounded-md"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
