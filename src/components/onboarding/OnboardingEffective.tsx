
import { Button } from "@/components/ui/button";

interface OnboardingEffectiveProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingEffective({ onContinue, onBack }: OnboardingEffectiveProps) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="max-w-lg w-full pt-12 animate-fade-up">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Learn 6x more effectively</h1>
          <p className="text-gray-600 mb-12">
            Gooru's interactive lessons start at your level and help you advance. Interactive learning has been shown to be 6x more effective than watching lecture videos.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={onContinue} 
              className="w-full max-w-xs bg-gray-800 hover:bg-gray-700 text-white py-6 rounded-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
