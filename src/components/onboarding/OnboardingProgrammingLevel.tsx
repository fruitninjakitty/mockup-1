
import { Button } from "@/components/ui/button";

interface OnboardingProgrammingLevelProps {
  onContinue: () => void;
  onBack: () => void;
  onSelect: (level: string) => void;
  selected: string;
}

export default function OnboardingProgrammingLevel({ 
  onContinue, 
  onBack,
  onSelect,
  selected
}: OnboardingProgrammingLevelProps) {
  const levels = [
    { 
      id: "beginner", 
      label: "Beginner", 
      description: "I want to start from the basics.",
      code: 'print("hello")'
    },
    { 
      id: "novice", 
      label: "Novice", 
      description: "I've seen, but not touched code before.",
      code: 'if b > a:\n    print b'
    },
    { 
      id: "intermediate", 
      label: "Intermediate", 
      description: "I can write simple programs with loops.",
      code: 'for i in range(5):'
    },
    { 
      id: "advanced", 
      label: "Advanced", 
      description: "I've written longer programs.",
      code: 'def circle(size):'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-3xl w-full mx-auto pt-10 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#43bc88]">What's your programming comfort level?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`p-4 rounded-md border flex flex-col h-48 transition-colors ${
                selected === level.id 
                  ? "border-[#43bc88] bg-[#f0f9f5]" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="h-1/2 flex items-center justify-center p-4">
                <pre className="text-[#518cca] text-sm whitespace-pre">
                  {level.code}
                </pre>
              </div>
              <div className="h-1/2 flex flex-col items-center justify-center text-center">
                <span className="text-base font-medium mb-2">{level.label}</span>
                <span className="text-sm text-gray-600">{level.description}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onContinue}
            disabled={!selected}
            className={`w-full max-w-xs py-4 rounded-md font-medium ${
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
