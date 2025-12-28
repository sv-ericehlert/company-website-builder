import { Briefcase, Users, Camera, Mic2, MapPin, Calendar } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Find Work",
    description: "Discover production, artist, venue, and content creation opportunities across global entertainment hubs.",
  },
  {
    icon: Users,
    title: "Hire Talent",
    description: "Access a curated network of industry professionals including videographers, photographers, and production crews.",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description: "Filter opportunities by city - from LA to Ibiza, NYC to Berlin. Work where the action is.",
  },
  {
    icon: Camera,
    title: "Content Creators",
    description: "Connect with videographers, photographers, and visual artists for your next production.",
  },
  {
    icon: Mic2,
    title: "Artists & Performers",
    description: "Book talent or find your next gig at the world's most prestigious venues.",
  },
  {
    icon: Calendar,
    title: "Event Access",
    description: "Get exclusive access to industry events, networking opportunities, and venue connections.",
  },
];

const Features = () => {
  return (
    <section id="jobs" className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Succeed
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
              className="group p-8 rounded-2xl bg-card border border-border/50 card-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-foreground/10 flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors">
                <feature.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
