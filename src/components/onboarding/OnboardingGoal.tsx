
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
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-medium">What's your top goal?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelect(goal.id)}
              className={`w-full p-4 rounded-lg border flex items-center text-left transition-colors ${
                selected === goal.id 
                  ? "border-purple-500 bg-blue-50" 
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
