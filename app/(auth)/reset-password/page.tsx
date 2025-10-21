"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const schema = z
  .object({
    newPassword: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(8, "Xác nhận mật khẩu tối thiểu 8 ký tự"),
  })
  .refine((vals) => vals.newPassword === vals.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!token) {
      toast.error("Thiếu token đặt lại mật khẩu. Vui lòng kiểm tra email.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...values }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.message || "Đặt lại mật khẩu thất bại");
        return;
      }
      toast.success(data?.message || "Đặt lại mật khẩu thành công");
      router.push("/sign-in");
    } catch (e) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18232a] p-4">
      <div className="w-full max-w-md bg-[#18232a] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Đặt lại mật khẩu
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mật khẩu mới"
                      {...field}
                      className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      {...field}
                      className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition cursor-pointer">
              {isSubmitting ? "Đang xử lý..." : "XÁC NHẬN"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

