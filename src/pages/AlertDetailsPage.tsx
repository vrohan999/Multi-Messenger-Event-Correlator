import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Activity,
  Database,
  Star,
  Save,
  ExternalLink,
} from "lucide-react";

// Mock data - same as in AlertsPage, in real app would fetch by ID
const mockAlerts = [
  {
    id: "1",
    name_id: "SN2024A",
    event_type: "Supernova",
    timestamp: "2024-01-15T14:30:00Z",
    ra: 123.456,
    dec: -23.789,
    source: "Hubble Space Telescope",
    description: "Type Ia supernova detected in galaxy NGC 1234. Bright optical transient with characteristic light curve evolution.",
    status: "New",
    confidence_score: 0.95
  },
  {
    id: "2",
    name_id: "GRB240116A",
    event_type: "Gamma-Ray Burst",
    timestamp: "2024-01-16T08:15:00Z",
    ra: 245.123,
    dec: 67.890,
    source: "Fermi Gamma-ray Space Telescope",
    description: "Long-duration gamma-ray burst with high-energy emission. Duration ~45 seconds with complex temporal structure.",
    status: "Under Review",
    confidence_score: 0.88
  },
  {
    id: "3",
    name_id: "GW240117",
    event_type: "Gravitational Wave",
    timestamp: "2024-01-17T12:45:00Z",
    ra: 89.567,
    dec: 12.345,
    source: "LIGO-Virgo Collaboration",
    description: "Binary black hole merger detected with high significance. Estimated masses: 35 + 30 solar masses.",
    status: "Follow-up Needed",
    confidence_score: 0.92
  },
  {
    id: "4",
    name_id: "IC240118A",
    event_type: "Neutrino Event",
    timestamp: "2024-01-18T16:20:00Z",
    ra: 156.789,
    dec: -45.123,
    source: "IceCube Neutrino Observatory",
    description: "High-energy neutrino event with potential astrophysical origin. Energy ~100 TeV, well-reconstructed track.",
    status: "New",
    confidence_score: 0.75
  },
  {
    id: "5",
    name_id: "FRB240119",
    event_type: "Fast Radio Burst",
    timestamp: "2024-01-19T09:30:00Z",
    ra: 301.234,
    dec: 55.678,
    source: "CHIME Telescope",
    description: "Repeating fast radio burst with unique dispersion measure. Multiple pulses detected over 6-hour observation window.",
    status: "Dismissed",
    confidence_score: 0.65
  },
  {
    id: "6",
    name_id: "OTH240120",
    event_type: "Other",
    timestamp: "2024-01-20T11:10:00Z",
    ra: 78.901,
    dec: -12.456,
    source: "Kepler Space Telescope",
    description: "Unusual stellar brightening event in K-type star. Magnitude increase of 2.5 over 48 hours, no clear explanation.",
    status: "Under Review",
    confidence_score: 0.55
  }
];

export default function AlertDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Find the alert by ID
  const alert = mockAlerts.find(a => a.id === id);
  const [currentStatus, setCurrentStatus] = useState(alert?.status || "New");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!alert) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Alert Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested astronomical alert could not be found.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Alerts
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentStatus(newStatus);
      setIsUpdating(false);
      toast({
        title: "Status Updated",
        description: `Alert status changed to "${newStatus}"`,
      });
    }, 1000);
  };

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
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { label: "High", color: "text-status-new" };
    if (score >= 0.5) return { label: "Medium", color: "text-status-review" };
    return { label: "Low", color: "text-status-followup" };
  };

  const confidence = getConfidenceLevel(alert.confidence_score);

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Under Review", label: "Under Review" },
    { value: "Follow-up Needed", label: "Follow-up Needed" },
    { value: "Dismissed", label: "Dismissed" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Alerts
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge className={getEventTypeColor(alert.event_type)}>
              {alert.event_type}
            </Badge>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus}
            </Badge>
          </div>
        </div>

        {/* Alert Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{alert.name_id}</h1>
          <p className="text-muted-foreground mt-1">
            Astronomical Alert Details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Event Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {alert.description}
                </p>
              </CardContent>
            </Card>

            {/* Coordinates & Timing */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Right Ascension
                    </label>
                    <p className="text-lg font-mono text-foreground">
                      {alert.ra.toFixed(6)}°
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Declination
                    </label>
                    <p className="text-lg font-mono text-foreground">
                      {alert.dec.toFixed(6)}°
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Detection Time (UTC)
                  </label>
                  <p className="text-lg text-foreground">
                    {formatDate(alert.timestamp)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Source Information */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Source Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Observatory/Instrument
                    </label>
                    <p className="text-lg text-foreground">{alert.source}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    More Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Confidence Score */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Confidence Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-3xl font-bold ${confidence.color} mb-2`}>
                  {(alert.confidence_score * 100).toFixed(0)}%
                </div>
                <div className={`text-sm font-medium ${confidence.color} mb-4`}>
                  {confidence.label} Confidence
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${alert.confidence_score * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Current Status
                  </label>
                  <Select
                    value={currentStatus}
                    onValueChange={setCurrentStatus}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentStatus !== alert.status && (
                  <Button
                    onClick={() => handleStatusUpdate(currentStatus)}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                )}

                <div className="text-xs text-muted-foreground">
                  Status changes are logged and tracked for audit purposes.
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("Under Review")}
                  disabled={currentStatus === "Under Review" || isUpdating}
                >
                  Mark for Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("Follow-up Needed")}
                  disabled={currentStatus === "Follow-up Needed" || isUpdating}
                >
                  Needs Follow-up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("Dismissed")}
                  disabled={currentStatus === "Dismissed" || isUpdating}
                >
                  Dismiss Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
