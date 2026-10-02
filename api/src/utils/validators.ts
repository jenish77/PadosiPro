import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    code: z.string().length(6, 'Verification code must be exactly 6 digits').regex(/^\d+$/, 'Code must contain only digits'),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
});

export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
    address: z.string().min(5, 'Address must be at least 5 characters long'),
    societyBuilding: z.string().optional(),
    flatUnit: z.string().optional(),
    businessName: z.string().optional(),
  }),
});

export const selectTasksSchema = z.object({
  body: z.object({
    taskIds: z.array(z.string().uuid('Invalid task ID format')).min(1, 'Please select at least one task'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

