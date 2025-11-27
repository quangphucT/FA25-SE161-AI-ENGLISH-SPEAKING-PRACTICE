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
import { upLevelForLearner } from "@/features/learner/hooks/up-level/upLevelHook";



export default function EnrollingCourses() {
  const router = useRouter();
  const learnerCourseIdOnZustand = useLearnerStore(
    (state) => state.getAllLearnerData().learnerCourseId
  );

  const { data: userData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";

  const [viewingLevel, setViewingLevel] = useState<string>(userLevel);

  // hook call courses based on level
  const { data: coursesBasedOnLevel, isLoading } = useGetCoursesBasedOnLevelLearner(viewingLevel);

  const { data: levelAndLearnerCourseIdData } = useGetLevelAndLearnerCourseIdAfterEnrolling();
  const { mutate: enrollFirstCourse } = useEnrollFirstCourse();
  const { mutate: upLevel } = upLevelForLearner();

  const { mutate: enrollingPaidCourse } = useEnrollCourseNotFree();
  const currentViewingLevelData = levelAndLearnerCourseIdData?.data?.levels.find((item) => item.Level === viewingLevel);
  const enrolledCoursesInLevel = currentViewingLevelData?.Courses || [];
  
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
      onSuccess: () => {
       
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

  // Check if user can access a level
  const canAccessLevel = (targetLevel: string): boolean => {
    const targetIndex = levels.indexOf(targetLevel);
    
    // Level đầu tiên luôn mở
    if (targetIndex === 0) return true;
    
    // Check tất cả levels trước đó đã hoàn thành chưa
    for (let i = 0; i < targetIndex; i++) {
      const levelData = levelsData.find((l) => l.Level === levels[i]);
      
      // Nếu level trước chưa có course hoặc chưa hoàn thành hết
      if (!levelData || levelData.TotalCourses !== levelData.CompletedCourses || levelData.TotalCourses === 0) {
        return false;
      }
    }
    
    return true;
  };

  // Check if current user level is completed (để up level)
  const isCurrentLevelCompleted = (): boolean => {
    const currentLevelData = levelsData.find((l) => l.Level === userLevel);
    if (!currentLevelData) return false;
    return currentLevelData.TotalCourses > 0 && 
           currentLevelData.TotalCourses === currentLevelData.CompletedCourses;
  };

  // Handle level click - cho phép click nếu level đã unlock
  const handleLevelClick = (level: string) => {
    const levelIndex = levels.indexOf(level);
    const userLevelIndex = levels.indexOf(userLevel);
    
    // Nếu click vào level hiện tại hoặc level đã unlock trước đó
    if (levelIndex <= userLevelIndex) {
      setViewingLevel(level);
      return;
    }
    
    // Nếu click vào level tiếp theo (userLevel + 1) và đã hoàn thành level hiện tại
    if (levelIndex === userLevelIndex + 1 && isCurrentLevelCompleted()) {
      // Call API up level
      upLevel(undefined, {
        onSuccess: () => {
          setViewingLevel(level);
        }
      });
      return;
    }
    
    // Các trường hợp khác - level bị khóa
    if (!canAccessLevel(level)) {
      toast.info(`Hoàn thành tất cả khóa học ở Level ${userLevel} để mở khóa Level ${level}`);
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
              const levelData = levelsData.find((l) => l.Level === level);
              const isViewingLevel = level === viewingLevel; // Level đang xem
              const isUserCurrentLevel = level === userLevel; // Level hiện tại của user
              const hasCoursesInLevel =
                levelData && levelData.Courses && levelData.Courses.length > 0;
              const isUnlocked = canAccessLevel(level); // Check xem level đã unlock chưa
              const isLocked = !isUnlocked;

              return (
                <div key={level} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {/* Level Circle */}
                    <div
                      onClick={() => handleLevelClick(level)}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        isLocked
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                          : isViewingLevel
                          ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-110 ring-4 ring-blue-200 cursor-pointer hover:shadow-xl"
                          : isUserCurrentLevel
                          ? "bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-md hover:scale-105 ring-2 ring-green-300 cursor-pointer hover:shadow-xl"
                          : hasCoursesInLevel
                          ? "bg-linear-to-br from-blue-400 to-indigo-500 text-white shadow-md hover:scale-105 cursor-pointer hover:shadow-xl"
                          : "bg-white text-gray-400 border-2 border-gray-300 hover:border-gray-400 cursor-pointer hover:shadow-xl"
                      }`}
                      title={
                        isLocked
                          ? `Hoàn thành Level ${levels[index - 1]} để mở khóa`
                          : isUserCurrentLevel
                          ? `Level hiện tại của bạn - Click để xem`
                          : `Click để xem Level ${level}`
                      }
                    >
                      <span>{level}</span>
                      {/* Badge for current user level */}
                      {isUserCurrentLevel && !isLocked && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </span>
                      )}
                      {/* Lock icon for locked levels */}
                      {isLocked && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Level name */}
                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-semibold ${
                          isLocked
                            ? "text-gray-400"
                            : isViewingLevel
                            ? "text-blue-600"
                            : isUserCurrentLevel
                            ? "text-green-600"
                            : hasCoursesInLevel
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        {isLocked ? `🔒 ${level}` : isUserCurrentLevel ? "Level của bạn" : `Level ${level}`}
                      </p>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {index < levels.length - 1 && (
                    <ArrowRight
                      className={`w-8 h-8 mx-2 mb-4 ${
                        isUnlocked ? "text-blue-400" : "text-gray-300"
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
                        {/* Progress Badge - hiển thị status từ API */}
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
                      <span className="bg-linear-to-r from-blue-400 to-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                        Miễn phí
                      </span>
                    ) : (
                      <span className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
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
                      className={`w-[200px] rounded-4xl font-bold cursor-pointer ${
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
                          // BE đã handle điều kiện, không cần check ở FE
                          handleEnrollCourseNotFree(course.courseId);
                        }
                      }}
                      className={`w-[200px]  rounded-4xl  font-bold cursor-pointer ${
                        isFirstCourse
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }`}
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

