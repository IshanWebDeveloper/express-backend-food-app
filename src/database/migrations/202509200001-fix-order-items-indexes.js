'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const table = 'order_items';

        // Inspect current indexes so we can act idempotently
        const existing = await queryInterface.showIndex(table);

        const getFieldNames = idx => {
            if (!idx) return [];
            // Different dialects return slightly different shapes
            if (Array.isArray(idx.fields)) {
                // MySQL/SQLite: [{ attribute: 'col', length, order }]
                const first = idx.fields[0];
                if (
                    first &&
                    typeof first === 'object' &&
                    'attribute' in first
                ) {
                    return idx.fields.map(f => f.attribute);
                }
                // Postgres: ['col1', 'col2']
                return idx.fields;
            }
            if (Array.isArray(idx.columnNames)) {
                return idx.columnNames;
            }
            return [];
        };

        const byName = new Map(existing.map(ix => [ix.name, ix]));

        // Drop incorrect single-column UNIQUE indexes on order_id / dish_id
        for (const ix of existing) {
            const fields = getFieldNames(ix);
            if (ix.unique && !ix.primary) {
                if (
                    fields.length === 1 &&
                    (fields[0] === 'order_id' || fields[0] === 'dish_id')
                ) {
                    // eslint-disable-next-line no-console
                    console.log(
                        `Dropping unique index ${
                            ix.name
                        } on ${table}(${fields.join(',')})`,
                    );
                    await queryInterface.removeIndex(table, ix.name);
                }
            }
        }

        // Re-read indexes after drops
        const afterDrop = await queryInterface.showIndex(table);
        const namesAfter = new Set(afterDrop.map(ix => ix.name));
        const hasCompositeUnique = afterDrop.some(ix => {
            if (!ix.unique) return false;
            const fields = getFieldNames(ix);
            const set = new Set(fields);
            return set.size === 2 && set.has('order_id') && set.has('dish_id');
        });

        if (!hasCompositeUnique) {
            await queryInterface.addIndex(table, ['order_id', 'dish_id'], {
                unique: true,
                name: 'order_items_order_id_dish_id_unique',
            });
        }

        // Add helpful non-unique indexes if missing
        if (!namesAfter.has('order_items_order_id_idx')) {
            await queryInterface.addIndex(table, ['order_id'], {
                name: 'order_items_order_id_idx',
            });
        }
        if (!namesAfter.has('order_items_dish_id_idx')) {
            await queryInterface.addIndex(table, ['dish_id'], {
                name: 'order_items_dish_id_idx',
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const table = 'order_items';
        const existing = await queryInterface.showIndex(table);
        const names = new Set(existing.map(ix => ix.name));

        if (names.has('order_items_order_id_dish_id_unique')) {
            await queryInterface.removeIndex(
                table,
                'order_items_order_id_dish_id_unique',
            );
        }
        if (names.has('order_items_order_id_idx')) {
            await queryInterface.removeIndex(table, 'order_items_order_id_idx');
        }
        if (names.has('order_items_dish_id_idx')) {
            await queryInterface.removeIndex(table, 'order_items_dish_id_idx');
        }

        // Recreate the problematic single-column unique indexes to revert schema
        await queryInterface.addIndex(table, ['order_id'], {
            unique: true,
            name: 'order_items_order_id_unique',
        });
        await queryInterface.addIndex(table, ['dish_id'], {
            unique: true,
            name: 'order_items_dish_id_unique',
        });
    },
};
