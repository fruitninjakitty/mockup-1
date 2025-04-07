
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
    <div className="min-h-screen flex flex-col pt-16 px-4 bg-[#f5f8f7]">
      <div className="max-w-md w-full mx-auto pt-10 animate-fade-up bg-white p-8 rounded-xl shadow-sm mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[#43bc88]">How will learning fit into your day?</h2>
        </div>

        <div className="space-y-3 mb-8">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => handleSelect(schedule.id)}
              className={`w-full p-4 rounded-md border flex items-center text-left transition-colors ${
                selected === schedule.id 
                  ? "border-[#43bc88] bg-[#f0f9f5]" 
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
