import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Rocket,
  Key,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Database,
  ArrowLeft,
  Loader2,
  Info,
} from "lucide-react";

export default function NasaApiIntegrationPage() {
  const [apiKey, setApiKey] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [lastIngestion, setLastIngestion] = useState<string | null>(null);
  const [ingestionStatus, setIngestionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleStartIngestion = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your NASA API key to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsIngesting(true);
    setIngestionStatus('idle');

    // Simulate API call - in real app this would call backend function
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setIngestionStatus('success');
        setLastIngestion(new Date().toISOString());
        toast({
          title: "Ingestion Successful",
          description: "New astronomical alerts have been successfully ingested from NASA APIs.",
        });
      } else {
        setIngestionStatus('error');
        toast({
          title: "Ingestion Failed",
          description: "Failed to connect to NASA APIs. Please check your API key and try again.",
          variant: "destructive",
        });
      }
      
      setIsIngesting(false);
    }, 3000);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        </div>

        {/* Page Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">NASA API Integration</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect to NASA's astronomical data feeds to automatically ingest real-time 
            alerts from various space observatories and detection systems.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Integration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Configuration */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    NASA API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your NASA API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isIngesting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Don't have an API key? 
                    <Button variant="link" className="h-auto p-0 ml-1 text-xs" asChild>
                      <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">
                        Get one here <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </p>
                </div>

                <Button
                  onClick={handleStartIngestion}
                  disabled={isIngesting || !apiKey.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isIngesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ingesting Data...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Start Data Ingestion
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Ingestion Status */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Ingestion Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ingestionStatus === 'idle' && !isIngesting && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Ready to ingest data</span>
                  </div>
                )}

                {isIngesting && (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting to NASA APIs and ingesting alerts...</span>
                  </div>
                )}

                {ingestionStatus === 'success' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-status-new">
                      <CheckCircle className="h-4 w-4" />
                      <span>Ingestion completed successfully</span>
                    </div>
                    {lastIngestion && (
                      <p className="text-sm text-muted-foreground">
                        Last successful ingestion: {formatDate(lastIngestion)}
                      </p>
                    )}
                  </div>
                )}

                {ingestionStatus === 'error' && (
                  <div className="flex items-center gap-2 text-status-dismissed">
                    <AlertCircle className="h-4 w-4" />
                    <span>Ingestion failed - please check your API key and try again</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium text-foreground">Connect to NASA APIs</p>
                    <p className="text-sm text-muted-foreground">
                      Using your API key, we connect to various NASA data sources including 
                      GCN (General Coordinates Network) and other astronomical alert systems.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium text-foreground">Parse Alert Data</p>
                    <p className="text-sm text-muted-foreground">
                      Raw alert data is parsed and normalized into our standard 
                      AstronomicalAlert format with all required fields.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium text-foreground">Store & Process</p>
                    <p className="text-sm text-muted-foreground">
                      New alerts are stored in the database and made available 
                      for review, filtering, and status management.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Data Sources */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle>Supported Data Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GCN</Badge>
                  <span className="text-sm text-muted-foreground">General Coordinates Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Fermi</Badge>
                  <span className="text-sm text-muted-foreground">Gamma-ray Space Telescope</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">LIGO</Badge>
                  <span className="text-sm text-muted-foreground">Gravitational Wave Observatory</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Swift</Badge>
                  <span className="text-sm text-muted-foreground">Space Observatory</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">IceCube</Badge>
                  <span className="text-sm text-muted-foreground">Neutrino Observatory</span>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-card-gradient border-border/50">
              <CardHeader>
                <CardTitle>Integration Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Ingestions</span>
                  <span className="text-sm font-medium text-foreground">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alerts Imported</span>
                  <span className="text-sm font-medium text-foreground">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="text-sm font-medium text-foreground">
                    {lastIngestion ? formatDate(lastIngestion) : "Never"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Developer Note */}
            <Card className="bg-card-gradient border-border/50 border-accent/30">
              <CardHeader>
                <CardTitle className="text-accent">Developer Note</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  This frontend provides the UI for NASA API integration. 
                  The actual data ingestion requires a backend function 
                  (e.g., <code className="text-accent">ingest_nasa_alerts</code>) 
                  to be implemented separately.
                </p>
                <p>
                  The backend should handle API authentication, data parsing, 
                  and persistence to the AstronomicalAlert entity.
                </p>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <Database className="h-4 w-4 mr-2" />
                View Current Alerts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}