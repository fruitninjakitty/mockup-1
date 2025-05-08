
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrganizationSearch } from "@/components/auth/FormFields/OrganizationSearch";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SchoolCodeFieldProps {
  schoolCode: string;
  onSchoolCodeChange: (value: string) => void;
}

export function SchoolCodeField({ schoolCode, onSchoolCodeChange }: SchoolCodeFieldProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <div className="space-y-1">
      <Label htmlFor="register-school" className="text-[#43BC88] text-sm font-semibold">
        School Code
      </Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            id="register-school"
            type="text"
            placeholder="School Code"
            className="w-full border-border"
            value={schoolCode}
            onChange={(e) => onSchoolCodeChange(e.target.value)}
            required
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowSearch(!showSearch)}
            className="whitespace-nowrap"
          >
            <Search className="h-4 w-4 mr-2" />
            {showSearch ? "Hide Search" : "Find School"}
          </Button>
        </div>
        
        {showSearch && (
          <div className="rounded-md border p-3 bg-background">
            <p className="text-sm text-muted-foreground mb-2">
              Search for your institution by name:
            </p>
            <OrganizationSearch onSelect={(code) => {
              onSchoolCodeChange(code);
              setShowSearch(false);
            }} />
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Don't have a school code? Ask your administrator or search for your institution.
        </p>
      </div>
    </div>
  );
}
