'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('food_products', [
            {
                id: uuidv4(),
                name: "Cheeseburger Wendy's Burger",
                description:
                    "The Cheeseburger Wendy's Burger is a classic fast food burger that packs a punch of flavor in every bite. Made with a juicy beef patty cooked to perfection, it's topped with melted American cheese, crispy lettuce, ripe tomato, and crunchy pickles.",
                preparation_time: 26,
                rating: 4.9,
                price: 8.24,
                image_url:
                    '../assets/images/foods/cheeseburger_wendy_burger.png',
                category_id: '53db3596-17df-4fb1-8bc6-bc0c30ae0e5f', // Replace with valid category ID
            },
            {
                id: uuidv4(),
                name: 'Hamburger Veggie Burger',
                description:
                    'Enjoy our delicious Hamburger Veggie Burger, made with a savory blend of fresh vegetables and herbs, topped with crisp lettuce, juicy tomatoes, and tangy pickles, all served on a soft, toasted bun. ',
                preparation_time: 42,
                rating: 4.6,
                price: 12.48,
                image_url: '../assets/images/foods/hamburger_veggie_burger.png',
                category_id: 'ec41c59d-bc54-4764-8fba-4c48e47dd888', // Replace with valid category ID
            },
            {
                id: uuidv4(),
                name: 'Hamburger Chicken Burger',
                description:
                    'Our chicken burger is a delicious and healthier alternative to traditional beef burgers, perfect for those looking for a lighter meal option. Try it today and experience the mouth-watering flavors of our Hamburger Chicken Burger! ',
                preparation_time: 42,
                rating: 4.6,
                price: 12.48,
                image_url:
                    '../assets/images/foods/hamburger_chicken_burger.png',
                category_id: 'bb3ea967-8aab-4dd3-b211-7e8797498db2', // Replace with valid category ID
            },
            {
                id: uuidv4(),
                name: 'Fried Chicken Burger',
                description:
                    'Indulge in our crispy and savory Fried Chicken Burger, made with a juicy chicken patty, hand-breaded and deep-fried to perfection, served on a warm bun with lettuce, tomato, and a creamy sauce. ',
                preparation_time: 14,
                rating: 4.5,
                price: 26.99,
                image_url: '../assets/images/foods/fried_chicken_burger.png',
                category_id: 'bb3ea967-8aab-4dd3-b211-7e8797498db2', // Replace with valid category ID
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
