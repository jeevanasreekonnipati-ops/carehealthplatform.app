const express = require('express');
const router = express.Router();
const { getAppointmentsByUser, createAppointment, cancelAppointment } = require('../database');
const { requireAuth } = require('../middleware/auth');

// Get my appointments
router.get('/my', requireAuth, async (req, res) => {
    try {
        const appointments = await getAppointmentsByUser(req.user.id);
        res.json(appointments);
    } catch (error) {
        console.error('Fetch appointments error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Book appointment
router.post('/book', requireAuth, async (req, res) => {
    try {
        const { doctorId, date, time, type, notes } = req.body;

        const appointmentDate = new Date(`${date}T${time}`);

        const appointment = await createAppointment({
            userId: req.user.id,
            doctorId,
            date: appointmentDate,
            type: type || 'in-person',
            notes,
            status: 'confirmed'
        });

        res.json({ success: true, appointment });
    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// Cancel appointment
router.post('/:id/cancel', requireAuth, async (req, res) => {
    try {
        await cancelAppointment(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

module.exports = router;
