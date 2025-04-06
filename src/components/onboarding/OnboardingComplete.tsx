
import { Button } from "@/components/ui/button";

interface OnboardingCompleteProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingComplete({ onContinue, onBack }: OnboardingCompleteProps) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 px-4">
      <div className="max-w-lg w-full pt-12 animate-fade-up flex flex-col items-center">
        <div className="mb-10 relative">
          <div className="w-40 h-40 flex items-center justify-center">
            <div className="w-32 h-32 bg-green-500 transform rotate-45"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-6 text-center">You're on your way now!</h1>
        
        <div className="flex justify-center mb-8">
          <div className="flex text-yellow-400 text-3xl">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>
        
        <blockquote className="italic text-gray-600 text-center max-w-md mb-12">
          "If you like bending your mind over interesting problems or want to explore a rich world full of beautiful mysteries, this app will be a sure thing for you."
          <footer className="mt-4 text-gray-500">— Bob V.</footer>
        </blockquote>
        
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
