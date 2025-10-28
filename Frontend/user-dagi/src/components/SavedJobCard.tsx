import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MapPin, Star, Trash2 } from "lucide-react";

interface SavedJobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  logo: string;
  onUnsave?: (id: string) => void;
  onApply?: (id: string) => void;
}

export const SavedJobCard = ({
  id,
  title,
  company,
  location,
  salary,
  logo,
  onUnsave,
  onApply,
}: SavedJobCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg font-semibold text-foreground">
              {logo}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-lg text-muted-foreground mb-2">{company}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </div>
                <span className="font-semibold text-primary">{salary}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onUnsave?.(id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Unsave
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 transition-colors"
                  size="sm"
                  onClick={() => onApply?.(id)}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};