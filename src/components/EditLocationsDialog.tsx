import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  userId: string;
  onSave: (locations: string[]) => void;
}

const EditLocationsDialog = ({
  open,
  onOpenChange,
  currentLocations,
  userId,
  onSave,
}: EditLocationsDialogProps) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(currentLocations);
  const [isSaving, setIsSaving] = useState(false);

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
      .update({ frequently_visited_cities: selectedLocations })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to save locations");
      console.error(error);
    } else {
      toast.success("Locations updated");
      onSave(selectedLocations);
      onOpenChange(false);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Frequently Visited Cities</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select up to 5 cities you visit often ({selectedLocations.length}/5)
          </p>
          <ScrollArea className="h-64">
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
