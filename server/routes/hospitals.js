const express = require('express');
const router = express.Router();
const { nearbyHospitals, geocodeAddress } = require('../services/google');

const { Hospital } = require('../models');
const { Op } = require('sequelize');

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const data = await nearbyHospitals({ lat, lng, radius, key: process.env.GOOGLE_API_KEY });
    res.json({ results: data.results });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
  }
});

// Local search endpoint
router.get('/search', async (req, res) => {
  try {
    const { query, city, specialty } = req.query;
    const where = {};

    if (query) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { services: { [Op.like]: `%${query}%` } }
      ];
    }

    if (city) {
      where.city = city;
    }

    if (specialty) {
      where.services = { [Op.like]: `%${specialty}%` };
    }

    const hospitals = await Hospital.findAll({ where });
    res.json(hospitals);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
