
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function UserSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('search_users', {
        search_query: query
      });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not complete the search. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users in your organization..."
          className="pl-8"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="mt-2 rounded-md border bg-card p-2 shadow-sm">
          {searchResults.map((user) => (
            <div key={user.id} className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm">
              <div>
                <p className="font-medium">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
