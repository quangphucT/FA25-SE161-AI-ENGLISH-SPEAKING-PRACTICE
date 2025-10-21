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
import { OTPPopup } from "@/components/PopUpVerifyToken";
import { useVerifyOTPMutation } from "@/hooks/useVerifyOTPMutation";
import { useResendOTPMutation } from "@/hooks/useResendOTPMutation";

const formSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập tên đầy đủ").max(100),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ").max(15),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  role: z.enum(["LEARNER", "REVIEWER"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegisterMutation();
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [resendOTPSuccess, setResendOTPSuccess] = useState<
    (() => void) | undefined
  >(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "LEARNER",
    },
  });

  const { mutate: verifyOTPMutate, isPending: isVerifyingOTPPending } =
    useVerifyOTPMutation();
  const { mutate: resendOTPMutate, isPending: isResendingOTPPending } =
    useResendOTPMutation();

  function handleNext() {
    if (step === 1) {
      // Validate full name
      form.trigger("role").then((valid) => {
        if (valid) setStep(2);
      });
    } else if (step === 2) {
      // Validate role
      form.trigger("fullName").then((valid) => {
        if (valid) setStep(3);
      });
    }
  }

  const handleLogicWhenCloseOTPPopup = () => {
    setShowOTPPopup(false);
    router.push("/sign-in");
  };

  const handleOTPVerify = async (otpInput: string) => {
    verifyOTPMutate(
      { email: userEmail, otpInput },
      {
        onSuccess: () => {
          toast.success("Xác thực thành công!");
          setShowOTPPopup(false);
          router.push("/sign-in");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  const handleResendOTP = async () => {
    // Call API to resend OTP
    resendOTPMutate(
      { email: userEmail },
      {
        onSuccess: () => {
          // Tạo callback function để báo cho OTPPopup biết thành công
          setResendOTPSuccess(() => () => {
            // Reset callback sau khi sử dụng
            setResendOTPSuccess(undefined);
          });
        },
        onError: (err) => {
          toast.error(
            err.message || "Không thể gửi lại mã OTP. Vui lòng thử lại."
          );
        },
      }
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP."
        );
        setUserEmail(values.email);
        setShowOTPPopup(true);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18232a]">
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-white mb-0.5 text-center">
            Chọn vai trò
          </h1>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold text-white mb-0.5 text-center">
            Tên đầy đủ
          </h1>
        </>
      )}
      {step === 3 && (
        <>
          <h1 className="text-2xl font-bold text-white mb-0.5 text-center">
            Tạo hồ sơ
          </h1>
        </>
      )}
      <div className="w-full max-w-md rounded-2xl  p-10 flex flex-col items-center relative">
      
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {step === 1 && (
              <>
                <div className="flex flex-col gap-4">
                  {/* --- Card chọn Role --- */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex gap-4 mt-2">
                          <div
                            onClick={() => field.onChange("LEARNER")}
                            className={`flex-1 cursor-pointer border rounded-xl p-6 text-center transition ${
                              field.value === "LEARNER"
                                ? "border-[#2ed7ff] bg-[#22303a]"
                                : "border-[#616163] bg-[#18232a]"
                            }`}
                          >
                            <h3 className="text-white font-semibold text-lg">
                              Learner
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">
                              Dành cho học viên tham gia bài test.
                            </p>
                          </div>

                          <div
                            onClick={() => field.onChange("REVIEWER")}
                            className={`flex-1 cursor-pointer border rounded-xl p-6 text-center transition ${
                              field.value === "REVIEWER"
                                ? "border-[#2ed7ff] bg-[#22303a]"
                                : "border-[#616163] bg-[#18232a]"
                            }`}
                          >
                            <h3 className="text-white font-semibold text-lg">
                              Reviewer
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">
                              Dành cho người chấm bài, đánh giá học viên.
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full cursor-pointer bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition"
                >
                  Tiếp theo
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Tên đầy đủ"
                            {...field}
                            className="bg-[#18232a]  text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg "
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
                  className="w-full cursor-pointer bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition"
                >
                  Tiếp theo
                </Button>
              </>
            )}
            {step === 3 && (
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
                  name="phoneNumber"
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
                  className="w-full cursor-pointer bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition"
                >
                  Tạo tài khoản
                </Button>
              </>
            )}

           
          </form>
        </Form>
        <div className="mt-8 text-center text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="text-[#2ed7ff] font-bold underline">
            Đăng nhập
          </Link>
        </div>
        <AdvertisingMessage />
      </div>
      {/* OTP Popup */}
      <OTPPopup
        isOpen={showOTPPopup}
        onClose={handleLogicWhenCloseOTPPopup}
        onVerify={handleOTPVerify}
        onResendOTP={handleResendOTP}
        onResendOTPSuccess={resendOTPSuccess}
        isVerifying={isVerifyingOTPPending}
        isResendingOTP={isResendingOTPPending}
      />
    </div>
  );
}
