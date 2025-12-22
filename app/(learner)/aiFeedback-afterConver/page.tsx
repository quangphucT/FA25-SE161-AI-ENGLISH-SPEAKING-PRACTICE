"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Calendar,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Target,
  Lightbulb,
  Award,
  CheckCircle,
} from "lucide-react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import fetchWithAuth from "@/utils/fetchWithAuth";
dayjs.extend(utc);
dayjs.extend(timezone);
interface Message {
  type: "agent" | "user";
  text?: string;
  transcription?: string;
  firstReceivedTime?: number;
  id?: string;
}

interface FeedbackSection {
  title: string;
  description: string;
  items: string[];
}

const feedbackIcons = [
  CheckCircle2,
  TrendingUp,
  Target,
  Lightbulb,
  Award,
  Sparkles,
  MessageSquare,
  CheckCircle2,
];

const feedbackColors = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
  "from-indigo-500 to-blue-600",
  "from-green-500 to-emerald-600",
];

const Feedback = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbackSections, setFeedbackSections] = useState<FeedbackSection[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessagesAndFetchFeedback = async () => {
      const data = localStorage.getItem("messages");
      if (data) {
        try {
          const parsedMessages = JSON.parse(data);
          setMessages(parsedMessages);

          // If we have messages, fetch feedback
          if (parsedMessages.length > 0) {
            setLoading(true);
            setError(null);
            setFeedbackSections([]);

            try {
              // Combine messages into text format
              const conversationText = parsedMessages
                .map((msg: Message) => {
                  const speaker = msg.type === "agent" ? "Agent" : "You";
                  const text = msg.text || msg.transcription || "";
                  return `${speaker}: ${text}`;
                })
                .join("\n");

              // Call the API
              const response = await fetchWithAuth("/api/aiFeedback", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: conversationText,
                }),
              });

              if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
              }

              const data = await response.json();
              setFeedbackSections(parseFeedback(data.feedback || ""));
            } catch (err) {
              console.error("Error fetching feedback:", err);
              setError((err as Error).message || "Failed to fetch feedback");
            } finally {
              setLoading(false);
            }
          }
        } catch (err) {
          console.error("Error parsing messages:", err);
          setError("Failed to load messages");
        }
      }
    };

    loadMessagesAndFetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    if (messages.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Combine messages into text format
      const conversationText = messages
        .map((msg) => {
          const speaker = msg.type === "agent" ? "Agent" : "You";
          const text = msg.text || msg.transcription || "";
          return `${speaker}: ${text}`;
        })
        .join("\n");

      // Call the API
      const response = await fetchWithAuth("/api/aiFeedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: conversationText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setFeedbackSections(parseFeedback(data.feedback || ""));
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError((err as Error).message || "Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/50">
      {/* Professional Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() =>
                router.push("/dashboard-learner-layout?menu=conversationWithAI")
              }
              className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Quay lại</span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {dayjs().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY • HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="flex items-center gap-4 mb-10">
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 bg-gray-900 rounded-xl">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Phản hồi cuộc hội thoại
            </h1>
            <p className="text-gray-500">
              Phân tích và đề xuất cải thiện dựa trên phần luyện nói của bạn
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="relative inline-flex">
              <div className="w-12 h-12 border-3 border-gray-200 rounded-full"></div>
              <div className="w-12 h-12 border-3 border-gray-900 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-1">
              Phân tích...
            </h3>
            <p className="text-gray-500 text-sm">Đang phân tích cuộc hội thoại của bạn</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Đã xảy ra lỗi khi tải phản hồi
              </h3>
              <p className="text-gray-500 text-sm mb-5">{error}</p>
              <Button
                onClick={fetchFeedback}
                className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </Button>
            </div>
          </div>
        )}

        {/* No Messages State */}
        {!loading && !error && messages.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Chưa có cuộc hội thoại nào
            </h3>

            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              Hãy bắt đầu trò chuyện với AI để nhận phản hồi và đánh giá
            </p>

            <Button
              onClick={() =>
                router.push(`/dashboard-learner-layout?menu=conversationWithAI`)
              }
              className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
            >
              Bắt đầu luyện nói
            </Button>
          </div>
        )}

        {/* Feedback Content */}
        {!loading &&
          !error &&
          feedbackSections.length > 0 &&
          (() => {
            const displaySections: FeedbackSection[] = [];

            feedbackSections.forEach((section) => {
              if (section.items.length > 0) {
                section.items.forEach((item, idx) => {
                  displaySections.push({
                    title: `${idx + 1}`,
                    description: item,
                    items: [],
                  });
                });
              } else {
                displaySections.push(section);
              }
            });

            // Split into 2 columns
            const midPoint = Math.ceil(displaySections.length / 2);
            const leftColumn = displaySections.slice(0, midPoint);
            const rightColumn = displaySections.slice(midPoint);

            const renderCard = (
              section: FeedbackSection,
              idx: number,
              globalIdx: number
            ) => {
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Number Badge */}
                    <div className="shrink-0 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {globalIdx + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {leftColumn.map((section, idx) =>
                    renderCard(section, idx, idx)
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {rightColumn.map((section, idx) =>
                    renderCard(section, idx, idx + midPoint)
                  )}
                </div>
              </div>
            );
          })()}

        {/* Summary Stats */}
        {!loading && !error && feedbackSections.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Hãy tiếp tục luyện tập!
                </h3>
                <p className="text-gray-400 text-sm max-w-lg">
                  Luyện tập thường xuyên sẽ giúp bạn cải thiện độ trôi chảy và
                  sự tự tin khi nói.
                </p>
              </div>

              <Button
                onClick={() =>
                  router.push(
                    `/dashboard-learner-layout?menu=conversationWithAI`
                  )
                }
                className="bg-white text-gray-900 hover:bg-gray-100 cursor-pointer font-medium"
              >
                Luyện tập lại
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const parseFeedback = (text: string): FeedbackSection[] => {
  if (!text) return [];

  const sections: FeedbackSection[] = [];
  let currentSection: FeedbackSection | null = null;

  const pushCurrentSection = () => {
    if (currentSection) {
      sections.push({
        title: currentSection.title,
        description: currentSection.description.trim(),
        items: currentSection.items,
      });
    }
  };

  text.split("\n").forEach((rawLine: string) => {
    const line = rawLine.trim();
    if (!line) return;

    const sectionMatch = line.match(/^\*\*(.+?)\*\*:?(.+)?$/);

    if (sectionMatch) {
      pushCurrentSection();
      currentSection = {
        title: sectionMatch[1],
        description: sectionMatch[2]?.trim() ?? "",
        items: [],
      };
      return;
    }

    if (!currentSection) {
      currentSection = { title: "", description: "", items: [] };
    }

    const listMatch = line.match(/^\d+\.\s*(.+)$/);
    if (listMatch) {
      currentSection.items.push(listMatch[1]);
      return;
    }

    if (currentSection.items.length > 0) {
      currentSection.items[currentSection.items.length - 1] += ` ${line}`;
    } else if (currentSection.description) {
      currentSection.description += ` ${line}`;
    } else {
      currentSection.description = line;
    }
  });

  pushCurrentSection();

  return sections.filter(
    (section) =>
      section.title || section.description || section.items.length > 0
  );
};

export default Feedback;
