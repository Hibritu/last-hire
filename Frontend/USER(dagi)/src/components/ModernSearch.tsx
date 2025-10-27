import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

interface ModernSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
}

export const ModernSearch = ({ 
  value, 
  onChange, 
  onFilter,
  placeholder = "Search for your dream job..."
}: ModernSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-glow rounded-2xl transition-opacity duration-300 ${
        isFocused ? 'opacity-100' : 'opacity-0'
      }`}></div>
      
      <div className="relative flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-2 transition-all duration-300 hover:border-primary/50">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground transition-colors" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-12 pr-4 py-3 h-auto bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground text-lg"
          />
          <Sparkles className="absolute right-4 h-4 w-4 text-accent animate-pulse" />
        </div>
        
        {onFilter && (
          <Button
            variant="outline"
            size="lg"
            onClick={onFilter}
            className="h-12 px-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};