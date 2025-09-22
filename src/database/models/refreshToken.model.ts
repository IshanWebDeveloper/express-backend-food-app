import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface RefreshTokenAttributes {
    id: number;
    user_id: string; // FK to users.id (UUID)
    token: string;
    expires_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface RefreshTokenCreationAttributes
    extends Optional<
        RefreshTokenAttributes,
        'id' | 'created_at' | 'updated_at'
    > {}

export class RefreshToken
    extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes
{
    public id!: number;
    public user_id!: string;
    public token!: string;
    public expires_at!: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

export default (sequelize: Sequelize) => {
    RefreshToken.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            sequelize,
            tableName: 'refresh_tokens',
            modelName: 'RefreshToken',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                {
                    unique: true,
                    fields: ['token'],
                },
                {
                    fields: ['user_id'],
                },
            ],
        },
    );

    return RefreshToken;
};
