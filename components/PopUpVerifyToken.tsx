import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";


// OTP Popup Component
interface OTPPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otpInput: string) => void;
  onResendOTP: () => void;
  onResendOTPSuccess?: () => void; // Callback khi resend thành công
  isVerifying: boolean;
  isResendingOTP?: boolean; // State cho loading resend button
}
export const OTPPopup = ({ isOpen, onClose, onVerify, onResendOTP, onResendOTPSuccess, isVerifying, isResendingOTP }: OTPPopupProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset countdown when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]); // Reset OTP when reopened
    }
  }, [isOpen]);

  // Handle successful resend OTP
  useEffect(() => {
    if (onResendOTPSuccess) {
      setTimeLeft(60); // Reset timer
      setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      toast.success("Đã gửi lại mã OTP!");
      // Call the callback để reset state trong parent
      onResendOTPSuccess();
    }
  }, [onResendOTPSuccess]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // Just set to 0, don't close popup or show error
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onVerify(otpString);
    } else {
      toast.error("Vui lòng nhập đủ 6 số");
    }
  };

  const handleResendOTP = () => {
    onResendOTP(); // Call parent's resend function - chờ thành công mới reset
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#18232a]  flex items-center justify-center">
      <div className="bg-[#18232a] p-8 rounded-2xl max-w-md w-full mx-4 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Xác thực OTP</h2>
          <Button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
             <p>Close</p>
          </Button>
        </div>
        
        <p className="text-gray-300 mb-2 text-center">
          Nhập mã OTP 6 số đã được gửi đến email của bạn
        </p>
        
        <div className="text-center mb-6 flex flex-col items-center">
         
          <p className="text-gray-400 text-sm mt-1 mb-4">
            OTP còn hiệu lực trong
          </p>
           <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-[#2ed7ff]'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-white bg-[#18232a] border border-[#616163] rounded-lg text-lg focus:border-[#2ed7ff] focus:outline-none"
              maxLength={1}
            />
          ))}
        </div>

        {timeLeft > 0 ? (
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-3 rounded-xl hover:bg-[#1ec6e6] transition cursor-pointer"
          >
            {isVerifying ? "Đang xác thực..." : "Xác thực"}
          </Button>
        ) : (
          <Button
            onClick={handleResendOTP}
            disabled={isResendingOTP}
            className="w-full bg-gray-600 text-white font-semibold text-lg py-3.5 rounded-xl hover:bg-gray-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResendingOTP ? "Đang gửi..." : "Gửi lại mã OTP"}
          </Button>
        )}
      </div>
    </div>
  );
};