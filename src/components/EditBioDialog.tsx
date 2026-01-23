import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditBioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBio: string | null;
  userId: string | undefined;
  onSave: () => void;
}

const EditBioDialog = ({ open, onOpenChange, currentBio, userId, onSave }: EditBioDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(currentBio || "");

  useEffect(() => {
    if (open) {
      setBio(currentBio || "");
    }
  }, [open, currentBio]);

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // implementation here
    const { error } = await supabase
      .from('profiles')
      .update({ introduction: bio || null })
      .eq('user_id', userId);

    setIsLoading(false);

    if (error) {
      console.error('Bio update error:', error);
      toast({
        title: "Error",
        description: "Failed to update bio. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bio updated",
      description: "Your bio has been updated successfully.",
    });

    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Share a bit about yourself, your interests, and what you're looking for.
            </p>
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

export default EditBioDialog;
