import {
  useVoiceAssistant,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
  VideoTrack,
  useTracks,
  useMultibandTrackVolume,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState, useMemo, useRef } from "react";
import { Bot, User, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import "@livekit/components-styles";

interface TranscriptionMessage {
  id: string;
  text: string;
  type: "agent" | "user";
  firstReceivedTime: number;
}

// Custom Wave Visualizer Component - 7 bars giống icon, dựa trên audio thực tế
const WaveVisualizer = ({ 
  state, 
  trackRef
}: { 
  state?: string;
  trackRef?: TrackReferenceOrPlaceholder | null;
}) => {
  // Lấy audio data thực tế từ track - 7 frequency bands
  // Voice frequency range: ~85Hz - ~255Hz (fundamental) và harmonics lên đến ~8000Hz
  const volumeBands = useMultibandTrackVolume(trackRef || undefined, {
    bands: 7,
    loPass: 0, // Bắt đầu từ đầu để capture toàn bộ voice range
    hiPass: undefined, // Không giới hạn để capture harmonics
  });

  // Base heights tạo peak ở giữa (bar thứ 4)
  const baseHeights = useMemo(() => [30, 45, 60, 80, 60, 45, 30], []);
  
  // Map audio volume vào heights với smoothing
  // Tất cả 7 bars đều di chuyển dựa trên audio
  const heights = useMemo(() => {
    // Nếu không có track hoặc không speaking, trả về base heights
    if (!trackRef || state !== "speaking") {
      return baseHeights;
    }

    // Kiểm tra xem có audio data không (tổng volume > threshold)
    const totalVolumeCheck = volumeBands.reduce((sum, v) => sum + v, 0);
    const hasAudio = totalVolumeCheck > 0.01; // Threshold nhỏ để detect audio

    if (!hasAudio) {
      return baseHeights;
    }

    // Volume bands đã được normalize về 0-1 từ useMultibandTrackVolume
    // Tất cả 7 bars đều nhận audio data và di chuyển
    // Đảm bảo có đủ 7 values
    let bands = [...volumeBands];
    if (bands.length < 7) {
      // Nếu có ít hơn 7 bands, duplicate hoặc spread giá trị
      while (bands.length < 7) {
        bands.push(bands[bands.length - 1] || 0);
      }
    }
    bands = bands.slice(0, 7); // Đảm bảo chỉ lấy 7 giá trị
    
    // Tính tổng volume để scale tất cả bars
    const bandsTotalVolume = bands.reduce((sum, v) => sum + v, 0);
    const avgVolume = bandsTotalVolume / 7;
    
    return bands.map((volume, i) => {
      // Volume đã normalize (0-1), clamp để đảm bảo trong range
      let normalizedVolume = Math.max(0, Math.min(1, volume));
      
      // Nếu volume quá thấp, sử dụng average để đảm bảo tất cả bars đều có movement
      if (normalizedVolume < 0.1 && avgVolume > 0.01) {
        normalizedVolume = avgVolume * 0.5; // Dùng 50% của average
      }
      
      // Base height đảm bảo shape giống icon (peak ở giữa)
      const baseHeight = baseHeights[i];
      
      // Volume boost: tăng height dựa trên audio level
      // Sử dụng square root để làm mượt hơn và responsive hơn
      const volumeBoost = Math.sqrt(normalizedVolume) * 60; // Tăng tối đa 60%
      
      // Kết hợp base + volume boost
      const newHeight = Math.max(20, Math.min(100, baseHeight + volumeBoost));
      
      return newHeight;
    });
  }, [volumeBands, trackRef, state, baseHeights]);

  // Smooth heights với transition
  const [smoothHeights, setSmoothHeights] = useState<number[]>(baseHeights);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Smooth transition giữa các heights với requestAnimationFrame
    // Tất cả 7 bars đều animate
    const animate = () => {
      setSmoothHeights((prev) => {
        let allReached = true;
        const newHeights = prev.map((prevHeight, i) => {
          const targetHeight = heights[i];
          
          // Exponential smoothing với factor 0.25 để mượt mà và responsive
          const newHeight = prevHeight + (targetHeight - prevHeight) * 0.25;
          
          // Kiểm tra xem đã đến target chưa
          if (Math.abs(newHeight - targetHeight) > 0.1) {
            allReached = false;
          }
          
          return newHeight;
        });
        
        // Nếu tất cả đã đến target, dừng animation
        if (allReached) {
          return heights;
        }
        
        return newHeights;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [heights]);

  return (
    <div className="flex items-end justify-center gap-2 h-24">
      {smoothHeights.map((height, index) => (
        <div
          key={index}
          className="bg-white/90 rounded-sm"
          style={{
            width: '8px',
            height: `${height}%`,
            minHeight: '20px',
            // Không dùng CSS transition vì đang dùng JS animation
          }}
        />
      ))}
    </div>
  );
};

const EnhancedVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  
  // Lấy tất cả remote audio tracks để tìm track của agent
  const remoteAudioTracks = useTracks(
    [{ source: Track.Source.Microphone, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  // Tìm track của agent từ audioTrack hoặc remote tracks
  const agentTrack = useMemo(() => {
    if (audioTrack) {
      return {
        trackRef: audioTrack,
        track: audioTrack.publication?.track,
        publication: audioTrack.publication,
      };
    }
    
    // Fallback: tìm remote audio track đầu tiên (thường là agent)
    const remoteTrack = remoteAudioTracks.find(
      (t) => t.participant?.identity?.includes('agent') || 
             t.participant?.identity?.includes('assistant') ||
             t.participant?.identity?.includes('va-')
    ) || remoteAudioTracks[0];
    
    if (remoteTrack) {
      return {
        trackRef: {
          participant: remoteTrack.participant,
          publication: remoteTrack.publication,
          source: remoteTrack.source,
        },
        track: remoteTrack.publication?.track,
        publication: remoteTrack.publication,
      };
    }
    
    return null;
  }, [audioTrack, remoteAudioTracks]);

  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState<TranscriptionMessage[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<TranscriptionMessage[]>([]);
  const [isSubtitleExpanded, setIsSubtitleExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lưu messages vào localStorage và state
  useEffect(() => {
    const allMessages: TranscriptionMessage[] = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" as const })) ??
        []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" as const })) ??
        []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    
    // Group consecutive messages of the same type within 3 seconds
    const grouped: TranscriptionMessage[] = [];
    allMessages.forEach((msg) => {
      const lastMsg = grouped[grouped.length - 1];
      
      // If same type and within 3 seconds, merge the text
      if (
        lastMsg && 
        lastMsg.type === msg.type && 
        Math.abs(msg.firstReceivedTime - lastMsg.firstReceivedTime) < 3000
      ) {
        // Update the last message with combined text
        lastMsg.text = `${lastMsg.text} ${msg.text}`;
      } else {
        // Add as new message
        grouped.push({ ...msg });
      }
    });
    
    setMessages(allMessages);
    setGroupedMessages(grouped);
    if (allMessages.length > 0) {
      localStorage.setItem("messages", JSON.stringify(allMessages));
    }
  }, [agentTranscriptions, userTranscriptions]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isSubtitleExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSubtitleExpanded]);

  const getStateText = () => {
    switch (state) {
      case "listening":
        return "Đang nghe...";
      case "thinking":
        return "Đang xử lý...";
      case "speaking":
        return "Đang nói...";
      default:
        return "Sẵn sàng";
    }
  };

  const getStateColor = () => {
    switch (state) {
      case "listening":
        return "from-emerald-500 to-teal-600";
      case "thinking":
        return "from-amber-500 to-orange-600";
      case "speaking":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-5xl px-6">
        
        {/* AI Avatar & Visualizer Section */}
        <div className="flex flex-col items-center">
          {/* AI Avatar with Pulse Effect */}
          <div className="relative mb-8">
            {/* Outer Pulse Ring */}
            <div className={`absolute -inset-4 rounded-full bg-linear-to-r ${getStateColor()} opacity-20 ${state === 'speaking' ? 'animate-ping' : state === 'listening' ? 'animate-pulse' : ''}`} />
            <div className={`absolute -inset-2 rounded-full bg-linear-to-r ${getStateColor()} opacity-30 ${state === 'speaking' || state === 'listening' ? 'animate-pulse' : ''}`} />
            
            {/* Main Avatar */}
            <div className={`relative w-32 h-32 rounded-full bg-linear-to-br ${getStateColor()} flex items-center justify-center shadow-2xl border-4 border-white/20`}>
              <Bot className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            
            {/* Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${
              state === 'speaking' ? 'bg-blue-500' : 
              state === 'listening' ? 'bg-emerald-500' : 
              state === 'thinking' ? 'bg-amber-500' : 'bg-gray-400'
            }`}>
              <div className={`w-3 h-3 rounded-full bg-white ${state !== 'idle' ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          {/* AI Name & Status */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">AI Agent</h2>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r ${getStateColor()} text-white text-sm font-semibold shadow-lg`}>
              <span className={`w-2 h-2 rounded-full bg-white ${state !== 'idle' ? 'animate-pulse' : ''}`} />
              {getStateText()}
            </div>
          </div>

          {/* Audio Visualizer */}
          <div className="bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50 min-w-[320px]">
            <div className="flex items-center justify-center h-28">
              {agentTrack?.trackRef ? (
                <WaveVisualizer 
                  state={state} 
                  trackRef={agentTrack.trackRef}
                />
              ) : (
                <WaveVisualizer state={state} />
              )}
            </div>
          </div>
        </div>

        {/* User Camera Section */}
        <div className="flex flex-col items-center">
          {/* Camera Card */}
          <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
            {/* Camera Label */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-white">Camera của bạn</span>
            </div>

            {/* Video Container */}
            <div className="w-80 h-60">
              {localParticipant.localParticipant && localParticipant.cameraTrack ? (
                <VideoTrack
                  trackRef={{
                    participant: localParticipant.localParticipant,
                    publication: localParticipant.cameraTrack,
                    source: Track.Source.Camera,
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-600">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Camera đang tắt</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mt-6">
            <h3 className="text-lg font-semibold text-white">Bạn</h3>
            <p className="text-sm text-gray-400">Nói tự nhiên, AI sẽ phản hồi</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="mt-10">
        <VoiceAssistantControlBar />
      </div>

      {/* Floating Subtitle Panel - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-50 w-96">
        {/* Header - Always visible */}
        <button
          onClick={() => setIsSubtitleExpanded(!isSubtitleExpanded)}
          className="w-full flex items-center justify-between bg-gray-900/95 backdrop-blur-md px-4 py-3 rounded-t-xl border border-gray-700/50 cursor-pointer hover:bg-gray-800/95 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Phụ đề</span>
            {groupedMessages.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {groupedMessages.length}
              </span>
            )}
          </div>
          {isSubtitleExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Messages Container - Collapsible */}
        {isSubtitleExpanded && (
          <div className="bg-gray-900/90 backdrop-blur-md border-x border-b border-gray-700/50 rounded-b-xl max-h-[500px] overflow-y-auto">
            {groupedMessages.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500">Chưa có phụ đề...</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {groupedMessages.slice(-10).map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex gap-2 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      msg.type === "agent" 
                        ? "bg-blue-500" 
                        : "bg-emerald-500"
                    }`}>
                      {msg.type === "agent" ? (
                        <Bot className="w-3 h-3 text-white" />
                      ) : (
                        <User className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    {/* Message */}
                    <div className={`flex-1 ${msg.type === "user" ? "text-right" : ""}`}>
                      <p className={`text-xs leading-relaxed px-2.5 py-1.5 rounded-lg inline-block max-w-[90%] ${
                        msg.type === "agent"
                          ? "bg-gray-800 text-gray-200"
                          : "bg-blue-600 text-white"
                      }`}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVoiceAssistant;