const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GOOGLE_BASE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const GEOCODE_BASE = 'https://maps.googleapis.com/maps/api/geocode/json';

async function nearbyHospitals({ lat, lng, radius = 5000, key }) {
  const url = `${GOOGLE_BASE}?location=${lat},${lng}&radius=${radius}&type=hospital&key=${key}`;
  const res = await fetch(url);
  return res.json();
}

async function geocodeAddress({ address, key }) {
  const url = `${GEOCODE_BASE}?address=${encodeURIComponent(address)}&key=${key}`;
  const res = await fetch(url);
  return res.json();
}

module.exports = { nearbyHospitals, geocodeAddress };
