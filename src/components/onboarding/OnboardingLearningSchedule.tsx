
import { Button } from "@/components/ui/button";

interface OnboardingLearningScheduleProps {
  onContinue: () => void;
  onBack: () => void;
  onSelect: (schedule: string) => void;
  selected: string;
}

export default function OnboardingLearningSchedule({ 
  onContinue, 
  onBack,
  onSelect,
  selected
}: OnboardingLearningScheduleProps) {
  const schedules = [
    { id: "morning", label: "Morning routine", description: "during breakfast or my commute" },
    { id: "lunch", label: "Quick break", description: "during lunch or between activities" },
    { id: "evening", label: "Nightly ritual", description: "after dinner or while in bed" },
    { id: "other", label: "Another time", description: "in my day" }
  ];

  const handleSelect = (scheduleId: string) => {
    onSelect(scheduleId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-medium">How will learning fit into your day?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => handleSelect(schedule.id)}
              className={`w-full p-4 rounded-lg border flex items-center text-left transition-colors ${
                selected === schedule.id 
                  ? "border-purple-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-base font-medium">{schedule.label}</span>
                <span className="text-sm text-gray-600">{schedule.description}</span>
              </div>
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
