import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  eventTypeFilter: string;
  setEventTypeFilter: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export function FilterControls({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  eventTypeFilter,
  setEventTypeFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "New", label: "New" },
    { value: "Under Review", label: "Under Review" },
    { value: "Follow-up Needed", label: "Follow-up Needed" },
    { value: "Dismissed", label: "Dismissed" },
  ];

  const eventTypeOptions = [
    { value: "all", label: "All Events" },
    { value: "Supernova", label: "Supernova" },
    { value: "Gamma-Ray Burst", label: "Gamma-Ray Burst" },
    { value: "Gravitational Wave", label: "Gravitational Wave" },
    { value: "Neutrino Event", label: "Neutrino Event" },
    { value: "Fast Radio Burst", label: "Fast Radio Burst" },
    { value: "Other", label: "Other" },
  ];

  const sortOptions = [
    { value: "timestamp", label: "Date" },
    { value: "confidence_score", label: "Confidence" },
    { value: "name_id", label: "Name" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setEventTypeFilter("all");
    setSortBy("timestamp");
    setSortOrder("desc");
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== "all" ? statusFilter : null,
    eventTypeFilter !== "all" ? eventTypeFilter : null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search alerts by name, description, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card/50 rounded-lg border border-border/50">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Event Type
            </label>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Order
            </label>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full justify-start"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}