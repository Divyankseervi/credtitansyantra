import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SATELLITE_LAYER = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const STREET_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

function calculateCentroid(latlngs) {
  if (!latlngs || latlngs.length === 0) return null;
  let sumLat = 0, sumLng = 0, count = 0;
  latlngs.forEach(ring => {
    const points = Array.isArray(ring) ? ring : (ring?.lat ? [ring] : []);
    points.forEach(p => {
      const lat = p.lat ?? p[0];
      const lng = p.lng ?? p[1];
      if (typeof lat === 'number' && typeof lng === 'number') {
        sumLat += lat;
        sumLng += lng;
        count++;
      }
    });
  });
  if (count === 0) return null;
  return { lat: sumLat / count, lon: sumLng / count };
}

function LayerToggle({ isSatellite, onToggle, showNDVI, onNDVIToggle }) {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-card text-sm font-medium text-surface-900 hover:shadow-card-hover transition-all border border-surface-200"
      >
        {isSatellite ? '🗺️ Street View' : '🛰️ Satellite'}
      </button>
      {isSatellite && (
        <button
          onClick={onNDVIToggle}
          className={`px-4 py-2 rounded-lg shadow-card text-sm font-medium transition-all border ${
            showNDVI 
              ? 'bg-emerald-500 text-white border-emerald-600' 
              : 'bg-white/95 backdrop-blur-sm text-surface-900 border-surface-200 hover:shadow-card-hover'
          }`}
        >
          🌿 NDVI Overlay
        </button>
      )}
    </div>
  );
}

function DrawControl({ drawnItemsRef, onLandSelect }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !drawnItemsRef.current) return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: '#22c55e',
            fillColor: '#22c55e',
            fillOpacity: 0.3,
          },
          guideLines: true,
          showArea: true,
          metric: true,
          repeatMode: false,
        },
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs()[0] || [];
      const centroid = calculateCentroid([latlngs.map(ll => [ll.lat, ll.lng])]);
      if (centroid) {
        onLandSelect({
          coordinates: latlngs.map(ll => [ll.lat, ll.lng]),
          centroid: { lat: centroid.lat, lon: centroid.lon },
        });
      }
    });

    map.on(L.Draw.Event.DELETED, () => {
      onLandSelect(null);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onLandSelect]);

  return null;
}

function MapContent({ isSatellite, showNDVI, drawnItemsRef, onLandSelect, selectedLand, isAnalyzing }) {
  return (
    <>
      <TileLayer
        url={isSatellite ? SATELLITE_LAYER : STREET_LAYER}
        attribution='&copy; OpenStreetMap, Esri'
      />
      <DrawControl drawnItemsRef={drawnItemsRef} onLandSelect={onLandSelect} />
      {isAnalyzing && (
        <div className="absolute inset-0 z-[800] pointer-events-none overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 scan-line" />
          <div className="absolute inset-0 bg-emerald-500/5" />
        </div>
      )}
      {showNDVI && isSatellite && (
        <div className="absolute inset-0 z-[700] pointer-events-none bg-emerald-900/20 mix-blend-multiply" />
      )}
    </>
  );
}

export default function MapSelector({
  selectedLand,
  onLandSelect,
  isSatellite,
  onSatelliteToggle,
  showNDVI,
  onNDVIToggle,
  isAnalyzing,
}) {
  const drawnItemsRef = useRef(new L.FeatureGroup());
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-surface-200 shadow-card">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
        whenCreated={() => setMapReady(true)}
      >
        <MapContent
          isSatellite={isSatellite}
          showNDVI={showNDVI}
          drawnItemsRef={drawnItemsRef}
          onLandSelect={onLandSelect}
          selectedLand={selectedLand}
          isAnalyzing={isAnalyzing}
        />
        <LayerToggle
          isSatellite={isSatellite}
          onToggle={onSatelliteToggle}
          showNDVI={showNDVI}
          onNDVIToggle={onNDVIToggle}
        />
      </MapContainer>
    </div>
  );
}
