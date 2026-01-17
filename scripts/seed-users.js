const { User, sequelize } = require('../server/models');

async function seedUser() {
    try {
        await sequelize.sync(); // Ensure tables exist

        const email = 'test@example.com';
        const password = 'password123';
        const name = 'Test Patient';

        // Check if user exists
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            console.log('Test user already exists.');
            // Update password just in case
            existing.password = password; // Hook will hash it
            await existing.save();
            console.log('Password updated for existing user.');
        } else {
            await User.create({
                email,
                password, // Hook will hash it
                name,
                role: 'patient'
            });
            console.log('Test user created.');
        }

        console.log('--------------------------------');
        console.log('Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('--------------------------------');

    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        await sequelize.close();
    }
}

seedUser();
