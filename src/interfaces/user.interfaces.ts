import { SocialLoginProvider } from '@/database/models/order.model';

export interface User {
    id?: string;
    email: string;
    name: string;
    username: string;
    password?: string;
    delivery_address?: string;
    phone_number?: string;
    is_Social_login: boolean;
    Social_login_provider?: SocialLoginProvider | null;
    refresh_token_id?: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}
