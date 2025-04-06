
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
    { id: "5min", label: "5 min", icon: "⏱️" },
    { id: "10min", label: "10 min", icon: "⏱️" },
    { id: "15min", label: "15 min", icon: "⏱️" },
    { id: "20min", label: "20 min", icon: "⏱️" }
  ];

  const handleSelect = (timeId: string) => {
    onSelect(timeId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="flex mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-[40%] flex items-center justify-center mr-4">
            <div className="w-6 h-6 bg-black"></div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl flex-1">
            <h2 className="text-xl font-bold">What's your daily learning goal?</h2>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {times.map((time) => (
            <button
              key={time.id}
              onClick={() => handleSelect(time.id)}
              className={`w-full p-4 rounded-xl border flex items-center text-left transition-colors ${
                selected === time.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              <span className="text-2xl mr-4">{time.icon}</span>
              <span className="text-lg">{time.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onContinue}
            disabled={!selected}
            className="w-full max-w-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-6 rounded-full disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
