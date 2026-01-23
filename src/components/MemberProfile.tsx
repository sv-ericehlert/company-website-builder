import { useState, useEffect, useCallback, useRef } from "react";
import { User, Instagram, Briefcase, Building2, MapPin, Plane, Star, X, Pencil, Linkedin, ExternalLink, FolderOpen, Camera, Image, Video, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EditProfileDialog from "./EditProfileDialog";
import EditPortfolioDialog from "./EditPortfolioDialog";
import EditInterestsDialog from "./EditInterestsDialog";
import EditLocationsDialog from "./EditLocationsDialog";
import EditAboutDialog from "./EditAboutDialog";
import EditBioDialog from "./EditBioDialog";
import EditHeaderDialog from "./EditHeaderDialog";
import memberBadge from "@/assets/member-badge.png";

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
  interests: string[] | null;
  frequently_visited_cities: string[] | null;
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
  const [isHeaderEditOpen, setIsHeaderEditOpen] = useState(false);
  const [isBioEditOpen, setIsBioEditOpen] = useState(false);
  const [isAboutEditOpen, setIsAboutEditOpen] = useState(false);
  const [isPortfolioEditOpen, setIsPortfolioEditOpen] = useState(false);
  const [isInterestsEditOpen, setIsInterestsEditOpen] = useState(false);
  const [isLocationsEditOpen, setIsLocationsEditOpen] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return;
    
    // implementation here
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, birthday, current_location, origin, professions, introduction, instagram, linkedin, avatar_url, company, gender, cover_url, interests, frequently_visited_cities')
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
  const hasRealInterests = profileData?.interests && profileData.interests.length > 0;
  const interests = hasRealInterests 
    ? profileData.interests 
    : ["Music", "Tech", "Travel", "Networking", "Events", "Startups", "Art", "Fashion", "Sports", "Food"];

  const frequentCities = profileData?.frequently_visited_cities?.length 
    ? profileData.frequently_visited_cities 
    : [];

  const defaultCoverImage = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200";

  const handleRemoveInterest = async (interestToRemove: string) => {
    if (!user?.id) return;
    
    const updatedInterests = (profileData?.interests || []).filter(i => i !== interestToRemove);
    
    // implementation here
    const { error } = await supabase
      .from('profiles')
      .update({ interests: updatedInterests })
      .eq('user_id', user.id);

    if (error) {
      console.error('Remove interest error:', error);
      toast({
        title: "Error",
        description: "Failed to remove interest",
        variant: "destructive",
      });
      return;
    }

    // Update local state
    setProfileData(prev => prev ? { ...prev, interests: updatedInterests } : null);
  };

  const getTypeIcon = (type: 'photo' | 'video' | 'link') => {
    switch (type) {
      case 'photo': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Cover Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${coverUrl || defaultCoverImage}')` }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background/90" />
      </div>

      {/* Change Cover Button - Fixed position */}
      <button
        onClick={handleCoverClick}
        disabled={isUploadingCover}
        className="fixed top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-sm text-foreground hover:bg-background/80 transition-colors z-30"
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

      {/* Scrollable Content */}
      <div className="relative z-10 pt-8 px-4 max-w-lg mx-auto pb-8">
        {/* Top bar with close button */}
        {onClose && (
          <div className="flex justify-start mb-6">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-background/30 backdrop-blur-sm shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

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

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHeaderEditOpen(true)}
            className="mt-2 text-primary hover:text-primary/80"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        {/* Bio Card */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-semibold text-foreground">Bio</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBioEditOpen(true)}
              className="text-primary hover:text-primary/80"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <p className="text-foreground/90 text-sm leading-relaxed">{bio}</p>
        </div>

        {/* About Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">About</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAboutEditOpen(true)}
              className="text-primary hover:text-primary/80"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">My cities</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLocationsEditOpen(true)}
              className="text-primary hover:text-primary/80"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">Lives in {location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Plane className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">From {origin}</span>
            </div>
            {frequentCities.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-foreground/80">
                  <span className="text-primary">Often Visits:</span> {frequentCities.join(", ")}
                </span>
              </div>
            )}
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
            <>
              {/* Media Grid - photos and videos */}
              {portfolioItems.filter(item => item.type === 'photo' || item.type === 'video').length > 0 && (
                <div className={`grid gap-2 ${
                  portfolioItems.filter(item => item.type === 'photo' || item.type === 'video').length === 1 
                    ? 'grid-cols-1' 
                    : portfolioItems.filter(item => item.type === 'photo' || item.type === 'video').length === 2 
                    ? 'grid-cols-2'
                    : portfolioItems.filter(item => item.type === 'photo' || item.type === 'video').length === 3
                    ? 'grid-cols-3'
                    : portfolioItems.filter(item => item.type === 'photo' || item.type === 'video').length === 4
                    ? 'grid-cols-4'
                    : 'grid-cols-5'
                }`}>
                  {portfolioItems.filter(item => item.type === 'photo' || item.type === 'video').map((item) => (
                    <div 
                      key={item.id}
                      className="aspect-square rounded-lg overflow-hidden bg-background/30 group relative"
                      title={item.title}
                    >
                      {item.type === 'photo' && (
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.type === 'video' && (
                        <video 
                          src={item.url} 
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Hover overlay with title */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-white text-xs font-medium truncate w-full">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Links - displayed separately */}
              {portfolioItems.filter(item => item.type === 'link').length > 0 && (
                <div className="space-y-2 mt-4">
                  {portfolioItems.filter(item => item.type === 'link').map((item) => (
                    <a 
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No portfolio items yet. Click Edit to add your work.</p>
          )}
        </div>

        {/* Interests Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Interests</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInterestsEditOpen(true)}
              className="text-primary hover:text-primary/80"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {interests.slice(0, 10).map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors gap-1 pr-1"
              >
                {interest}
                {hasRealInterests && (
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-1 p-0.5 rounded-full hover:bg-primary/30 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {!hasRealInterests && (
            <p className="text-xs text-muted-foreground mt-2">
              These are placeholder interests. Click Edit to add your own.
            </p>
          )}
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

      {/* Edit Interests Dialog */}
      <EditInterestsDialog
        open={isInterestsEditOpen}
        onOpenChange={setIsInterestsEditOpen}
        userId={user?.id}
        currentInterests={profileData?.interests || []}
        onSave={() => {
          fetchProfileData();
        }}
      />

      {/* Edit Locations Dialog */}
      <EditLocationsDialog
        open={isLocationsEditOpen}
        onOpenChange={setIsLocationsEditOpen}
        userId={user?.id}
        currentLocations={profileData?.frequently_visited_cities || []}
        currentLocation={profileData?.current_location || null}
        origin={profileData?.origin || null}
        onSave={() => {
          fetchProfileData();
        }}
      />

      {/* Edit About Dialog */}
      <EditAboutDialog
        open={isAboutEditOpen}
        onOpenChange={setIsAboutEditOpen}
        userId={user?.id}
        profileData={profileData}
        onSave={() => {
          fetchProfileData();
        }}
      />

      {/* Edit Bio Dialog */}
      <EditBioDialog
        open={isBioEditOpen}
        onOpenChange={setIsBioEditOpen}
        userId={user?.id}
        currentBio={profileData?.introduction || null}
        onSave={() => {
          fetchProfileData();
        }}
      />

      {/* Edit Header Dialog */}
      <EditHeaderDialog
        open={isHeaderEditOpen}
        onOpenChange={setIsHeaderEditOpen}
        userId={user?.id}
        profileData={profileData}
        onSave={() => {
          fetchProfileData();
        }}
      />
    </div>
  );
};

export default MemberProfile;
