
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
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-medium">What's your daily learning goal?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {times.map((time) => (
            <button
              key={time.id}
              onClick={() => handleSelect(time.id)}
              className={`w-full p-4 rounded-lg border flex items-center text-left transition-colors ${
                selected === time.id 
                  ? "border-purple-500 bg-blue-50" 
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
            className={`w-full py-6 rounded-full font-medium ${
              selected 
                ? "bg-gray-800 hover:bg-gray-700 text-white" 
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
