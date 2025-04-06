
import { Button } from "@/components/ui/button";

interface OnboardingEffectiveProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingEffective({ onContinue, onBack }: OnboardingEffectiveProps) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="max-w-lg w-full pt-12 animate-fade-up flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 relative">
          <div className="w-32 h-32 bg-green-500 rounded-[40%] relative flex items-center justify-center">
            <div className="w-10 h-10 bg-black"></div>
          </div>
          
          <div className="absolute -right-16 top-0 w-36 h-36 bg-white border border-gray-200 rounded-lg p-2 -rotate-6 shadow-md flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-800 flex items-center justify-center rounded-md">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 text-center md:text-left md:pl-6">
          <h1 className="text-4xl font-bold mb-6">Learn 6x more effectively</h1>
          <p className="text-gray-600 mb-12">
            Gooru's interactive lessons start at your level and help you advance. Interactive learning has been shown to be 6x more effective than watching lecture videos.
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
