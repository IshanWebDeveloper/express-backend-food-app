import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface RefreshTokenAttributes {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RefreshTokenCreationAttributes
    extends Optional<
        RefreshTokenAttributes,
        'id' | 'createdAt' | 'updatedAt'
    > {}

export class RefreshToken
    extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes
{
    public id!: number;
    public userId!: number;
    public token!: string;
    public expiresAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
    RefreshToken.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            sequelize,
            tableName: 'RefreshTokens',
            modelName: 'RefreshToken',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['token'],
                },
                {
                    fields: ['userId'],
                },
            ],
        },
    );

    return RefreshToken;
};
