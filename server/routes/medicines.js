const express = require('express');
const router = express.Router();
const db = require('../models');
const { Medicine, Op } = db;

// Get Catalog (API or View)
router.get('/', async (req, res) => {
    try {
        const { query, category } = req.query;
        const where = {};

        if (query) {
            where.name = { [Op.like]: `%${query}%` };
        }
        if (category) {
            where.category = category;
        }

        const medicines = await Medicine.findAll({ where });

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

// Seed Medicines (Dev)
router.get('/seed', async (req, res) => {
    const seeds = [
        {
            name: "Paracetamol 500mg",
            description: "Effective for fever and mild pain relief.",
            price: 5.00,
            stock: 100,
            category: "Pain Relief",
            image: "https://via.placeholder.com/150?text=Paracetamol",
            requiresPrescription: false
        },
        {
            name: "Amoxicillin 250mg",
            description: "Antibiotic for treating bacterial infections.",
            price: 12.50,
            stock: 50,
            category: "Antibiotics",
            image: "https://via.placeholder.com/150?text=Amoxicillin",
            requiresPrescription: true
        },
        {
            name: "Vitamin C Supplements",
            description: "Immunity booster tablets.",
            price: 8.00,
            stock: 200,
            category: "Supplements",
            image: "https://via.placeholder.com/150?text=Vitamin+C",
            requiresPrescription: false
        },
        {
            name: "Cough Syrup",
            description: "Relief from dry and wet cough.",
            price: 6.50,
            stock: 80,
            category: "Cold & Flu",
            image: "https://via.placeholder.com/150?text=Cough+Syrup",
            requiresPrescription: false
        },
        {
            name: "Ibuprofen 400mg",
            description: "Anti-inflammatory pain reliever.",
            price: 7.00,
            stock: 120,
            category: "Pain Relief",
            image: "https://via.placeholder.com/150?text=Ibuprofen",
            requiresPrescription: false
        }
    ];

    await Medicine.bulkCreate(seeds);
    res.send('Medicines seeded!');
});

module.exports = router;
