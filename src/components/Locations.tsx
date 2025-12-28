import { useState } from "react";
import worldMapNetwork from "@/assets/world-map-network.png";

const locations = {
  "North America": [
    { city: "Los Angeles", country: "USA", venues: 120 },
    { city: "Miami", country: "USA", venues: 85 },
    { city: "New York", country: "USA", venues: 150 },
    { city: "San Francisco", country: "USA", venues: 70 },
    { city: "Chicago", country: "USA", venues: 65 },
    { city: "San Diego", country: "USA", venues: 45 },
    { city: "Las Vegas", country: "USA", venues: 90 },
  ],
  "Europe": [
    { city: "London", country: "UK", venues: 95 },
    { city: "Ibiza", country: "Spain", venues: 60 },
    { city: "Berlin", country: "Germany", venues: 75 },
    { city: "Amsterdam", country: "Netherlands", venues: 55 },
    { city: "Barcelona", country: "Spain", venues: 80 },
    { city: "Paris", country: "France", venues: 85 },
  ],
  "Latin America": [
    { city: "Mexico City", country: "Mexico", venues: 70 },
    { city: "Buenos Aires", country: "Argentina", venues: 55 },
    { city: "Rio de Janeiro", country: "Brazil", venues: 65 },
  ],
  "Africa & Asia": [
    { city: "Cape Town", country: "South Africa", venues: 40 },
    { city: "Tbilisi", country: "Georgia", venues: 35 },
  ],
};

const Locations = () => {
  const [activeRegion, setActiveRegion] = useState<string>("North America");

  const regionLocations = locations[activeRegion as keyof typeof locations];

  return (
    <section id="locations" className="py-24 relative overflow-hidden min-h-[900px]">
      {/* Background image (fixed sizing so it doesn't change between tabs) */}
      <img
        src={worldMapNetwork}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 top-0 w-full h-auto opacity-30 pointer-events-none select-none"
        decoding="async"
      />
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-background/50" />
      
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
              className={`px-6 py-3 font-medium transition-all duration-300 ${
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
          {regionLocations.map((location, index) => (
            <div
              key={location.city}
              className="group p-6 bg-card border border-border/50 card-glow text-center animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-display text-2xl font-bold mb-1 group-hover:text-muted-foreground transition-colors">
                {location.city}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{location.country}</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-foreground/10 text-foreground text-sm font-medium">
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
