const { User, Doctor, Hospital, Medicine, Vital } = require('../models');

async function seed() {
    try {
        console.log('Starting database seeding...');

        // 1. Create Test User
        let testUser = await User.findOne({ where: { email: 'test@example.com' } });
        if (!testUser) {
            testUser = await User.create({
                name: 'Test Patient',
                email: 'test@example.com',
                password: 'password123',
                role: 'patient'
            });
            console.log('✅ Test user created: test@example.com / password123');
        }

        // 2. Seed Vitals for Test User
        const vitalCount = await Vital.count({ where: { userId: testUser.id } });
        if (vitalCount === 0) {
            const now = new Date();
            const vitalData = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(now);
                date.setDate(date.getDate() - (6 - i));
                vitalData.push({
                    userId: testUser.id,
                    type: 'heart_rate',
                    value: 70 + Math.floor(Math.random() * 15),
                    unit: 'bpm',
                    recordedAt: date
                });
            }
            await Vital.bulkCreate(vitalData);
            console.log('✅ Vitals seeded for test user');
        }

        // 3. Seed Doctors
        const doctorCount = await Doctor.count();
        if (doctorCount <= 5) { // If only initial seed exists or empty
            await Doctor.bulkCreate([
                {
                    name: "Dr. S. Anwar Basha",
                    specialization: "General Surgery",
                    experience: 15,
                    fees: 500,
                    bio: "Highly experienced General Surgeon specializing in advanced laparoscopic and gastrointestinal surgeries in Tirupati.",
                    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
                    availableDays: JSON.stringify(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
                    rating: 4.8
                },
                {
                    name: "Dr. Harshita Reddy G",
                    specialization: "General Medicine",
                    experience: 11,
                    fees: 400,
                    bio: "General Physician and Diabetologist specializing in diabetes management, hypertension, and infectious diseases at The Family Tree Clinics.",
                    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
                    availableDays: JSON.stringify(["Mon", "Tue", "Wed", "Thu", "Fri"]),
                    rating: 4.9
                },
                {
                    name: "Dr. Prathap Kumar Kukkapalli",
                    specialization: "ENT Specialist",
                    experience: 13,
                    fees: 450,
                    bio: "Expert ENT Specialist practicing at Sri Siddharth ENT Hospital, providing comprehensive ear, nose, and throat care.",
                    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
                    availableDays: JSON.stringify(["Mon", "Wed", "Fri", "Sat"]),
                    rating: 4.8
                },
                {
                    name: "Dr. Tejovathi G S",
                    specialization: "Dermatology",
                    experience: 14,
                    fees: 500,
                    bio: "Leading Dermatologist at Surya Skin And Hair Hospital, specializing in clinical dermatology and advanced hair treatments.",
                    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
                    availableDays: JSON.stringify(["Tue", "Thu", "Sat"]),
                    rating: 4.7
                },
                {
                    name: "Dr. Adhikari Gauthami",
                    specialization: "Pediatrics",
                    experience: 20,
                    fees: 450,
                    bio: "Senior Pediatrician with two decades of experience in child healthcare and neonatal specialist care.",
                    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f0871?w=400&q=80",
                    availableDays: JSON.stringify(["Mon", "Tue", "Thu", "Fri"]),
                    rating: 4.9
                },
                {
                    name: "Dr. V. Sunanda Kumar Reddy",
                    specialization: "Orthopedics",
                    experience: 18,
                    fees: 600,
                    bio: "Senior Consultant Orthopedic Surgeon at Aster Narayanadri Hospital, expert in joint replacements and trauma surgery.",
                    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
                    availableDays: JSON.stringify(["Mon", "Wed", "Fri"]),
                    rating: 4.8
                },
                {
                    name: "Dr. Devika P",
                    specialization: "Ophthalmology",
                    experience: 15,
                    fees: 350,
                    bio: "Highly skilled Ophthalmologist at Dr. Agarwals Eye Hospital, specializing in cataract surgery and refractive errors.",
                    image: "https://images.unsplash.com/photo-1594824488132-d4e565219a11?w=400&q=80",
                    availableDays: JSON.stringify(["Tue", "Wed", "Thu", "Sat"]),
                    rating: 4.7
                }
            ]);
            console.log('✅ Expanded real-time Tirupati doctors added');
        }

        // 4. Seed Medicines
        const medicineCount = await Medicine.count();
        if (medicineCount <= 4) {
            const categories = [
                { name: 'Pain Relief', items: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Diclofenac Gel', 'Naproxen 250mg', 'Aspirin 75mg', 'Tramadol 50mg', 'Mefenamic Acid', 'Aceclofenac 100mg', 'Etoricoxib 90mg', 'Ketorolac'], image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
                { name: 'Antibiotics', items: ['Amoxicillin 250mg', 'Azithromycin 500mg', 'Ciprofloxacin 500mg', 'Doxycycline 100mg', 'Cefixime 200mg', 'Ofloxacin 200mg', 'Clindamycin 300mg', 'Metronidazole 400mg', 'Levofloxacin', 'Erythromycin'], image: 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?w=400&q=80' },
                { name: 'Supplements', items: ['Vitamin C 1000mg', 'Multivitamin Gold', 'Vitamin D3 60K', 'B-Complex with B12', 'Zinc 50mg', 'Iron & Folic Acid', 'Omega-3 Fish Oil', 'Calcium + D3', 'Magnesium 400mg', 'Biotin 5000mcg'], image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400&q=80' },
                { name: 'Cold & Flu', items: ['Cough Syrup (Dry)', 'Cough Syrup (Wet)', 'Cetirizine 10mg', 'Loratadine 10mg', 'VapoRub', 'Nasal Decongestant', 'Levocetirizine', 'Montelukast 10mg', 'Fexofenadine 120mg', 'Bromhexine'], image: 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=400&q=80' },
                { name: 'Stomach Care', items: ['Pantoprazole 40mg', 'Omeprazole 20mg', 'Antacid Syrup', 'Ranitidine 150mg', 'Domperidone 10mg', 'Loperamide 2mg', 'ORS Sachet', 'Digestive Enzymes', 'Rabeprazole 20mg', 'Sucralfate Syrup'], image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80' },
                { name: 'Heart & BP', items: ['Amlodipine 5mg', 'Telmisartan 40mg', 'Atorvastatin 10mg', 'Metoprolol 25mg', 'Ramipril 5mg', 'Losartan 50mg', 'Rosuvastatin 10mg', 'Clopidogrel 75mg', 'Bisoprolol 5mg', 'Enalapril 5mg'], image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80' },
                { name: 'Diabetes', items: ['Metformin 500mg', 'Glimepiride 2mg', 'Sitagliptin 100mg', 'Vildagliptin 50mg', 'Daonil 5mg', 'Teneligliptin 20mg', 'Pioglitazone 15mg', 'Gliclazide 60mg', 'Acarbose 50mg', 'Linagliptin 5mg'], image: 'https://images.unsplash.com/photo-1550572017-ed20015ade7a?w=400&q=80' },
                { name: 'Skin Care', items: ['Betadine Ointment', 'Clotrimazole Cream', 'Hydrocortisone', 'Mupirocin Ointment', 'Ketoconazole Shampoo', 'Salicylic Acid Gel', 'Permethrin Lotion', 'Aloe Vera Gel', 'Calamine Lotion', 'Benzoyl Peroxide'], image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80' },
                { name: 'Eye & Ear', items: ['Ciprofloxacin Eye Drops', 'Tear Substitute', 'Ofloxacin Ear Drops', 'Timolol Eye Drops', 'Lubricating Eye Gel', 'Wax Dissolver Drops', 'Moxifloxacin Eye Drops', 'Antihistamine Eye Drops', 'Steroid Eye Drops', 'Gentamicin Drops'], image: 'https://images.unsplash.com/photo-1616763355614-4c6700255c65?w=400&q=80' }
            ];

            const medicineData = [];
            let itemCounter = 0;

            categories.forEach(cat => {
                cat.items.forEach((itemName, index) => {
                    itemCounter++;
                    medicineData.push({
                        name: itemName,
                        price: (Math.random() * 20 + 5).toFixed(2),
                        description: `Effective ${itemName} for ${cat.name.toLowerCase()} management.`,
                        category: cat.name,
                        stock: Math.floor(Math.random() * 100) + 20,
                        image: cat.image,
                        requiresPrescription: cat.name === 'Antibiotics' || cat.name === 'Heart & BP' || cat.name === 'Diabetes'
                    });
                });
            });

            await Medicine.bulkCreate(medicineData);
            console.log(`✅ ${medicineData.length} Medicines seeded across ${categories.length} categories.`);
        }

        // 5. Seed Hospitals
        const hospitalCount = await Hospital.count();
        if (hospitalCount <= 2) {
            await Hospital.bulkCreate([
                { name: 'SVIMS Hospital', address: 'Alipiri Road', city: 'Tirupati', latitude: 13.6373, longitude: 79.4063, services: 'Specialized Tertiary Care, Cardiac, Oncology, Nephrology', rating: 4.8, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
                { name: 'Apollo Hospitals Tirupati', address: 'Renigunta Road', city: 'Tirupati', latitude: 13.6262, longitude: 79.4323, services: 'Multi-specialty, 24/7 Emergency, Pharmacy', rating: 4.6, image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400' },
                { name: 'Amara Hospital', address: 'Karakambadi Road', city: 'Tirupati', latitude: 13.6500, longitude: 79.4500, services: 'Orthopedics, Pediatrics, General Medicine', rating: 4.7, image: 'https://images.unsplash.com/photo-1586773860418-d319a39855df?w=400' }
            ]);
            console.log('✅ Tirupati hospitals added');
        }

        console.log('🚀 All systems go! Seeding completed.');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

module.exports = seed;
