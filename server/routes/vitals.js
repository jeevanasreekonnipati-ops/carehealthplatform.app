const express = require('express');
const router = express.Router();
const { Vital } = require('../models');
const { requireAuth } = require('../middleware/auth');

// Get vitals history
router.get('/', requireAuth, async (req, res) => {
    try {
        const vitals = await Vital.findAll({
            where: { userId: req.user.id },
            order: [['recordedAt', 'ASC']]
        });
        res.json(vitals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vitals' });
    }
});

// Add vital reading
router.post('/', requireAuth, async (req, res) => {
    try {
        const { type, value, unit } = req.body;

        const vital = await Vital.create({
            userId: req.user.id,
            type,
            value,
            unit,
            recordedAt: new Date()
        });

        res.json({ success: true, vital });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save vital' });
    }
});

module.exports = router;
