
import { Button } from "@/components/ui/button";

interface OnboardingFitInProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingFitIn({ onContinue, onBack }: OnboardingFitInProps) {
  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-topography">
      <div className="max-w-lg w-full mx-auto pt-12 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-6 text-[#43bc88]">You'll fit right in</h1>
          <p className="text-gray-600 mb-12">
            Millions of lifelong learners use Gooru Labs to stay on top of cutting-edge topics
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onContinue} 
            className="w-full max-w-xs bg-[#43bc88] hover:bg-[#3ba677] text-white py-4 rounded-md"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
