import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
}

export const SearchInput = ({ 
  placeholder, 
  value, 
  onChange, 
  onFilter 
}: SearchInputProps) => {
  return (
    <div className="flex gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12 border-input-border focus:ring-primary focus:border-primary bg-input"
        />
      </div>
      {onFilter && (
        <Button
          variant="outline"
          size="lg"
          onClick={onFilter}
          className="h-12 px-4 border-input-border"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};