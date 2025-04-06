
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
    { id: "math", label: "Math", icon: "🔷" },
    { id: "science", label: "Science & Engineering", icon: "🟡" },
    { id: "cs", label: "Computer Science & Programming", icon: "🟣" },
    { id: "data", label: "Data Science & Data Analysis", icon: "🟤" }
  ];

  const handleSelect = (topicId: string) => {
    onSelect(topicId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="flex mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-[40%] flex items-center justify-center mr-4">
            <div className="w-6 h-6 bg-black"></div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl flex-1">
            <h2 className="text-xl font-bold">Which topic do you want to explore first?</h2>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSelect(topic.id)}
              className={`w-full p-4 rounded-xl border flex items-center text-left transition-colors ${
                selected === topic.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              <span className="text-2xl mr-4">{topic.icon}</span>
              <span className="text-lg">{topic.label}</span>
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
