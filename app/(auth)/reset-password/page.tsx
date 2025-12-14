"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useResetPassword } from "@/hooks/useResetPassword";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema, ResetPasswordSchema } from "@/lib/validators/passwordValidator";



function ResetPasswordInner() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token") || "";

  const {mutate:resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    if (!token) {
      toast.error("Thiếu token đặt lại mật khẩu. Vui lòng kiểm tra email.");
      return;
    }
    resetPassword(
      {
        credentials: {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        token,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Đặt lại mật khẩu thành công");
          router.push("/sign-in");
        },
        onError: (data) => {
          toast.error(data?.message || "Đặt lại mật khẩu thất bại");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18232a] p-4">
      <div className="w-full max-w-md bg-[#18232a] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Đặt lại mật khẩu
        </h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
        </p>
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
            <Button
              type="submit"
              className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition cursor-pointer"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          Đang tải...
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
