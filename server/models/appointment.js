const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        static associate(models) {
            Appointment.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
            Appointment.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        }
    }

    Appointment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'pending'
        },
        notes: {
            type: DataTypes.TEXT
        },
        type: {
            type: DataTypes.ENUM('in-person', 'video'),
            defaultValue: 'in-person'
        }
    }, {
        sequelize,
        modelName: 'Appointment',
        tableName: 'Appointments'
    });

    return Appointment;
};
