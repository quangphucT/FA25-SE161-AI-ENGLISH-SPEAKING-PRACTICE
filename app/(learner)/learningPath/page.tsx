"use client";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import {
  Lock,
  ArrowRight,
  BookOpen,
  Trophy,
  Target,
  ChevronRight,
} from "lucide-react";

import { useLearnerStore } from "@/store/useLearnerStore";
import { useLearningPathCourseFull } from "@/features/learner/hooks/learningPathCourseFullHooks/learningPathCourseFull";
import { Progress } from "@/components/ui/progress";
import { useStartExercise } from "@/features/learner/hooks/startExerciseHooks/startExercise";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

function LearningPathContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getAllLearnerData = useLearnerStore((state) => state.getAllLearnerData);
  const learnerData = getAllLearnerData();

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useLearningPathCourseFull(
    {
      learningPathCourseId: learnerData?.learningPathCourseId || "",
      courseId: learnerData?.courseId || "",
    },
    Boolean(learnerData)
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: startExercise, isPending: isStarting } = useStartExercise();
  const [loadingExerciseId, setLoadingExerciseId] = useState<string | null>(
    null
  );
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tự động mở chapter từ URL params - only on client
  useEffect(() => {
    if (!isMounted) return;

    const chapterId = searchParams.get("chapterId");
    if (chapterId) {
      setExpandedChapterId(chapterId);
      // Scroll to chapter after a short delay to ensure rendering
      setTimeout(() => {
        const element = document.getElementById(`chapter-${chapterId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [searchParams, isMounted]);

  // Ngay khi vào trang lấy thông tin user
  const { data: userData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";

  const handleNavigateToEnrollingCourses = () => {
    router.push("/enrolling-courses");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in_progress":
      case "inprogress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "locked":
        return "text-gray-400 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Hoàn thành";
      case "in_progress":
      case "inprogress":
        return "Đang học";
      case "locked":
        return "Đã khóa";
      default:
        return status;
    }
  };

  if (!learnerData) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <Card className="p-6 bg-linear-to-br from-yellow-50 to-orange-50 border-2 border-orange-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Chưa tham gia khóa học đầu tiên
              </h3>
              <p className="text-gray-700 mb-4">
                Bạn hiện tại chưa enroll khóa đầu tiên của Level {userLevel}.
                Hãy qua tab menu{" "}
                <span className="font-bold text-orange-600">Khóa học</span> để
                tham gia khóa học đầu tiên (miễn phí).
              </p>
              <Button
                onClick={handleNavigateToEnrollingCourses}
                className="cursor-pointer bg-orange-600 hover:bg-orange-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Đi đến Khóa học
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const learningPathData = apiResponse?.data;

  if (!learningPathData) {
    return (
      <div className="max-w-[1400px] mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-gray-600">
            Không tìm thấy dữ liệu lộ trình học tập
          </p>
        </Card>
      </div>
    );
  }

  const { course, chapters, progress, status, numberOfChapter } =
    learningPathData;

  const handleButtonClick = (
    exerciseStatus: string,
    learningPathExerciseId: string,
    exerciseId: string,
    chapterId: string
  ) => {
    if (exerciseStatus === "NotStarted") {
      // Set loading state cho exercise này
      setLoadingExerciseId(learningPathExerciseId);

      // Gọi API để bắt đầu exercise
      startExercise(
        { learningPathExerciseId },
        {
          onSuccess: () => {
            setLoadingExerciseId(null);
            refetch();
            // Navigate đến trang exercise với chapterId
            router.push(`/exercise/${exerciseId}?chapterId=${chapterId}`);
          },
          onError: (data) => {
            toast.error(data?.message || "Có lỗi xảy ra khi bắt đầu bài tập.");
            setLoadingExerciseId(null);
          },
        }
      );
    } else {
      // Nếu status khác NotStarted, navigate trực tiếp đến trang exercise với chapterId
      router.push(`/exercise/${exerciseId}?chapterId=${chapterId}`);
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Course Header - Compact */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
            <div className="max-w-xl">
              <h1
                className="text-xl font-bold text-gray-900 line-clamp-1"
                title={course.title}
              >
                {course.title}
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>Level {course.level}</span>
                <span>•</span>
                <span>{numberOfChapter} chương</span>
                <span>•</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                    status
                  )}`}
                >
                  {getStatusText(status)}
                </span>
                 <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium text-gray-700">
                    Điểm trung bình: <span className="text-blue-600 font-semibold">{course.averageScore ?? 0}</span>/100
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-48">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Tiến độ</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="flex gap-6">
        {/* Left Sidebar - Chapters Navigation */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Nội dung khóa học</h2>
            </div>
            <div className=" overflow-y-auto">
              {chapters && chapters.length > 0 ? (
                chapters.map((chapter, index) => (
                  <div
                    key={chapter.learningPathChapterId}
                    id={`chapter-${chapter.learningPathChapterId}`}
                    onClick={() => {
                      if (chapter.status.toLowerCase() !== "locked") {
                        setExpandedChapterId(chapter.learningPathChapterId);
                      }
                    }}
                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-all ${
                      chapter.status.toLowerCase() === "locked"
                        ? "opacity-50 cursor-not-allowed bg-gray-50"
                        : expandedChapterId === chapter.learningPathChapterId
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                          chapter.status.toLowerCase() === "completed"
                            ? "bg-green-100 text-green-600"
                            : chapter.status.toLowerCase() === "locked"
                            ? "bg-gray-200 text-gray-400"
                            : expandedChapterId ===
                              chapter.learningPathChapterId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {chapter.status.toLowerCase() === "locked" ? (
                          <Lock className="w-4 h-4" />
                        ) : chapter.status.toLowerCase() === "completed" ? (
                          <Trophy className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-gray-900 line-clamp-1"
                          title={chapter.chapterTitle}
                        >
                          {chapter.chapterTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full transition-all"
                              style={{ width: `${chapter.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round(chapter.progress)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Chưa có chương nào
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content - Exercises */}
        <div className="flex-1">
          {expandedChapterId ? (
            (() => {
              const selectedChapter = chapters?.find(
                (ch) => ch.learningPathChapterId === expandedChapterId
              );
              if (!selectedChapter) return null;

              return (
                <div className="space-y-4">
                  {/* Chapter Header */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                          Chương {selectedChapter.orderIndex}
                        </span>
                        <h2
                          className="text-xl font-bold text-gray-900 mt-1 line-clamp-2"
                          title={selectedChapter.chapterTitle}
                        >
                          {selectedChapter.chapterTitle}
                        </h2>
                        <p
                          className="text-gray-500 text-sm mt-1 line-clamp-2"
                          title={selectedChapter.chapterDescription}
                        >
                          {selectedChapter.chapterDescription}
                        </p>
                      </div>
                      <div className="text-right">
                        {/* <div className="text-2xl font-bold text-gray-900">
                          {Math.round(selectedChapter.progress)}%
                        </div> */}
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedChapter.progress}%
                        </div>

                        <div className="text-xs text-gray-500">Hoàn thành</div>
                      </div>
                    </div>
                    <Progress
                      value={selectedChapter.progress}
                      className="h-2 mt-4"
                    />
                  </div>

                  {/* Exercises Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedChapter.exercises &&
                    selectedChapter.exercises.length > 0 ? (
                      selectedChapter.exercises.map((exercise, exIndex) => (
                        <div
                          key={exercise.learningPathExerciseId}
                          className={`bg-white rounded-xl border p-5 transition-all ${
                            exercise.status.toLowerCase() === "locked"
                              ? "border-gray-200 opacity-50"
                              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                exercise.status.toLowerCase() === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : exercise.status.toLowerCase() === "locked"
                                  ? "bg-gray-100 text-gray-400"
                                  : exercise.status === "InProgress"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {exercise.status.toLowerCase() === "locked" ? (
                                <Lock className="w-5 h-5" />
                              ) : exercise.status.toLowerCase() ===
                                "completed" ? (
                                <Trophy className="w-5 h-5" />
                              ) : (
                                <span className="font-bold">{exIndex + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4
                                  className="font-semibold text-gray-900 line-clamp-1"
                                  title={exercise.exerciseTitle}
                                >
                                  {exercise.exerciseTitle}
                                </h4>
                                {exercise.scoreAchieved > 0 && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    {exercise.scoreAchieved}đ
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-sm text-gray-500 line-clamp-2 mt-1"
                                title={exercise.exerciseDescription}
                              >
                                {exercise.exerciseDescription}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-gray-400">
                                  {exercise.numberOfQuestion} câu hỏi
                                </span>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleButtonClick(
                                      exercise.status,
                                      exercise.learningPathExerciseId,
                                      exercise.exerciseId,
                                      selectedChapter.learningPathChapterId
                                    );
                                  }}
                                  disabled={
                                    loadingExerciseId ===
                                      exercise.learningPathExerciseId ||
                                    exercise.status.toLowerCase() === "locked"
                                  }
                                  size="sm"
                                  className={`rounded-lg cursor-pointer text-xs font-medium ${
                                    exercise.status.toLowerCase() === "locked"
                                      ? "bg-gray-100 text-gray-400"
                                      : exercise.status === "NotStarted"
                                      ? "bg-blue-600 text-white hover:bg-blue-700"
                                      : exercise.status === "InProgress"
                                      ? "bg-amber-500 text-white hover:bg-amber-600"
                                      : "bg-green-600 text-white hover:bg-green-700"
                                  }`}
                                >
                                  {loadingExerciseId ===
                                  exercise.learningPathExerciseId
                                    ? "..."
                                    : exercise.status === "NotStarted"
                                    ? "Bắt đầu"
                                    : exercise.status === "InProgress"
                                    ? "Tiếp tục"
                                    : "Ôn tập"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Chưa có bài tập trong chương này
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chọn chương để bắt đầu
              </h3>
              <p className="text-gray-500">
                Chọn một chương từ danh sách bên trái để xem các bài tập
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearningPath() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      }
    >
      <LearningPathContent />
    </Suspense>
  );
}
