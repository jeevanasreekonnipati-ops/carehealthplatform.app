let map, markers = [];

function initMap(center = { lat: 13.6288, lng: 79.4192 }) { // Tirupati default
  // Initialize Leaflet Map
  if (map) {
    map.setView([center.lat, center.lng], 13);
    return;
  }

  map = L.map('map').setView([center.lat, center.lng], 13);

  // Add OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Initial search
  fetchNearby(center);
}

async function geocodeAndCenter() {
  const address = document.getElementById('address-input').value;
  if (!address) return;

  try {
    const res = await fetch(`/api/hospitals/geocode?address=${encodeURIComponent(address)}`);
    const data = await res.json();

    const loc = data.results?.[0]?.geometry?.location;
    if (loc) {
      const center = { lat: loc.lat, lng: loc.lng };
      map.setView([center.lat, center.lng], 13);
      fetchNearby(center);
    } else {
      alert('Location not found');
    }
  } catch (e) {
    console.error('Geocode error:', e);
  }
}

function useMyLocation() {
  if (!navigator.geolocation) return alert('Geolocation not supported.');
  navigator.geolocation.getCurrentPosition(pos => {
    const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    initMap(center); // Centers if already exists
    fetchNearby(center);
  }, () => alert('Could not get location.'));
}

async function fetchNearby(center) {
  clearMarkers();

  // 1. Fetch from Backend (OSM Service)
  try {
    const res = await fetch(`/api/hospitals/nearby?lat=${center.lat}&lng=${center.lng}&radius=5000`);
    const data = await res.json();
    const results = data.results || [];
    displayHospitals(results);
  } catch (e) {
    console.error('Places error:', e);
  }
}

async function applyFilters() {
  const specialty = document.getElementById('specialty-filter').value;
  const rating = document.getElementById('rating-filter').value;
  const address = document.getElementById('address-input').value;

  const params = new URLSearchParams();
  if (specialty) params.append('specialty', specialty);
  if (address) params.append('query', address);

  try {
    // Use local DB search logic
    const res = await fetch(`/api/hospitals/search?${params.toString()}`);
    let results = await res.json();

    if (rating) {
      results = results.filter(h => (h.rating || 0) >= parseInt(rating));
    }

    // Convert local format to uniform map format
    const mapResults = results.map(h => ({
      name: h.name,
      vicinity: h.address,
      rating: h.rating,
      geometry: {
        location: { lat: h.latitude, lng: h.longitude }
      }
    }));

    clearMarkers();
    displayHospitals(mapResults);

    if (mapResults.length > 0) {
      const first = mapResults[0].geometry.location;
      map.setView([first.lat, first.lng], 13);
    } else {
      alert('No hospitals found matching criteria.');
    }
  } catch (e) {
    console.error('Search error:', e);
  }
}

function displayHospitals(results) {
  const list = document.getElementById('hospital-list');
  list.innerHTML = ''; // Clear list

  results.forEach(place => {
    if (!place.geometry) return;
    const pos = place.geometry.location;

    // Add Marker
    const marker = L.marker([pos.lat, pos.lng]).addTo(map);
    marker.bindPopup(`
            <strong>${place.name}</strong><br/>
            ${place.vicinity || ''}<br/>
            Rating: ${place.rating || 'N/A'}<br/>
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}')" 
                    style="margin-top:5px; padding:4px 8px; cursor:pointer;">
                Get Directions
            </button>
        `);
    markers.push(marker);

    // Add List Item
    const li = document.createElement('li');
    li.innerHTML = `<span>${place.name} — <small>${place.vicinity || ''}</small></span>
      <button class="btn alt" onclick="map.setView([${pos.lat}, ${pos.lng}], 15)">Locate</button>`;
    list.appendChild(li);
  });
}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

// Initialize map on load
document.addEventListener('DOMContentLoaded', () => {
  // Default to Tirupati or Nellore
  initMap();
});
