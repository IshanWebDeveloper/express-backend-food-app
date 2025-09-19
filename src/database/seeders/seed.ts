import {
    Category,
    Dish,
    Order,
    OrderItem,
    Rating,
    Restaurant,
    sequelize,
    User,
} from '../models';
import { OrderStatus } from '../models/order.model';

const faker = require('faker');

(async () => {
    await sequelize.sync({ force: true });

    // Users
    const users = await Promise.all(
        Array.from({ length: 50 }).map(() =>
            User.create({
                email: faker.internet.email(),
                password: 'Password@123', // hashed by model hook
                name: faker.name.findName(),
                username: faker.internet.userName(),
                delivery_address: faker.address.streetAddress(),
                phone_number: faker.phone.phoneNumber(),
                is_Social_login: false,
                Social_login_provider: undefined,
            }),
        ),
    );

    // Restaurants
    const restaurants = await Promise.all(
        Array.from({ length: 20 }).map(() =>
            Restaurant.create({
                name: faker.company.companyName(),
                address: faker.address.streetAddress(),
                tags: faker.random.words(3),
                description: faker.lorem.sentence(),
                delivery_time: `${faker.datatype.number({
                    min: 20,
                    max: 60,
                })} mins`,
                distance: parseFloat(
                    faker.datatype
                        .number({ min: 1, max: 20, precision: 0.01 })
                        .toFixed(2),
                ),
                location_url: faker.internet.url(),
                allergens: faker.random.words(2),
                hygieneRating: faker.datatype
                    .number({ min: 1, max: 5 })
                    .toString(),
                closing_time: '22:00',
                minimum_order_amount: faker.datatype.number({
                    min: 10,
                    max: 50,
                }),
                notes: faker.lorem.sentence(),
                delivery_fee: parseFloat(faker.commerce.price(1, 10)),
                rating_id: 0,
                canChangeDeliveryAddress: faker.datatype.boolean(),
                canGroupOrder: faker.datatype.boolean(),
                image_url: faker.image.food(640, 480, true),
                phone: faker.phone.phoneNumber(),
            }),
        ),
    );

    // Categories
    const categories = await Promise.all(
        [
            'Pizza',
            'Burgers',
            'Salads',
            'Chinese',
            'Desserts',
            'Sushi',
            'Drinks',
        ].map(name => Category.create({ name })),
    );

    // Dishes
    const dishes = [];
    for (const restaurant of restaurants) {
        for (let i = 0; i < 25; i++) {
            const dish = await Dish.create({
                id: faker.datatype.uuid(),
                name: faker.commerce.productName(),
                description: faker.lorem.sentence(),
                ingredients: faker.lorem.words(5),
                rating: parseFloat(
                    faker.datatype.number({ min: 1, max: 5 }).toFixed(1),
                ),
                price: parseFloat(faker.commerce.price(5, 50)),
                calories: faker.datatype.number({ min: 100, max: 1000 }),
                image_url: faker.image.food(640, 480, true),
                category_id:
                    categories[Math.floor(Math.random() * categories.length)]
                        .id,
                restaurant_id: restaurant.id,
            });
            dishes.push(dish);
        }
    }

    // Ratings
    for (let i = 0; i < 200; i++) {
        await Rating.create({
            score: faker.datatype.number({ min: 1, max: 5 }),
            restaurant_id:
                restaurants[Math.floor(Math.random() * restaurants.length)].id,
            review: faker.lorem.sentence(),
            user_id: users[Math.floor(Math.random() * users.length)].id,
        });
    }

    // Orders (10,000 total with order items)
    const totalOrders = 10000;
    for (let i = 0; i < totalOrders; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const order = await Order.create({
            userId: user.id,
            totalAmount: 0,
            status: OrderStatus.PENDING,
        });
        const itemCount = faker.datatype.number({ min: 1, max: 5 });

        let total = 0;
        for (let j = 0; j < itemCount; j++) {
            const dish = dishes[Math.floor(Math.random() * dishes.length)];
            const qty = faker.datatype.number({ min: 1, max: 3 });
            await OrderItem.create({
                id: faker.datatype.uuid(),
                orderId: order.id,
                dishId: dish.id,
                quantity: qty,
                price: dish.price,
            });
            total += dish.price * qty;
        }
        order.totalAmount = parseFloat(total.toFixed(2));
        await order.save();
        if ((i + 1) % 500 === 0)
            console.log(`Seeded ${i + 1}/${totalOrders} orders`);
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
})();
