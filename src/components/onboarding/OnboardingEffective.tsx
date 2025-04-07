
import { Button } from "@/components/ui/button";

interface OnboardingEffectiveProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function OnboardingEffective({ onContinue, onBack }: OnboardingEffectiveProps) {
  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-lg w-full mx-auto pt-12 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-[#43bc88]">Learn 6x more effectively</h1>
          <p className="text-gray-600 mb-12">
            Gooru's interactive lessons start at your level and help you advance. Interactive learning has been shown to be 6x more effective than watching lecture videos.
          </p>
          
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
