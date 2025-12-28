import { Briefcase, Users, Camera, Mic2, MapPin, Calendar } from "lucide-react";
import featureFindWork from "@/assets/feature-find-work.jpg";
import featureHireTalent from "@/assets/feature-hire-talent.jpg";
import featureLocation from "@/assets/feature-location.jpg";
import featureContent from "@/assets/feature-content.jpg";
import featureArtists from "@/assets/feature-artists.jpg";
import featureEvents from "@/assets/feature-events.jpg";

const features = [
  {
    icon: Briefcase,
    title: "Find Work",
    description: "Discover production, artist, venue, and content creation opportunities across global entertainment hubs.",
    image: featureFindWork,
  },
  {
    icon: Users,
    title: "Hire Talent",
    description: "Access a curated network of industry professionals including visual creatives, artists and production crews.",
    image: featureHireTalent,
  },
  {
    icon: MapPin,
    title: "Location Based",
    description: "Filter opportunities by city - from LA to Ibiza, NYC to Berlin. Work where the action is.",
    image: featureLocation,
  },
  {
    icon: Camera,
    title: "Content Creators",
    description: "Connect with videographers, photographers, graphic designers, managers and content editors wherever you travel.",
    image: featureContent,
  },
  {
    icon: Mic2,
    title: "Artists",
    description: "Find creative talent and venues across multiple cities when you need them.",
    image: featureArtists,
  },
  {
    icon: Calendar,
    title: "Event Access",
    description: "Get exclusive access to industry events, networking opportunities, and venue connections.",
    image: featureEvents,
  },
];

const Features = () => {
  return (
    <section id="jobs" className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            A Central Place to Connect
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're looking for your next gig or building your dream team,
            STAGEVEST connects you with the right opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 overflow-hidden card-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <img
                src={feature.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/40" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="w-14 h-14 bg-foreground/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors border border-border/30">
                  <feature.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
