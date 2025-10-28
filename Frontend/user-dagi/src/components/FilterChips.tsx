import { Button } from "@/components/ui/button";

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterChips = ({ 
  filters, 
  activeFilter, 
  onFilterChange 
}: FilterChipsProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={activeFilter === filter 
            ? "bg-primary text-primary-foreground hover:bg-primary-dark" 
            : "border-input-border hover:bg-secondary"
          }
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};