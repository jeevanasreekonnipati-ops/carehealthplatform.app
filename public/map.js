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
  const res = await fetch(`/api/hospitals/nearby?lat=${center.lat}&lng=${center.lng}&radius=5000`);
  const { results } = await res.json();
  const list = document.getElementById('hospital-list');
  list.innerHTML = '';
  results.forEach(place => {
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
