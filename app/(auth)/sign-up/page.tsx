"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/hooks/useRegisterMutation";
import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import AdvertisingMessage from "@/components/AdvertisingMessage";
import Link from "next/link";
const formSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên").max(50),
  lastName: z.string().min(1, "Vui lòng nhập họ").max(50),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ").max(15),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegisterMutation();
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  function handleNext() {
    if (step === 1) {
      // Validate firstName, lastName
      form.trigger(["firstName", "lastName"]).then((valid) => {
        if (valid) setStep(2);
      });
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/sign-in");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18232a]">
      {step === 1 ? (
        <>
          {" "}
          <button
            className="absolute left-6 top-6 cursor-pointer text-gray-400 hover:text-white text-3xl font-bold"
            aria-label="Quay về đăng nhập"
            onClick={() => router.push("/landing")}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <button className="absolute left-6 top-6 text-gray-400 hover:text-white text-3xl font-bold">
            <ArrowLeft className="text-white" onClick={() => setStep(1)} />
          </button>
        </>
      )}
      <div className="w-full max-w-md rounded-2xl  p-10 flex flex-col items-center relative">
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-8 text-center">
              Nhập họ và tên
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-8 text-center">
              Tạo hồ sơ
            </h1>
          </>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {step === 1 && (
              <>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Tên"
                            {...field}
                            className="bg-[#18232a]  text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Họ"
                            {...field}
                            className="bg-[#18232a] text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition"
                >
                  Tiếp theo
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="bg-[#18232a] text-white border border-[#616163]  rounded-xl px-4 py-[23px] text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Số điện thoại"
                          {...field}
                          className="bg-[#18232a] text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mật khẩu"
                          {...field}
                          className="bg-[#18232a] text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition"
                >
                  Tạo tài khoản
                </Button>
              </>
            )}
             
            <GoogleLoginButton onClick={() => toast.error("Chức năng đang phát triển")} />
          </form>
        </Form>
        <div className="mt-8 text-center text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="text-[#2ed7ff] font-bold underline">
            Đăng nhập
          </Link>
        </div>
        <AdvertisingMessage/>
      </div>
    </div>
  );
}
