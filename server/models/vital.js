const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vital extends Model {
        static associate(models) {
            Vital.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }

    Vital.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING, // 'heart_rate', 'bp_systolic', 'bp_diastolic', 'weight', 'glucose'
            allowNull: false
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING
        },
        recordedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Vital',
        tableName: 'Vitals'
    });

    return Vital;
};
