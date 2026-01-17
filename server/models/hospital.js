const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Hospital extends Model { }

    Hospital.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
        latitude: {
            type: DataTypes.FLOAT
        },
        longitude: {
            type: DataTypes.FLOAT
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        totalRatings: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        openingHours: {
            type: DataTypes.STRING // Storing as JSON string or simple text for now
        },
        services: {
            type: DataTypes.TEXT // JSON string or comma separated
        },
        emergencyContacts: {
            type: DataTypes.STRING
        },
        website: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        insuranceAccepted: {
            type: DataTypes.TEXT // JSON string
        }
    }, {
        sequelize,
        modelName: 'Hospital',
        tableName: 'Hospitals'
    });

    return Hospital;
};
