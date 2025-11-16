"use client";
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

import { useRouter } from "next/navigation";
import { useLearnerStore } from "@/store/useLearnerStore";
import { useLearningPathCourseFull } from "@/features/learner/hooks/learningPathCourseFullHooks/learningPathCourseFull";
import { Progress } from "@/components/ui/progress";

interface LearningPathProps {
  setActiveMenu?: (menu: string) => void;
}

const LearningPath = ({ setActiveMenu }: LearningPathProps) => {
  const router = useRouter();
  const getAllLearnerData = useLearnerStore((state) => state.getAllLearnerData);
  const learnerData = getAllLearnerData();

  const { data: apiResponse, isLoading } = useLearningPathCourseFull(
    {
      learningPathCourseId: learnerData?.learningPathCourseId || "",
      courseId: learnerData?.courseId || "",
      status: learnerData?.status || "",
    },
    Boolean(learnerData)
  );

  // Ngay khi vào trang lấy thông tin user
  const { data: userData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";

  const handleNavigateToEnrollingCourses = () => {
    if (setActiveMenu) {
      setActiveMenu("enrollingCourses");
    }
  };



  const handleExerciseClick = (exerciseId: string) => {
    // Navigate to exercise
    router.push(`/exercise?exerciseId=${exerciseId}`);
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
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-300">
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

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Course Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
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
        <div className="mt-4">
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
          chapters.map((chapter, index) => (
            <Card
              key={chapter.learningPathChapterId}
              className={`p-6 border-2 transition-all hover:shadow-md ${
                chapter.status.toLowerCase() === "locked"
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:border-blue-300"
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
                  <div className="flex items-center justify-between">
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

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(chapter.progress)}%
                        </div>
                        <div className="text-xs text-gray-500">Hoàn thành</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <Progress value={chapter.progress} className="h-2" />

                  {/* Chapter Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{chapter.exercises?.length || 0} Bài tập</span>
                  </div>

                  {/* Exercises */}
                  {chapter.exercises && chapter.exercises.length > 0 && (
                    <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200">
                      {chapter.exercises.map((exercise, exerciseIndex) => (
                        <div
                          key={exercise.learningPathExerciseId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            exercise.status.toLowerCase() === "locked"
                              ? "bg-gray-50 border-gray-200 opacity-60"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          } transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (exercise.status.toLowerCase() !== "locked") {
                              handleExerciseClick(exercise.exerciseId);
                            }
                          }}
                        >
                          <div className=" rounded-lg p-4 duration-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                Bài tập {exercise.orderIndex}
                              </span>
                              {exercise.scoreAchieved > 0 && (
                                <span className="text-green-600 font-semibold text-sm">
                                  Điểm: {exercise.scoreAchieved}
                                </span>
                              )}
                            </div>
                            <h4 className="text-md font-semibold text-gray-900 mb-1">
                              {exercise.exerciseTitle}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {exercise.exerciseDescription}
                            </p>
                            <div className="text-xs text-gray-500">
                              {exercise.numberOfQuestion} câu hỏi
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
};

export default LearningPath;
