import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Electronic music focused interest suggestions
const SUGGESTED_INTERESTS = [
  // Genres
  "House", "Techno", "Trance", "Drum & Bass", "Dubstep", "EDM",
  "Deep House", "Tech House", "Progressive House", "Minimal Techno",
  "Melodic Techno", "Hardstyle", "Garage", "Jungle", "Breakbeat",
  "Electro", "Synthwave", "Downtempo", "Ambient", "IDM",
  "Bass Music", "Future Bass", "Trap", "UK Garage", "Afro House",
  // Industry roles
  "DJing", "Producing", "A&R", "Artist Management", "Event Production",
  "Club Promotion", "Label Management", "Music Marketing", "Booking",
  "Sound Engineering", "Live Performance", "Festival Organization",
  // Culture & Lifestyle
  "Vinyl Collecting", "Festival Culture", "Club Culture", "Rave Culture",
  "Music Technology", "Synthesizers", "Music Production Software",
  "Audio Equipment", "Music Business", "Networking", "Collaborations",
  // Related interests
  "Visual Arts", "Stage Design", "Lighting Design", "Music Videos",
  "Photography", "Graphic Design", "Fashion", "Travel", "Nightlife",
  "Wellness", "Fitness", "Yoga", "Meditation", "Sustainability"
];

interface EditInterestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
  currentInterests: string[];
  onSave: () => void;
}

const EditInterestsDialog = ({ open, onOpenChange, userId, currentInterests, onSave }: EditInterestsDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedInterests(currentInterests);
      setInputValue("");
    }
  }, [open, currentInterests]);

  const filteredSuggestions = SUGGESTED_INTERESTS.filter(
    interest => 
      interest.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedInterests.includes(interest)
  ).slice(0, 8);

  const addInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (!trimmedInterest) return;
    
    if (selectedInterests.length >= 10) {
      toast({
        title: "Limit reached",
        description: "You can add up to 10 interests",
        variant: "destructive",
      });
      return;
    }

    if (selectedInterests.some(i => i.toLowerCase() === trimmedInterest.toLowerCase())) {
      toast({
        title: "Already added",
        description: "This interest is already in your list",
        variant: "destructive",
      });
      return;
    }

    setSelectedInterests(prev => [...prev, trimmedInterest]);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addInterest(filteredSuggestions[0]);
      } else {
        addInterest(inputValue);
      }
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    setIsLoading(true);

    // implementation here
    const { error } = await supabase
      .from('profiles')
      .update({ interests: selectedInterests })
      .eq('user_id', userId);

    setIsLoading(false);

    if (error) {
      console.error('Update interests error:', error);
      toast({
        title: "Error",
        description: "Failed to update interests. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Interests updated",
      description: "Your interests have been saved",
    });

    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Interests</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Add up to 10 interests ({selectedInterests.length}/10)
          </p>

          {/* Selected Interests */}
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="bg-primary/20 text-primary border-0 gap-1 pr-1"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-1 p-0.5 rounded-full hover:bg-primary/30 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Input with Suggestions */}
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Type an interest..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              disabled={selectedInterests.length >= 10}
            />
            
            {/* Add custom button */}
            {inputValue.trim() && !filteredSuggestions.some(s => s.toLowerCase() === inputValue.toLowerCase()) && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                onClick={() => addInterest(inputValue)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addInterest(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {!inputValue && selectedInterests.length < 10 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_INTERESTS
                  .filter(s => !selectedInterests.includes(s))
                  .slice(0, 12)
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => addInterest(suggestion)}
                      className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInterestsDialog;
