
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  code: string;
}

export interface OrganizationSearchProps {
  onSelect: (code: string) => void;
}

export function OrganizationSearch({ onSelect }: OrganizationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchOrganizations = async () => {
      if (searchTerm.trim().length < 2) {
        setOrganizations([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, code')
          .ilike('name', `%${searchTerm}%`)
          .order('name', { ascending: true })
          .limit(10);

        if (error) throw error;
        
        setOrganizations(data || []);
      } catch (err) {
        console.error('Error searching organizations:', err);
        setError('Failed to search organizations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchOrganizations, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by institution name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      {!isLoading && searchTerm.trim().length >= 2 && organizations.length === 0 && (
        <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded-md">
          No organizations found. Try a different search term.
        </div>
      )}
      
      {organizations.length > 0 && (
        <div className="max-h-60 overflow-y-auto border rounded-md bg-white shadow-sm">
          {organizations.map((org) => (
            <button
              key={org.id}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex flex-col border-b last:border-b-0 transition-colors"
              onClick={() => onSelect(org.code)}
            >
              <span className="font-medium text-primary">{org.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5">Code: {org.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
