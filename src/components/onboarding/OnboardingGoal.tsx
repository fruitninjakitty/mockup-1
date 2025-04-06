
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
    { id: "professional", label: "Professional growth", icon: "📈" },
    { id: "staying-sharp", label: "Staying sharp", icon: "🎯" },
    { id: "excelling", label: "Excelling in school", icon: "📚" },
    { id: "child", label: "Helping my child learn", icon: "✨" },
    { id: "students", label: "Helping my students learn", icon: "🍎" }
  ];

  const handleSelect = (goalId: string) => {
    onSelect(goalId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="flex mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-[40%] mr-4"></div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl flex-1">
            <h2 className="text-xl font-bold">What's your top goal?</h2>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelect(goal.id)}
              className={`w-full p-4 rounded-xl border flex items-center text-left transition-colors ${
                selected === goal.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              <span className="text-2xl mr-4">{goal.icon}</span>
              <span className="text-lg">{goal.label}</span>
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
