import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { Bot, User, Camera, Waves } from "lucide-react";

interface MessageProps {
  type: "agent" | "user";
  text: string;
  timestamp?: number;
}

interface TranscriptionMessage {
  id: string;
  text: string;
  type: "agent" | "user";
  firstReceivedTime: number;
}

const Message = ({ type, text, timestamp }: MessageProps) => {
  const formatTime = (time?: number) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex gap-3 mb-4 ${type === "user" ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          type === "agent"
            ? "bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg"
            : "bg-linear-to-br from-green-500 to-emerald-600 shadow-lg"
        }`}
      >
        {type === "agent" ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex-1 ${type === "user" ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-[85%] ${
            type === "agent"
              ? "bg-white border border-blue-100 rounded-2xl rounded-tl-sm"
              : "bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl rounded-tr-sm"
          } px-4 py-3 shadow-sm`}
        >
          <p
            className={`text-sm leading-relaxed ${
              type === "agent" ? "text-gray-800" : "text-white"
            }`}
          >
            {text}
          </p>
        </div>
        {timestamp && (
          <p className="text-xs text-gray-400 mt-1 px-2">
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

const EnhancedVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });
  const [messages, setMessages] = useState<TranscriptionMessage[]>([]);

  useEffect(() => {
    const allMessages: TranscriptionMessage[] = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" as const })) ??
        []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" as const })) ??
        []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
    if (allMessages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(allMessages));
    }
  }, [agentTranscriptions, userTranscriptions]);

  const getStateText = () => {
    switch (state) {
      case "listening":
        return "Đang nghe...";
      case "thinking":
        return "Đang xử lý...";
      case "speaking":
        return "Đang trả lời...";
      default:
        return "Sẵn sàng";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Left Column - User Camera & AI Visualizer */}
      <div className="flex flex-col gap-6">
        {/* User Camera Card */}
        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-lg relative">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <h3 className="text-xs font-semibold text-white flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-green-400" />
              Camera của bạn
            </h3>
          </div>

          {/* Video Track */}
          <div className="aspect-video bg-gray-900 relative">
            {localParticipant.localParticipant &&
            localParticipant.cameraTrack ? (
              <VideoTrack
                trackRef={{
                  participant: localParticipant.localParticipant,
                  publication: localParticipant.cameraTrack,
                  source: Track.Source.Camera,
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">Camera chưa bật</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Voice Visualizer Card */}
        <div className="bg-linear-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl p-6 border border-blue-400 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-200" />
              AI Assistant
            </h3>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                state === "speaking"
                  ? "bg-white/30 text-white"
                  : "bg-white/20 text-blue-100"
              }`}
            >
              {getStateText()}
            </span>
          </div>

          {/* Visualizer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-inner border border-white/20 min-h-[180px] flex items-center justify-center">
            <BarVisualizer state={state} barCount={15} trackRef={audioTrack} />
          </div>
        </div>

        {/* Control Bar Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <VoiceAssistantControlBar />
        </div>
      </div>

      {/* Right Column - Transcript Messages */}
      <div className="flex flex-col">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Phụ đề trò chuyện
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Tất cả nội dung được ghi âm tự động
            </p>
          </div>

          {/* Messages Container - Manual Scroll */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-white scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Chưa có tin nhắn
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Bắt đầu nói để cuộc trò chuyện được ghi lại
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <Message
                    key={msg.id || index}
                    type={msg.type}
                    text={msg.text}
                    timestamp={msg.firstReceivedTime}
                  />
                ))}
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Tổng:{" "}
              <span className="font-semibold text-gray-700">
                {messages.length}
              </span>{" "}
              tin nhắn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVoiceAssistant;
