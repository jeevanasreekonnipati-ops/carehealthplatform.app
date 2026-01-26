const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        static associate(models) {
            Doctor.belongsTo(models.Hospital, { foreignKey: 'hospitalId', as: 'hospital' });
        }
    }

    Doctor.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fees: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        bio: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING, // URL or data URI
        },
        availableDays: {
            type: DataTypes.STRING, // JSON string e.g., ["Mon", "Wed", "Fri"]
            defaultValue: '[]'
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        hospitalId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Hospitals',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Doctor',
        tableName: 'Doctors'
    });

    return Doctor;
};
