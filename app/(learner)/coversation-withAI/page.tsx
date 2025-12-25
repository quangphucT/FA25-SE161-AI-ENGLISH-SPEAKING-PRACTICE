"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  Clock,
  Coins,
  User,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import EnhancedVoiceAssistant from "@/components/ai-conversation/EnhancedVoiceAssistant";
import { useChartCoinForConversation } from "@/features/learner/hooks/chartCoinForConversation/useChartCoinForConversation";
import { useGetAIPackages } from "@/features/learner/hooks/ai-packagesHooks/aiPackages";
import "@livekit/components-styles";
interface AIPackage {
  allowedMinutes: number;
  amountCoin: number;
  aiConversationChargeId: string;
}

const ConversationWithAI = () => {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  console.log("UserData:", userData)
  const queryClient = useQueryClient();
  const {data: aiPackagesData} = useGetAIPackages();
  const [duration, setDuration] = useState<string>("");
  const [showLiveKit, setShowLiveKit] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { mutate: chartCoinForConversationMutation } = useChartCoinForConversation();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationOptions = Array.isArray(aiPackagesData) 
    ? aiPackagesData.map((pkg: AIPackage) => ({
        value: pkg.allowedMinutes.toString(),
        label: `${pkg.allowedMinutes} phút`,
        coins: pkg.amountCoin,
        id: pkg.aiConversationChargeId
      }))
    : [];

  const selectedOption = durationOptions.find((opt) => opt.value === duration);
  const requiredCoins = selectedOption?.coins || 0;
  const userCoins = userData?.coinBalance || 0;
  const hasEnoughCoins = userCoins >= requiredCoins;

  const getToken = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVEKIT_TOKEN_URL}?name=${encodeURIComponent(
          userId
        )}`
      );
      const contentType = response.headers.get("content-type") || "";
      const bodyText = await response.text();
      
     

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.status} ${bodyText}`);
      }
      if (!contentType.includes("application/json")) {
        throw new Error("Failed to get token: unexpected response format");
      }
      const data = JSON.parse(bodyText);
      
     
      
      setToken(data.token);
      setServerUrl(data.url);
      return true; // Trả về true nếu thành công
    } catch (error) {
     
      toast.error("Không thể kết nối. Vui lòng thử lại!");
      setShowLiveKit(false);
      throw error; // Throw error để handleStart có thể catch
    }
  }, []);

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    if (isDisconnecting) return; // Prevent multiple calls
    
    setIsDisconnecting(true);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Give time for localStorage to save and LiveKit to disconnect properly
    setTimeout(() => {
      setShowLiveKit(false);
      setToken(null);
      setServerUrl(null);
      setTimeRemaining(0);
      setIsDisconnecting(false);
      
      // Navigate to feedback page
      router.push("/aiFeedback-afterConver");
    }, 500); 
  }, [router, isDisconnecting]);

  // Timer countdown effect
  useEffect(() => {
    if (showLiveKit && token && duration) {
      const totalSeconds = parseInt(duration) * 60;
      setTimeRemaining(totalSeconds);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // When time runs out
          if (newTime <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            
            // Disconnect and redirect to feedback
            toast.info("Hết thời gian trò chuyện!");
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
              handleDisconnect();
            }, 0);
            
            return 0;
          }

          // Warning at 1 minute remaining
          if (newTime === 60) {
            toast.warning("Còn 1 phút!");
          }

          // Warning at 30 seconds remaining
          if (newTime === 30) {
            toast.warning("Còn 30 giây!");
          }

          return newTime;
        });
      }, 1000);

      // Cleanup on unmount or when modal closes
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [showLiveKit, token, duration, handleDisconnect]);

  // Format time remaining for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  
  const handleStart = async () => {
    // if (!name.trim()) {
    //   toast.error("Vui lòng nhập tên của bạn");
    //   return;
    // }
    if (!duration) {
      toast.error("Vui lòng chọn thời gian muốn trò chuyện");
      return;
    }
    if (!hasEnoughCoins) {
      toast.error("Số dư không đủ! Vui lòng nạp thêm coin");
      return;
    }

    if (!selectedOption?.id) {
      toast.error("Không tìm thấy gói đã chọn");
      return;
    }

    // Gọi getToken trước để đảm bảo kết nối thành công
    setIsStarting(true);
    try {
      const userId = userData?.userId || "";
      const tokenSuccess = await getToken(userId);
      
      // Chỉ gọi mutation nếu getToken thành công
      if (tokenSuccess) {
        chartCoinForConversationMutation(
          { aiConversationChargeId: selectedOption.id },
          {
            onSuccess: () => {
              // Clear old messages from previous conversation
              localStorage.removeItem("messages");
              setShowLiveKit(true);
              toast.success("Bắt đầu trò chuyện với AI!");
              queryClient.invalidateQueries({ queryKey: ["getMe"] });
              setIsStarting(false);
            },
            onError: (error) => {
              // Nếu mutation thất bại, reset token và serverUrl
              setToken(null);
              setServerUrl(null);
              setShowLiveKit(false);
              toast.error(error.message || "Không thể khấu trừ coin. Vui lòng thử lại!");
              setIsStarting(false);
            },
          }
        );
      } else {
        setIsStarting(false);
      }
    } catch (error) {
      // getToken đã thất bại, không gọi mutation
      // Error đã được xử lý trong getToken (toast.error)
      console.error("Failed to get token:", error);
      setIsStarting(false);
    }
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-6">
      {/* LiveKit Modal - Enhanced Design */}
      {showLiveKit && (

        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl z-50 flex flex-col animate-in fade-in duration-300">
          {/* Minimal Professional Header */}
          <div className="relative px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10">
            {/* Left - Logo & Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Luyện nói với AI</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-400">
                      {token ? "Đã kết nối" : "Đang kết nối..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Timer */}
            {token && timeRemaining > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className={`px-6 py-2.5 rounded-full font-mono text-xl font-bold flex items-center gap-3 transition-all duration-300 ${
                  timeRemaining <= 60 
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                    : timeRemaining <= 120 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30' 
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  <Clock className="w-5 h-5" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}

            {/* Right - End Call Button */}
            <button
              onClick={() => {
                if (isDisconnecting) return;
                
                setIsDisconnecting(true);
                
                if (timerIntervalRef.current) {
                  clearInterval(timerIntervalRef.current);
                  timerIntervalRef.current = null;
                }
                
                toast.info("Đang kết thúc...");
                
                setTimeout(() => {
                  setShowLiveKit(false);
                  setToken(null);
                  setServerUrl(null);
                  setTimeRemaining(0);
                  setIsDisconnecting(false);
                  
                  router.push("/aiFeedback-afterConver");
                }, 500);
              }}
              disabled={isDisconnecting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 ${
                isDisconnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <X className="w-4 h-4" />
              Kết thúc
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {token ? (
              <LiveKitRoom
                serverUrl={
                  serverUrl || process.env.NEXT_PUBLIC_LIVEKIT_URL || ""
                }
                token={token}
                connect={!isDisconnecting}
                video={true}
                audio={true}
                onDisconnected={handleDisconnect}
                onError={(error) => {
                  console.error("LiveKit Room Error:", error);
                  if (!isDisconnecting && !error.message?.includes("Client initiated disconnect")) {
                    toast.error(`Connection error: ${error.message}`);
                  }
                }}
              >
                <RoomAudioRenderer />
                <EnhancedVoiceAssistant />
              </LiveKitRoom>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                {/* Loading State */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justif
                  
                  
                  
                  y-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  {/* Spinning Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Connecting to AI...</h3>
                <p className="text-gray-400 text-sm">Please wait while we set up your session</p>

                {/* Loading Dots */}
                <div className="flex gap-1.5 mt-6">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      )}


      <Card className="w-full max-w-5xl shadow-xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Trò chuyện với AI
              </h1>
              <p className="text-gray-500 text-sm">
                Luyện tập giao tiếp tiếng Anh với AI
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Input Form */}
            <div className="col-span-2 space-y-4">
              {/* <h3 className="text-base font-semibold text-gray-900 mb-3">
                Thông tin trò chuyện
              </h3> */}

              <div className="grid grid-cols-2 gap-4">
                {/* Name Input */}
                {/* <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Tên của bạn
                  </Label>
                  <Input
                    type="text"
                    placeholder="Nhập tên của bạn..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 border border-gray-300 focus:border-blue-500 rounded-lg bg-white"
                  />
                </div> */}

                {/* Duration Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Thời gian trò chuyện
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-11 cursor-pointer border border-gray-300 focus:border-blue-500 rounded-lg bg-white">
                      <SelectValue placeholder="Chọn thời gian..." />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.length > 0 ? (
                        durationOptions.map((option) => (
                          <SelectItem key={option.id} value={option.value}>
                            <div className="flex cursor-pointer items-center justify-between w-full gap-8">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-orange-600 font-bold text-sm">
                                {option.coins} coin
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                          Đang tải gói...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Info Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className=" gap-3 text-xs text-blue-700">
                  <p className="flex items-start gap-1">
                    <span>
                      Chuẩn bị sẵn chủ đề để cuộc trò chuyện thêm phần thú vị
                      hơn, AI sẽ điều chỉnh độ khó theo trình độ của bạn.
                    </span>
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-2">
                <Button
                  onClick={handleStart}
                  disabled={!duration || isStarting}
                  className={`w-full h-12 text-base font-bold rounded-lg transition-all duration-300 ${
                    hasEnoughCoins  && duration && !isStarting
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl cursor-pointer rounded-4xl"
                      : "bg-gray-300 hover:bg-gray-300 text-black-500 cursor-not-allowed rounded-4xl"
                  }`}
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang kết nối...
                    </>
                  ) : !hasEnoughCoins && duration ? (
                    <>
                      <Coins className="w-5 h-5 mr-2" />
                      Nạp thêm Coin
                    </>
                  ) : (
                    <>
                      Bắt đầu trò chuyện
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Thanh toán
              </h3>

              {/* Coin Balance */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 font-medium">
                      Số dư của bạn
                    </p>
                    <p className="text-lg font-black text-orange-600">
                      {userCoins} Coin
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              {duration ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                  <h4 className="font-semibold text-gray-900 text-xs flex items-center gap-1 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    Chi tiết
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedOption?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tỷ lệ:</span>
                      <span className="font-medium text-gray-700">
                        {selectedOption ? (selectedOption.coins / parseInt(selectedOption.value)).toFixed(1) : 0} coin/phút
                      </span>
                    </div>
                    <div className="border-t border-gray-200 my-1.5"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chi phí:</span>
                      <span className="font-bold text-orange-600">
                        {requiredCoins} coin
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Còn lại:</span>
                      <span
                        className={`font-bold ${
                          hasEnoughCoins ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {userCoins - requiredCoins} coin
                      </span>
                    </div>
                  </div>

                  {!hasEnoughCoins && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-1.5 mt-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-red-700">
                        <p className="font-semibold">Không đủ coin!</p>
                        <p>
                          Cần thêm{" "}
                          <span className="font-bold">
                            {requiredCoins - userCoins}
                          </span>{" "}
                          coin
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    Chọn thời gian để xem chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>



    </div>
  );
};

export default ConversationWithAI;
