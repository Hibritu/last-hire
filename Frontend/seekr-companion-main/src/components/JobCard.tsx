import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MapPin } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  applicants?: number;
  tags: string[];
  logo: string;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  onApply?: (id: string) => void;
}

export const JobCard = ({
  id,
  title,
  company,
  location,
  type,
  salary,
  applicants,
  tags,
  logo,
  isBookmarked = false,
  onBookmark,
  onApply,
}: JobCardProps) => {
  return (
    <Card className="p-6 border border-border hover:shadow-lg transition-all duration-200 bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{logo}</span>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{company}</div>
            {applicants && (
              <div className="text-xs text-muted-foreground">
                +{applicants} Applied
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBookmark?.(id)}
          className="text-muted-foreground hover:text-primary"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {location}
        </div>
        <span>•</span>
        <span>{type}</span>
        {salary && (
          <>
            <span>•</span>
            <span className="font-medium text-foreground">{salary}</span>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Save
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary-dark"
          size="sm"
          onClick={() => onApply?.(id)}
        >
          Apply
        </Button>
      </div>
    </Card>
  );
};