import { useState } from "react";

const locations = {
  "North America": [
    { city: "Los Angeles", country: "USA", venues: 120 },
    { city: "Miami", country: "USA", venues: 85 },
    { city: "New York", country: "USA", venues: 150 },
  ],
  "Europe": [
    { city: "London", country: "UK", venues: 95 },
    { city: "Ibiza", country: "Spain", venues: 60 },
    { city: "Berlin", country: "Germany", venues: 75 },
    { city: "Amsterdam", country: "Netherlands", venues: 55 },
  ],
};

const Locations = () => {
  const [activeRegion, setActiveRegion] = useState<string>("North America");

  return (
    <section id="locations" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Global Presence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From Miami to Ibiza, connect with opportunities in the world's 
            most vibrant entertainment capitals.
          </p>
        </div>

        {/* Region Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {Object.keys(locations).map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeRegion === region
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Cities Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {locations[activeRegion as keyof typeof locations].map((location, index) => (
            <div
              key={location.city}
              className="group p-6 rounded-2xl bg-card border border-border/50 card-glow text-center animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-display text-2xl font-bold mb-1 group-hover:text-muted-foreground transition-colors">
                {location.city}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{location.country}</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/10 text-foreground text-sm font-medium">
                {location.venues} venues
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
