const express = require('express');
const router = express.Router();
const { nearbyHospitals, geocodeAddress } = require('../services/google');

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const data = await nearbyHospitals({ lat, lng, radius, key: process.env.GOOGLE_API_KEY });
    res.json({ results: data.results });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const data = await geocodeAddress({ address, key: process.env.GOOGLE_API_KEY });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

module.exports = router;
