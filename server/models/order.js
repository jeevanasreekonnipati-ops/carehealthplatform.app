const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
        }
    }

    Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        prescriptionImage: {
            type: DataTypes.STRING // Path to uploaded prescription if needed
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Orders'
    });

    return Order;
};
