import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string()
    .email("Invalid email format")
    .refine(val => !val.includes("mailinator") && !val.includes("tempmail"), {
      message: "Disposable emails are not allowed"
    }),

  password: z.string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
    .regex(/[0-9]/, "Must include at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character"),

  phone: z.string()
    .min(10, "Phone must be 10 digits minimum")
    .max(15, "Phone must be 15 digits maximum")
    .regex(/^[0-9]+$/, "Phone must contain only numbers"),

  address: z.string().optional(),
  company: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
