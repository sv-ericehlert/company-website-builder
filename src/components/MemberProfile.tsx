import { useState, useEffect } from "react";
import { User, Instagram, Briefcase, MapPin, Plane, Star, Music, X, Pencil, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import EditProfileDialog from "./EditProfileDialog";

interface MemberProfileProps {
  profile: any;
  user: any;
  onClose?: () => void;
}

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

const MemberProfile = ({ profile, user, onClose }: MemberProfileProps) => {
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (!user?.email) return;
      
      // implementation here
      const { data, error } = await supabase
        .from('membership_applications')
        .select('first_name, last_name, birthday, current_location, origin, professions, introduction, instagram, linkedin, photo_url')
        .eq('email', user.email)
        .eq('status', 'approved')
        .single();
      
      if (!error && data) {
        setApplicationData(data);
      }
    };

    fetchApplicationData();
  }, [user?.email]);

  // Use application data first, then profile, then user metadata
  const firstName = applicationData?.first_name || profile?.first_name || user?.user_metadata?.first_name || 'Member';
  const lastName = applicationData?.last_name || profile?.last_name || user?.user_metadata?.last_name || '';
  
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
  
  const age = calculateAge(applicationData?.birthday || null);
  const location = applicationData?.current_location || "Not specified";
  const origin = applicationData?.origin || "Not specified";
  const professions = applicationData?.professions || [];
  const bio = applicationData?.introduction || "No bio yet.";
  const instagram = applicationData?.instagram || null;
  const linkedin = applicationData?.linkedin || null;
  const photoUrl = applicationData?.photo_url || profile?.avatar_url || null;

  // Placeholder data for features not yet in applications
  const interests = ["Music", "Tech", "Travel", "Networking", "Events", "Startups"];
  const frequentCities = ["Paris, France", "Miami, FL"];

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Hero Cover Image */}
      <div className="absolute inset-0 h-80 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
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
            {firstName} {lastName && <span className="font-normal">{lastName}</span>}
            {age && <span className="text-muted-foreground font-normal text-2xl ml-2">{age}</span>}
          </h1>

          {professions.length > 0 && (
            <p className="text-muted-foreground text-sm mt-1">
              {professions.join(", ")}
            </p>
          )}

          {instagram && (
            <p className="text-primary text-sm mt-1">{instagram}</p>
          )}

          <p className="text-muted-foreground text-sm mt-1">{location}</p>

          <Badge variant="secondary" className="mt-3 bg-primary/20 text-primary border-0">
            👑 {firstName}
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
            {instagram && (
              <div className="flex items-center gap-3 text-sm">
                <Instagram className="w-4 h-4 text-primary" />
                <span className="text-primary">{instagram}</span>
              </div>
            )}
            {linkedin && (
              <div className="flex items-center gap-3 text-sm">
                <Linkedin className="w-4 h-4 text-primary" />
                <span className="text-primary">{linkedin}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center gap-3 text-sm">
                <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">🎂</span>
                <span className="text-foreground/80">{age} years old</span>
              </div>
            )}
            {professions.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground/80">{professions.join(", ")}</span>
              </div>
            )}
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

        {/* Interests Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-4">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Interests</h3>
          
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors"
              >
                {interest}
              </Badge>
            ))}
            <Badge variant="outline" className="bg-muted/50 border-border text-muted-foreground">
              +10 more
            </Badge>
          </div>
        </div>

        {/* Profile Song Section */}
        <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-4 mb-8">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Profile song</h3>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">DAISIES</p>
              <p className="text-sm text-muted-foreground">Justin Bieber</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        applicationData={applicationData}
        userEmail={user?.email}
        onSave={() => {
          // Refetch data after save
          // implementation here
        }}
      />
    </div>
  );
};

export default MemberProfile;
