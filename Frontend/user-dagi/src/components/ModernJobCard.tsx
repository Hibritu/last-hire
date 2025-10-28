import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MapPin, Star, TrendingUp } from "lucide-react";

interface ModernJobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  remote?: boolean;
  featured?: boolean;
  rating?: number;
  skills?: string[];
  logo?: string;
  isSaved?: boolean;
  hasApplied?: boolean;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  onClick?: () => void;
}

export const ModernJobCard = ({
  id,
  title,
  company,
  location,
  salary,
  remote = false,
  featured = false,
  rating,
  skills = [],
  logo = '',
  onSave,
  onApply,
  onClick,
}: ModernJobCardProps) => {
  return (
    <Card 
      className={`group relative overflow-hidden border transition-all duration-200 hover:border-primary/30 hover:shadow-md cursor-pointer ${
        featured ? 'bg-card border-primary/20' : 'bg-card'
      }`}
      onClick={onClick}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
      )}
      
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
              {logo || company?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{company}</span>
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs text-warning">{rating}</span>
                  </div>
                )}
              </div>
              {featured && (
                <Badge variant="secondary" className="mt-1 text-xs bg-primary/20 text-primary border-primary/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(id);
            }}
            className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        {/* Job Title */}
        <h3 className="text-xl font-bold text-foreground">
          {title}
        </h3>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </div>
          {remote && (
            <Badge variant="outline" className="text-xs border-success/50 text-success">
              Remote
            </Badge>
          )}
          <span className="font-semibold text-primary">{salary}</span>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge 
                key={`${skill}-${index}`} 
                variant="secondary" 
                className="text-xs bg-muted/50 hover:bg-muted transition-colors cursor-default"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-muted/30 text-muted-foreground">
                +{skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border/50 hover:border-primary/50 hover:bg-primary/5"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(id);
            }}
          >
            Save for Later
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 transition-colors"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(id);
            }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};