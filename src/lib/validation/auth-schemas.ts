import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 charakters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 charakters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name is too long")
        .optional()
        .or(z.literal("")),
})
.refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;