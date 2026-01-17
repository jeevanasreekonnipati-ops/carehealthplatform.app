const express = require('express');
const router = express.Router();
const db = require('../models');
const { Doctor, Op } = db;

// Get all doctors with filters
router.get('/', async (req, res) => {
    try {
        const { specialty, query } = req.query;
        const where = {};

        if (specialty) {
            where.specialization = specialty;
        }

        if (query) {
            where.name = { [Op.like]: `%${query}%` };
        }

        const doctors = await Doctor.findAll({ where });

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

// Seed Doctors (Dev helper)
router.get('/seed', async (req, res) => {
    const seeds = [
        {
            name: "Dr. Sarah Smith",
            specialization: "Cardiology",
            experience: 12,
            fees: 150,
            bio: "Expert cardiologist with over a decade of experience in heart failure and transplants.",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            availableDays: JSON.stringify(["Mon", "Tue", "Thu"]),
            rating: 4.9
        },
        {
            name: "Dr. James Wilson",
            specialization: "Pediatrics",
            experience: 8,
            fees: 100,
            bio: "Friendly pediatrician known for making kids smile while treating them.",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            availableDays: JSON.stringify(["Mon", "Wed", "Fri"]),
            rating: 4.7
        },
        {
            name: "Dr. Emily Chen",
            specialization: "Neurology",
            experience: 15,
            fees: 200,
            bio: "Specialist in treating migraines and neurological disorders.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            availableDays: JSON.stringify(["Tue", "Thu", "Sat"]),
            rating: 4.8
        },
        {
            name: "Dr. Michael Ross",
            specialization: "Orthopedics",
            experience: 20,
            fees: 180,
            bio: "Senior orthopedic surgeon specializing in sports injuries.",
            image: "https://randomuser.me/api/portraits/men/85.jpg",
            availableDays: JSON.stringify(["Mon", "Wed", "Fri"]),
            rating: 4.6
        }
    ];

    await Doctor.bulkCreate(seeds);
    res.send('Doctors seeded!');
});

module.exports = router;
