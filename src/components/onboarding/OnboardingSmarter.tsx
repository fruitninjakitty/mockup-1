
import { Button } from "@/components/ui/button";

interface OnboardingSmarterProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingSmarter({ onContinue, onBack }: OnboardingSmarterProps) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="max-w-lg w-full pt-12 animate-fade-up flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 relative">
          <div className="w-48 h-48 bg-green-500 rounded-[40%] flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-[40%] border-8 border-yellow-200 opacity-40"></div>
            <div className="w-16 h-16 bg-black"></div>
          </div>
        </div>
        
        <div className="md:w-1/2 text-center md:text-left md:pl-6">
          <h1 className="text-4xl font-bold mb-6">Smarter every day</h1>
          <p className="text-gray-600 mb-12">
            Gooru keeps you on track—with lessons, puzzles, and daily motivation designed for you.
          </p>
          
          <div className="flex justify-center md:justify-start">
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
