import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const MembershipQuestionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get user data from previous page
  const userData = location.state as { firstName: string; lastName: string; email: string } | null;

  // Redirect if no user data
  useEffect(() => {
    if (!userData) {
      navigate("/membership");
    }
  }, [userData, navigate]);

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    navigate("/");
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/membership")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <Logo />
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Welcome, {userData.firstName}!
          </h2>
          <p className="text-muted-foreground mb-8">
            Let's learn more about you. Your questionnaire slides will go here.
          </p>
          
          {/* Placeholder for slideshow - you can add your questions here */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-12 mb-8">
            <p className="text-muted-foreground">
              Slideshow questions will be added here
            </p>
          </div>

          <Button variant="hero" size="xl" onClick={handleSubmit}>
            Submit Application
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MembershipQuestionnaire;
