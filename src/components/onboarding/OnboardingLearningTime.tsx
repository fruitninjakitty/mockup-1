
import { Button } from "@/components/ui/button";

interface OnboardingLearningTimeProps {
  onContinue: () => void;
  onBack: () => void;
  onSelect: (time: string) => void;
  selected: string;
}

export default function OnboardingLearningTime({ 
  onContinue, 
  onBack,
  onSelect,
  selected
}: OnboardingLearningTimeProps) {
  const times = [
    { id: "5min", label: "5 min" },
    { id: "10min", label: "10 min" },
    { id: "15min", label: "15 min" },
    { id: "20min", label: "20 min" }
  ];

  const handleSelect = (timeId: string) => {
    onSelect(timeId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#43bc88]">What's your daily learning goal?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {times.map((time) => (
            <button
              key={time.id}
              onClick={() => handleSelect(time.id)}
              className={`w-full p-4 rounded-md border flex items-center text-left transition-colors ${
                selected === time.id 
                  ? "border-[#43bc88] bg-[#f0f9f5]" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-base">{time.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onContinue}
            disabled={!selected}
            className={`w-full py-4 rounded-md font-medium ${
              selected 
                ? "bg-[#43bc88] hover:bg-[#3ba677] text-white" 
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
