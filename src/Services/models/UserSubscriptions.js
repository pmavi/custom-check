const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Users = require("./Users");

const UserSubscriptions = sequelize.define(
    "user_subscriptions",
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
        subscription_package_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "subscription_packages",
            },
        },
        billing_id: {
            defaultValue: null,
            type: Sq.INTEGER,
        },
        billing_cycle: Sq.ENUM("month", "year"),
        start_date: Sq.DATE,
        end_date: Sq.DATE,
        created_by: Sq.INTEGER,
        updated_by: Sq.INTEGER,
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

module.exports = UserSubscriptions;

// UserSubscriptions.belongsTo(Users, {
//     as: "created_user",
//     foreignKey: "id",
//     sourceKey: "created_by",
// });