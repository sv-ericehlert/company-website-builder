import { User, Instagram, Briefcase, Building2, MapPin, Plane, Star, Music, X, MoreHorizontal, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberProfileProps {
  profile: any;
  user: any;
  onClose?: () => void;
}

const cities = [
  "Los Angeles, CA",
  "New York, NY",
  "Miami, FL",
  "Chicago, IL",
  "San Francisco, CA",
  "Austin, TX",
  "Seattle, WA",
  "Paris, France",
  "London, UK",
  "Berlin, Germany",
  "Tokyo, Japan",
  "Sydney, Australia",
];

const MemberProfile = ({ profile, user, onClose }: MemberProfileProps) => {
  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Member';
  const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
  const age = 28;
  
  const profession = "Software Developer";
  const company = "StageVest Inc.";
  const location = "Los Angeles, CA";
  const origin = "New York, NY";
  const instagram = "@" + firstName.toLowerCase();
  const bio = "Builder of things, lover of chaos (controlled, mostly). Addicted to coffee, travel, and high-speed strategy. Always looking for the next big opportunity! 🎯";
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
        {/* Top bar with close, search, city dropdown, and more */}
        <div className="flex justify-between items-center gap-3 mb-6">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-background/30 backdrop-blur-sm shrink-0">
              <X className="w-5 h-5" />
            </Button>
          )}
          
          {/* Search and City Dropdown - Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 h-9 w-32 sm:w-40 bg-background/30 backdrop-blur-sm border-border/30 focus:bg-background/50"
              />
            </div>
            
            {/* City Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 bg-background/30 backdrop-blur-sm border border-border/30 hover:bg-background/50">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm hidden sm:inline">City</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
                {cities.map((city) => (
                  <DropdownMenuItem key={city} className="cursor-pointer">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm shrink-0">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center overflow-hidden mb-4 shadow-lg">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-primary" />
            )}
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground">
            {firstName} <span className="text-muted-foreground font-normal text-2xl">{age}</span>
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            {profession}, {company}
          </p>

          <p className="text-primary text-sm mt-1">{instagram}</p>

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
            <div className="flex items-center gap-3 text-sm">
              <Instagram className="w-4 h-4 text-primary" />
              <span className="text-primary">{instagram}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">🎂</span>
              <span className="text-foreground/80">{age}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">Man</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground/80">{profession}</span>
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
    </div>
  );
};

export default MemberProfile;
