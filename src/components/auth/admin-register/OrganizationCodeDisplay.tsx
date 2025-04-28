
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OrganizationCodeDisplayProps {
  organizationCode: string;
}

export function OrganizationCodeDisplay({ organizationCode }: OrganizationCodeDisplayProps) {
  const navigate = useNavigate();
  
  return (
    <div className="text-center space-y-6">
      <div className="p-6 bg-[#E6FAF0] rounded-lg border-2 border-[#43BC88]">
        <h2 className="text-xl font-bold text-[#43BC88] mb-2">Your Organization Code</h2>
        <p className="text-sm text-gray-600 mb-4">
          Share this code with teachers and students to join your organization:
        </p>
        <div className="bg-white py-4 px-6 rounded-md border border-[#43BC88] font-mono text-2xl font-bold tracking-wider">
          {organizationCode}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Please save this code. You will need it to add new members.
        </p>
      </div>
      <Button
        onClick={() => navigate("/courses")}
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold rounded-md"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}
