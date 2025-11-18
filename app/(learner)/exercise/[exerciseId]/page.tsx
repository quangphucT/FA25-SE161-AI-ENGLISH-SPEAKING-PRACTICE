"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mic, Volume2, ArrowLeft, ArrowRight } from "lucide-react";
import { useLearnerStore } from "@/store/useLearnerStore";
import { useLearningPathCourseFull } from "@/features/learner/hooks/learningPathCourseFullHooks/learningPathCourseFull";
import { useSubmitAnswerQuestion } from "@/features/learner/hooks/submitAnswerQuestionHooks/submitAnswerQuestion";

const ExercisePage = () => {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params?.exerciseId as string;
  const getAllLearnerData = useLearnerStore((state) => state.getAllLearnerData);
  const learnerData = getAllLearnerData();

  // Get full learning path data
  const { data: apiResponse, isLoading } = useLearningPathCourseFull(
    {
      learningPathCourseId: learnerData?.learningPathCourseId || "",
      courseId: learnerData?.courseId || "",
      status: learnerData?.status || "",
    },
    Boolean(learnerData)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState<boolean[]>([]);
  const [uiBlocked, setUiBlocked] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: submitAnswerQuestion } = useSubmitAnswerQuestion();

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

  // API config
  const apiMainPathSTS = process.env.NEXT_PUBLIC_AI_STS_API_URL;
  const STScoreAPIKey = process.env.NEXT_PUBLIC_AI_STS_API_KEY || "";
  const AILanguage = process.env.NEXT_PUBLIC_AI_STS_LANGUAGE || "en";

  // Find current exercise from learning path data
  const currentExerciseData = useMemo(() => {
    if (!apiResponse?.data?.chapters || !exerciseId) return null;

    for (const chapter of apiResponse.data.chapters) {
      const exercise = chapter.exercises.find(
        (ex) => ex.exerciseId === exerciseId
      );
      if (exercise) return exercise;
    }
    return null;
  }, [apiResponse, exerciseId]);

  const questions = useMemo(() => {
    if (!currentExerciseData?.questions) return [];
    return currentExerciseData.questions.sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  }, [currentExerciseData]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize recorded state
  useEffect(() => {
    setIsMounted(true);
    if (questions.length > 0 && recorded.length === 0) {
      setRecorded(new Array(questions.length).fill(false));
      setPronunciationAccuracy(new Array(questions.length).fill(""));
      setPronunciationScores(new Array(questions.length).fill(0));
      setIpaTranscripts(new Array(questions.length).fill(""));
      setRealIpaTranscripts(new Array(questions.length).fill(""));
      setColoredContents(new Array(questions.length).fill(""));
    }
  }, [questions, recorded.length]);

  // Utility function to convert blob to base64
  const convertBlobToBase64 = useCallback(async (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);

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

  // Text-to-Speech - Play question audio
  const handleSpeakQuestion = useCallback(() => {
    if (!currentQuestion?.text || !synthRef.current) return;

    setUiBlocked(true);
    const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.lang = "en-US";
    utterance.rate = 0.7;

    utterance.onend = () => setUiBlocked(false);
    utterance.onerror = () => setUiBlocked(false);

    synthRef.current.speak(utterance);
  }, [currentQuestion]);



  // Recording functions
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
            const text = currentQuestion?.text || "";
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

    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        const enVoice = voices.find((voice) => voice.lang.startsWith("en"));
        if (enVoice) voiceRef.current = enVoice;
      };
      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
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

  const handleNextQuestion = async () => {
    // Submit kết quả câu hiện tại trước khi chuyển sang câu tiếp theo
    if (recorded[currentQuestionIndex]) {
      setIsSubmitting(true);
      try {
        await new Promise<void>((resolve, reject) => {
          submitAnswerQuestion(
            {
              learningPathQuestionId: currentQuestion?.learningPathQuestionId || "",
              audioRecordingUrl: "abc",
              transcribedText: ipaTranscripts[currentQuestionIndex] || "",
              scoreForVoice: pronunciationScores[currentQuestionIndex] || 0,
              explainTheWrongForVoiceAI: "abc",
            },
            {
              onSuccess: () => {
                resolve();
              },
              onError: (error) => {
                console.error("Submit error:", error);
                reject(error);
              },
            }
          );
        });
      } catch (error) {
        console.error("Failed to submit answer:", error);
        // Tiếp tục chuyển câu dù có lỗi
      } finally {
        setIsSubmitting(false);
      }
    }

    // Chuyển sang câu tiếp theo
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Submit kết quả câu cuối cùng
    if (recorded[currentQuestionIndex]) {
      setIsSubmitting(true);
      try {
        await new Promise<void>((resolve, reject) => {
          submitAnswerQuestion(
            {
              learningPathQuestionId: currentQuestion?.learningPathQuestionId || "",
              audioRecordingUrl: "",
              transcribedText: ipaTranscripts[currentQuestionIndex] || "",
              scoreForVoice: pronunciationScores[currentQuestionIndex] || 0,
              explainTheWrongForVoiceAI: "",
            },
            {
              onSuccess: () => {
                toast.success("Đã nộp bài thành công!");
                resolve();
              },
              onError: (error) => {
                toast.error("Nộp bài thất bại");
                console.error("Submit error:", error);
                reject(error);
              },
            }
          );
        });
        // Vẫn nằm ở câu cuối sau khi submit
      } catch (error) {
        console.error("Failed to submit final answer:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-gray-600">Không tìm thấy câu hỏi</p>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
      suppressHydrationWarning
    >
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentExerciseData?.exerciseTitle || "Exercise"}
                </h1>
                <p className="text-xs text-gray-500">
                  {currentExerciseData?.exerciseDescription || ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() =>
                  router.push("/dashboard-learner-layout?menu=learningPath")
                }
                className="text-gray-600 cursor-pointer hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <div className="text-right">
                <p className="text-xs text-gray-500">Câu hỏi</p>
                <p className="text-lg font-bold text-gray-900">
                  {currentQuestionIndex + 1}{" "}
                  <span className="text-gray-400">/</span> {totalQuestions}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {Math.round(progressPercentage)}%
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
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          {/* Mini progress indicators */}
          <div className="flex justify-between mt-2">
            {questions.map((_, index) => (
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

      <div className="max-w-7xl mx-auto px-6 pb-32">
        {/* Question type badge */}
        <div className="text-center mb-8 mt-8">
          <span className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full shadow-lg uppercase tracking-wide">
            <span className="text-lg">
              {currentQuestion.type === "Word"
                ? "📝"
                : currentQuestion.type === "Sentence"
                ? "💬"
                : "📄"}
            </span>
            {currentQuestion.type === "Word"
              ? "Từ vựng"
              : currentQuestion.type === "Sentence"
              ? "Câu"
              : "Đoạn văn"}
          </span>
        </div>

        {/* Processing status */}
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
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="text-4xl font-bold text-gray-900 leading-relaxed">
            {currentQuestion.text}
          </div>
          <div>
            <Button
              onClick={handleSpeakQuestion}
              disabled={uiBlocked}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl cursor-pointer"
            >
              <Volume2
                className={`w-5 h-5 mr-2 ${uiBlocked ? "animate-pulse" : ""}`}
              />
              Nghe phát âm
            </Button>
          </div>
        </div>
        {/* Main content area - 2 column layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Question & Results */}
          <div className="space-y-6">
            {/* Question content - enhanced card */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                {/* Media Section - Video and Image */}
                {currentQuestion.media && currentQuestion.media.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {currentQuestion.media.map((mediaItem, idx) => (
                      <div
                        key={mediaItem.questionMediaId || idx}
                        className="space-y-4"
                      >
                        {/* Video - Mouth shape demonstration */}
                        {mediaItem.videoUrl && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 shadow-md">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-blue-900">
                                  Video hướng dẫn khẩu hình
                                </p>
                                <p className="text-xs text-blue-700">
                                  Quan sát và bắt chước cách đặt miệng khi phát
                                  âm
                                </p>
                              </div>
                            </div>
                            <div className="rounded-xl overflow-hidden border-2 border-white shadow-lg">
                              <video
                                src={mediaItem.videoUrl}
                                controls
                                loop
                                className="w-full max-h-[400px] object-contain bg-black"
                                controlsList="nodownload"
                              >
                                Trình duyệt của bạn không hỗ trợ video.
                              </video>
                            </div>
                            <p className="text-xs text-blue-600 mt-2 text-center font-medium">
                              💡 Tip: Xem video nhiều lần và thực hành theo từng
                              chuyển động của môi
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Accuracy Result - Enhanced */}
            {recorded[currentQuestionIndex] && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">
                        Độ chính xác phát âm
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        {pronunciationScores[currentQuestionIndex]?.toFixed(
                          1
                        ) || 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {/* Colored text result */}
                {coloredContents[currentQuestionIndex] && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      Phân tích chi tiết:
                    </p>
                    <div
                      className="text-2xl font-semibold leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: coloredContents[currentQuestionIndex],
                      }}
                    />
                  </div>
                )}

                {/* IPA Transcripts */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200 mt-4">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1 font-medium">
                      IPA của bạn
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {ipaTranscripts[currentQuestionIndex] || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1 font-medium">
                      IPA chuẩn
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      {realIpaTranscripts[currentQuestionIndex] || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Play recording button */}
            {recorded[currentQuestionIndex] && (
              <div className="flex justify-center">
                <Button
                  onClick={playRecording}
                  disabled={isPlayingAudio}
                  className="bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-base font-semibold disabled:opacity-50 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isPlayingAudio ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang phát...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Nghe lại bản ghi
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Recording Controls */}
          <div className="lg:sticky lg:top-32">
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
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {isRecording
                    ? "Đang ghi âm..."
                    : recorded[currentQuestionIndex]
                    ? "Đã ghi âm"
                    : "Chưa ghi âm"}
                </div>
              </div>

              {/* Large Recording Button */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative">
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                  )}

                  <button
                    onClick={handleRecord}
                    disabled={isProcessingAudio || uiBlocked}
                    className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ${
                      isRecording
                        ? "bg-gradient-to-br from-red-500 to-red-600"
                        : recorded[currentQuestionIndex]
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    }`}
                  >
                    {isProcessingAudio ? (
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    ) : isRecording ? (
                      <div className="w-8 h-8 bg-white rounded"></div>
                    ) : (
                      <Mic className="w-12 cursor-pointer h-12 text-white" />
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    {isProcessingAudio
                      ? "Đang xử lý..."
                      : isRecording
                      ? "Click để dừng"
                      : recorded[currentQuestionIndex]
                      ? "Ghi lại"
                      : "Bắt đầu ghi âm"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {!recorded[currentQuestionIndex] &&
                      !isRecording &&
                      "Click vào micro để bắt đầu"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer - Fixed navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-20">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Navigation Buttons */}
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="px-6 py-3 rounded-xl font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Câu trước
            </Button>

            {/* Progress Info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex gap-1">
                {questions
                  .slice(0, Math.min(10, totalQuestions))
                  .map((_, index) => (
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
                  ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>

            {/* Next/Submit Button */}
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!recorded.every((r) => r) || isSubmitting}
                className={`font-semibold px-10 py-4 rounded-xl text-base transition-all shadow-lg ${
                  recorded.every((r) => r)
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer transform hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang nộp bài...
                    </>
                  ) : recorded.every((r) => r) ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Nộp bài
                    </>
                  ) : (
                    "Hoàn thành tất cả câu hỏi"
                  )}
                </span>
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={!recorded[currentQuestionIndex] || isSubmitting}
                className={`font-semibold px-10 py-4 rounded-xl text-base transition-all shadow-lg ${
                  recorded[currentQuestionIndex]
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white cursor-pointer transform hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang lưu kết quả...
                    </>
                  ) : recorded[currentQuestionIndex] ? (
                    <>
                      Câu tiếp theo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    "Vui lòng ghi âm để tiếp tục"
                  )}
                </span>
              </Button>
            )}

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
    </div>
  );
};

export default ExercisePage;
