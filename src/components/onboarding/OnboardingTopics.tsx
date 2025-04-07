
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
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#43bc88]">Which topic do you want to explore first?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSelect(topic.id)}
              className={`w-full p-4 rounded-md border flex items-center text-left transition-colors ${
                selected === topic.id 
                  ? "border-[#43bc88] bg-[#f0f9f5]" 
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
