
import { Button } from "@/components/ui/button";

interface OnboardingGoalProps {
  onContinue: () => void;
  onBack: () => void;
  onSelect: (goal: string) => void;
  selected: string;
}

export default function OnboardingGoal({ 
  onContinue, 
  onBack,
  onSelect,
  selected
}: OnboardingGoalProps) {
  const goals = [
    { id: "professional", label: "Professional growth" },
    { id: "staying-sharp", label: "Staying sharp" },
    { id: "excelling", label: "Excelling in school" },
    { id: "child", label: "Helping my child learn" },
    { id: "students", label: "Helping my students learn" }
  ];

  const handleSelect = (goalId: string) => {
    onSelect(goalId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#43bc88]">What's your top goal?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelect(goal.id)}
              className={`w-full p-4 rounded-md border flex items-center text-left transition-colors ${
                selected === goal.id 
                  ? "border-[#43bc88] bg-[#f0f9f5]" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-base">{goal.label}</span>
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
