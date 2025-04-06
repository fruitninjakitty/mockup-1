
import { Button } from "@/components/ui/button";

interface OnboardingFocusProps {
  onContinue: () => void;
  onBack: () => void;
  onSelect: (focus: string) => void;
  selected: string;
}

export default function OnboardingFocus({ 
  onContinue, 
  onBack,
  onSelect,
  selected
}: OnboardingFocusProps) {
  const focusAreas = [
    { id: "skills", label: "Learning specific skills", icon: "🖥️" },
    { id: "curiosity", label: "Following my curiosity", icon: "🌍" },
    { id: "problem-solving", label: "Building my problem-solving skills", icon: "🧩" },
    { id: "basics", label: "Brushing up on the basics", icon: "✏️" },
    { id: "other", label: "Something else", icon: "📱" }
  ];

  const handleSelect = (focusId: string) => {
    onSelect(focusId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="flex mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-[40%] flex items-center justify-center mr-4">
            <div className="w-6 h-6 bg-black"></div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl flex-1">
            <h2 className="text-xl font-bold">What do you want to focus on?</h2>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {focusAreas.map((focus) => (
            <button
              key={focus.id}
              onClick={() => handleSelect(focus.id)}
              className={`w-full p-4 rounded-xl border flex items-center text-left transition-colors ${
                selected === focus.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              <span className="text-2xl mr-4">{focus.icon}</span>
              <span className="text-lg">{focus.label}</span>
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
