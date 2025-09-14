'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('food_products', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.TEXT },
            price: { type: Sequelize.FLOAT, allowNull: false },
            image_url: { type: Sequelize.STRING },
            category_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'categories', key: 'id' },
                onDelete: 'CASCADE',
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('food_products');
    },
};
