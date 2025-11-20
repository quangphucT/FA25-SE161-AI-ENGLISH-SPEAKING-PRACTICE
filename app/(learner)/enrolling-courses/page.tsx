"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useEnrollFirstCourse,
  useGetCoursesBasedOnLevelLearner,
} from "@/features/learner/hooks/coursesBasedOnLevelLearner/coursesBasedOnLevelLearner";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { BookOpen, Coins, TrendingUp, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useGetLevelAndLearnerCourseIdAfterEnrolling } from "@/features/learner/hooks/enrollingCourseHooks/enrollingCourses";
import { useLearnerStore } from "@/store/useLearnerStore";
import { useEnrollCourseNotFree } from "@/features/learner/hooks/enrollingCourseNotFreeHooks/enrollCourseNotFree";
import { useRouter } from "next/navigation";



export default function EnrollingCourses() {
  const router = useRouter();
  const learnerCourseIdOnZustand = useLearnerStore(
    (state) => state.getAllLearnerData().learnerCourseId
  );

  const { data: userData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";
  const [viewingLevel, setViewingLevel] = useState<string>(userLevel);
  const { data: coursesBasedOnLevel, isLoading } = useGetCoursesBasedOnLevelLearner(viewingLevel);
  const { data: levelAndLearnerCourseIdData } = useGetLevelAndLearnerCourseIdAfterEnrolling();
  const { mutate: enrollFirstCourse } = useEnrollFirstCourse();

  const { mutate: enrollingPaidCourse } = useEnrollCourseNotFree();
  const currentViewingLevelData = levelAndLearnerCourseIdData?.data?.levels.find((item) => item.level === viewingLevel);
  const enrolledCoursesInLevel = currentViewingLevelData?.courses || [];
  useEffect(() => {
    setViewingLevel(userLevel);
  }, [userLevel]);
  const handleSelectCourse = (
    courseId: string,
    learningPathCourseId: string,
    learnerCourseId: string,
    status: string
  ) => {
    const courseData = {
      learnerCourseId,
      learningPathCourseId,
      courseId,
      status: status as "InProgress" | "Completed",
    };
    useLearnerStore.getState().setAllLearnerData(courseData);
    router.push(`/dashboard-learner-layout?menu=learningPath`);
  };

  const handleEnrollCourseFree = async (courseId: string) => {
    enrollFirstCourse(courseId, {
      onSuccess: (data) => {
        toast.success(data.message || "Đã tham gia khóa học thành công!");
        router.push(`/dashboard-learner-layout?menu=learningPath`);
      },
    });
  };

  const setAllLearnerData = useLearnerStore((state) => state.setAllLearnerData);

  const handleEnrollCourseNotFree = async (courseId: string) => {
    enrollingPaidCourse(
      {
        learnerCourseId: learnerCourseIdOnZustand || "",
        courseId: courseId,
      },
      {
        onSuccess: (data) => {
          toast.success("Đã tham gia khóa học thành công!");
          setAllLearnerData({
            learnerCourseId: data.data.learningPathCourseId,
            courseId: data.data.courseId,
            learningPathCourseId: data.data.learningPathCourseId,
            status: data.data.status,
          });
          router.push(`/dashboard-learner-layout?menu=learningPath`);
        },
        onError: (error) => {
          toast.error(error.message || "Tham gia khóa học thất bại");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải khoá học...</p>
        </div>
      </div>
    );
  }

  const courses = coursesBasedOnLevel?.data || [];

  // Level progression data
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const levelsData = levelAndLearnerCourseIdData?.data?.levels || [];

  // Handle level click
  const handleLevelClick = (level: string) => {
    const levelData = levelsData.find((l) => l.level === level);
    const isCurrentLevel = level === userLevel;
    const hasCoursesInLevel =
      levelData && levelData.courses && levelData.courses.length > 0;

    if (isCurrentLevel || hasCoursesInLevel) {
      setViewingLevel(level);
    } else {
      toast.info(`Level ${level} chưa có khóa học nào`);
    }
  };

  return (
    <div>
      {/* Level Mind Map */}
      <Card className="mb-6 p-6 bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Cấp độ hiện tại của bạn
          </h3>

          <div className="flex items-center gap-3 w-full justify-center">
            {levels.map((level, index) => {
              const levelData = levelsData.find((l) => l.level === level);
              const isCurrentLevel = level === viewingLevel;
              const hasCoursesInLevel =
                levelData && levelData.courses && levelData.courses.length > 0;
              const isClickable = level === userLevel || hasCoursesInLevel;

              return (
                <div key={level} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {/* Level Circle */}
                    <div
                      onClick={() => isClickable && handleLevelClick(level)}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        isCurrentLevel
                          ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-110 ring-4 ring-blue-200"
                          : hasCoursesInLevel
                          ? "bg-linear-to-br from-blue-400 to-indigo-500 text-white shadow-md hover:scale-105"
                          : "bg-white text-gray-400 border-2 border-gray-300"
                      } ${
                        isClickable
                          ? "cursor-pointer hover:shadow-xl"
                          : "cursor-not-allowed opacity-60"
                      }`}
                      title={
                        isClickable
                          ? `Click để xem Level ${level}`
                          : `Level ${level} chưa mở khóa`
                      }
                    >
                      <span>{level}</span>
                    </div>

                    {/* Level name */}
                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-semibold ${
                          isCurrentLevel
                            ? "text-blue-600"
                            : hasCoursesInLevel
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        Level {level}
                      </p>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {index < levels.length - 1 && (
                    <ArrowRight
                      className={`w-8 h-8 mx-2 mb-4 ${
                        hasCoursesInLevel ? "text-blue-400" : "text-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="mb-6 flex flex-col justify-center items-center ">
        <h3 className="text-2xl font-bold text-gray-900">
          Khám phá khóa học Level {viewingLevel}
        </h3>
        <p className="text-gray-500 mt-1">
          {courses.length} khóa học chuyên sâu về phát âm và giao tiếp - Khóa
          đầu miễn phí
        </p>
      </div>

      {/* Courses Grid */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course, index) => {
            const isFirstCourse = index === 0;
            const totalExercises =
              course.chapters?.reduce(
                (sum, ch) => sum + ch.numberOfExercise,
                0
              ) || 0;

            // Get enrollment info from levelAndLearnerCourseIdData
            const enrolledCourse = enrolledCoursesInLevel.find(
              (item) => item.courseId === course.courseId
            );
            const isEnrolled = !!enrolledCourse;
            const status = enrolledCourse?.status || "";
            const isCompleted = status === "Completed";
            const isInProgress = status === "InProgress";

            return (
              <Card
                key={course.courseId}
                className="p-4 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Course Header */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-gray-900 text-base">
                          {course.title}
                        </h5>
                        {/* Progress Badge */}
                        {isEnrolled && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : isInProgress
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isCompleted
                              ? "✓ Hoàn thành"
                              : isInProgress
                              ? "Đang học"
                              : "Chưa bắt đầu"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badge */}
                    {course.isFree || isFirstCourse ? (
                      <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                        Miễn phí
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Coins className="w-3 h-3" />
                        {course.price}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {course.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    {course.numberOfChapter} Chương • {totalExercises} Bài tập
                  </p>

                  {/* Action Button */}
                  {isEnrolled ? (
                    <Button
                      onClick={() =>
                        handleSelectCourse(
                          course.courseId,
                          enrolledCourse.learningPathCourseId,
                          enrolledCourse.learnerCourseId,
                          enrolledCourse.status
                        )
                      }
                      className={`w-full font-bold cursor-pointer ${
                        isCompleted
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {isCompleted ? "Xem lại khóa học" : "Tiếp tục học"}
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFirstCourse) {
                          handleEnrollCourseFree(course.courseId);
                        } else {
                          // Check if user has enrolled in at least one course in this level
                          if (enrolledCoursesInLevel.length === 0) {
                            toast.error(
                              "Vui lòng tham gia khóa học đầu tiên trước"
                            );
                            return;
                          }
                          handleEnrollCourseNotFree(course.courseId);
                        }
                      }}
                      className={`w-full font-bold cursor-pointer ${
                        isFirstCourse
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : enrolledCoursesInLevel.length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }`}
                      disabled={
                        !isFirstCourse && enrolledCoursesInLevel.length === 0
                      }
                    >
                      {isFirstCourse ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Tham gia miễn phí
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Mở khóa - {course.price} Coin
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

