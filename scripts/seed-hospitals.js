const db = require('../server/models');

const hospitals = [
    {
        name: "City General Hospital",
        address: "123 Main St",
        city: "Metropolis",
        state: "NY",
        zip: "10001",
        latitude: 40.7128,
        longitude: -74.0060,
        rating: 4.5,
        totalRatings: 150,
        openingHours: "24/7",
        services: "Emergency, Surgery, Pediatrics, Cardiology",
        totalBeds: 500,
        availableBeds: 45,
        insuranceAccepted: JSON.stringify(["Aetna", "BlueCross", "Medicare"])
    },
    {
        name: "Heart & Vascular Institute",
        address: "456 Oak Ave",
        city: "Metropolis",
        state: "NY",
        zip: "10002",
        latitude: 40.7282,
        longitude: -73.9942,
        rating: 4.8,
        totalRatings: 320,
        openingHours: "8:00 AM - 8:00 PM",
        services: "Cardiology, Vascular Surgery",
        totalBeds: 100,
        availableBeds: 12,
        insuranceAccepted: JSON.stringify(["Aetna", "Cigna", "UnitedHealthcare"])
    },
    {
        name: "Community Health Center",
        address: "789 Pine Ln",
        city: "Smallville",
        state: "KS",
        zip: "66002",
        latitude: 39.0997,
        longitude: -94.5786,
        rating: 3.9,
        totalRatings: 50,
        openingHours: "9:00 AM - 5:00 PM",
        services: "General Practice, Pediatrics",
        totalBeds: 50,
        availableBeds: 30,
        insuranceAccepted: JSON.stringify(["Medicaid", "Medicare"])
    }
];

const seed = async () => {
    try {
        // Sync first to ensure tables exist
        await db.sequelize.sync();

        // Check if hospitals exist
        const count = await db.Hospital.count();
        if (count === 0) {
            await db.Hospital.bulkCreate(hospitals);
            console.log('Hospitals seeded successfully.');
        } else {
            console.log('Hospitals already exist. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await db.sequelize.close();
    }
};

seed();
