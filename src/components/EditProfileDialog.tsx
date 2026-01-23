import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationData {
  first_name: string;
  last_name: string;
  birthday: string | null;
  current_location: string | null;
  origin: string | null;
  professions: string[] | null;
  introduction: string | null;
  instagram: string | null;
  linkedin: string | null;
  photo_url: string | null;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationData: ApplicationData | null;
  userEmail: string | undefined;
  onSave: () => void;
}

const EditProfileDialog = ({ open, onOpenChange, applicationData, userEmail, onSave }: EditProfileDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    current_location: "",
    origin: "",
    professions: "",
    introduction: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    if (applicationData) {
      setFormData({
        first_name: applicationData.first_name || "",
        last_name: applicationData.last_name || "",
        current_location: applicationData.current_location || "",
        origin: applicationData.origin || "",
        professions: applicationData.professions?.join(", ") || "",
        introduction: applicationData.introduction || "",
        instagram: applicationData.instagram || "",
        linkedin: applicationData.linkedin || "",
      });
    }
  }, [applicationData]);

  const handleSave = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // implementation here
    const { error } = await supabase
      .from('membership_applications')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        current_location: formData.current_location || null,
        origin: formData.origin || null,
        professions: formData.professions ? formData.professions.split(",").map(p => p.trim()) : null,
        introduction: formData.introduction || null,
        instagram: formData.instagram || null,
        linkedin: formData.linkedin || null,
      })
      .eq('email', userEmail)
      .eq('status', 'approved');

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });

    onSave();
    onOpenChange(false);
    
    // Reload to show updated data
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_location">Current Location</Label>
            <Input
              id="current_location"
              placeholder="e.g., Los Angeles, CA"
              value={formData.current_location}
              onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="e.g., New York, NY"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professions">Professions (comma separated)</Label>
            <Input
              id="professions"
              placeholder="e.g., Software Developer, Designer"
              value={formData.professions}
              onChange={(e) => setFormData({ ...formData, professions: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="introduction">Bio</Label>
            <Textarea
              id="introduction"
              placeholder="Tell us about yourself..."
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="@username"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
