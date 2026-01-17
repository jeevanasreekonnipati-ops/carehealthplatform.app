const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        validPassword(password) {
            if (!this.password) return false;
            return bcrypt.compareSync(password, this.password);
        }

        static hashPassword(password) {
            return bcrypt.hashSync(password, 10);
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true // Null allowed for Google-only users
        },
        name: {
            type: DataTypes.STRING
        },
        photo: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'patient'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        hooks: {
            beforeCreate: (user) => {
                if (user.password) {
                    user.password = User.hashPassword(user.password);
                }
            },
            beforeUpdate: (user) => {
                if (user.changed('password')) {
                    user.password = User.hashPassword(user.password);
                }
            }
        }
    });

    return User;
};
