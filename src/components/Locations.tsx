import { useState } from "react";
import worldMapNetwork from "@/assets/world-map-network.png";

const locations = {
  "North America": [
    { city: "Los Angeles", country: "United States" },
    { city: "Miami", country: "United States" },
    { city: "New York", country: "United States" },
    { city: "San Francisco", country: "United States" },
    { city: "Chicago", country: "United States" },
    { city: "San Diego", country: "United States" },
    { city: "Las Vegas", country: "United States" },
  ],
  "Europe": [
    { city: "London", country: "United Kingdom" },
    { city: "Ibiza", country: "Spain" },
    { city: "Berlin", country: "Germany" },
    { city: "Amsterdam", country: "Netherlands" },
    { city: "Barcelona", country: "Spain" },
    { city: "Paris", country: "France" },
  ],
  "Latin America": [
    { city: "Mexico City", country: "Mexico" },
    { city: "Buenos Aires", country: "Argentina" },
    { city: "Rio de Janeiro", country: "Brazil" },
  ],
  "Africa & Asia": [
    { city: "Cape Town", country: "South Africa" },
    { city: "Tbilisi", country: "Georgia" },
  ],
};

const Locations = () => {
  const [activeRegion, setActiveRegion] = useState<string>("North America");

  const regionLocations = locations[activeRegion as keyof typeof locations];
  const maxLocations = Math.max(...Object.values(locations).map((arr) => arr.length));
  const placeholdersCount = Math.max(0, maxLocations - regionLocations.length);

  return (
    <section id="locations" className="py-24 relative overflow-hidden">
      {/* Background image (kept consistent by keeping section height consistent) */}
      <img
        src={worldMapNetwork}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-50 pointer-events-none select-none"
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
              className="group p-6 min-h-[120px] bg-card border border-border/50 card-glow text-center animate-scale-in flex flex-col items-center justify-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-display text-2xl font-bold mb-1 group-hover:text-muted-foreground transition-colors">
                {location.city}
              </h3>
              <p className="text-muted-foreground text-sm">{location.country}</p>
            </div>
          ))}

          {Array.from({ length: placeholdersCount }).map((_, i) => (
            <div
              key={`placeholder-${activeRegion}-${i}`}
              aria-hidden="true"
              className="p-6 min-h-[176px] invisible"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
