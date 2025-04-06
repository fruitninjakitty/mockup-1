
import { Button } from "@/components/ui/button";

interface OnboardingFitInProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingFitIn({ onContinue, onBack }: OnboardingFitInProps) {
  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-lg w-full mx-auto pt-12 animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">You'll fit right in</h1>
          <p className="text-gray-600 mb-12">
            Millions of lifelong learners use Gooru Labs to stay on top of cutting-edge topics
          </p>
        </div>
        
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
  );
}
