
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
    { id: "skills", label: "Learning specific skills" },
    { id: "curiosity", label: "Following my curiosity" },
    { id: "problem-solving", label: "Building my problem-solving skills" },
    { id: "basics", label: "Brushing up on the basics" },
    { id: "other", label: "Something else" }
  ];

  const handleSelect = (focusId: string) => {
    onSelect(focusId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-medium">What do you want to focus on?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {focusAreas.map((focus) => (
            <button
              key={focus.id}
              onClick={() => handleSelect(focus.id)}
              className={`w-full p-4 rounded-lg border flex items-center text-left transition-colors ${
                selected === focus.id 
                  ? "border-purple-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-base">{focus.label}</span>
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
