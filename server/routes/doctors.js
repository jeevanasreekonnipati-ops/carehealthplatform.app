const express = require('express');
const router = express.Router();
const { getDoctors } = require('../database');

// Get all doctors with filters
router.get('/', async (req, res) => {
    try {
        const { specialty, query } = req.query;

        const doctors = await getDoctors({ specialty, query });

        // If requesting JSON (AJAX), return JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(doctors);
        }

        // Otherwise render view
        res.render('doctors', { doctors, user: req.user, query, specialty });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
