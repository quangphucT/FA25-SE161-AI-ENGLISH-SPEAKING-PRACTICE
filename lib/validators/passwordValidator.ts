import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(8, "Xác nhận mật khẩu tối thiểu 8 ký tự"),
  })
  .refine((vals) => vals.newPassword === vals.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
