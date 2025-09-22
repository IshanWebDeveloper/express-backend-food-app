import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface RestaurantAttributes {
    id: string;
    name: string;
    address: string;
    phone?: string;
    description?: string;
    delivery_time?: string;
    tags?: string;
    distance?: number;
    location_url?: string;
    allergens?: string;
    hygieneRating?: string;
    hygiene_rating_url?: string;
    closing_time?: string;
    minimum_order_amount?: number;
    notes: string;
    delivery_fee?: number;
    rating_id: number;
    canChangeDeliveryAddress?: boolean;
    canGroupOrder?: boolean;
    image_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface RestaurantCreationAttributes
    extends Optional<
        RestaurantAttributes,
        | 'id'
        | 'phone'
        | 'description'
        | 'delivery_time'
        | 'tags'
        | 'distance'
        | 'location_url'
        | 'allergens'
        | 'hygieneRating'
        | 'hygiene_rating_url'
        | 'closing_time'
        | 'minimum_order_amount'
        | 'notes'
        | 'delivery_fee'
        | 'rating_id'
        | 'canChangeDeliveryAddress'
        | 'canGroupOrder'
        | 'image_url'
        | 'createdAt'
        | 'updatedAt'
    > {}

class Restaurant
    extends Model<RestaurantAttributes, RestaurantCreationAttributes>
    implements RestaurantAttributes
{
    public id!: string;
    public name!: string;
    public address!: string;
    public phone?: string;
    public description?: string;
    public delivery_time?: string;
    public tags?: string;
    public distance?: number;
    public location_url?: string;
    public allergens?: string;
    public hygieneRating?: string;
    public hygiene_rating_url?: string;
    public closing_time?: string;
    public minimum_order_amount?: number;
    public notes!: string;
    public delivery_fee?: number;
    public rating_id!: number;
    public canChangeDeliveryAddress?: boolean;
    public canGroupOrder?: boolean;
    public image_url?: string;
    public createdAt?: Date | undefined;
    public updatedAt?: Date | undefined;
}

export default function (sequelize: Sequelize): typeof Restaurant {
    Restaurant.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            delivery_time: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tags: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            distance: {
                type: DataTypes.DECIMAL(6, 2),
                allowNull: true,
            },
            location_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            allergens: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            hygieneRating: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            hygiene_rating_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            closing_time: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            minimum_order_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            delivery_fee: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            rating_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            canChangeDeliveryAddress: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            canGroupOrder: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'restaurants',
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                { fields: ['name'] },
                { fields: ['rating_id'] },
                // Only keep if you actually query by tags
                { fields: ['tags'] },
            ],
        },
    );
    return Restaurant;
}
