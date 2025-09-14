'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_items', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'orders', key: 'id' },
                onDelete: 'CASCADE',
            },
            product_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'food_products', key: 'id' },
                onDelete: 'CASCADE',
            },
            quantity: { type: Sequelize.INTEGER, allowNull: false },
            price: { type: Sequelize.FLOAT, allowNull: false },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('order_items');
    },
};
