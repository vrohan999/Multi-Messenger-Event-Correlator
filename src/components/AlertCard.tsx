import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Clock, MapPin, Activity } from "lucide-react";
import { Link } from "react-router-dom";

interface AstronomicalAlert {
  id: string;
  name_id: string;
  event_type: string;
  timestamp: string;
  ra: number;
  dec: number;
  source: string;
  description: string;
  status: string;
  confidence_score: number;
}

interface AlertCardProps {
  alert: AstronomicalAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase().replace(' ', '-').replace(' ', '-')) {
      case "new":
        return "bg-status-new text-white";
      case "under-review":
        return "bg-status-review text-black";
      case "follow-up-needed":
        return "bg-status-followup text-white";
      case "dismissed":
        return "bg-status-dismissed text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase().replace(' ', '-').replace(' ', '-')) {
      case "supernova":
        return "bg-event-supernova text-white";
      case "gamma-ray-burst":
        return "bg-event-grb text-white";
      case "gravitational-wave":
        return "bg-event-gw text-white";
      case "neutrino-event":
        return "bg-event-neutrino text-black";
      case "fast-radio-burst":
        return "bg-event-frb text-white";
      default:
        return "bg-event-other text-white";
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { label: "High", color: "text-status-new" };
    if (score >= 0.5) return { label: "Medium", color: "text-status-review" };
    return { label: "Low", color: "text-status-followup" };
  };

  const confidence = getConfidenceLevel(alert.confidence_score);

  return (
    <Card className="bg-card-gradient border-border/50 hover:border-primary/30 transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getEventTypeColor(alert.event_type)}>
                {alert.event_type}
              </Badge>
              <Badge className={getStatusColor(alert.status)}>
                {alert.status}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {alert.name_id}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Activity className="h-4 w-4" />
            <span className={`font-medium ${confidence.color}`}>
              {confidence.label}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {alert.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(alert.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>RA: {alert.ra.toFixed(2)}°, Dec: {alert.dec.toFixed(2)}°</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Source: {alert.source}
          </span>
          <Button asChild size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
            <Link to={`/alert/${alert.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}