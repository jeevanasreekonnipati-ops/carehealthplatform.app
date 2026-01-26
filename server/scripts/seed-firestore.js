const { createUser, getHospitals, getDoctors, getMedicines } = require('../database');
const { db } = require('../firebase-config');

async function seedFirestore() {
    try {
        console.log('Starting Firestore seeding...');

        // 1. Create Test User
        const testEmail = 'test@example.com';
        const snapshot = await db.collection('users').where('email', '==', testEmail).limit(1).get();

        if (snapshot.empty) {
            await createUser({
                name: 'Test Patient',
                email: testEmail,
                password: 'password123',
                role: 'patient'
            });
            console.log('✅ Test user created in Firestore');
        }

        // 2. Seed Doctors
        const docSnapshot = await db.collection('doctors').limit(1).get();
        if (docSnapshot.empty) {
            const doctors = [
                {
                    name: "Dr. S. Anwar Basha",
                    specialization: "General Surgery",
                    experience: 15,
                    fees: 500,
                    bio: "Highly experienced General Surgeon specializing in advanced laparoscopic and gastrointestinal surgeries in Tirupati.",
                    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
                    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    rating: 4.8
                },
                {
                    name: "Dr. Harshita Reddy G",
                    specialization: "General Medicine",
                    experience: 11,
                    fees: 400,
                    bio: "General Physician and Diabetologist specializing in diabetes management, hypertension, and infectious diseases at The Family Tree Clinics.",
                    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
                    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                    rating: 4.9
                },
                {
                    name: "Dr. Prathap Kumar Kukkapalli",
                    specialization: "ENT Specialist",
                    experience: 13,
                    fees: 450,
                    bio: "Expert ENT Specialist practicing at Sri Siddharth ENT Hospital, providing comprehensive ear, nose, and throat care.",
                    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
                    availableDays: ["Mon", "Wed", "Fri", "Sat"],
                    rating: 4.8
                }
                // Add more if needed, but keeping it small for seeding test
            ];

            for (const doc of doctors) {
                await db.collection('doctors').add(doc);
            }
            console.log('✅ Doctors seeded in Firestore');
        }

        // 3. Seed Medicines
        const medSnapshot = await db.collection('medicines').limit(1).get();
        if (medSnapshot.empty) {
            const medicines = [
                {
                    name: 'Paracetamol 500mg',
                    price: 15.50,
                    description: 'Effective for pain relief and fever.',
                    category: 'Pain Relief',
                    stock: 100,
                    image: 'https://plus.unsplash.com/premium_photo-1668487826871-3315a013ad46?w=400&q=80',
                    requiresPrescription: false
                },
                {
                    name: 'Amoxicillin 250mg',
                    price: 45.00,
                    description: 'Broad-spectrum antibiotic.',
                    category: 'Antibiotics',
                    stock: 50,
                    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
                    requiresPrescription: true
                }
            ];

            for (const med of medicines) {
                await db.collection('medicines').add(med);
            }
            console.log('✅ Medicines seeded in Firestore');
        }

        // 4. Seed Hospitals
        const hospSnapshot = await db.collection('hospitals').limit(1).get();
        if (hospSnapshot.empty) {
            const hospitals = [
                { name: 'SVIMS Hospital', address: 'Alipiri Road', city: 'Tirupati', latitude: 13.6373, longitude: 79.4063, services: 'Specialized Tertiary Care, Cardiac, Oncology, Nephrology', rating: 4.8, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
                { name: 'Apollo Hospitals Tirupati', address: 'Renigunta Road', city: 'Tirupati', latitude: 13.6262, longitude: 79.4323, services: 'Multi-specialty, 24/7 Emergency, Pharmacy', rating: 4.6, image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400' }
            ];

            for (const hosp of hospitals) {
                await db.collection('hospitals').add(hosp);
            }
            console.log('✅ Hospitals seeded in Firestore');
        }

        console.log('🚀 Firestore seeding completed.');
    } catch (error) {
        console.error('❌ Firestore seeding failed:', error);
    }
}

if (require.main === module) {
    seedFirestore().then(() => process.exit(0));
}

module.exports = seedFirestore;
