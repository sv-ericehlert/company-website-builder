import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus, X, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const professionOptions = [
  "DJ",
  "Producer",
  "Artist/Performer",
  "Venue Owner/Manager",
  "Event Promoter",
  "Sound Engineer",
  "Lighting Technician",
  "Visual Artist/VJ",
  "Stage Manager",
  "Booking Agent",
  "Artist Manager",
  "Record Label",
  "Music Journalist",
  "Photographer/Videographer",
  "Other",
];

const TOTAL_STEPS = 7;

const MembershipQuestionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const userData = location.state as { firstName: string; lastName: string; email: string } | null;

  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Personal Info
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [origin, setOrigin] = useState("");
  
  // Step 2: Profession
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  
  // Step 3: Introduction
  const [introduction, setIntroduction] = useState("");
  
  // Step 4: Industry Experience
  const [industryExperience, setIndustryExperience] = useState("");
  
  // Step 5: Photo
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Step 6: Social Media
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  
  // Step 7: Referrals & Terms
  const [referralName, setReferralName] = useState("");
  const [referrals, setReferrals] = useState<string[]>([]);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  useEffect(() => {
    if (!userData) {
      navigate("/membership");
    }
  }, [userData, navigate]);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addReferral = () => {
    if (referralName.trim() && !referrals.includes(referralName.trim())) {
      setReferrals([...referrals, referralName.trim()]);
      setReferralName("");
    }
  };

  const removeReferral = (name: string) => {
    setReferrals(referrals.filter(r => r !== name));
  };

  const toggleProfession = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(selectedProfessions.filter(p => p !== profession));
    } else {
      setSelectedProfessions([...selectedProfessions, profession]);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return birthday && phone.trim() && currentLocation.trim() && origin.trim();
      case 2:
        return selectedProfessions.length > 0;
      case 3:
        return introduction.trim().length >= 200;
      case 4:
        return industryExperience.trim().length >= 200;
      case 5:
        return photo !== null;
      case 6:
        return instagram.trim().length > 0;
      case 7:
        return privacyAgreed && termsAgreed;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/membership");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userData) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('membership_applications')
        .insert({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          birthday: birthday || null,
          phone,
          current_location: currentLocation,
          origin,
          professions: selectedProfessions,
          introduction,
          industry_experience: industryExperience,
          instagram,
          linkedin: linkedin || null,
          referrals: referrals.length > 0 ? referrals : null,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      navigate("/");
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">What is your birthday?</Label>
                <Input 
                  id="birthday" 
                  type="date" 
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">What is your phone number?</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Where do you live?</Label>
                <Input 
                  id="location" 
                  placeholder="City, Country"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origin">Where are you from?</Label>
                <Input 
                  id="origin" 
                  placeholder="City, Country"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Your Profession</h2>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {professionOptions.map((profession) => (
                <button
                  key={profession}
                  type="button"
                  onClick={() => toggleProfession(profession)}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all",
                    selectedProfessions.includes(profession)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card/50 border-border/50 hover:border-primary/50"
                  )}
                >
                  {profession}
                </button>
              ))}
            </div>
            
            {selectedProfessions.length > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Selected: {selectedProfessions.join(", ")}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Introduce Yourself</h2>
              <p className="text-muted-foreground">We'd like to get to know you (min 200 characters)</p>
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Tell us about yourself, your interests, and what drives you..."
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="min-h-[200px]"
              />
              <p className={cn(
                "text-sm text-right",
                introduction.trim().length >= 200 ? "text-primary" : "text-muted-foreground"
              )}>
                {introduction.trim().length} / 200 characters minimum
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Industry Experience</h2>
              <p className="text-muted-foreground">Describe your work in the music industry (min 200 characters)</p>
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Share your experience, notable projects, collaborations, and achievements in the music industry..."
                value={industryExperience}
                onChange={(e) => setIndustryExperience(e.target.value)}
                className="min-h-[250px]"
              />
              <p className={cn(
                "text-sm text-right",
                industryExperience.trim().length >= 200 ? "text-primary" : "text-muted-foreground"
              )}>
                {industryExperience.trim().length} / 200 characters minimum
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Your Photo</h2>
              <p className="text-muted-foreground">Upload a photo of yourself</p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-48 h-48 rounded-full object-cover border-4 border-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-48 h-48 rounded-full border-2 border-dashed border-border/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Social Media</h2>
              <p className="text-muted-foreground">Share your social profiles</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Username (Required)</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground text-sm">
                    @
                  </span>
                  <Input 
                    id="instagram" 
                    placeholder="yourusername"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="rounded-l-none"
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL (Optional)</Label>
                <Input 
                  id="linkedin" 
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold mb-2">Almost Done!</h2>
              <p className="text-muted-foreground">A few final details</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>If any current members referred you, add their names below</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter name"
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReferral())}
                  />
                  <Button type="button" variant="outline" onClick={addReferral}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {referrals.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {referrals.map((name) => (
                      <span 
                        key={name} 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {name}
                        <button type="button" onClick={() => removeReferral(name)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="privacy" 
                    checked={privacyAgreed}
                    onCheckedChange={(checked) => setPrivacyAgreed(checked === true)}
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                    By checking this box you agree to our Privacy Notice.*
                  </Label>
                </div>
                
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={termsAgreed}
                    onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    By checking this box you agree to our Terms & Conditions.*
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <Logo />
          <div className="w-16" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < currentStep ? "bg-primary" : "bg-border/50"
                )}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-40 pb-32 px-4">
        <div className="max-w-xl mx-auto">
          {renderStep()}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-xl mx-auto flex gap-4">
            {currentStep > 1 && (
              <Button variant="outline" size="lg" onClick={handleBack} className="flex-1">
                Previous
              </Button>
            )}
            
            {currentStep < TOTAL_STEPS ? (
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="flex-1 group"
              >
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="flex-1 group"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
                {!isSubmitting && <Check className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MembershipQuestionnaire;
