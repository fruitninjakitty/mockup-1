
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
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-3xl w-full mx-auto pt-10 animate-fade-up">
        <div className="flex mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-[40%] flex items-center justify-center mr-4">
            <div className="w-6 h-6 bg-black"></div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl flex-1">
            <h2 className="text-xl font-bold">What's your programming comfort level?</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`p-4 rounded-xl border flex flex-col h-64 transition-colors ${
                selected === level.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              <div className="h-1/2 flex items-center justify-center p-4">
                <pre className="text-purple-600 text-sm whitespace-pre">
                  {level.code}
                </pre>
              </div>
              <div className="h-1/2 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold mb-2">{level.label}</span>
                <span className="text-sm text-gray-600">{level.description}</span>
              </div>
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
