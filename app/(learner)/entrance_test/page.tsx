"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGetTestAssessment } from "@/features/learner/hooks/testAssessmentHooks/useGetTestAssessment";
import { useSubmitTestAssessment } from "@/features/learner/hooks/testAssessmentHooks/useSubmitTestAssessment";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
export interface ResultsAfterTest {
  averageScore: number;
  assignedLevel: string;
}
const EntranceTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState<boolean[]>([]);
  const [uiBlocked, setUiBlocked] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [resultsAfterTest, setResultsAfterTest] =
    useState<ResultsAfterTest | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [loadingToDashboardLearner, setLoadingToDashboardLearner] =
    useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRecordedRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [pronunciationAccuracy, setPronunciationAccuracy] = useState<string[]>(
    []
  );
  const [pronunciationScores, setPronunciationScores] = useState<number[]>([]);
  const [ipaTranscripts, setIpaTranscripts] = useState<string[]>([]);
  const [realIpaTranscripts, setRealIpaTranscripts] = useState<string[]>([]);
  const [coloredContents, setColoredContents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // Hooks
  const { data: userData } = useGetMeQuery();
  const { mutate: submitTestAssessmentMutation } = useSubmitTestAssessment();

  // API config from environment variables
  const apiMainPathSTS = process.env.NEXT_PUBLIC_AI_STS_API_URL;
  const STScoreAPIKey = process.env.NEXT_PUBLIC_AI_STS_API_KEY || "";
  const AILanguage = process.env.NEXT_PUBLIC_AI_STS_LANGUAGE || "en";

  const { data: testAssessmentData, isLoading } = useGetTestAssessment();
  const allQuestions = useMemo(() => {
    if (!testAssessmentData?.data?.sections) return [];

    const questions: Array<{
      id: string;
      content: string;
      type: string;
      sectionType: string;
    }> = [];

    // Define the order of question types
    const typeOrder = ["word", "sentence", "paragraph"];

    // Sort sections by type order
    const sortedSections = [...testAssessmentData.data.sections].sort(
      (a, b) => {
        const indexA = typeOrder.indexOf(a.type);
        const indexB = typeOrder.indexOf(b.type);
        return indexA - indexB;
      }
    );

    // Add questions in the sorted order
    sortedSections.forEach((section) => {
      section.questions.forEach((question) => {
        questions.push({
          id: question.questionAssessmentId,
          content: question.content,
          type: section.type,
          sectionType: section.type,
        });
      });
    });

    return questions;
  }, [testAssessmentData]);

  // Navigate to dashboard after refreshing token
  const handleNavigateDashboardLearnerLayout = async () => {
    setLoadingToDashboardLearner(true);
    try {
      const refreshResponse = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        // Use window.location.href for full page reload with new token
        window.location.href = "/dashboard-learner-layout";
      } else {
        toast.error("Phiên đã hết hạn, vui lòng đăng nhập lại.");
        router.push("/sign-in");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setLoadingToDashboardLearner(false);
  };

  // Initialize recorded array when questions are loaded
  useMemo(() => {
    if (allQuestions.length > 0 && recorded.length === 0) {
      setRecorded(new Array(allQuestions.length).fill(false));
      setPronunciationAccuracy(new Array(allQuestions.length).fill(""));
      setPronunciationScores(new Array(allQuestions.length).fill(0));
      setIpaTranscripts(new Array(allQuestions.length).fill(""));
      setRealIpaTranscripts(new Array(allQuestions.length).fill(""));
      setColoredContents(new Array(allQuestions.length).fill(""));
    }
  }, [allQuestions, recorded.length]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;

  // Utility function to convert blob to base64
  const convertBlobToBase64 = useCallback(async (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  // Play audio with speech synthesis
  // const playWithSpeechSynthesis = useCallback((text: string) => {
  //   if (!synthRef.current) return;
  //   setUiBlocked(true);
  //   const utter = new SpeechSynthesisUtterance(text);
  //   if (voiceRef.current) utter.voice = voiceRef.current;
  //   utter.rate = 0.7;
  //   utter.onend = () => setUiBlocked(false);
  //   synthRef.current.speak(utter);
  // }, []);

  // Play current question audio
  // const playAudio = useCallback(() => {
  //   if (currentQuestion?.content) {
  //     setMainTitle("Playing audio...");
  //     playWithSpeechSynthesis(currentQuestion.content);
  //     setTimeout(() => setMainTitle("AI Pronunciation Test"), 1000);
  //   }
  // }, [currentQuestion, playWithSpeechSynthesis]);

  // Play recorded audio
  const playRecording = useCallback(() => {
    const audio = audioRecordedRef.current;
    if (!audio) return;
    setIsPlayingAudio(true);
    audio
      .play()
      .then(() => {
        audio.addEventListener("ended", function handler() {
          audio.currentTime = 0;
          setIsPlayingAudio(false);
          audio.removeEventListener("ended", handler);
        });
      })
      .catch(() => {
        setIsPlayingAudio(false);
      });
  }, []);

  const getQuestionDescription = (type: string) => {
    switch (type) {
      case "word":
        return "Hãy đọc to từ sau:";
      case "sentence":
        return "Hãy đọc to câu sau:";
      case "paragraph":
        return "Hãy đọc to đoạn văn sau:";
      default:
        return "Hãy đọc to:";
    }
  };

  // Submit test results
  const handleSubmitTest = async () => {
    const learnerProfileId = userData?.learnerProfile?.learnerProfileId;

    if (!learnerProfileId) {
      toast.error("Không tìm thấy thông tin learner profile");
      return;
    }

    setIsSubmitting(true);

    try {
      // Group questions by section type
      const sectionMap = new Map<string, typeof allQuestions>();

      allQuestions.forEach((question) => {
        if (!sectionMap.has(question.sectionType)) {
          sectionMap.set(question.sectionType, []);
        }
        sectionMap.get(question.sectionType)!.push(question);
      });

      // Build tests array
      const tests = Array.from(sectionMap.entries()).map(
        ([type, questions]) => ({
          type,
          assessmentDetails: questions.map((q, idx) => {
            const questionIndex = allQuestions.findIndex(
              (aq) => aq.id === q.id
            );
            return {
              questionAssessmentId: q.id,
              score: pronunciationScores[questionIndex] || 0,
              aI_Feedback: "",
            };
          }),
        })
      );

      const payload = {
        learnerProfileId,
        numberOfQuestion: totalQuestions,
        tests,
      };

      submitTestAssessmentMutation(payload, {
        onSuccess: (data) => {
          toast.success("Đã nộp bài thành công!");
          setResultsAfterTest(data.data);
        },
      });

      // Redirect after 2 seconds
      // setTimeout(() => {
      //   window.location.href = "/learner/dashboard-learner";
      // }, 2000);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Có lỗi xảy ra khi nộp bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setDone(true);
      // Submit test when done
      handleSubmitTest();
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsProcessingAudio(true);
      setUiBlocked(true);
    } else {
      // Start recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "recording"
      ) {
        audioChunksRef.current = [];
        setIsRecording(true);
        mediaRecorderRef.current.start();
      }
    }
  };

  // Initialize audio context and speech synthesis
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    synthRef.current =
      typeof window !== "undefined" ? window.speechSynthesis : null;

    if (synthRef.current) {
      const loadVoices = () => {
        const voiceList = synthRef.current!.getVoices();
        // Try to find English voice
        const enVoice = voiceList.find((v) => v.lang.startsWith("en"));
        if (enVoice) voiceRef.current = enVoice;
      };
      loadVoices();
      synthRef.current.addEventListener("voiceschanged", loadVoices);
      return () =>
        synthRef.current?.removeEventListener("voiceschanged", loadVoices);
    }
  }, []);

  // Initialize MediaRecorder
  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      audio: { channelCount: 1, sampleRate: 48000 },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        streamRef.current = stream;
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;

        mr.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
        };

        mr.onstop = async () => {
          setUiBlocked(true);
          const blob = new Blob(audioChunksRef.current, { type: "audio/ogg;" });
          const audioUrl = URL.createObjectURL(blob);
          audioRecordedRef.current = new Audio(audioUrl);

          const base64 = await convertBlobToBase64(blob);

          if (!base64 || base64.length < 6) {
            setUiBlocked(false);
            return;
          }

          try {
            const text = currentQuestion?.content || "";
            const payload = {
              title: text,
              base64Audio: base64,
              language: AILanguage,
            };

            console.log("📤 Sending to API:", { text, language: AILanguage });

            const res = await fetch(
              apiMainPathSTS + "/GetAccuracyFromRecordedAudio",
              {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json",
                  "X-Api-Key": STScoreAPIKey,
                },
              }
            );

            if (!res.ok) {
              throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            console.log("🎯 AI Response:", data);
            const acc = parseFloat(data.pronunciation_accuracy);

            // Store results for current question
            const newAccuracy = [...pronunciationAccuracy];
            newAccuracy[
              currentQuestionIndex
            ] = `${data.pronunciation_accuracy}%`;
            setPronunciationAccuracy(newAccuracy);

            // Store actual score (number)
            const newScores = [...pronunciationScores];
            newScores[currentQuestionIndex] = acc;
            setPronunciationScores(newScores);

            const newIpa = [...ipaTranscripts];
            newIpa[currentQuestionIndex] = `/ ${data.ipa_transcript} /`;
            setIpaTranscripts(newIpa);

            // Store real IPA transcript
            const newRealIpa = [...realIpaTranscripts];
            newRealIpa[currentQuestionIndex] = data.real_transcripts_ipa
              ? `/ ${data.real_transcripts_ipa} /`
              : "";
            setRealIpaTranscripts(newRealIpa);

            // Color code the words: 1 = green, 0 = red
            const isLetterCorrectAll: string[] = String(
              data.is_letter_correct_all_words || ""
            ).split(" ");
            const words = text.split(" ");
            let coloredWords = "";

            for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
              const word = words[wordIdx];
              const lettersMask = isLetterCorrectAll[wordIdx] || "";
              let wordTemp = "";

              for (let letterIdx = 0; letterIdx < word.length; letterIdx++) {
                const ok = lettersMask[letterIdx] === "1";
                const color = ok ? "green" : "red";
                wordTemp += `<span style="color: ${color}">${word[letterIdx]}</span>`;
              }
              coloredWords += ` ${wordTemp}`;
            }

            const newColored = [...coloredContents];
            newColored[currentQuestionIndex] = coloredWords.trim();
            setColoredContents(newColored);

            // Mark as recorded
            const newRecorded = [...recorded];
            newRecorded[currentQuestionIndex] = true;
            setRecorded(newRecorded);

            setIsProcessingAudio(false);
          } catch (error) {
            console.error("Error processing audio:", error);
            setIsProcessingAudio(false);
          } finally {
            setUiBlocked(false);
          }
        };
      })
      .catch(() => {
        setUiBlocked(false);
      });
  }, [
    currentQuestion,
    convertBlobToBase64,
    currentQuestionIndex,
    recorded,
    pronunciationAccuracy,
    pronunciationScores,
    ipaTranscripts,
    realIpaTranscripts,
    coloredContents,
    apiMainPathSTS,
    STScoreAPIKey,
    AILanguage,
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-gray-900 text-lg font-medium">
            Đang tải câu hỏi...
          </div>
        </div>
      </div>
    );
  }

  // Show error if no questions
  if (!currentQuestion && !done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-gray-900 text-xl font-semibold mb-2">
            Không có câu hỏi
          </div>
          <p className="text-gray-600 mb-6">Vui lòng thử lại sau.</p>
          <Button
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
            onClick={() =>
              (window.location.href = "/learner/dashboard-learner")
            }
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🎯</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Entrance Test
                </h1>
                <p className="text-xs text-gray-500">Bài kiểm tra đầu vào</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Câu hỏi</p>
                <p className="text-lg font-bold text-gray-900">
                  {currentQuestionIndex + 1}{" "}
                  <span className="text-gray-400">/</span> {totalQuestions}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {Math.round(
                    ((currentQuestionIndex + (done ? 1 : 0)) / totalQuestions) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  ((currentQuestionIndex + (done ? 1 : 0)) / totalQuestions) *
                  100
                }%`,
              }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          {/* Mini progress indicators */}
          <div className="flex justify-between mt-2">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 mx-0.5 rounded-full transition-all duration-300 ${
                  index < currentQuestionIndex
                    ? "bg-green-500"
                    : index === currentQuestionIndex
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {!done ? (
        <div className="max-w-7xl mx-auto px-6 pb-32">
          {/* Question type badge with gradient */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full shadow-lg uppercase tracking-wide">
              <span className="text-lg">📝</span>
              {currentQuestion?.sectionType || "Question"}
            </span>
          </div>

          {/* Processing status - floating notification */}
          {isProcessingAudio && !isRecording && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <span className="text-blue-900 font-semibold block">
                    Đang phân tích âm thanh...
                  </span>
                  <span className="text-blue-700 text-xs">
                    AI đang đánh giá phát âm của bạn
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main content area - 2 column layout */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Question & Results */}
            <div className="space-y-6">
              {/* Question instruction with icon */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Hướng dẫn
                    </h3>
                    <p className="text-gray-700">
                      {currentQuestion &&
                        getQuestionDescription(currentQuestion.sectionType)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question content - enhanced card */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nội dung cần đọc
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 leading-relaxed">
                    {coloredContents[currentQuestionIndex] ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: coloredContents[currentQuestionIndex],
                        }}
                      />
                    ) : (
                      currentQuestion?.content || "Loading..."
                    )}
                  </div>
                </div>
              </div>

              {/* Accuracy Result - Enhanced */}
              {pronunciationAccuracy[currentQuestionIndex] && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Độ chính xác phát âm
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {pronunciationAccuracy[currentQuestionIndex]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* IPA Transcripts */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                    {/* Your pronunciation */}
                    {ipaTranscripts[currentQuestionIndex] && (
                      <div className="bg-white/70 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                          <span>🎤</span>
                          Phát âm của bạn
                        </p>
                        <p className="text-sm font-mono text-gray-800 break-words">
                          {ipaTranscripts[currentQuestionIndex]}
                        </p>
                      </div>
                    )}

                    {/* Real/Expected pronunciation */}
                    {realIpaTranscripts[currentQuestionIndex] && (
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                          <span>🎯</span>
                          Phát âm chuẩn
                        </p>
                        <p className="text-sm font-mono text-blue-900 break-words">
                          {realIpaTranscripts[currentQuestionIndex]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Play recording button - enhanced */}
              {recorded[currentQuestionIndex] && (
                <div className="flex justify-center">
                  <Button
                    onClick={playRecording}
                    disabled={isPlayingAudio}
                    className="bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold disabled:opacity-50 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    aria-label="Play recording"
                  >
                    {isPlayingAudio ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Đang phát bản ghi âm...
                      </>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Nghe lại bản ghi âm
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Recording Controls */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
                {/* Recording status indicator */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      isRecording
                        ? "bg-red-100 text-red-700 animate-pulse"
                        : recorded[currentQuestionIndex]
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isRecording
                          ? "bg-red-500"
                          : recorded[currentQuestionIndex]
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    {isRecording
                      ? "Đang ghi âm..."
                      : recorded[currentQuestionIndex]
                      ? "✓ Đã hoàn thành"
                      : "Sẵn sàng ghi âm"}
                  </div>
                </div>

                {/* Large Recording Button */}
                <div className="flex flex-col items-center gap-6 mb-8">
                  <div className="relative">
                    {/* Pulse rings when recording */}
                    {isRecording && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
                        <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-50"></div>
                      </>
                    )}

                    <Button
                      className={`relative rounded-full w-32 h-32 flex items-center cursor-pointer justify-center transition-all duration-300 shadow-2xl ${
                        isRecording
                          ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110"
                          : recorded[currentQuestionIndex]
                          ? "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          : "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-110"
                      }`}
                      onClick={handleRecord}
                      disabled={uiBlocked && !isRecording}
                      aria-label="Ghi âm"
                    >
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="2" width="6" height="14" rx="3" />
                        <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                        <line x1="12" y1="22" x2="12" y2="16" />
                      </svg>
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {isRecording
                        ? "Nhấn để dừng ghi âm"
                        : recorded[currentQuestionIndex]
                        ? "Bạn có thể ghi lại"
                        : "Nhấn để bắt đầu"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isRecording
                        ? "Đọc rõ ràng vào microphone"
                        : "Đảm bảo microphone đã được bật"}
                    </p>
                  </div>
                </div>

                {/* Tips section */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>💡</span>
                    Mẹo để đạt điểm cao
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Đọc chậm và rõ ràng từng từ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Giữ khoảng cách 15-20cm với mic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Tránh tiếng ồn xung quanh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Phát âm đúng trọng âm</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-6 py-2">
          {/* Completion - minimal & clean */}
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            {isSubmitting ? (
              <>
                {/* Submitting state */}
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                  Đang nộp bài...
                </h2>
                <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">
                  Chúc mừng bạn!
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Bạn đã hoàn thành bài kiểm tra đầu vào
                </p>

                {/* Results Card */}
                {resultsAfterTest && (
                  <div className="bg-gradient-to-br from-blue-10 to-indigo-50 rounded-2xl p-1 mb-8  shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Kết quả của bạn
                    </h3>

                    {/* Score */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-gray-700 font-medium">
                          Điểm trung bình:
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold text-blue-600">
                            {resultsAfterTest.averageScore.toFixed(1)}
                          </span>
                          <span className="text-2xl text-gray-500">/100</span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${resultsAfterTest.averageScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Level Badge */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        Trình độ của bạn:
                      </p>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-md">
                        <span>🏆</span>
                        <span>{resultsAfterTest.assignedLevel}</span>
                      </div>
                      <p className="text-gray-700 mb-8 text-base">
                  Kết quả đã được ghi nhận. Hãy tiếp tục luyện tập để nâng cao
                  kỹ năng của bạn! 💪
                </p>

                {loadingToDashboardLearner ? (
                  <Loader2 className="mx-auto animate-spin" />
                ) : (
                  <Button
                    className="bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-[15px]"
                    onClick={() => handleNavigateDashboardLearnerLayout()}>
                    Bắt đầu học ngay
                  </Button>
                )}
                    </div>
                  </div>
                )}

                
              </>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Footer - Fixed navigation */}
      {!done && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-20">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              {/* Progress Info */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalQuestions, 10) }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index < currentQuestionIndex
                            ? "bg-green-500"
                            : index === currentQuestionIndex
                            ? "bg-blue-500 w-3"
                            : "bg-gray-300"
                        }`}
                      />
                    )
                  )}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </span>
              </div>

              {/* Navigation Button */}
              <Button
                className={`flex-1 md:flex-initial font-semibold px-10 py-4 rounded-xl text-base transition-all shadow-lg ${
                  recorded[currentQuestionIndex]
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer transform hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleNext}
                disabled={!recorded[currentQuestionIndex]}
              >
                {recorded[currentQuestionIndex] ? (
                  <span className="flex items-center gap-2">
                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <>
                        Tiếp tục
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Hoàn thành bài thi
                      </>
                    )}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Vui lòng ghi âm để tiếp tục
                  </span>
                )}
              </Button>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-green-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">
                    {recorded.filter((r) => r).length} hoàn thành
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">
                    {totalQuestions - recorded.filter((r) => r).length} còn lại
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntranceTest;
