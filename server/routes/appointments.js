const express = require('express');
const router = express.Router();
const { Appointment, Doctor, User } = require('../models');
const { requireAuth } = require('../middleware/auth');

// Get my appointments
router.get('/my', requireAuth, async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { userId: req.user.id },
            include: [{ model: Doctor, as: 'doctor' }],
            order: [['date', 'ASC']]
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Book appointment
router.post('/book', requireAuth, async (req, res) => {
    try {
        const { doctorId, date, time, type, notes } = req.body;

        // Combine date/time
        const appointmentDate = new Date(`${date}T${time}`);

        const appointment = await Appointment.create({
            userId: req.user.id,
            doctorId,
            date: appointmentDate,
            type: type || 'in-person',
            notes,
            status: 'confirmed' // Auto-confirm for now
        });

        res.json({ success: true, appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// Cancel appointment
router.post('/:id/cancel', requireAuth, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

module.exports = router;
