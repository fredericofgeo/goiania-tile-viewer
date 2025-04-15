
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Minus, Plus, RotateCw, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Coordinates {
  latitude: number;
  longitude: number;
  zoom: number;
}

// Component to handle map center and zoom changes
function MapController({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], coordinates.zoom);
  }, [coordinates, map]);
  
  return null;
}

const MapViewer = () => {
  const { toast } = useToast();
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: -16.667295,
    longitude: -49.327279,
    zoom: 17.15
  });
  const [inputCoordinates, setInputCoordinates] = useState<Coordinates>({
    latitude: -16.667295,
    longitude: -49.327279,
    zoom: 17.15
  });

  // Handle coordinate input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Coordinates
  ) => {
    const value = parseFloat(e.target.value);
    setInputCoordinates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Navigate to input coordinates
  const handleNavigate = () => {
    // Validate input
    if (
      isNaN(inputCoordinates.latitude) ||
      isNaN(inputCoordinates.longitude) ||
      isNaN(inputCoordinates.zoom)
    ) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid numeric coordinates",
        variant: "destructive"
      });
      return;
    }

    // Update coordinates
    setCoordinates(inputCoordinates);
    toast({
      title: "Map updated",
      description: `Navigated to ${inputCoordinates.latitude}, ${inputCoordinates.longitude} at zoom ${inputCoordinates.zoom}`,
    });
  };

  // Handle zoom in/out
  const handleZoom = (increment: number) => {
    const newZoom = Math.min(Math.max(coordinates.zoom + increment, 10), 21);
    setCoordinates((prev) => ({
      ...prev,
      zoom: newZoom
    }));
    setInputCoordinates((prev) => ({
      ...prev,
      zoom: newZoom
    }));
  };

  // Reset to default view
  const handleReset = () => {
    const defaultCoordinates = {
      latitude: -16.667295,
      longitude: -49.327279,
      zoom: 17.15
    };
    setCoordinates(defaultCoordinates);
    setInputCoordinates(defaultCoordinates);
    toast({
      title: "Map reset",
      description: "Returned to default view",
    });
  };

  // Generate tile URL for the Goiania map service
  const getTileUrl = (x: number, y: number, z: number) => {
    // Format the URL to match the Goiania tiles server
    return `https://tiles-goiania.geo360.com.br/tiles/${z}/${x}/${y}.png`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col lg:flex-row gap-4 mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-1 flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={inputCoordinates.latitude}
              onChange={(e) => handleInputChange(e, 'latitude')}
            />
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={inputCoordinates.longitude}
              onChange={(e) => handleInputChange(e, 'longitude')}
            />
          </div>
          <div className="flex flex-col w-24 gap-2">
            <Label htmlFor="zoom">Zoom</Label>
            <Input
              id="zoom"
              type="number"
              step="0.01"
              value={inputCoordinates.zoom}
              onChange={(e) => handleInputChange(e, 'zoom')}
            />
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <Button onClick={handleNavigate} className="bg-map-primary hover:bg-blue-700">
            <Navigation className="w-4 h-4 mr-2" />
            Navigate
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative rounded-lg shadow overflow-hidden">
        <MapContainer
          center={[coordinates.latitude, coordinates.longitude]}
          zoom={coordinates.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController coordinates={coordinates} />
        </MapContainer>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(1)}
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(-1)}
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Current View</h3>
              <p className="text-sm font-mono">
                Lat: {coordinates.latitude.toFixed(6)}, 
                Lng: {coordinates.longitude.toFixed(6)}, 
                Zoom: {coordinates.zoom.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Map Type</h3>
              <p className="text-sm font-mono">OpenStreetMap (Default)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapViewer;
