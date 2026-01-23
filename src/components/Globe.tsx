import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Line, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  region: string;
}

const cities: City[] = [
  // North America
  { name: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, region: "North America" },
  { name: "Miami", country: "United States", lat: 25.7617, lng: -80.1918, region: "North America" },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.006, region: "North America" },
  { name: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, region: "North America" },
  { name: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, region: "North America" },
  { name: "San Diego", country: "United States", lat: 32.7157, lng: -117.1611, region: "North America" },
  { name: "Las Vegas", country: "United States", lat: 36.1699, lng: -115.1398, region: "North America" },
  { name: "Austin", country: "United States", lat: 30.2672, lng: -97.7431, region: "North America" },
  { name: "Detroit", country: "United States", lat: 42.3314, lng: -83.0458, region: "North America" },
  
  // Europe
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, region: "Europe" },
  { name: "Ibiza", country: "Spain", lat: 38.9067, lng: 1.4206, region: "Europe" },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, region: "Europe" },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, region: "Europe" },
  { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734, region: "Europe" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, region: "Europe" },
  { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122, region: "Europe" },
  { name: "Milan", country: "Italy", lat: 45.4642, lng: 9.19, region: "Europe" },
  { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, region: "Europe" },
  
  // Latin America
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, region: "Latin America" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, region: "Latin America" },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, region: "Latin America" },
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, region: "Latin America" },
  
  // Africa
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, region: "Africa" },
  { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, region: "Africa" },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, region: "Africa" },
  { name: "Marrakesh", country: "Morocco", lat: 31.6295, lng: -7.9811, region: "Africa" },
  
  // Asia & Middle East
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, region: "Asia" },
  { name: "Tbilisi", country: "Georgia", lat: 41.7151, lng: 44.8271, region: "Asia" },
  { name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.092, region: "Asia" },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, region: "Asia" },
];

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

interface CityMarkerProps {
  city: City;
  radius: number;
  onSelect: (city: City) => void;
  isSelected: boolean;
}

const CityMarker = ({ city, radius, onSelect, isSelected }: CityMarkerProps) => {
  const position = useMemo(() => latLngToVector3(city.lat, city.lng, radius), [city.lat, city.lng, radius]);
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate the normal direction (pointing outward from globe center)
  const normal = useMemo(() => position.clone().normalize(), [position]);
  
  useFrame(() => {
    if (groupRef.current) {
      const scale = hovered || isSelected ? 1.3 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  // Gold colors
  const goldColor = "#FFD700";
  const goldHover = "#FFEC8B";
  const goldSelected = "#FFA500";

  return (
    <group position={position}>
      <group 
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(city);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Pin head (sphere) */}
        <mesh position={[normal.x * 0.035, normal.y * 0.035, normal.z * 0.035]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshBasicMaterial 
            color={isSelected ? goldSelected : hovered ? goldHover : goldColor} 
          />
        </mesh>
        {/* Pin point (cone) - oriented along the normal */}
        <mesh 
          position={[normal.x * 0.012, normal.y * 0.012, normal.z * 0.012]}
          quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            normal.clone().negate()
          )}
        >
          <coneGeometry args={[0.008, 0.035, 8]} />
          <meshBasicMaterial 
            color={isSelected ? goldSelected : hovered ? goldHover : goldColor} 
          />
        </mesh>
      </group>
      {/* Subtle glow ring */}
      <mesh position={[normal.x * 0.035, normal.y * 0.035, normal.z * 0.035]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial 
          color={goldColor} 
          transparent 
          opacity={hovered || isSelected ? 0.3 : 0.15}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html
          position={[normal.x * 0.08, normal.y * 0.08, normal.z * 0.08]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="bg-black/95 px-3 py-2 rounded border border-white/10 shadow-2xl">
            <p className="text-sm font-medium text-white tracking-wide">{city.name}</p>
            <p className="text-xs text-white/50">{city.country}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Country boundary lines component using GeoJSON
const CountryBoundaries = ({ radius }: { radius: number }) => {
  const [geoData, setGeoData] = useState<any>(null);
  
  useEffect(() => {
    // Load world countries GeoJSON with state/province boundaries
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load geo data:', err));
  }, []);

  const lines = useMemo(() => {
    if (!geoData) return [];
    
    const allLines: THREE.Vector3[][] = [];
    
    geoData.features.forEach((feature: any) => {
      const processCoordinates = (coords: number[][]) => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < coords.length; i += 2) { // Sample every 2nd point for performance
          const [lng, lat] = coords[i];
          points.push(latLngToVector3(lat, lng, radius * 1.002));
        }
        if (points.length > 2) {
          allLines.push(points);
        }
      };
      
      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach((ring: number[][]) => {
          processCoordinates(ring);
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon: number[][][]) => {
          polygon.forEach((ring: number[][]) => {
            processCoordinates(ring);
          });
        });
      }
    });
    
    return allLines;
  }, [geoData, radius]);

  if (!geoData) return null;

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#e0e0e0"
          lineWidth={0.5}
          transparent
          opacity={0.35}
        />
      ))}
    </group>
  );
};

// US States boundaries
const USStatesBoundaries = ({ radius }: { radius: number }) => {
  const [statesData, setStatesData] = useState<any>(null);
  
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(res => res.json())
      .then(data => setStatesData(data))
      .catch(err => console.error('Failed to load US states:', err));
  }, []);

  const lines = useMemo(() => {
    if (!statesData) return [];
    
    const allLines: THREE.Vector3[][] = [];
    
    statesData.features.forEach((feature: any) => {
      const processCoordinates = (coords: number[][]) => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < coords.length; i += 1) {
          const [lng, lat] = coords[i];
          points.push(latLngToVector3(lat, lng, radius * 1.003));
        }
        if (points.length > 2) {
          allLines.push(points);
        }
      };
      
      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach((ring: number[][]) => {
          processCoordinates(ring);
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon: number[][][]) => {
          polygon.forEach((ring: number[][]) => {
            processCoordinates(ring);
          });
        });
      }
    });
    
    return allLines;
  }, [statesData, radius]);

  if (!statesData) return null;

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#c0c0c0"
          lineWidth={0.3}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  );
};

// Get unique countries that have city markers and calculate their center position
const getCountryLabels = (radius: number) => {
  const countryGroups: { [key: string]: { lats: number[], lngs: number[] } } = {};
  
  // Custom offsets for countries with overlapping labels (lat, lng)
  const labelOffsets: { [key: string]: { lat: number, lng: number } } = {
    "Netherlands": { lat: 1.2, lng: 0 },
    "Denmark": { lat: 1, lng: 0 },
  };
  
  cities.forEach(city => {
    if (!countryGroups[city.country]) {
      countryGroups[city.country] = { lats: [], lngs: [] };
    }
    countryGroups[city.country].lats.push(city.lat);
    countryGroups[city.country].lngs.push(city.lng);
  });
  
  return Object.entries(countryGroups).map(([country, coords]) => {
    const offset = labelOffsets[country] || { lat: 0, lng: 0 };
    const avgLat = coords.lats.reduce((a, b) => a + b, 0) / coords.lats.length + offset.lat;
    const avgLng = coords.lngs.reduce((a, b) => a + b, 0) / coords.lngs.length + offset.lng;
    return {
      country,
      position: latLngToVector3(avgLat, avgLng, radius * 1.01)
    };
  });
};

const CountryLabel = ({ country, position }: { country: string; position: THREE.Vector3 }) => {
  // Position the label slightly above the globe surface
  const normal = position.clone().normalize();
  const labelPosition = position.clone().add(normal.clone().multiplyScalar(0.08));
  
  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
      position={[labelPosition.x, labelPosition.y, labelPosition.z]}
    >
      <Text
        fontSize={0.018}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        outlineWidth={0.001}
        outlineColor="#000000"
      >
        {country.toUpperCase()}
      </Text>
    </Billboard>
  );
};

const GlobeMesh = ({ onSelectCity, selectedCity }: { onSelectCity: (city: City) => void; selectedCity: City | null }) => {
  const radius = 1.5;
  const countryLabels = useMemo(() => getCountryLabels(radius), [radius]);

  return (
    <group>
      {/* Deep black base globe */}
      <Sphere args={[radius, 128, 128]}>
        <meshBasicMaterial color="#030303" />
      </Sphere>
      
      {/* Country boundaries - refined thin lines */}
      <CountryBoundaries radius={radius} />
      
      {/* US State boundaries - even more subtle */}
      <USStatesBoundaries radius={radius} />
      
      {/* Outer atmosphere glow */}
      <Sphere args={[radius * 1.015, 64, 64]}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.02} 
          side={THREE.BackSide} 
        />
      </Sphere>
      
      {/* Country labels */}
      {countryLabels.map(({ country, position }) => (
        <CountryLabel key={country} country={country} position={position} />
      ))}
      
      {/* City markers */}
      {cities.map((city) => (
        <CityMarker
          key={city.name}
          city={city}
          radius={radius}
          onSelect={onSelectCity}
          isSelected={selectedCity?.name === city.name}
        />
      ))}
    </group>
  );
};

interface GlobeProps {
  onCitySelect?: (city: City) => void;
}

const Globe = ({ onCitySelect }: GlobeProps) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    onCitySelect?.(city);
  };

  const filteredCities = useMemo(() => {
    if (!searchQuery) return cities;
    return cities.filter(city => 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="w-full h-full relative bg-black">
      {/* Search bar and city dropdown - Top right */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input 
            placeholder="Search cities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-40 sm:w-48 bg-black/70 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:bg-black/80 focus:border-white/40"
          />
        </div>
        
        {/* City Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-3 bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-black/80 text-white">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm hidden sm:inline">Cities</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto bg-black/95 border-white/20">
            {filteredCities.map((city) => (
              <DropdownMenuItem 
                key={city.name} 
                className="cursor-pointer text-white hover:bg-white/10 focus:bg-white/10"
                onClick={() => handleCitySelect(city)}
              >
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span>{city.name}</span>
                <span className="ml-auto text-xs text-white/50">{city.country}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: '#000000' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <GlobeMesh onSelectCity={handleCitySelect} selectedCity={selectedCity} />
        </Suspense>
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.5}
          maxDistance={6}
          rotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Selected city panel */}
      {selectedCity && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-fade-in">
          <h3 className="font-display text-xl font-bold text-white">{selectedCity.name}</h3>
          <p className="text-white/70">{selectedCity.country}</p>
          <p className="text-xs text-primary mt-1">{selectedCity.region}</p>
        </div>
      )}
      
      {/* Legend - moved to bottom left */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-3">
        <p className="text-xs text-white/60 mb-1">Click a city to explore</p>
        <p className="text-xs text-white font-medium">{cities.length} locations worldwide</p>
      </div>
    </div>
  );
};

export default Globe;
