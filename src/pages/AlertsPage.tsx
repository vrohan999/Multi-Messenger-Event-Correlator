import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { AlertCard } from "@/components/AlertCard";
import { FilterControls } from "@/components/FilterControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Satellite, 
  AlertTriangle, 
  Eye, 
  TrendingUp, 
  Loader2,
  Zap
} from "lucide-react";

// Mock data - in a real app this would come from an API
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

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [isLoading] = useState(false);

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    let filtered = mockAlerts.filter((alert) => {
      const matchesSearch = 
        alert.name_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
      const matchesEventType = eventTypeFilter === "all" || alert.event_type === eventTypeFilter;
      
      return matchesSearch && matchesStatus && matchesEventType;
    });

    // Sort alerts
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "timestamp":
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case "confidence_score":
          aValue = a.confidence_score;
          bValue = b.confidence_score;
          break;
        case "name_id":
          aValue = a.name_id.toLowerCase();
          bValue = b.name_id.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockAlerts, searchTerm, statusFilter, eventTypeFilter, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockAlerts.length;
    const newAlerts = mockAlerts.filter(a => a.status === "New").length;
    const underReview = mockAlerts.filter(a => a.status === "Under Review").length;
    const highConfidence = mockAlerts.filter(a => a.confidence_score >= 0.8).length;
    
    return { total, newAlerts, underReview, highConfidence };
  }, [mockAlerts]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Astronomical Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage astronomical events and detections
            </p>
          </div>
          <Button asChild>
            <Link to="/nasa-api-integration" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              NASA API Integration
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card-gradient border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Satellite className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time events</p>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-status-new" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-new">{stats.newAlerts}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Eye className="h-4 w-4 text-status-review" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-review">{stats.underReview}</div>
              <p className="text-xs text-muted-foreground">Being analyzed</p>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.highConfidence}</div>
              <p className="text-xs text-muted-foreground">≥80% confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <FilterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          eventTypeFilter={eventTypeFilter}
          setEventTypeFilter={setEventTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {mockAlerts.length} alerts
            </span>
            {(searchTerm || statusFilter !== "all" || eventTypeFilter !== "all") && (
              <Badge variant="secondary">Filtered</Badge>
            )}
          </div>
        </div>

        {/* Alerts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAlerts.length === 0 ? (
          <Card className="bg-card-gradient border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Satellite className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No alerts found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchTerm || statusFilter !== "all" || eventTypeFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find more alerts."
                  : "No astronomical alerts have been detected yet. Check back later or configure the NASA API integration."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}