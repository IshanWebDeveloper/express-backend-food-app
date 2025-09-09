'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('users', [
            {
                id: '1e7b8f3e-9c3b-4d2a-8f1e-1a2b3c4d5e6f',
                email: 'user1@example.com',
                password: 'hashed_password1',
                name: 'User One',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '2e7b8f3e-9c3b-4d2a-8f1e-1a2b3c4d5e6f',
                email: 'user2@example.com',
                password: 'hashed_password2',
                name: 'User Two',
                created_at: new Date(),
                updated_at: new Date(),
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
