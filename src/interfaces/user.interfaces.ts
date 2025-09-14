export interface User {
    id?: string;
    email: string;
    name: string;
    username: string;
    password: string;
    delivery_address: string;
    phone_number: string;
    refresh_token?: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}
