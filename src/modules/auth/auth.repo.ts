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
        const rt = await DB.RefreshTokens.findOne({
            where: { token: refreshToken },
            include: [{ model: DB.Users, as: 'user' } as any],
        });
        const user = rt ? (rt.get('user') as User) : null;
        return user ?? null;
    },
    saveRefreshToken: async (
        userId: string | undefined,
        refreshToken: string,
    ): Promise<void> => {
        if (!userId) return;
        await DB.RefreshTokens.create({
            user_id: userId as string,
            token: refreshToken,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
        } as any);
    },
    clearRefreshToken: async (user: User): Promise<void> => {
        await DB.RefreshTokens.destroy({ where: { user_id: user.id } as any });
    },

    createUser: async (userData: User): Promise<User> => {
        return await DB.Users.create(userData);
    },
    updateUser: async (
        userId: string,
        updateData: Partial<User>,
    ): Promise<[affectedCount: number]> => {
        return await DB.Users.update(updateData, { where: { id: userId } });
    },
};

export default repo;
