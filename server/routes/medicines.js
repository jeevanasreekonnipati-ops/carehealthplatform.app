const express = require('express');
const router = express.Router();
const { getMedicines } = require('../database');

// Get Catalog (API or View)
router.get('/', async (req, res) => {
    try {
        const { query, category } = req.query;

        const medicines = await getMedicines({ category, query });

        // AJAX support
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(medicines);
        }

        res.render('pharmacy', { medicines, user: req.user, query, category });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
