
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
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#43bc88]">What do you want to focus on?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {focusAreas.map((focus) => (
            <button
              key={focus.id}
              onClick={() => handleSelect(focus.id)}
              className={`w-full p-4 rounded-md border flex items-center text-left transition-colors ${
                selected === focus.id 
                  ? "border-[#43bc88] bg-[#f0f9f5]" 
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
