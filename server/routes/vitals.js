const express = require('express');
const router = express.Router();
const { getVitalsByUser, addVital } = require('../database');
const { requireAuth } = require('../middleware/auth');

// Get vitals history
router.get('/', requireAuth, async (req, res) => {
    try {
        const vitals = await getVitalsByUser(req.user.id);
        res.json(vitals);
    } catch (error) {
        console.error('Fetch vitals error:', error);
        res.status(500).json({ error: 'Failed to fetch vitals' });
    }
});

// Add vital reading
router.post('/', requireAuth, async (req, res) => {
    try {
        const { type, value, unit } = req.body;

        const vital = await addVital({
            userId: req.user.id,
            type,
            value,
            unit,
            recordedAt: new Date()
        });

        res.json({ success: true, vital });
    } catch (error) {
        console.error('Add vital error:', error);
        res.status(500).json({ error: 'Failed to save vital' });
    }
});

module.exports = router;
