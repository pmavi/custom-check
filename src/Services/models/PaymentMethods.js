const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Users = require("./Users");

const PaymentMethods = sequelize.define(
    "payment_methods",
    {
        id: {
            primaryKey: true,
            type: Sq.INTEGER,
            autoIncrement: true,
        },
        user_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "users",
            },
        },
        store_id: {
            type: Sq.UUID,
            references: {
                key: "id",
                model: "stores",
            },
        },
        method_name: Sq.STRING,
        publishable_key: Sq.TEXT,
        secret: Sq.TEXT,
        status: {
            type: Sq.BOOLEAN,
            defaultValue: true,
        },
        created_by: Sq.INTEGER,
        updated_by: Sq.INTEGER,
        deleted_by: Sq.INTEGER,
    },
    {
        paranoid: false,
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);
module.exports = PaymentMethods;

PaymentMethods.belongsTo(Users, {
    foreignKey: "user_id",
});