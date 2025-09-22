import { SocialLoginProvider } from '@/database/models/order.model';
import { z } from 'zod';

// Reusable patterns
const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/;

// Zod schemas
const signUpSchema = z.object({
    id: z.uuid({ message: 'User ID must be in UUID format' }).optional(),
    email: z.email({ message: 'Email format is invalid' }),
    name: z
        .string('Name is required')
        .min(1, { message: 'Name should at least minimum 1 character' }),
    username: z.string().optional(),
    password: z
        .string('Password is required.')
        .min(8, { message: 'Password must have at least 8 characters.' })
        .regex(strongPasswordRegex, {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }),
    delivery_address: z
        .string()
        .min(1, {
            message: 'Delivery Address should at least minimum 1 character',
        })
        .optional(),
    is_social_login: z.boolean().default(false),
    social_login_provider: z
        .enum([...Object.values(SocialLoginProvider)])
        .optional(),
    phone_number: z
        .string()
        .regex(/^[0-9]+$/, {
            message: 'Phone number must contain only digits.',
        })
        .optional(),
});

const updateUserSchema = z.object({
    email: z.email({ message: 'Email format is invalid' }).optional(),
    name: z
        .string()
        .min(1, { message: 'Name should at least minimum 1 character' })
        .optional(),
    username: z.string().optional(),
    password: z
        .string()
        .min(8, { message: 'Password must have at least 8 characters.' })
        .regex(strongPasswordRegex, {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        })
        .optional(),
    delivery_address: z
        .string()
        .min(1, {
            message: 'Delivery Address should at least minimum 1 character',
        })
        .optional(),
    phone_number: z
        .string()
        .regex(/^[0-9]+$/, {
            message: 'Phone number must contain only digits.',
        })
        .optional(),
});

const signInSchema = z.object({
    email: z.email({ message: 'Email format is invalid' }),
    password: z.string(),
    is_social_login: z.boolean().default(false),
    social_login_provider: z.string().optional(),
});

// Helper to keep Joi-like error shape expected by auth.service.ts
type JoiLikeError = { details: Array<{ message: string }> };
type ValidationResult<T> = { value?: T; error?: JoiLikeError };

const requiredMessages: Record<string, string> = {
    email: 'Email is required',
    name: 'Name is required',
    password: 'Password is required.',
    delivery_address: 'Delivery Address is required',
    phone_number: 'Phone number is required.',
};

const toValidationResult = <T>(result: any): ValidationResult<T> => {
    if (result.success) {
        return { value: result.data };
    }
    // Map Zod's default "Required"/invalid_type errors to our custom messages
    const issue = result.error?.errors?.[0] || result.error[0];
    let message = issue?.message || 'Validation error';
    if (
        issue?.code === 'invalid_type' &&
        (issue as any).received === 'undefined' &&
        Array.isArray(issue.path) &&
        issue.path.length > 0
    ) {
        const key = String(issue.path[0]);
        message = requiredMessages[key] || message;
    }
    return { error: { details: [{ message }] } };
};

export const validateSignUp = (userData: any) => {
    const res = signUpSchema.safeParse(userData);
    return toValidationResult(res);
};

export const validateUpdateUser = (updateData: any) => {
    const res = updateUserSchema.safeParse(updateData);
    return toValidationResult(res);
};

export const validateSignIn = (userData: any) => {
    const res = signInSchema.safeParse(userData);
    return toValidationResult(res);
};

export const validateOauthSignIn = (
    userData: any,
): { error?: { details: Array<{ path: string; message: string }> } } => {
    const schema = z.object({
        email: z.email({ message: 'Email format is invalid' }),
        is_Social_login: z.boolean().refine(val => val === true, {
            message: 'is_social_login must be true',
        }),
        Social_login_provider: z.enum([...Object.values(SocialLoginProvider)], {
            message: 'Social login provider is invalid',
        }),
    });
    const res = schema.safeParse(userData);
    if (!res.success) {
        const errors = res.error.issues.map(issue => ({
            path: issue.path.join('.'), // e.g., "name", "address.street"
            message: issue.message,
        }));
        return {
            error: {
                details: errors,
            },
        };
    }
    return {};
};
