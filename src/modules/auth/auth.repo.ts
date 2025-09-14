import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

const repo = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        return await DB.Users.findOne({ where: { email } });
    },
    findUserByName: async (name: string): Promise<User | null> => {
        return await DB.Users.findOne({ where: { name } });
    },
    findUserById: async (id: string): Promise<User | null> => {
        return await DB.Users.findOne({ where: { id } });
    },
    findByRefreshToken: async (refreshToken: string): Promise<User | null> => {
        return await DB.Users.findOne({
            where: { refresh_token: refreshToken },
        });
    },
    saveRefreshToken: async (
        userId: string | undefined,
        refreshToken: string,
    ): Promise<void> => {
        if (!userId) return;
        await DB.Users.update(
            { refresh_token: refreshToken },
            { where: { id: userId } },
        );
    },
    clearRefreshToken: async (user: User): Promise<void> => {
        await DB.Users.update(
            { refresh_token: '' },
            { where: { id: user.id } },
        );
    },

    createUser: async (userData: User): Promise<User> => {
        return await DB.Users.create(userData);
    },
};

export default repo;
