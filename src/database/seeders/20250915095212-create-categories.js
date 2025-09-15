'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categories', [
            {
                id: uuidv4(),
                name: 'Beef burgers',
            },
            {
                id: uuidv4(),
                name: 'Chicken burgers',
            },
            {
                id: uuidv4(),
                name: 'Fried chicken burgers',
            },
            {
                id: uuidv4(),
                name: 'Veggie burgers',
            },
            {
                id: uuidv4(),
                name: 'Cheese burgers',
            },
            {
                id: uuidv4(),
                name: 'Sliders',
            },
            {
                id: uuidv4(),
                name: 'Drinks',
            },
            {
                id: uuidv4(),
                name: 'Combos',
            },
            {
                id: uuidv4(),
                name: 'Classics',
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
