const db = require('../server/models');

const sync = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all models
        // force: true will drop the table if it already exists
        await db.sequelize.sync({ force: false, alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await db.sequelize.close();
    }
};

sync();
