
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWelcome from "@/components/onboarding/OnboardingWelcome";
import OnboardingGoal from "@/components/onboarding/OnboardingGoal";
import OnboardingFocus from "@/components/onboarding/OnboardingFocus";
import OnboardingFitIn from "@/components/onboarding/OnboardingFitIn";
import OnboardingProgrammingLevel from "@/components/onboarding/OnboardingProgrammingLevel";
import OnboardingLearningTime from "@/components/onboarding/OnboardingLearningTime";
import OnboardingLearningSchedule from "@/components/onboarding/OnboardingLearningSchedule";
import OnboardingEffective from "@/components/onboarding/OnboardingEffective";
import OnboardingSmarter from "@/components/onboarding/OnboardingSmarter";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";
import OnboardingTopics from "@/components/onboarding/OnboardingTopics";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

export default function Onboarding() {
  const navigate = useNavigate();
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState({
    goal: "",
    focus: "",
    topic: "",
    programmingLevel: "",
    learningTime: "",
    learningSchedule: ""
  });

  const handleContinue = () => {
    if (onboardingStep === 10) {
      navigate("/courses");
    } else {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const updatePreference = (key: string, value: string) => {
    setUserPreferences({
      ...userPreferences,
      [key]: value
    });
  };

  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 1:
        return <OnboardingWelcome onContinue={handleContinue} />;
      case 2:
        return (
          <OnboardingGoal 
            onContinue={handleContinue} 
            onBack={handleBack}
            onSelect={(goal) => updatePreference('goal', goal)}
            selected={userPreferences.goal}
          />
        );
      case 3:
        return (
          <OnboardingFocus 
            onContinue={handleContinue} 
            onBack={handleBack}
            onSelect={(focus) => updatePreference('focus', focus)}
            selected={userPreferences.focus}
          />
        );
      case 4:
        return <OnboardingFitIn onContinue={handleContinue} onBack={handleBack} />;
      case 5:
        return (
          <OnboardingTopics 
            onContinue={handleContinue} 
            onBack={handleBack}
            onSelect={(topic) => updatePreference('topic', topic)}
            selected={userPreferences.topic}
          />
        );
      case 6:
        return (
          <OnboardingProgrammingLevel 
            onContinue={handleContinue} 
            onBack={handleBack}
            onSelect={(level) => updatePreference('programmingLevel', level)}
            selected={userPreferences.programmingLevel}
          />
        );
      case 7:
        return <OnboardingEffective onContinue={handleContinue} onBack={handleBack} />;
      case 8:
        return (
          <OnboardingLearningTime 
            onContinue={handleContinue} 
            onBack={handleBack}
            onSelect={(time) => updatePreference('learningTime', time)}
            selected={userPreferences.learningTime}
          />
        );
      case 9:
        return (
          <OnboardingLearningSchedule 
            onContinue={handleContinue} 
            onBack={handleBack}
            onSelect={(schedule) => updatePreference('learningSchedule', schedule)}
            selected={userPreferences.learningSchedule}
          />
        );
      case 10:
        return <OnboardingComplete onContinue={handleContinue} onBack={handleBack} />;
      default:
        return <OnboardingWelcome onContinue={handleContinue} />;
    }
  };

  return (
    <div className="min-h-screen bg-topography">
      <OnboardingProgress 
        currentStep={onboardingStep} 
        totalSteps={10} 
        showBackButton={onboardingStep > 1}
        onBack={handleBack}
      />
      {renderOnboardingStep()}
    </div>
  );
}
