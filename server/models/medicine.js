const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Medicine extends Model { }

    Medicine.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING
        },
        requiresPrescription: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Medicine',
        tableName: 'Medicines'
    });

    return Medicine;
};
