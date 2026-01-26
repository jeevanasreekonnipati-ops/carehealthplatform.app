const express = require('express');
const router = express.Router();
const { nearbyHospitals, geocodeAddress } = require('../services/osm');
const { getHospitals } = require('../database');

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const data = await nearbyHospitals({ lat, lng, radius });
    res.json({ results: data.results });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
  }
});

// Local search endpoint
router.get('/search', async (req, res) => {
  try {
    const { query, city, specialty } = req.query;

    // Firestore simple filtering
    let hospitals = await getHospitals({ city });

    if (query || specialty) {
      const q = (query || specialty).toLowerCase();
      hospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(q) ||
        (h.services && h.services.toLowerCase().includes(q))
      );
    }

    res.json(hospitals);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const data = await geocodeAddress({ address });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

module.exports = router;
