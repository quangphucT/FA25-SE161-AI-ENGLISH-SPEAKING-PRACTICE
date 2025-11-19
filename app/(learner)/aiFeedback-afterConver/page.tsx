"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import fetchWithAuth from "@/utils/fetchWithAuth";

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

const Feedback = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbackSections, setFeedbackSections] = useState<FeedbackSection[]>([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className=" sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                 onClick={() =>
                  router.push("/dashboard-learner-layout?menu=conversationWithAI")
                }
                className="cursor-pointer rounded-4xl border-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {dayjs().format("MMM D, YYYY h:mm A")}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-2">
        {/* Title Section */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-1 mb-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Phản hồi về cuộc trò chuyện
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Phân tích và đánh giá từ AI về cuộc hội thoại của bạn
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Đang phân tích...
            </h3>
            <p className="text-gray-600">
              AI đang xem xét cuộc trò chuyện của bạn
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-red-700 mb-6">{error}</p>
              <Button
                onClick={fetchFeedback}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </div>
        )}

        {/* No Messages State */}
        {!loading && !error && messages.length === 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có cuộc trò chuyện
            </h3>
            <p className="text-gray-700 mb-6">
              Vui lòng bắt đầu một cuộc trò chuyện trước khi xem phản hồi
            </p>
            <Button
              onClick={() => router.push("/coversation-withAI")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer shadow-lg"
            >
              Bắt đầu trò chuyện
            </Button>
          </div>
        )}

  {/* Feedback Content */}
{!loading && !error && feedbackSections.length > 0 && (() => {
  // Flatten items into individual sections for display
  const displaySections: FeedbackSection[] = [];
  
  feedbackSections.forEach((section) => {
    if (section.items.length > 0) {
      // Each item becomes its own section
      section.items.forEach((item, idx) => {
        displaySections.push({
          title: `${idx + 1}`,
          description: item,
          items: []
        });
      });
    } else {
      // Keep sections without items as-is
      displaySections.push(section);
    }
  });

  const leftSections = displaySections.slice(0, 4);
  const rightSections = displaySections.slice(4);

  return (
  <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-8">
    <div className="grid grid-cols-2 gap-8">

      {/* LEFT COLUMN (items 1-4) */}
      <div className="space-y-6">
        {leftSections.map((section, idx) => (
          <div key={idx}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[100%] flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-xl font-bold  text-white">{section.title}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed text-base">
                  {section.description}
                </p>
              </div>
            </div>
            {idx < leftSections.length - 1 && <div className="border-b-2 border-gray-200 my-6"></div>}
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN (items 5+) */}
      <div className="space-y-6">
        {rightSections.map((section, idx) => (
          <div key={idx}>
            <div className="flex items-start gap-3 mb-4">
            
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed text-base">
                  {section.description}
                </p>
              </div>
            </div>
            {idx < rightSections.length - 1 && <div className="border-b-2 border-gray-200 my-6"></div>}
          </div>
        ))}
      </div>

    </div>
  </div>
  );
})()}

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
