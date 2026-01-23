import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Linkedin, Briefcase, Building2, User, Calendar } from "lucide-react";

interface EditAboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: {
    instagram: string | null;
    linkedin: string | null;
    birthday: string | null;
    gender: string | null;
    professions: string[] | null;
    company: string | null;
  } | null;
  userId: string | undefined;
  onSave: () => void;
}

const EditAboutDialog = ({ open, onOpenChange, profileData, userId, onSave }: EditAboutDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    instagram: "",
    linkedin: "",
    birthday: "",
    gender: "",
    professions: "",
    company: "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        instagram: profileData.instagram || "",
        linkedin: profileData.linkedin || "",
        birthday: profileData.birthday || "",
        gender: profileData.gender || "",
        professions: profileData.professions?.join(", ") || "",
        company: profileData.company || "",
      });
    }
  }, [profileData]);

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
      .update({
        instagram: formData.instagram || null,
        linkedin: formData.linkedin || null,
        birthday: formData.birthday || null,
        gender: formData.gender || null,
        professions: formData.professions ? formData.professions.split(",").map(p => p.trim()) : null,
        company: formData.company || null,
      })
      .eq('user_id', userId);

    setIsLoading(false);

    if (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profile updated",
      description: "Your about info has been updated successfully.",
    });

    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit About</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-primary" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="@username"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-primary" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Birthday
            </Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Gender
            </Label>
            <Input
              id="gender"
              placeholder="e.g., Man, Woman, Non-binary"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professions" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Professions (comma separated)
            </Label>
            <Input
              id="professions"
              placeholder="e.g., Software Developer, Designer"
              value={formData.professions}
              onChange={(e) => setFormData({ ...formData, professions: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Company
            </Label>
            <Input
              id="company"
              placeholder="e.g., StageVest Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
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

export default EditAboutDialog;
