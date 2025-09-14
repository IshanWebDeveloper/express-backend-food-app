'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cart_items', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            cart_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'carts', key: 'id' },
                onDelete: 'CASCADE',
            },
            product_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'food_products', key: 'id' },
                onDelete: 'CASCADE',
            },
            quantity: { type: Sequelize.INTEGER, allowNull: false },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cart_items');
    },
};
