
import { Button } from "@/components/ui/button";

interface OnboardingWelcomeProps {
  onContinue: () => void;
}

export default function OnboardingWelcome({ onContinue }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full flex flex-col items-center animate-fade-up">
        <div className="w-64 h-64 mb-8 relative">
          <div className="w-48 h-48 bg-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[40%] flex items-center justify-center">
            <div className="w-16 h-16 bg-black"></div>
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500 rounded-lg transform rotate-12"></div>
          <div className="absolute top-4 left-4 w-14 h-14 bg-red-500 rounded-md transform -rotate-12"></div>
          <div className="absolute bottom-4 right-8 w-16 h-8 bg-orange-500 rounded-md transform rotate-25"></div>
          <div className="absolute bottom-8 left-0 w-10 h-10 bg-yellow-500 rounded transform -rotate-12"></div>
          <div className="absolute top-16 right-4 w-12 h-12 bg-purple-500 rounded-md transform rotate-45"></div>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-4">It's great to see you again!</h1>
        <p className="text-xl text-center text-gray-600 mb-12">Let's get back to learning.</p>
        
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
