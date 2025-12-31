import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Globe = lazy(() => import("@/components/Globe"));
const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        } else {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setProfile(profileData);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'Member';

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="home" className="h-full">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Logo />
            
            <TabsList className="bg-muted/50 hidden md:flex">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Home Tab Content */}
        <TabsContent value="home" className="pt-24 pb-12 px-4 mt-0">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-10">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Welcome back, {firstName}
              </h1>
              <p className="text-muted-foreground text-lg">
                Your hub for connections, opportunities, and events.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="bg-card/50 border border-border/50 rounded-xl p-6 opacity-60">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">Events</h3>
                <p className="text-sm text-muted-foreground">
                  Coming soon
                </p>
              </div>

              <div className="bg-card/50 border border-border/50 rounded-xl p-6 opacity-60">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">Find Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Coming soon
                </p>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-card/50 border border-border/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold">
                      {profile?.first_name || 'Member'} {profile?.last_name || ''}
                    </h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Member since</p>
                  <p className="font-medium">
                    {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Account status</p>
                  <p className="font-medium text-green-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="pt-24 pb-12 px-4 mt-0">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="font-display text-3xl font-bold mb-4">Members Directory</h2>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="pt-24 pb-12 px-4 mt-0">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="font-display text-3xl font-bold mb-4">Opportunities</h2>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="pt-24 pb-12 px-4 mt-0">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="font-display text-3xl font-bold mb-4">Events</h2>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="pt-24 pb-12 px-4 mt-0">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="font-display text-3xl font-bold mb-4">Locations</h2>
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="pt-16 mt-0 h-[calc(100vh-4rem)]">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">Loading globe...</p>
            </div>
          }>
            <Globe />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
