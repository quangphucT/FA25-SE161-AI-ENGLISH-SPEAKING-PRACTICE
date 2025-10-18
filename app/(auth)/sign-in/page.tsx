"use client";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { useLoginMutation } from "@/hooks/useLoginMutation";
import { Loader2 } from "lucide-react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import AdvertisingMessage from "@/components/AdvertisingMessage";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";
import { useLoginWithGoogle } from "@/hooks/useLoginWithGoogle";
import { toast } from "sonner";
export default function LoginForm() {
  const { mutate, isPending } = useLoginMutation();
    const { mutate: mutateGoogleLogin } = useLoginWithGoogle();
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().min(2).max(100).email(),
    password: z.string().min(6).max(100),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data) => {
        const { role } = data;
        // Điều hướng dựa vào trạng thái
        if (data.role === "LEARNER") {
          if (!data.isPlacementTestDone) {
            router.push("/entrance_test");
          } else {
            router.push("/dashboard-learner-layout");
          }
        } else if (data.role === "ADMIN") {
          router.push("/dashboard-admin-layout");
        } else if (data.role === "MANAGER") {
          router.push("/dashboard-manager-layout");
        } else if (data.role === "REVIEWER") {
          router.push("/dashboard-reviewer-layout");
        } else {
          router.push("/sign-in");
        }
      },
    });
  }

  // Google Login handler
  const handleLoginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    console.log("idToken:", idToken); // 🔑 kiểm tra idToken nhận được
    mutateGoogleLogin(
      { idToken },
      {
        onSuccess: (data) => {
          toast.success("Đăng nhập với Google thành công!");
          // if (!data?.isPlacementTestDone) {
          //   router.push("/entrance-test");
          // }
        },
      }
    ); // 🔑 gửi idToken qua hook
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18232a]">
      <button
        className="absolute left-6 top-6 cursor-pointer text-gray-400 hover:text-white text-3xl font-bold"
        aria-label="Quay về đăng nhập"
        onClick={() => router.push("/landing")}
      >
        ×
      </button>
      <div className="w-full max-w-md bg-[#18232a] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Đăng nhập
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email hoặc tên đăng nhập"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mật khẩu"
                        {...field}
                        className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-lg"
                      />
                    </FormControl>
                    <span
                      onClick={() => {
                        router.push("/forgot-password");
                      }}
                      className="ml-2 text-gray-400 text-sm cursor-pointer"
                    >
                      QUÊN?
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition cursor-pointer"
            >
              <Loader2
                className={
                  isPending ? "inline-block mr-2 animate-spin" : "hidden"
                }
              />
              ĐĂNG NHẬP
            </Button>

            <GoogleLoginButton onClick={handleLoginWithGoogle} />
            <div className="mt-6 text-center text-gray-400 text-sm">
              Chưa có tài khoản?{" "}
              <Link
                href="/sign-up"
                className="text-[#2ed7ff] font-bold underline"
              >
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </Form>
        <AdvertisingMessage />
      </div>
    </div>
  );
}
