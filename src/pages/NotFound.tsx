import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-space flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <Rocket className="h-16 w-16 text-primary" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The astronomical data you're looking for has drifted into space. 
            Let's get you back to mission control.
          </p>
        </div>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to AstroAlerts
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
