import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

const AVAILABLE_INTERESTS = [
  "Music", "Tech", "Travel", "Networking", "Events", "Startups",
  "Art", "Fashion", "Sports", "Food", "Film", "Photography",
  "Gaming", "Fitness", "Finance", "Real Estate", "Marketing",
  "Design", "Entertainment", "Wellness", "Nightlife", "Culture"
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

  useEffect(() => {
    if (open) {
      setSelectedInterests(currentInterests);
    }
  }, [open, currentInterests]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else if (prev.length < 10) {
        return [...prev, interest];
      } else {
        toast({
          title: "Limit reached",
          description: "You can select up to 10 interests",
          variant: "destructive",
        });
        return prev;
      }
    });
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

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select up to 10 interests ({selectedInterests.length}/10)
          </p>
          
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all
                    flex items-center gap-1.5
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {interest}
                </button>
              );
            })}
          </div>
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
