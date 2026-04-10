// Map component placeholder - Google Maps not configured
import React from 'react';

interface MapViewProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMapReady?: (map: unknown) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className || 'h-64'}`}>
      <p className="text-gray-500 text-sm">الخريطة غير متاحة حالياً</p>
    </div>
  );
};

export default MapView;
