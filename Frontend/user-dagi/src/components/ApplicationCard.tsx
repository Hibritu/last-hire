import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ApplicationCardProps {
  id: string;
  title: string;
  company: string;
  status: "submitted" | "delivered" | "shortlisted" | "rejected";
  salary: string;
  logo: string;
  appliedDate?: string;
}

export const ApplicationCard = ({
  id,
  title,
  company,
  status,
  salary,
  logo,
  appliedDate,
}: ApplicationCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success text-success-foreground";
      case "submitted":
        return "bg-warning text-warning-foreground";
      case "shortlisted":
        return "bg-primary text-primary-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-4 border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{logo}</span>
          </div>
          <div>
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{company}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Badge 
          className={`capitalize px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(status)}`}
        >
          {status}
        </Badge>
        <span className="text-sm font-semibold text-foreground">{salary}</span>
      </div>
    </Card>
  );
};