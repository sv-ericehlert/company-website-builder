import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dj-set.png";
import { ArrowRight, Users, Globe, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="DJ performing at festival with electric blue stage lights and crowd"
          className="w-full h-full object-cover"
        />
        <div className="gradient-overlay absolute inset-0" />
        <div className="gradient-glow absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated/80 backdrop-blur-sm border border-border/50 mb-8 opacity-0 animate-fade-in">
            <Zap className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              The Entertainment Industry Network
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 opacity-0 animate-slide-up animation-delay-100">
            Where Talent
            <br />
            Meets Opportunity
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-slide-up animation-delay-200">
            Connect with venues, artists, and production teams across the world&apos;s 
            most iconic entertainment destinations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0 animate-slide-up animation-delay-300">
            <Button variant="hero" size="xl" className="group">
              Find Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Hire Talent
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto opacity-0 animate-fade-in animation-delay-500">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                <Users className="w-5 h-5" />
                <span className="font-display text-3xl font-bold">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Professionals</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                <Globe className="w-5 h-5" />
                <span className="font-display text-3xl font-bold">7</span>
              </div>
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                <Zap className="w-5 h-5" />
                <span className="font-display text-3xl font-bold">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Venues</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
