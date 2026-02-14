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

function SearchControl() {
  const map = useMap();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!map) return;

    // Create a custom control element
    const controlDiv = document.createElement('div');
    controlDiv.className = 'leaflet-control leaflet-bar';
    controlDiv.style.cssText = 'background: white; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.65); z-index: 1000;';

    const searchBtn = document.createElement('button');
    searchBtn.title = 'Search Location';
    searchBtn.innerHTML = '🔍';
    searchBtn.style.cssText = 'width: 36px; height: 36px; background-color: white; border: none; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;';
    
    searchBtn.addEventListener('click', () => {
      setShowSearch(!showSearch);
    });

    controlDiv.appendChild(searchBtn);

    // Add to map
    const control = L.Control.extend({
      onAdd() {
        return controlDiv;
      }
    });

    map.addControl(new control({ position: 'topleft' }));

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return (
    <div>
      {showSearch && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50px',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
          width: '250px'
        }}>
          <SearchBox map={map} onClose={() => setShowSearch(false)} />
        </div>
      )}
    </div>
  );
}

function SearchBox({ map, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchText) => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=5`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    map.setView([lat, lon], 13);
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          performSearch(e.target.value);
        }}
        style={{
          width: '100%',
          padding: '8px',
          fontsize: '12px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          boxSizing: 'border-box'
        }}
      />
      {results.length > 0 && (
        <ul style={{
          listStyle: 'none',
          margin: '8px 0 0 0',
          padding: '0',
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '3px'
        }}>
          {results.map((result, idx) => (
            <li
              key={idx}
              onClick={() => handleSelectResult(result)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: idx < results.length - 1 ? '1px solid #eee' : 'none',
                fontSize: '12px',
                backgroundColor: 'white'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{result.name}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {parseFloat(result.lat).toFixed(4)}°, {parseFloat(result.lon).toFixed(4)}°
              </div>
            </li>
          ))}
        </ul>
      )}
      {loading && <div style={{ padding: '8px', fontSize: '12px', color: '#666' }}>Searching...</div>}
    </div>
  );
}

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
    <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
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
      <SearchControl />
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
    <div className="relative w-full h-full rounded-xl overflow-hidden">
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
