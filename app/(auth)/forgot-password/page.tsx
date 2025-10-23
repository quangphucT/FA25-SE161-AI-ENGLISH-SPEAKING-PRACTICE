"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/lib/validators/emailValidator";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordSchema) => {
    forgotPassword(
      { email: values.email },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Đã gửi email đặt lại mật khẩu!");
          form.reset();
        },
        onError: (data) => {
          toast.error(data?.message || "Gửi email đặt lại mật khẩu thất bại");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16232d]">
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Quên mật khẩu
        </h1>
        <p className="text-lg text-[#cbe7ff] text-center mb-6">
          Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu qua email của bạn.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white ml-0.5 mb-1">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="bg-[#22313f] border-[#3a4a5a] text-white placeholder:text-[#8fa3b7] py-6 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#4fc3f7] hover:bg-[#29b6f6] text-[#16232d] text-lg font-bold py-7 rounded-3xl cursor-pointer transition"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Đang gửi...</span>
                </div>
              ) : (
                "Gửi"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
