import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface RouteMapProps {
  source: string;
  destination: string;
}

// Common Indian cities that might be ambiguous
const INDIAN_CITIES = [
  'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 
  'pune', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
  'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna',
  'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad',
  'meerut', 'rajkot', 'varanasi', 'srinagar', 'amritsar', 'aurangabad'
];

// Free geocoding using OpenStreetMap Nominatim API
const geocodeCity = async (cityName: string): Promise<Location | null> => {
  try {
    // Extract city name from strings like "Mumbai (BOM)" or "Mumbai (BOM) → Denpasar (DPS)"
    let cleanCityName = cityName
      .split('→')[0] // Take first part if there's an arrow
      .split('(')[0] // Remove airport codes
      .trim()
      .toLowerCase();

    // Check if it's a common Indian city name
    const isIndianCity = INDIAN_CITIES.some(city => 
      cleanCityName.includes(city) || city.includes(cleanCityName)
    );

    // Build search query with country context for Indian cities
    let searchQuery = cleanCityName;
    if (isIndianCity) {
      // Add "India" to the search query for better accuracy
      searchQuery = `${cleanCityName}, India`;
    }

    // Try with country context first for Indian cities
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TravelMind-AI/1.0' // Required by Nominatim
        }
      }
    );

    let data = await response.json();
    
    if (data && data.length > 0) {
      // For Indian cities, prefer results that are actually in India
      if (isIndianCity) {
        const indianResult = data.find((result: any) => {
          const address = result.address || {};
          const country = (address.country || '').toLowerCase();
          return country === 'india' || country === 'in';
        });
        
        if (indianResult) {
          return {
            name: cleanCityName.charAt(0).toUpperCase() + cleanCityName.slice(1),
            lat: parseFloat(indianResult.lat),
            lng: parseFloat(indianResult.lon),
          };
        }
      }
      
      // Fallback to first result if no country-specific match found
      return {
        name: cleanCityName.charAt(0).toUpperCase() + cleanCityName.slice(1),
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    // If no results with country context, try without
    if (isIndianCity && searchQuery.includes(', India')) {
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanCityName)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TravelMind-AI/1.0'
          }
        }
      );
      
      data = await response.json();
      if (data && data.length > 0) {
        // Still prefer Indian results
        const indianResult = data.find((result: any) => {
          const address = result.address || {};
          const country = (address.country || '').toLowerCase();
          return country === 'india' || country === 'in';
        });
        
        if (indianResult) {
          return {
            name: cleanCityName.charAt(0).toUpperCase() + cleanCityName.slice(1),
            lat: parseFloat(indianResult.lat),
            lng: parseFloat(indianResult.lon),
          };
        }
        
        // Last resort: use first result
        return {
          name: cleanCityName.charAt(0).toUpperCase() + cleanCityName.slice(1),
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const RouteMap = ({ source, destination }: RouteMapProps) => {
  const [sourceLocation, setSourceLocation] = useState<Location | null>(null);
  const [destLocation, setDestLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      setError(null);

      // Extract source and destination from flight details
      // Handle formats like:
      // - "Mumbai (BOM) → Denpasar (DPS)" (departure)
      // - "Denpasar (DPS) → Mumbai (BOM)" (arrival)
      let sourceCity = source;
      let destCity = destination;

      // Parse departure: "Mumbai (BOM) → Denpasar (DPS)"
      if (source.includes('→')) {
        const parts = source.split('→');
        sourceCity = parts[0].trim(); // First city is source
        // If destination doesn't have arrow, use second part of source
        if (!destination.includes('→')) {
          destCity = parts[1]?.trim() || destination;
        }
      }

      // Parse arrival: "Denpasar (DPS) → Mumbai (BOM)"
      if (destination.includes('→')) {
        const parts = destination.split('→');
        // For arrival, the first city is the destination (where we're going)
        // But we already have source from departure, so use first city as destination
        if (!source.includes('→')) {
          destCity = parts[0].trim();
        } else {
          // Both have arrows, use second part of departure as destination
          const sourceParts = source.split('→');
          destCity = sourceParts[1]?.trim() || parts[0].trim();
        }
      }

      const [sourceLoc, destLoc] = await Promise.all([
        geocodeCity(sourceCity),
        geocodeCity(destCity),
      ]);

      if (sourceLoc && destLoc) {
        setSourceLocation(sourceLoc);
        setDestLocation(destLoc);
      } else {
        setError('Could not find locations on map');
      }
      setLoading(false);
    };

    loadLocations();
  }, [source, destination]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !sourceLocation || !destLocation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">{error || 'Unable to display map'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate center point between source and destination
  const centerLat = (sourceLocation.lat + destLocation.lat) / 2;
  const centerLng = (sourceLocation.lng + destLocation.lng) / 2;

  // Create a curved route line (great circle approximation)
  const routePoints: [number, number][] = [];
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = sourceLocation.lat + (destLocation.lat - sourceLocation.lat) * t;
    const lng = sourceLocation.lng + (destLocation.lng - sourceLocation.lng) * t;
    routePoints.push([lat, lng]);
  }

  // Custom icons for source and destination
  const sourceIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const destIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg overflow-hidden border border-border">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[sourceLocation.lat, sourceLocation.lng]} icon={sourceIcon}>
              <Popup>
                <div className="font-semibold">📍 Source</div>
                <div>{sourceLocation.name}</div>
              </Popup>
            </Marker>
            <Marker position={[destLocation.lat, destLocation.lng]} icon={destIcon}>
              <Popup>
                <div className="font-semibold">🎯 Destination</div>
                <div>{destLocation.name}</div>
              </Popup>
            </Marker>
            <Polyline
              positions={routePoints}
              color="#3b82f6"
              weight={3}
              opacity={0.7}
              dashArray="10, 5"
            />
          </MapContainer>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">Source: {sourceLocation.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground">Destination: {destLocation.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

