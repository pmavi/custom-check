const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Users = require("./Users");

const BuyLinks = sequelize.define(
    "buy_links",
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
        buy_link_token: Sq.TEXT,
        product_ids: {
            type: Sq.ARRAY(Sq.TEXT),
            defaultValue: null,
        },
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
module.exports = BuyLinks;

BuyLinks.belongsTo(Users, {
    foreignKey: "user_id",
});