
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrganizationCodeDisplayProps {
  organizationCode: string;
  onContinue: () => void;
}

export function OrganizationCodeDisplay({ organizationCode, onContinue }: OrganizationCodeDisplayProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const registrationLink = `${window.location.origin}/?code=${organizationCode}`;
  
  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'code') {
        setCodeCopied(true);
        toast.success("Organization code copied to clipboard");
        setTimeout(() => setCodeCopied(false), 2000);
      } else {
        setLinkCopied(true);
        toast.success("Registration link copied to clipboard");
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch (err) {
      toast.error("Failed to copy. Please try again.");
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="p-6 bg-[#E6FAF0] rounded-lg border-2 border-[#43BC88]">
        <h2 className="text-xl font-bold text-[#43BC88] mb-2">Your Organization Code</h2>
        <p className="text-sm text-gray-600 mb-4">
          Share this code with teachers and students to join your organization:
        </p>
        <div className="bg-white py-4 px-6 rounded-md border border-[#43BC88] font-mono text-2xl font-bold tracking-wider flex items-center justify-between">
          <span>{organizationCode}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(organizationCode, 'code')}
                  className="h-8 w-8 p-0"
                >
                  {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy code</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{codeCopied ? "Copied!" : "Copy code"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mt-5">
          <div className="bg-white py-3 px-4 rounded-md border border-[#43BC88] text-sm flex items-center justify-between overflow-hidden">
            <span className="truncate mr-2">{registrationLink}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(registrationLink, 'link')}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy registration link</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{linkCopied ? "Copied!" : "Copy registration link"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          Please save this code and link. You will need them to add new members to your organization.
        </p>
      </div>
      <Button
        onClick={onContinue}
        className="w-full bg-[#43BC88] hover:bg-[#3ba574] text-white font-semibold rounded-md"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}
