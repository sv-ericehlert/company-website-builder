import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Plane, Star } from "lucide-react";

const AVAILABLE_CITIES = [
  // North America
  "Los Angeles",
  "Miami",
  "New York",
  "San Francisco",
  "Chicago",
  "San Diego",
  "Las Vegas",
  // Europe
  "London",
  "Ibiza",
  "Berlin",
  "Amsterdam",
  "Barcelona",
  "Paris",
  // Latin America
  "Mexico City",
  "Buenos Aires",
  "Rio de Janeiro",
  // Africa & Asia
  "Cape Town",
  "Tbilisi",
];

interface EditLocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLocations: string[];
  currentLocation: string | null;
  origin: string | null;
  userId: string;
  onSave: () => void;
}

const EditLocationsDialog = ({
  open,
  onOpenChange,
  currentLocations,
  currentLocation,
  origin,
  userId,
  onSave,
}: EditLocationsDialogProps) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(currentLocations);
  const [livesIn, setLivesIn] = useState(currentLocation || "");
  const [fromLocation, setFromLocation] = useState(origin || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedLocations(currentLocations);
      setLivesIn(currentLocation || "");
      setFromLocation(origin || "");
    }
  }, [open, currentLocations, currentLocation, origin]);

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== location));
    } else {
      if (selectedLocations.length >= 5) {
        toast.error("You can select up to 5 cities");
        return;
      }
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // implementation here
    const { error } = await supabase
      .from("profiles")
      .update({ 
        frequently_visited_cities: selectedLocations,
        current_location: livesIn || null,
        origin: fromLocation || null,
      })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to save locations");
      console.error(error);
    } else {
      toast.success("Locations updated");
      onSave();
      onOpenChange(false);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit My Cities</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Lives In */}
          <div className="space-y-2">
            <Label htmlFor="livesIn" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Lives in
            </Label>
            <Input
              id="livesIn"
              value={livesIn}
              onChange={(e) => setLivesIn(e.target.value)}
              placeholder="e.g. Los Angeles, CA"
            />
          </div>

          {/* From */}
          <div className="space-y-2">
            <Label htmlFor="from" className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-muted-foreground" />
              From
            </Label>
            <Input
              id="from"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="e.g. New York, NY"
            />
          </div>

          {/* Often Visits */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Often Visits ({selectedLocations.length}/5)
            </Label>
            <ScrollArea className="h-48">
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_CITIES.map((city) => (
                  <Badge
                    key={city}
                    variant={selectedLocations.includes(city) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/80"
                    onClick={() => toggleLocation(city)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationsDialog;
