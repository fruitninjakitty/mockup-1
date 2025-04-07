
import { Button } from "@/components/ui/button";

interface OnboardingCompleteProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingComplete({ onContinue, onBack }: OnboardingCompleteProps) {
  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-lg w-full mx-auto pt-12 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-[#43bc88]">You're on your way now!</h1>
          
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
              className="w-full max-w-xs bg-[#43bc88] hover:bg-[#3ba677] text-white py-4 rounded-md"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
