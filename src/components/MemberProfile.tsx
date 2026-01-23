import { useState, useEffect, useCallback, useRef } from "react";
import { User, Instagram, Briefcase, Building2, MapPin, Plane, Star, X, Pencil, Linkedin, ExternalLink, FolderOpen, Camera, Image, Video, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EditProfileDialog from "./EditProfileDialog";
import EditPortfolioDialog from "./EditPortfolioDialog";

interface MemberProfileProps {
  profile: any;
  user: any;
  onClose?: () => void;
}

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  current_location: string | null;
  origin: string | null;
  professions: string[] | null;
  introduction: string | null;
  instagram: string | null;
  linkedin: string | null;
  avatar_url: string | null;
  company: string | null;
  gender: string | null;
  cover_url: string | null;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  type: 'photo' | 'video' | 'link';
  url: string;
  thumbnail_url: string | null;
}

const MemberProfile = ({ profile, user, onClose }: MemberProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPortfolioEditOpen, setIsPortfolioEditOpen] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return;
    
    // implementation here
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, birthday, current_location, origin, professions, introduction, instagram, linkedin, avatar_url, company, gender, cover_url')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (!error && data) {
      setProfileData(data);
    }
  }, [user?.id]);

  const fetchPortfolioItems = useCallback(async () => {
    if (!user?.id) return;
    
    // implementation here
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id, title, description, type, url, thumbnail_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPortfolioItems(data as PortfolioItem[]);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfileData();
    fetchPortfolioItems();
  }, [fetchProfileData, fetchPortfolioItems]);

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/cover.${fileExt}`;

      // implementation here
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new cover URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfileData(prev => prev ? { ...prev, cover_url: publicUrl } : null);

      toast({
        title: "Cover photo updated",
        description: "Your cover photo has been updated",
      });
    } catch (error) {
      console.error('Cover upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload cover photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Use profile data first, then passed profile prop, then user metadata
  const firstName = profileData?.first_name || profile?.first_name || user?.user_metadata?.first_name || 'Member';
  const lastName = profileData?.last_name || profile?.last_name || user?.user_metadata?.last_name || '';
  
  // Calculate age from birthday
  const calculateAge = (birthday: string | null): number | null => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const calculatedAge = calculateAge(profileData?.birthday || null);
  const age = calculatedAge ?? 28;
  const location = profileData?.current_location || "Los Angeles, CA";
  const origin = profileData?.origin || "New York, NY";
  const professions = profileData?.professions?.length ? profileData.professions : ["Software Developer"];
  const bio = profileData?.introduction || "Builder of things, lover of chaos (controlled, mostly). Addicted to coffee, travel, and high-speed strategy. Always looking for the next big opportunity! 🎯";
  const instagram = profileData?.instagram || "@" + firstName.toLowerCase();
  const linkedin = profileData?.linkedin || null;
  const photoUrl = profileData?.avatar_url || profile?.avatar_url || null;
  const company = profileData?.company || "StageVest Inc.";
  const gender = profileData?.gender || "Man";
  const coverUrl = profileData?.cover_url || null;

  // Placeholder data for features not yet in profiles
  const interests = ["Music", "Tech", "Travel", "Networking", "Events", "Startups", "Art", "Fashion", "Sports", "Food"];
  const frequentCities = ["Paris, France", "Miami, FL"];

  const defaultCoverImage = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200";

  const getTypeIcon = (type: 'photo' | 'video' | 'link') => {
    switch (type) {
      case 'photo': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Hero Cover Image */}
      <div className="absolute inset-0 h-80 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${coverUrl || defaultCoverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Change Cover Button */}
        <button
          onClick={handleCoverClick}
          disabled={isUploadingCover}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-sm text-foreground hover:bg-background/80 transition-colors z-20"
        >
          {isUploadingCover ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isUploadingCover ? "Uploading..." : "Change Cover"}</span>
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="hidden"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-8 px-4 max-w-lg mx-auto">
        {/* Top bar with close and edit buttons */}
        <div className="flex justify-between mb-6">
          {onClose ? (
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-background/30 backdrop-blur-sm shrink-0">
              <X className="w-5 h-5" />
            </Button>
          ) : (
            <div />
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditOpen(true)} 
            className="rounded-full bg-background/30 backdrop-blur-sm shrink-0"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center overflow-hidden mb-4 shadow-lg">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-primary" />
            )}
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground">
            {firstName}
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            {professions.join(", ")}, {company}
          </p>

          <p className="text-primary text-sm mt-1">{instagram}</p>

          <p className="text-muted-foreground text-sm mt-1">{location}</p>

          <Badge variant="secondary" className="mt-3 bg-primary/20 text-primary border-0">
            👑 Member
          </Badge>
        </div>

        {/* Bio Card */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <p className="text-foreground/90 text-sm leading-relaxed">{bio}</p>
        </div>

        {/* About Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground">About</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Instagram className="w-4 h-4 text-primary" />
              <span className="text-primary">{instagram}</span>
            </div>
            {linkedin && (
              <div className="flex items-center gap-3 text-sm">
                <Linkedin className="w-4 h-4 text-primary" />
                <span className="text-primary">{linkedin}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">🎂</span>
              <span className="text-foreground/80">{age}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">{gender}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">{professions.join(", ")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">{company}</span>
            </div>
          </div>
        </div>

        {/* My Cities Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground">My cities</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">Lives in {location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Plane className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">From {origin}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-foreground/80">
                <span className="text-primary">Often Visits:</span> {frequentCities.join(" and ")}
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Portfolio
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPortfolioEditOpen(true)}
              className="text-primary hover:text-primary/80"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          
          {portfolioItems.length > 0 ? (
            <div className="space-y-3">
              {portfolioItems.map((item) => (
                <a 
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No portfolio items yet. Click Edit to add your work.</p>
          )}
        </div>

        {/* Interests Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Interests</h3>
          
          <div className="flex flex-wrap gap-2">
            {interests.slice(0, 10).map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        profileData={profileData}
        userId={user?.id}
        onSave={() => {
          fetchProfileData();
        }}
      />

      {/* Edit Portfolio Dialog */}
      <EditPortfolioDialog
        open={isPortfolioEditOpen}
        onOpenChange={setIsPortfolioEditOpen}
        userId={user?.id}
        portfolioItems={portfolioItems}
        onSave={() => {
          fetchPortfolioItems();
        }}
      />
    </div>
  );
};

export default MemberProfile;
