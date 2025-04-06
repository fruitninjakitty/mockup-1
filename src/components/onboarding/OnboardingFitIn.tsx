
import { Button } from "@/components/ui/button";

interface OnboardingFitInProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingFitIn({ onContinue, onBack }: OnboardingFitInProps) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="max-w-lg w-full pt-12 animate-fade-up flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 relative">
          <div className="w-32 h-32 bg-green-500 rounded-[40%] relative">
            <div className="w-8 h-8 bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white border border-gray-200 rounded-lg p-2 rotate-6 shadow-md flex items-center justify-center">
            <div className="w-full h-12 bg-purple-500 rounded"></div>
          </div>
          
          <div className="absolute -right-16 top-12 w-32 h-32 bg-white border border-gray-200 rounded-lg p-2 rotate-3 shadow-md flex flex-col justify-between">
            <div className="w-full h-4 bg-black"></div>
            <div className="flex items-center justify-center flex-1 border-2 border-green-500">
              <div className="text-green-500 text-2xl">&lt;/&gt;</div>
            </div>
          </div>
          
          <div className="absolute -right-8 top-36 w-28 h-28 bg-white border border-gray-200 rounded-lg p-2 -rotate-6 shadow-md">
            <div className="flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <div className="w-4 h-4 bg-black"></div>
                <div className="w-4 h-4 bg-orange-500"></div>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="w-full h-2 bg-orange-400"></div>
                <div className="w-2/3 h-2 bg-orange-400"></div>
                <div className="w-3/4 h-2 bg-orange-400"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2 text-center md:text-left md:pl-6">
          <h1 className="text-4xl font-bold mb-6">You'll fit right in</h1>
          <p className="text-gray-600 mb-12">
            Millions of lifelong learners use Gooru Labs to stay on top of cutting-edge topics
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
