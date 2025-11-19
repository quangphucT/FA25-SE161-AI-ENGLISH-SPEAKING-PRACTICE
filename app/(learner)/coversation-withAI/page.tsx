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
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import EnhancedVoiceAssistant from "@/components/ai-conversation/EnhancedVoiceAssistant";
import { useChartCoinForConversation } from "@/features/learner/hooks/chartCoinForConversation/useChartCoinForConversation";
import { useGetAIPackages } from "@/features/learner/hooks/ai-packagesHooks/aiPackages";

interface AIPackage {
  allowedMinutes: number;
  amountCoin: number;
  aiConversationChargeId: string;
}

const ConversationWithAI = () => {
  const router = useRouter();
  const { data: userData, refetch: refetchUserData } = useGetMeQuery();
  const {data: aiPackagesData} = useGetAIPackages();
  
  const [name, setName] = useState("");
  const [duration, setDuration] = useState<string>("");
  const [showLiveKit, setShowLiveKit] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { mutate: chartCoinForConversationMutation } = useChartCoinForConversation();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use API data for duration options - data is directly in aiPackagesData, not aiPackagesData.data
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

  const getToken = useCallback(async (userName: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIVEKIT_TOKEN_URL}?name=${encodeURIComponent(
          userName
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
    } catch (error) {
     
      toast.error("Không thể kết nối. Vui lòng thử lại!");
      setShowLiveKit(false);
    }
  }, []);

  useEffect(() => {
    if (showLiveKit && name) {
      getToken(name);
    }
  }, [showLiveKit, name, getToken]);

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
    }, 1000); // Increased to 1 second for proper cleanup
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


  
  const handleStart = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên của bạn");
      return;
    }
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

    chartCoinForConversationMutation(
      { aiConversationChargeId: selectedOption.id },
      {
        onSuccess: () => {
          // Clear old messages from previous conversation
          localStorage.removeItem("messages");
          
          toast.success("Bắt đầu trò chuyện với AI!");
          setShowLiveKit(true);
          refetchUserData();
        },
      }
    );
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-6">
      {/* LiveKit Modal - Enhanced Design */}
      {showLiveKit && (

        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-white/50 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header with Gradient & Decorative Elements */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 flex items-center justify-between flex-shrink-0 overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-300 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                {/* Animated Icon */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-blue-100 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    AI Voice Assistant
                    <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                      Live
                    </span>
                  </h2>
                  <p className="text-blue-100 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {token
                      ? "Đã kết nối - Sẵn sàng trò chuyện!"
                      : "Đang kết nối với trợ lý AI..."}
                  </p>
                </div>
              </div>

              {/* Timer Display */}
              {token && timeRemaining > 0 && (
                <div className="relative z-10 mx-4">
                  <div className={`px-4 py-2 rounded-xl backdrop-blur-sm font-mono text-lg font-bold flex items-center gap-2 ${
                    timeRemaining <= 60 ? 'bg-red-500/90 text-white animate-pulse' : 
                    timeRemaining <= 120 ? 'bg-yellow-500/90 text-white' : 
                    'bg-white/20 text-white'
                  }`}>
                    <Clock className="w-5 h-5" />
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (isDisconnecting) return; // Prevent multiple clicks
                  
                  setIsDisconnecting(true);
                  
                  // Clear timer
                  if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                  }
                  
                  toast.info("Đang kết thúc trò chuyện...");
                  
                  // Give time for cleanup
                  setTimeout(() => {
                    setShowLiveKit(false);
                    setToken(null);
                    setServerUrl(null);
                    setTimeRemaining(0);
                    setIsDisconnecting(false);
                    
                    // Navigate to feedback page
                    router.push("/aiFeedback-afterConver");
                  }, 1000);
                }}
                disabled={isDisconnecting}
                className={`relative z-10 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 group ${
                  isDisconnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title="Đóng"
              >
                <X className="w-6 h-6 text-white group-hover:text-red-200 transition-colors" />
              </button>
            </div>

            {/* Content - Scrollable with Enhanced Styling */}
            <div className="p-8 overflow-y-auto flex-1 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent">
              {token ? (
                <div className="h-full">

                     {/* LiveKit Room có nhiệm vụ là kết nối vào 1 cái room trên livekit server để stream audio/video và dữ liệu thời gian thực */}
                  <LiveKitRoom
                    serverUrl={
                      serverUrl || process.env.NEXT_PUBLIC_LIVEKIT_URL || ""
                    }
                    token={token}
                    connect={!isDisconnecting}
                    video={false}
                    audio={true}
                    onDisconnected={handleDisconnect}
                    onError={(error) => {
                      console.error("LiveKit Room Error:", error);
                      // Don't show error toast if we're intentionally disconnecting
                      if (!isDisconnecting && !error.message?.includes("Client initiated disconnect")) {
                        toast.error(`Lỗi kết nối: ${error.message}`);
                      }
                    }}
                  >
                    <RoomAudioRenderer />  {/* Xử lý phát âm thanh từ phòng LiveKit */}
                    
                    <EnhancedVoiceAssistant /> {/* Hiển thị nội dung cuộc trò chuyện với AI */}
                  </LiveKitRoom>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100/50">
                  {/* Animated Loading Spinner */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-xl font-bold text-gray-800">
                      Đang kết nối...
                    </p>
                    <p className="text-sm text-gray-500 max-w-md">
                      Đang thiết lập kết nối với AI Assistant. Vui lòng chờ
                      trong giây lát...
                    </p>
                  </div>

                  {/* Loading Progress Dots */}
                  <div className="flex gap-2 mt-6">
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Tips */}
            {token && (
              <div className="px-8 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-t border-blue-100 flex-shrink-0">
                <div className="flex items-center gap-3 text-xs text-blue-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="flex-1">
                    <span className="font-semibold">Mẹo:</span> Nói rõ ràng và
                    tự nhiên. AI sẽ phản hồi theo thời gian thực và điều chỉnh
                    theo trình độ của bạn.
                  </p>
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
                Luyện tập giao tiếp tiếng Anh với trợ lý AI
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Input Form */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Thông tin trò chuyện
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Name Input */}
                <div className="space-y-2">
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
                </div>

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
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Thanh toán
              </h3>

              {/* Coin Balance */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
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

          {/* Start Button */}
          <div className="mt-4">
            <Button
              onClick={handleStart}
              disabled={!name.trim() || !duration}
              className={`w-full h-12 text-base font-bold rounded-lg transition-all duration-300 ${
                hasEnoughCoins && name.trim() && duration
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl cursor-pointer rounded-4xl"
                  : "bg-gray-300 hover:bg-gray-300 text-black-500 cursor-not-allowed rounded-4xl"
              }`}
            >
              {!hasEnoughCoins && duration ? (
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
      </Card>



    </div>
  );
};

export default ConversationWithAI;
