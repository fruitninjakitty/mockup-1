
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
    { id: "morning", label: "Morning routine", description: "during breakfast or my commute", icon: "🌞" },
    { id: "lunch", label: "Quick break", description: "during lunch or between activities", icon: "🍕" },
    { id: "evening", label: "Nightly ritual", description: "after dinner or while in bed", icon: "🌙" },
    { id: "other", label: "Another time", description: "in my day", icon: "🖥️" }
  ];

  const handleSelect = (scheduleId: string) => {
    onSelect(scheduleId);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 px-4">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up">
        <div className="flex mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-[40%] flex items-center justify-center mr-4">
            <div className="w-6 h-6 bg-black"></div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl flex-1">
            <h2 className="text-xl font-bold">How will learning fit into your day?</h2>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => handleSelect(schedule.id)}
              className={`w-full p-4 rounded-xl border flex items-center text-left transition-colors ${
                selected === schedule.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
              }`}
            >
              <span className="text-2xl mr-4">{schedule.icon}</span>
              <div className="flex flex-col">
                <span className="text-lg font-medium">{schedule.label}</span>
                <span className="text-sm text-gray-600">{schedule.description}</span>
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
