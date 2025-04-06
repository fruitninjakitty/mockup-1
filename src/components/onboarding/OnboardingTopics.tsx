
import { Button } from "@/components/ui/button";

interface OnboardingTopicsProps {
  onContinue: () => void;
  onBack: () => void;
  onSelect: (topic: string) => void;
  selected: string;
}

export default function OnboardingTopics({ 
  onContinue, 
  onBack,
  onSelect,
  selected
}: OnboardingTopicsProps) {
  const topics = [
    { id: "math", label: "Math" },
    { id: "science", label: "Science & Engineering" },
    { id: "cs", label: "Computer Science & Programming" },
    { id: "data", label: "Data Science & Data Analysis" }
  ];

  const handleSelect = (topicId: string) => {
    onSelect(topicId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-medium">Which topic do you want to explore first?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSelect(topic.id)}
              className={`w-full p-4 rounded-lg border flex items-center text-left transition-colors ${
                selected === topic.id 
                  ? "border-purple-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-base">{topic.label}</span>
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
