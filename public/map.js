let map, markers = [];

function initMap(center = { lat: 14.4426, lng: 79.9865 }) { // Nellore default
  map = new google.maps.Map(document.getElementById('map'), {
    center, zoom: 13, mapId: 'DEMO_MAP_ID'
  });
}

async function geocodeAndCenter() {
  const address = document.getElementById('address-input').value;
  if (!address) return;
  const res = await fetch(`/api/hospitals/geocode?address=${encodeURIComponent(address)}`);
  const data = await res.json();
  const loc = data.results?.[0]?.geometry?.location;
  if (loc) {
    const center = { lat: loc.lat, lng: loc.lng };
    map.setCenter(center);
    fetchNearby(center);
  }
}

function useMyLocation() {
  if (!navigator.geolocation) return alert('Geolocation not supported.');
  navigator.geolocation.getCurrentPosition(pos => {
    const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    if (!map) initMap(center);
    else map.setCenter(center);
    fetchNearby(center);
  }, () => alert('Could not get location.'));
}

async function fetchNearby(center) {
  clearMarkers();

  // 1. Fetch from Google Places (via backend)
  try {
    const res = await fetch(`/api/hospitals/nearby?lat=${center.lat}&lng=${center.lng}&radius=5000`);
    const { results } = await res.json();
    displayHospitals(results);
  } catch (e) {
    console.error('Google Places error:', e);
  }

  // 2. Fetch from Local Database (if any, merging could be complex, for now appending)
  // In a real app we would merge or prefer local.
  // We will let 'applyFilters' handle separate local search.
}

async function applyFilters() {
  const specialty = document.getElementById('specialty-filter').value;
  const rating = document.getElementById('rating-filter').value;
  const address = document.getElementById('address-input').value; // usage as query/city proxy if needed

  // If we have filters, we use the local search endpoint
  const params = new URLSearchParams();
  if (specialty) params.append('specialty', specialty);
  if (address) params.append('query', address); // utilizing address input as general query

  try {
    const res = await fetch(`/api/hospitals/search?${params.toString()}`);
    let results = await res.json();

    // Filter by rating client-side or server-side (server doesn't have rating filter yet)
    if (rating) {
      results = results.filter(h => (h.rating || 0) >= parseInt(rating));
    }

    // Convert local format to map format
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
      map.setCenter(mapResults[0].geometry.location);
    } else {
      alert('No hospitals found matching criteria.');
    }
  } catch (e) {
    console.error('Search error:', e);
  }
}

function displayHospitals(results) {
  const list = document.getElementById('hospital-list');
  // Don't clear list if appending is desired, but here we refresh.
  // If calling fetchNearby then applyFilters, we might want to be careful.
  // For simplicity, we clear list in the caller or here if we assume one source.
  // But fetchNearby calls this, and applyFilters calls this.

  // Let's rely on caller clearing markers. For list, we append.
  // But usually we want to clear list.
  // We'll require caller to clear list or handle it.
  // Let's make displayHospitals strictly append, and callers clear.

  results.forEach(place => {
    if (!place.geometry) return;
    const pos = place.geometry.location;
    const marker = new google.maps.Marker({ position: pos, map, title: place.name });
    const info = new google.maps.InfoWindow({
      content: `<strong>${place.name}</strong><br/>${place.vicinity || ''}<br/>Rating: ${place.rating || 'N/A'}`
    });
    marker.addListener('click', () => info.open({ anchor: marker, map }));
    markers.push(marker);

    const li = document.createElement('li');
    li.innerHTML = `<span>${place.name} — ${place.vicinity || ''}</span>
      <button class="btn alt" onclick="map.setCenter({lat:${pos.lat},lng:${pos.lng}})">Trace</button>`;
    list.appendChild(li);
  });
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}

document.addEventListener('DOMContentLoaded', () => initMap());
