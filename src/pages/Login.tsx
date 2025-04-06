
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    goal: "",
    focus: "",
    topic: "",
    programmingLevel: "",
    learningTime: "",
    learningSchedule: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingStep(1);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingStep(1);
  };

  const handleContinue = () => {
    if (onboardingStep === 10) {
      navigate("/courses");
    } else {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const handleBack = () => {
    if (onboardingStep > 0) {
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
      case 0:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="w-full max-w-md p-4 animate-fade-up">
              <Card className="backdrop-blur-sm bg-white/90">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome to Gooru Labs navigated learning platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                          />
                          <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                          Sign In
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <Input type="text" placeholder="Full Name" className="w-full" />
                        <Input type="email" placeholder="Email" className="w-full" />
                        <Input type="password" placeholder="Password" className="w-full" />
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                          Create Account
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        );
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
    <div className="min-h-screen bg-gray-50">
      {onboardingStep > 0 && (
        <OnboardingProgress 
          currentStep={onboardingStep} 
          totalSteps={10} 
          showBackButton={onboardingStep > 1}
          onBack={handleBack}
        />
      )}
      {renderOnboardingStep()}
    </div>
  );
}
