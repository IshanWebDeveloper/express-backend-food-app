// Enable on-the-fly TypeScript support and tsconfig path aliases for '@/'
require('ts-node/register/transpile-only');
require('tsconfig-paths/register');

// Use the runtime DB entry that initializes Sequelize and models
const { DB } = require('../../database');
const {
    sequelize,
    Users: User,
    Categories: Category,
    Dishes: Dish,
    Orders: Order,
    OrderItems: OrderItem,
    Ratings: Rating,
    Restaurants: Restaurant,
} = DB;

// Faker v10 API
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async () => {
        // Users
        const users = [];
        for (let i = 0; i < 50; i++) {
            const u = await User.create({
                email: faker.internet.email(),
                password: 'Password@123',
                name: faker.person.fullName(),
                username: faker.internet.username(),
                delivery_address: faker.location.streetAddress(),
                phone_number: faker.phone.number(),
                is_Social_login: false,
                Social_login_provider: null,
            });
            users.push(u);
        }

        // Restaurants
        const restaurants = [];
        for (let i = 0; i < 20; i++) {
            const r = await Restaurant.create({
                name: faker.company.name(),
                address: faker.location.streetAddress(),
                tags: faker.word.words(3),
                description: faker.lorem.sentence(),
                delivery_time: `${faker.number.int({ min: 20, max: 60 })} mins`,
                distance: Number(
                    faker.number
                        .float({ min: 1, max: 20, precision: 0.01 })
                        .toFixed(2),
                ),
                location_url: faker.internet.url(),
                allergens: faker.word.words(2),
                hygieneRating: String(faker.number.int({ min: 1, max: 5 })),
                closing_time: '22:00',
                minimum_order_amount: Number(
                    faker.number
                        .float({ min: 10, max: 50, precision: 0.01 })
                        .toFixed(2),
                ),
                notes: faker.lorem.sentence(),
                delivery_fee: Number(
                    faker.number
                        .float({ min: 1, max: 10, precision: 0.01 })
                        .toFixed(2),
                ),
                rating_id: 0,
                canChangeDeliveryAddress: faker.datatype.boolean(),
                canGroupOrder: faker.datatype.boolean(),
                image_url:
                    faker.image.urlLoremFlickr?.({ category: 'food' }) ||
                    faker.image.url(),
                phone: faker.phone.number(),
            });
            restaurants.push(r);
        }

        // Categories
        const categoryNames = [
            'Pizza',
            'Burgers',
            'Salads',
            'Chinese',
            'Desserts',
            'Sushi',
            'Drinks',
        ];
        const categories = [];
        for (const name of categoryNames) {
            categories.push(await Category.create({ name }));
        }

        // Dishes
        const dishes = [];
        for (const restaurant of restaurants) {
            for (let i = 0; i < 25; i++) {
                const dish = await Dish.create({
                    name: faker.commerce.productName(),
                    description: faker.lorem.sentence(),
                    ingredients: faker.lorem.words(5),
                    rating: Number(
                        faker.number
                            .float({ min: 1, max: 5, precision: 0.1 })
                            .toFixed(1),
                    ),
                    price: Number(
                        faker.number
                            .float({ min: 5, max: 50, precision: 0.01 })
                            .toFixed(2),
                    ),
                    calories: faker.number.int({ min: 100, max: 1000 }),
                    image_url:
                        faker.image.urlLoremFlickr?.({ category: 'food' }) ||
                        faker.image.url(),
                    category_id:
                        categories[
                            Math.floor(Math.random() * categories.length)
                        ].id,
                    restaurant_id: restaurant.id,
                });
                dishes.push(dish);
            }
        }

        // Ratings
        for (let i = 0; i < 200; i++) {
            await Rating.create({
                score: faker.number.int({ min: 1, max: 5 }),
                restaurant_id:
                    restaurants[Math.floor(Math.random() * restaurants.length)]
                        .id,
                review: faker.lorem.sentence(),
                user_id: users[Math.floor(Math.random() * users.length)].id,
            });
        }

        // Orders (configurable via SEED_ORDER_COUNT, default 10,000)
        const totalOrders = Number(process.env.SEED_ORDER_COUNT || 10000);
        for (let i = 0; i < totalOrders; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const order = await Order.create({
                user_id: user.id,
                total_amount: 0,
                status: 'pending',
            });
            const itemCount = faker.number.int({ min: 1, max: 5 });

            let total = 0;
            // Ensure each dish appears at most once per order to honor composite unique (order_id, dish_id)
            const usedDishIds = new Set();
            for (let j = 0; j < itemCount; j++) {
                let dish = dishes[Math.floor(Math.random() * dishes.length)];
                let attempts = 0;
                while (usedDishIds.has(dish.id) && attempts < 10) {
                    dish = dishes[Math.floor(Math.random() * dishes.length)];
                    attempts++;
                }
                if (usedDishIds.has(dish.id)) {
                    // Couldn't find a new unique dish quickly; skip to keep seeding robust
                    continue;
                }
                usedDishIds.add(dish.id);
                const qty = faker.number.int({ min: 1, max: 3 });
                const price = Number.isFinite(dish.price)
                    ? dish.price
                    : Number(
                          faker.number
                              .float({
                                  min: 5,
                                  max: 50,
                                  precision: 0.01,
                              })
                              .toFixed(2),
                      );
                try {
                    await OrderItem.create({
                        order_id: order.id,
                        dish_id: dish.id,
                        quantity: qty,
                        price,
                    });
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('OrderItem.create failed', {
                        order_id: order.id,
                        dish_id: dish.id,
                        quantity: qty,
                        price,
                        err: err?.errors || err?.message || String(err),
                    });
                    throw err;
                }
                total += price * qty;
            }
            order.total_amount = Number(total.toFixed(2));
            await order.save();
            if ((i + 1) % 500 === 0) {
                // eslint-disable-next-line no-console
                console.log(`Seeded ${i + 1}/${totalOrders} orders`);
            }
        }

        // eslint-disable-next-line no-console
        console.log('✅ Seeding complete!');
    },
    down: async queryInterface => {
        // Delete in FK-safe order
        await queryInterface.bulkDelete('order_items', null, {});
        await queryInterface.bulkDelete('orders', null, {});
        await queryInterface.bulkDelete('ratings', null, {});
        await queryInterface.bulkDelete('dishes', null, {});
        await queryInterface.bulkDelete('categories', null, {});
        await queryInterface.bulkDelete('restaurants', null, {});
        await queryInterface.bulkDelete('users', null, {});
    },
};
