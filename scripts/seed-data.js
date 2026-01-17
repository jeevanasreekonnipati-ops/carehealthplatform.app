const { Sequelize } = require('sequelize');
const { User, Doctor, Medicine, Appointment, Order, OrderItem, sequelize } = require('../server/models');

const doctors = [
    {
        name: 'Dr. Sarah Wilson',
        specialization: 'Cardiology',
        experience: 15,
        fees: 150,
        bio: 'Senior Cardiologist with over 15 years of experience in treating complex heart conditions. specialized in interventional cardiology.',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 4.9,
        availableDays: 'Mon,Wed,Fri'
    },
    {
        name: 'Dr. James Chen',
        specialization: 'Pediatrics',
        experience: 10,
        fees: 100,
        bio: 'Friendly and compassionate pediatrician. Expert in child development and pediatric nutrition.',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        availableDays: 'Tue,Thu,Sat'
    },
    {
        name: 'Dr. Emily Rodriguez',
        specialization: 'Neurology',
        experience: 12,
        fees: 180,
        bio: 'Specialist in treating migraines, epilepsy, and other neurological disorders. dedicated to patient-centered care.',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.7,
        availableDays: 'Mon,Tue,Thu'
    },
    {
        name: 'Dr. Michael Chang',
        specialization: 'Orthopedics',
        experience: 20,
        fees: 200,
        bio: 'Expert orthopedic surgeon specializing in joint replacement and sports injuries.',
        image: 'https://randomuser.me/api/portraits/men/85.jpg',
        rating: 4.9,
        availableDays: 'Wed,Fri'
    },
    {
        name: 'Dr. Anita Patel',
        specialization: 'General Medicine',
        experience: 8,
        fees: 80,
        bio: 'Dedicated general practitioner focusing on preventive care and chronic disease management.',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        rating: 4.6,
        availableDays: 'Mon,Tue,Wed,Thu,Fri'
    },
    {
        name: 'Dr. Robert Fox',
        specialization: 'Dermatology',
        experience: 14,
        fees: 130,
        bio: 'Board-certified dermatologist specializing in cosmetic and medical dermatology.',
        image: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 4.8,
        availableDays: 'Tue,Thu'
    },
    {
        name: 'Dr. Lisa Wong',
        specialization: 'Gynecology',
        experience: 18,
        fees: 160,
        bio: 'Experienced gynecologist providing comprehensive women\'s health services.',
        image: 'https://randomuser.me/api/portraits/women/55.jpg',
        rating: 4.9,
        availableDays: 'Mon,Wed,Fri'
    },
    {
        name: 'Dr. David Kim',
        specialization: 'Psychiatry',
        experience: 11,
        fees: 140,
        bio: 'Compassionate psychiatrist helping patients manage mental health challenges with therapy and medication.',
        image: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 4.7,
        availableDays: 'Tue,Thu,Sat'
    }
];

const medicines = [
    {
        name: 'Paracetamol 500mg',
        description: 'Effective pain reliever and fever reducer.',
        price: 5.00,
        stock: 500,
        category: 'Pain Relief',
        image: 'https://via.placeholder.com/150?text=Paracetamol',
        requiresPrescription: false
    },
    {
        name: 'Aspirin 75mg',
        description: 'Anti-inflammatory and blood thinner used to prevent heart attacks.',
        price: 8.50,
        stock: 200,
        category: 'Heart Health',
        image: 'https://via.placeholder.com/150?text=Aspirin',
        requiresPrescription: true
    },
    {
        name: 'Amoxicillin 500mg',
        description: 'Antibiotic used to treat bacterial infections.',
        price: 15.00,
        stock: 100,
        category: 'Antibiotics',
        image: 'https://via.placeholder.com/150?text=Amoxicillin',
        requiresPrescription: true
    },
    {
        name: 'Vitamin C 1000mg',
        description: 'Immunity booster dietary supplement.',
        price: 12.00,
        stock: 300,
        category: 'Supplements',
        image: 'https://via.placeholder.com/150?text=Vit+C',
        requiresPrescription: false
    },
    {
        name: 'Cough Syrup',
        description: 'Relief from dry and chesty coughs.',
        price: 9.99,
        stock: 150,
        category: 'Cold & Flu',
        image: 'https://via.placeholder.com/150?text=Cough+Syrup',
        requiresPrescription: false
    },
    {
        name: 'Ibuprofen 400mg',
        description: 'Non-steroidal anti-inflammatory drug (NSAID) for pain relief.',
        price: 7.50,
        stock: 400,
        category: 'Pain Relief',
        image: 'https://via.placeholder.com/150?text=Ibuprofen',
        requiresPrescription: false
    },
    {
        name: 'Metformin 500mg',
        description: 'First-line medication for the treatment of type 2 diabetes.',
        price: 10.00,
        stock: 250,
        category: 'Diabetes',
        image: 'https://via.placeholder.com/150?text=Metformin',
        requiresPrescription: true
    },
    {
        name: 'Atorvastatin 20mg',
        description: 'Statin medication used to prevent cardiovascular disease.',
        price: 18.00,
        stock: 180,
        category: 'Heart Health',
        image: 'https://via.placeholder.com/150?text=Atorvastatin',
        requiresPrescription: true
    },
    {
        name: 'Cetirizine 10mg',
        description: 'Antihistamine used to relieve allergy symptoms.',
        price: 6.00,
        stock: 350,
        category: 'Allergies',
        image: 'https://via.placeholder.com/150?text=Cetirizine',
        requiresPrescription: false
    },
    {
        name: 'Multivitamin Complex',
        description: 'Daily supplement for overall health and vitality.',
        price: 25.00,
        stock: 120,
        category: 'Supplements',
        image: 'https://via.placeholder.com/150?text=Multivitamin',
        requiresPrescription: false
    }
];

async function seedData() {
    try {
        await sequelize.sync();
        console.log('Database synced.');

        // 1. Seed Doctors
        console.log('Seeding Doctors...');
        for (const doc of doctors) {
            await Doctor.findOrCreate({ where: { name: doc.name }, defaults: doc });
        }
        console.log('✅ Doctors seeded.');

        // 2. Seed Medicines
        console.log('Seeding Medicines...');
        for (const med of medicines) {
            await Medicine.findOrCreate({ where: { name: med.name }, defaults: med });
        }
        console.log('✅ Medicines seeded.');

        // 3. Seed Test User Data (Appointments & Orders)
        const testUserEmail = 'test@example.com';
        const user = await User.findOne({ where: { email: testUserEmail } });

        if (user) {
            console.log(`Seeding data for test user: ${testUserEmail}...`);

            // Seed Appointment
            const doc = await Doctor.findOne();
            if (doc) {
                await Appointment.findOrCreate({
                    where: {
                        UserId: user.id,
                        DoctorId: doc.id,
                        date: new Date().toISOString().split('T')[0]
                    },
                    defaults: {
                        time: '10:00',
                        status: 'confirmed',
                        type: 'video',
                        notes: 'Follow-up consultation'
                    }
                });
                console.log('✅ Test appointment created.');
            }

            // Seed Order
            const med1 = await Medicine.findOne({ where: { name: 'Paracetamol 500mg' } });
            const med2 = await Medicine.findOne({ where: { name: 'Vitamin C 1000mg' } });

            if (med1 && med2) {
                // Check if pending order exists
                let order = await Order.findOne({ where: { UserId: user.id, status: 'pending' } });
                if (!order) {
                    order = await Order.create({
                        UserId: user.id,
                        totalAmount: med1.price + med2.price,
                        status: 'pending',
                        shippingAddress: '123 Test St, City'
                    });

                    await OrderItem.create({ OrderId: order.id, MedicineId: med1.id, quantity: 1, price: med1.price });
                    await OrderItem.create({ OrderId: order.id, MedicineId: med2.id, quantity: 1, price: med2.price });
                    console.log('✅ Test order created.');
                } else {
                    console.log('Test order already exists.');
                }
            }
        } else {
            console.log('⚠️ Test user not found. Run seed-users.js first.');
        }

        console.log('--------------------------------');
        console.log('🎉 Data Seeding Complete!');
        console.log('--------------------------------');

    } catch (error) {
        console.error('Error in seed script:', error);
    } finally {
        await sequelize.close();
    }
}

seedData();
