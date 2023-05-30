const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Users = require("./Users");
const SubscriptionProducts = require("./SubscriptionProducts");

const SubscriptionPackage = sequelize.define(
    "subscription_packages",
    {
        id: {
            primaryKey: true,
            type: Sq.INTEGER,
            autoIncrement: true,
        },
        stript_object_id: Sq.STRING,
        stript_object_type: Sq.STRING,
        stript_object_description: {
            type: Sq.STRING,
            defaultValue: null,
        },
        subscription_product_id: Sq.INTEGER,
        package_name: Sq.STRING,
        package_description: Sq.STRING,
        billing_cycle: Sq.ENUM("month", "year"),
        price: Sq.INTEGER,
        freetrail_days: Sq.INTEGER,
        is_active: {
            type: Sq.BOOLEAN,
            defaultValue: true,
        },
        created_by: Sq.INTEGER,
        updated_by: Sq.INTEGER,
        deleted_by: Sq.INTEGER,
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);
module.exports = SubscriptionPackage;

// SubscriptionPackage.belongsTo(SubscriptionProducts, {
// foreignKey: "subscription_product_id",
// });

SubscriptionPackage.belongsTo(Users, {
    foreignKey: "created_by",
});

SubscriptionPackage.belongsTo(Users, {
    foreignKey: "updated_by",
});

SubscriptionPackage.belongsTo(Users, {
    foreignKey: "deleted_by",
});