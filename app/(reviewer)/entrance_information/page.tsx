"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { useUploadCertificate } from "@/features/reviewer/hooks/useUploadCertificateMutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const EntranceInformation = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // const { mutate: uploadCertificate, isPending } = useUploadCertificate();
  const router = useRouter();
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Chưa chọn file!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    // uploadCertificate(formData, {
    //   onSuccess: async (data) => {
    //     toast.success(data.message || "Upload thành công");

    //     if (typeof window.forceRefreshToken === "function") {
    //       await window.forceRefreshToken();
    //       router.push("/dashboard-reviewer-layout");
    //     }
    //   },
    //   onError: (error) => {
    //     toast.error(error.message || "Upload thất bại");
    //   },
    // });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#18232a] px-4">
      <Card className="w-full max-w-md bg-[#18232a] border-none text-white rounded-2xl shadow-xl p-2">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-extrabold tracking-wide">
            Upload bằng cấp
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Tải lên bằng cấp của bạn
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên bằng cấp"
                className="bg-[#22313c] border-[#2c3e50] text-white h-[50px] rounded-xl focus:ring-2 focus:ring-[#2ed7ff]/50 "
              />
            </div>

            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer w-60 bg-[#22313c] border-[#2c3e50] file:text-white h-11 rounded-xl focus:ring-2 focus:ring-[#2ed7ff]/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer h-11 text-base bg-[#2ed7ff] text-[#18232a] hover:bg-[#1ec6e6] rounded-xl font-semibold transition-all"
            >
              {/* {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Upload"
              )} */}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntranceInformation;
