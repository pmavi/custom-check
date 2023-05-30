"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            first_name: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            last_name: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            email: {
                unique: true,
                type: Sequelize.STRING,
            },
            password: Sequelize.STRING,
            user_type: {
                defaultValue: "merchant",
                type: Sequelize.ENUM("admin", "merchant"),
            },
            avatar: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            email_verified_at: {
                defaultValue: null,
                type: Sequelize.DATE,
            },
            otp: {
                defaultValue: null,
                type: Sequelize.INTEGER,
            },
            reset_password_expires: {
                defaultValue: null,
                type: Sequelize.DATE,
            },
            user_status: {
                defaultValue: true,
                type: Sequelize.BOOLEAN,
            },
            stripe_customer_id: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            created_at: Sequelize.DATE,
            created_by: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "users",
                },
            },
            updated_at: Sequelize.DATE,
            updated_by: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "users",
                },
            },
            deleted_at: Sequelize.DATE,
            deleted_by: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "users",
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("users");
        await queryInterface.sequelize.query("DROP TYPE IF EXISTS public.enum_users_user_type");
    },
};