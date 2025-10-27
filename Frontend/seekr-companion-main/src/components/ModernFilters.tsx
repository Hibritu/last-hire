import { Button } from "@/components/ui/button";

interface ModernFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const ModernFilters = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: ModernFiltersProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <Button
            key={category}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`whitespace-nowrap transition-all duration-200 ${
              isActive 
                ? "bg-gradient-primary shadow-lg shadow-primary/25 hover:opacity-90" 
                : "border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-card/50 backdrop-blur-sm"
            }`}
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
};