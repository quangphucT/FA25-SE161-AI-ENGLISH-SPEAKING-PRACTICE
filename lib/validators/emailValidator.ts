import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
