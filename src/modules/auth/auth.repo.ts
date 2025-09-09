import { DB } from '@/database';
import { User } from '@/interfaces/user.interfaces';

const repo = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        return await DB.Users.findOne({ where: { email } });
    },
    saveRefreshToken: async (
        userId: string,
        refreshToken: string,
    ): Promise<void> => {
        await DB.Users.update({ refreshToken }, { where: { id: userId } });
    },

    createUser: async (userData: User): Promise<User> => {
        return await DB.Users.create(userData);
    },
};

export default repo;
