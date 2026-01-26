const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

// Use a user-agent as required by Nominatim usage policy
const HEADERS = {
    'User-Agent': 'SmartHealthConnect/1.0 (contact@smarthealth.com)'
};

async function nearbyHospitals({ lat, lng, radius = 5000 }) {
    // Overpass API is powerful but complex. For simplicity and robustness without a dedicated Overpass server,
    // we can search Nominatim for "hospital" near the location.
    // Alternatively, just return the local seeded hospitals if we want to avoid external dependencies for "nearby".
    // Let's try to query Nominatim for hospitals in the city.

    // Actually, let's use Overpass for bounding box if available, but let's stick to a simple Nominatim search for now.
    // Nominatim isn't great for "radius", but we can search by city if 'address' was provided.
    // However, `nearbyHospitals` receives lat/lng.

    // Better approach for this demo: 
    // 1. Reverse geocode lat/lng to get city.
    // 2. Search for "hospital in [city]".

    try {
        // Reverse geocode
        const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        const reverseRes = await fetch(reverseUrl, { headers: HEADERS });
        const reverseData = await reverseRes.json();

        const city = reverseData.address?.city || reverseData.address?.town || reverseData.address?.village || reverseData.address?.county;

        if (!city) return { results: [] };

        // Search hospitals in city
        const searchUrl = `${NOMINATIM_BASE}?q=hospital in ${encodeURIComponent(city)}&format=json&limit=10`;
        const searchRes = await fetch(searchUrl, { headers: HEADERS });
        const places = await searchRes.json();

        // Map to Google-like format to minimize frontend breakage
        const results = places.map(p => ({
            name: p.display_name.split(',')[0],
            vicinity: p.display_name,
            geometry: {
                location: {
                    lat: parseFloat(p.lat),
                    lng: parseFloat(p.lon)
                }
            },
            rating: (Math.random() * 1.5 + 3.5).toFixed(1) // Mock rating as OSM doesn't have it
        }));

        return { results };
    } catch (e) {
        console.error('OSM Nearby Error:', e);
        return { results: [] };
    }
}

async function geocodeAddress({ address }) {
    try {
        const url = `${NOMINATIM_BASE}?q=${encodeURIComponent(address)}&format=json&limit=1`;
        const res = await fetch(url, { headers: HEADERS });
        const data = await res.json();

        if (data && data.length > 0) {
            const p = data[0];
            return {
                results: [{
                    geometry: {
                        location: {
                            lat: parseFloat(p.lat),
                            lng: parseFloat(p.lon)
                        }
                    }
                }]
            };
        }
        return { results: [] };
    } catch (e) {
        console.error('OSM Geocode Error:', e);
        return { results: [] };
    }
}

module.exports = { nearbyHospitals, geocodeAddress };
