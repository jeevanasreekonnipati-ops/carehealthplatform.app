const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Hospital = require('./hospital')(sequelize, Sequelize.DataTypes);
const Doctor = require('./doctor')(sequelize, Sequelize.DataTypes);
const Appointment = require('./appointment')(sequelize, Sequelize.DataTypes);
const Vital = require('./vital')(sequelize, Sequelize.DataTypes);
const Medicine = require('./medicine')(sequelize, Sequelize.DataTypes);
const Order = require('./order')(sequelize, Sequelize.DataTypes);
const OrderItem = require('./orderItem')(sequelize, Sequelize.DataTypes);

db.User = User;
db.Hospital = Hospital;
db.Doctor = Doctor;
db.Appointment = Appointment;
db.Vital = Vital;
db.Medicine = Medicine;
db.Order = Order;
db.OrderItem = OrderItem;

// Associations
if (db.Appointment.associate) db.Appointment.associate(db);
if (db.Vital.associate) db.Vital.associate(db);
if (db.Order.associate) db.Order.associate(db);
if (db.OrderItem.associate) db.OrderItem.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

module.exports = db;
