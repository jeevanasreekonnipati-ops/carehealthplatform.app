const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
            OrderItem.belongsTo(models.Medicine, { foreignKey: 'medicineId', as: 'medicine' });
        }
    }

    OrderItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.FLOAT, // Snapshot of price at purchase time
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'OrderItems'
    });

    return OrderItem;
};
