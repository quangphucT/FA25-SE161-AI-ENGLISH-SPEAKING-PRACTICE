"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import AdvertisingMessage from "@/components/AdvertisingMessage";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";
import { useLoginWithGoogle } from "@/hooks/useLoginWithGoogle";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function LoginForm() {
  const { mutate, isPending } = useLoginMutation();
  const { mutate: mutateGoogleLoginForLearner,isPending: isPendingGoogleLoginForLearner} = useLoginWithGoogle();
  const {mutate: mutateGoogleLoginForReviewer,isPending: isPendingGoogleLoginForReviewer} = useLoginWithGoogle();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"LEARNER" | "REVIEWER">("LEARNER");
  const [showPasswordLearner, setShowPasswordLearner] = useState(false);
  const [showPasswordReviewer, setShowPasswordReviewer] = useState(false);
  const formSchema = z.object({
    email: z.string().min(2).max(100).email(),
    password: z.string().min(6).max(100),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const extractReviewerStatus = (data: unknown): string | undefined => {
    const typed =
      (data as { reviewerStatus?: string; reviewStatus?: string }) || {};
    return typed.reviewerStatus ?? typed.reviewStatus;
  };

  const handleReviewerNavigation = (
    isReviewerActive?: boolean,
    rawStatus?: string
  ) => {
    const reviewerStatus = rawStatus || "Pending";
    if (reviewerStatus === "Active" && isReviewerActive) {
      router.push("/dashboard-reviewer-layout");
      return;
    }
    if (reviewerStatus === "Pending" && isReviewerActive === false) {
      router.push("/entrance_information");
      return;
    }
    if (reviewerStatus === "Pending" && isReviewerActive) {
      router.push("/reviewer-waiting");
      return;
    }
    router.push("/dashboard-reviewer-layout");
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      role: selectedRole,
    };
    mutate(payload, {
      onSuccess: (data) => {
        toast.success(data.message || "Đăng nhập thành công!");
        // Điều hướng dựa vào trạng thái
        if (data.role === "LEARNER") {
          if (!data.isPlacementTestDone) {
            router.push("/entrance_test");
          } else {
            router.push("/dashboard-learner-layout?menu=learningPath");
          }
        } else if (data.role === "REVIEWER") {
          handleReviewerNavigation(
            data.isReviewerActive,
            extractReviewerStatus(data)
          );
        } else {
          router.push("/sign-in");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  // Google Login handler
  const handleLoginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    if (selectedRole === "LEARNER") {
      mutateGoogleLoginForLearner(
        { idToken, role: selectedRole },
        {
          onSuccess: (data) => {
            toast.success("Đăng nhập với Google thành công!");
            if (!data?.isPlacementTestDone) {
              router.push("/entrance_test");
            } else {
              router.push("/dashboard-learner-layout?menu=learningPath");
            }
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      ); 
    } else {
      mutateGoogleLoginForReviewer(
        { idToken, role: selectedRole },
        {
          onSuccess: (data) => {
            toast.success("Đăng nhập với Google thành công!");
            handleReviewerNavigation(
              data.isReviewerActive,
              extractReviewerStatus(data)
            );
          },
          onError: (error) => {
            toast.error(error.message);
          }
        }
      );
    }
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
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Đăng nhập</h1>
        <Tabs
          value={selectedRole}
          onValueChange={(v) => setSelectedRole(v as typeof selectedRole)}
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-2 w-full bg-[#22313c] rounded-xl">
            <TabsTrigger
              value="LEARNER"
              className="text-white data-[state=active]:bg-[#2ed7ff] data-[state=active]:text-[#18232a] rounded-xl cursor-pointer"
            >
              Người học
            </TabsTrigger>
            <TabsTrigger
              value="REVIEWER"
              className="text-white data-[state=active]:bg-[#2ed7ff] data-[state=active]:text-[#18232a] rounded-xl cursor-pointer"
            >
              Người đánh giá
            </TabsTrigger>
          </TabsList>

          {/* Tab: Học viên */}
          <TabsContent value="LEARNER">
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
                          placeholder="Email"
                          {...field}
                          className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] focus:outline-none focus:ring-2 focus:ring-[#2ed7ff] placeholder:text-gray-400 text-lg"
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
                        <div className="relative w-full">
                          <FormControl>
                            <Input
                              type={showPasswordLearner ? "text" : "password"}
                              placeholder="Mật khẩu"
                              {...field}
                              className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] pr-12 focus:outline-none focus:ring-2 focus:ring-[#2ed7ff] placeholder:text-gray-400 text-lg w-full"
                            />
                          </FormControl>

                          {/* 👁 Icon bật/tắt hiển thị mật khẩu */}
                          <button
                            type="button"
                            onClick={() => setShowPasswordLearner(!showPasswordLearner)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2ed7ff]"
                          >
                            {showPasswordLearner ? <EyeOff size={22} /> : <Eye size={22} />}
                          </button>
                        </div>

                        {/* Link QUÊN? */}
                        <span
                          onClick={() => router.push("/forgot-password")}
                          className="ml-3 text-gray-400 text-sm cursor-pointer whitespace-nowrap"
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
                {isPendingGoogleLoginForLearner ? (
                  <div className="flex justify-center mt-4">
                    <Loader2 className="inline-block animate-spin text-white" />
                  </div>
                ) : (
                  <GoogleLoginButton onClick={handleLoginWithGoogle} />
                )}

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
          </TabsContent>

          {/* Tab: Reviewer */}
          <TabsContent value="REVIEWER">
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
                          placeholder="Email"
                          {...field}
                          className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] focus:outline-none focus:ring-2 focus:ring-[#2ed7ff] placeholder:text-gray-400 text-lg"
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
                        <div className="relative w-full">
                          <FormControl>
                            <Input
                              type={showPasswordReviewer ? "text" : "password"}
                              placeholder="Mật khẩu"
                              {...field}
                              className="bg-[#22313c] text-white border border-[#2c3e50] rounded-xl px-4 py-[23px] pr-12 focus:outline-none focus:ring-2 focus:ring-[#2ed7ff] placeholder:text-gray-400 text-lg w-full"
                            />
                          </FormControl>

                          {/* 👁 Icon bật/tắt hiển thị mật khẩu */}
                          <button
                            type="button"
                            onClick={() => setShowPasswordReviewer(!showPasswordReviewer)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2ed7ff]"
                          >
                            {showPasswordReviewer ? <EyeOff size={22} /> : <Eye size={22} />}
                          </button>
                        </div>

                        {/* Link QUÊN? */}
                        <span
                          onClick={() => router.push("/forgot-password")}
                          className="ml-3 text-gray-400 text-sm cursor-pointer whitespace-nowrap"
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
                {isPendingGoogleLoginForReviewer ? (
                  <div className="flex justify-center mt-4">
                    <Loader2 className="inline-block animate-spin text-white" />
                  </div>
                ) : ( 
                  <GoogleLoginButton onClick={handleLoginWithGoogle} />
                )}
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
          </TabsContent>
        </Tabs>

        <AdvertisingMessage />
      </div>
    </div>
  );
}