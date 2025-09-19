import { User } from '@/interfaces/user.interfaces';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type UserCreationAttributes = Optional<User, 'id' | 'username'>;

export class UserModel
    extends Model<User, UserCreationAttributes>
    implements User
{
    public id!: string;
    public email!: string;
    public name!: string;
    public username!: string;
    public password!: string;
    public is_Social_login!: boolean;
    public Social_login_provider?: string;
    // Deprecated column from previous design; not used as FK anymore
    public refresh_token_id?: string;
    public delivery_address!: string;
    public phone_number!: string;
    public created_at: string | undefined;
    public updated_at: string | undefined;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            username: {
                allowNull: true,
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING(255),
            },
            delivery_address: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            is_Social_login: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
                field: 'is_social_login',
            },
            Social_login_provider: {
                allowNull: true,
                type: DataTypes.STRING,
                field: 'social_login_provider',
            },
            phone_number: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            // Keep column if already exists in DB, but do not enforce FK that caused sync errors
            refresh_token_id: {
                allowNull: true,
                type: DataTypes.TEXT,
                field: 'refresh_token_id',
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            tableName: 'users',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    return UserModel;
}
