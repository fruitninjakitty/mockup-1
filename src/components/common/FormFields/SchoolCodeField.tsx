
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrganizationSearch } from "./OrganizationSearch";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export interface SchoolCodeFieldProps {
  schoolCode: string;
  onSchoolCodeChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function SchoolCodeField({ 
  schoolCode, 
  onSchoolCodeChange,
  label = "School Code",
  placeholder = "School Code"
}: SchoolCodeFieldProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <div className="space-y-1">
      <Label htmlFor="register-school" className="text-[#43BC88] text-sm font-semibold">
        {label}
      </Label>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="register-school"
            type="text"
            placeholder={placeholder}
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
            {showSearch ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Hide Search
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Find School
              </>
            )}
          </Button>
        </div>
        
        {showSearch && (
          <div className="rounded-md border p-4 bg-gray-50 shadow-sm">
            <p className="text-sm text-muted-foreground mb-3">
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
