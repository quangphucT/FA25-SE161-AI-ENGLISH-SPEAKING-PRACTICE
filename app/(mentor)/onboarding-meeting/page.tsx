"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { VideoIcon, Users, User } from "lucide-react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

const OnBoardingMeeting = () => {
  const { fullName, setFullName } = useUser();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setFullName("");
  }, []);

  // Create new room with loading
  const handleCreateRoom = async () => {
    if (!fullName.trim()) return;

    setIsCreatingRoom(true);
    try {
      // Simulate loading time (có thể thay bằng API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate new room ID và redirect
      const newRoomId = uuidv4();
      router.push(`/room/${newRoomId}`);
    } catch (error) {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-[100px]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Phòng Meeting</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-8">
              {/* Mentor Name Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4" />
                  Tên Mentor
                </label>
                <Input
                  type="text"
                  placeholder="Nhập tên đầy đủ của bạn (vd: Thầy Nguyễn Văn A)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value.toString())}
                  className="h-12 text-lg border-2 focus:border-blue-500 rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  Tên này sẽ hiển thị cho học viên trong buổi học
                </p>
              </div>

              {/* Meeting Controls */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                {/* Create New Room Button - khi chưa có Room ID */}

                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Chưa có Room ID? Tạo phòng mới
                    </p>

                    <Button
                      onClick={handleCreateRoom}
                      disabled={!fullName.trim() || isCreatingRoom}
                      className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingRoom ? (
                        <>
                          <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Đang tạo...
                        </>
                      ) : (
                        <>Tạo Room</>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <VideoIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-900">
                      Video HD
                    </p>
                    <p className="text-xs text-blue-600">
                      Chất lượng hình ảnh rõ nét
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-900">
                      Đa người dùng
                    </p>
                    <p className="text-xs text-purple-600">
                      Hỗ trợ tối đa 10 người
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingMeeting;
