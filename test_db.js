try {
    const db = require('./server/database');
    console.log('Database loaded successfully');
} catch (error) {
    console.error('Error loading database:', error);
}
