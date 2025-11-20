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

  const { data: apiResponse, isLoading, refetch } = useLearningPathCourseFull(
    {
      learningPathCourseId: learnerData?.learningPathCourseId || "",
      courseId: learnerData?.courseId || "",
      status: learnerData?.status || "",
    },
    Boolean(learnerData)
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: startExercise, isPending: isStarting } = useStartExercise();
  const [loadingExerciseId, setLoadingExerciseId] = useState<string | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tự động mở chapter từ URL params - only on client
  useEffect(() => {
    if (!isMounted) return;
    
    const chapterId = searchParams.get('chapterId');
    if (chapterId) {
      setExpandedChapterId(chapterId);
      // Scroll to chapter after a short delay to ensure rendering
      setTimeout(() => {
        const element = document.getElementById(`chapter-${chapterId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            toast.success("Đã bắt đầu bài tập!");
            setLoadingExerciseId(null);
            refetch();
            // Navigate đến trang exercise với chapterId
            router.push(`/exercise/${exerciseId}?chapterId=${chapterId}`);
          },
          onError: (data) => {
            toast.error(data?.message || "Có lỗi xảy ra khi bắt đầu bài tập.");
            setLoadingExerciseId(null);
          
          }
        }
      );
    } else {
      // Nếu status khác NotStarted, navigate trực tiếp đến trang exercise với chapterId
      router.push(`/exercise/${exerciseId}?chapterId=${chapterId}`);
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Course Header */}
      <Card className="p-6 bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
            </div>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Level: {course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{numberOfChapter} Chương</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full border ${getStatusColor(
                  status
                )}`}
              >
                {getStatusText(status)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-gray-600">Tiến độ</div>
            </div>
          </div>
        </div>
        <div>
          <Progress value={progress} className="h-3" />
        </div>
      </Card>

      {/* Chapters List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Danh sách chương
        </h2>

        {chapters && chapters.length > 0 ? (
          chapters.map((chapter) => (
            <Card
              key={chapter.learningPathChapterId}
              id={`chapter-${chapter.learningPathChapterId}`}
              className={`p-6 border-2 transition-all hover:shadow-md ${
                chapter.status.toLowerCase() === "locked"
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Chapter Number */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-blue-600">
                    {chapter.orderIndex}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {/* Chapter Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chapter.status.toLowerCase() !== "locked") {
                        setExpandedChapterId(
                          expandedChapterId === chapter.learningPathChapterId 
                            ? null 
                            : chapter.learningPathChapterId
                        );
                      }
                    }}
                  >
                    <div className=" rounded-lg bg-white ">
                      <div className="flex flex-col mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Chương {chapter.orderIndex}
                        </h3>
                        <h3 className="text-lg font-semibold text-blue-600">
                          {chapter.chapterTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {chapter.chapterDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(chapter.progress)}%
                        </div>
                        <div className="text-xs text-gray-500">Hoàn thành</div>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedChapterId === chapter.learningPathChapterId 
                            ? "rotate-90" 
                            : ""
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <Progress value={chapter.progress} className="h-2" />

                  {/* Chapter Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{chapter.exercises?.length || 0} Bài tập</span>
                  </div>

                  {/* Exercises */}
                  {expandedChapterId === chapter.learningPathChapterId && 
                    chapter.exercises && 
                    chapter.exercises.length > 0 && (
                    <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200">
                      {chapter.exercises.map((exercise) => (
                        <div
                          key={exercise.learningPathExerciseId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            exercise.status.toLowerCase() === "locked"
                              ? "bg-gray-50 border-gray-200 opacity-60"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          } transition-all`}
                        
                        >
                          <div className="w-full rounded-xl p-3 bg-white border shadow-sm hover:shadow-md duration-200">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-500">
                                Bài tập {exercise.orderIndex}
                              </span>

                              {exercise.scoreAchieved > 0 && (
                                <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                                  Điểm: {exercise.scoreAchieved}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className="text-lg font-semibold text-gray-900 ">
                              {exercise.exerciseTitle}
                            </h4>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb line-clamp-2">
                              {exercise.exerciseDescription}
                            </p>
                            {/* Question count */}
                            <div className="text-xs text-gray-500">
                              {exercise.numberOfQuestion} câu hỏi
                            </div>
                            {/* Button → căn phải */}
                            <div className="flex justify-end">
                              <Button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleButtonClick(
                                    exercise.status, 
                                    exercise.learningPathExerciseId,
                                    exercise.exerciseId,
                                    chapter.learningPathChapterId
                          
                                  );
                                }}
                                disabled={loadingExerciseId === exercise.learningPathExerciseId}
                                className={
                                  `font-medium cursor-pointer px-4 rounded-lg duration-200 ` +
                                  (exercise.status === "NotStarted"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : exercise.status === "InProgress"
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                    : "bg-gray-700 text-white hover:bg-gray-800")
                                }
                              >
                                {loadingExerciseId === exercise.learningPathExerciseId
                                  ? "Đang xử lý..."
                                  : exercise.status === "NotStarted"
                                  ? "Bắt đầu luyện tập"
                                  : exercise.status === "InProgress"
                                  ? "Tiếp tục học"
                                  : "Xem lại"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">
              Chưa có chương nào trong khóa học này
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LearningPath() {
  return (
    <Suspense fallback={
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    }>
      <LearningPathContent />
    </Suspense>
  );
}
