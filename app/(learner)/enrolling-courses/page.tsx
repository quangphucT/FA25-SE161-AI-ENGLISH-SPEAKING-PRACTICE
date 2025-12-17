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

  const { data: userData, refetch: refetchUserData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";

  const [viewingLevel, setViewingLevel] = useState<string>(userLevel);

  // hook call courses based on level
  const { data: coursesBasedOnLevel, isLoading } =
    useGetCoursesBasedOnLevelLearner(viewingLevel);

  const { data: levelAndLearnerCourseIdData } =
    useGetLevelAndLearnerCourseIdAfterEnrolling();
  const { mutate: enrollFirstCourse } = useEnrollFirstCourse();
  const { mutate: upLevel } = upLevelForLearner();

  const { mutate: enrollingPaidCourse } = useEnrollCourseNotFree();
  const currentViewingLevelData =
    levelAndLearnerCourseIdData?.data?.levels.find(
      (item) => item.Level === viewingLevel
    );
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
    // Lấy learnerCourseId từ Zustand, nếu không có thì lấy từ API data
    let learnerCourseId: string | null = learnerCourseIdOnZustand;

    // Nếu không có trong Zustand (sau khi logout), lấy từ levelAndLearnerCourseIdData
    if (!learnerCourseId) {
      const userLevelData = levelAndLearnerCourseIdData?.data?.levels.find(
        (item) => item.Level === userLevel
      );

      // Bắt buộc phải lấy learnerCourseId từ course đang InProgress
      if (userLevelData?.Courses && userLevelData.Courses.length > 0) {
        const inProgressCourse = userLevelData.Courses.find(
          (c) => c.status === "InProgress"
        );
        learnerCourseId = inProgressCourse?.learnerCourseId || null;
      }
    }

    if (!learnerCourseId) {
      toast.error(
        "Bạn cần hoàn thành bước đăng ký khoá học miễn phí trước khi có thể mua khoá học trả phí."
      );
      return;
    }

    enrollingPaidCourse(
      {
        learnerCourseId: learnerCourseId,
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

          refetchUserData();
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
      if (
        !levelData ||
        levelData.TotalCourses !== levelData.CompletedCourses ||
        levelData.TotalCourses === 0
      ) {
        return false;
      }
    }

    return true;
  };

  // Check if current user level is completed (để up level)
  const isCurrentLevelCompleted = (): boolean => {
    const currentLevelData = levelsData.find((l) => l.Level === userLevel);
    if (!currentLevelData) return false;
    return (
      currentLevelData.TotalCourses > 0 &&
      currentLevelData.TotalCourses === currentLevelData.CompletedCourses
    );
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
        },
      });
      return;
    }

    // Các trường hợp khác - level bị khóa
    if (!canAccessLevel(level)) {
      toast.info(
        `Hoàn thành tất cả khóa học ở Level ${userLevel} để mở khóa Level ${level}`
      );
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
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
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
                        {isLocked
                          ? `🔒 ${level}`
                          : isUserCurrentLevel
                          ? "Level của bạn"
                          : `Level ${level}`}
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
          {courses.length} khóa học về phát âm - Khóa đầu miễn phí
        </p>
      </div>

      {/* Courses Table */}
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
            <div className="col-span-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Khóa học
            </div>
            <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"></div>
            <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"></div>
            <div className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"></div>
          </div>

          {/* Table Body */}
          {courses.map((course, index) => {
            const isFirstCourse = index === 0;
            const totalExercises =
              course.chapters?.reduce(
                (sum, ch) => sum + ch.numberOfExercise,
                0
              ) || 0;

            const enrolledCourse = enrolledCoursesInLevel.find(
              (item) => item.courseId === course.courseId
            );
            const isEnrolled = !!enrolledCourse;
            const status = enrolledCourse?.status || "";
            const isCompleted = status === "Completed";
            const isInProgress = status === "InProgress";
            const isNotStarted = status === "NotStarted";

            return (
              <div
                key={course.courseId}
                className={`group grid grid-cols-12 gap-4 px-8 py-6 items-center border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/50 transition-all duration-200 ${
                  index === courses.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Course Info */}
                <div className="col-span-5">
                  <div className="flex items-center gap-4">
                    {/* Course Number Badge */}
                    <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 border border-slate-200">
                      <span className="text-slate-600 font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-gray-500 text-sm line-clamp-1 mb-1">
                        {course.description}
                      </p>
                      {isEnrolled && (
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isCompleted
                                ? "bg-green-500"
                                : isInProgress
                                ? "bg-blue-500 animate-pulse"
                                : isNotStarted
                                ? "bg-orange-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span
                            className={`text-xs font-semibold ${
                              isCompleted
                                ? "text-green-600"
                                : isInProgress
                                ? "text-blue-600"
                                : isNotStarted
                                ? "text-orange-600"
                                : "text-gray-500"
                            }`}
                          >
                            {isCompleted
                              ? "Đã hoàn thành"
                              : isInProgress
                              ? "Đang học"
                              : isNotStarted
                              ? "Chưa bắt đầu"
                              : "Chưa bắt đầu"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Stats */}
                <div className="col-span-2 text-center">
                  <div className="inline-flex flex-col items-center gap-1 px-4 py-2 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-semibold text-gray-800">
                        {course.numberOfChapter}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">chương</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {totalExercises} bài tập
                    {course.duration > 0 && (
                      <span className="ml-1">• {course.duration}p</span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center">
                  {course.isFree || isFirstCourse ? (
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-200">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zm-2.207 6.207a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Miễn phí
                      </span>
                      <span className="text-xs text-green-600 mt-1">
                        Không mất phí
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 text-sm font-bold rounded-xl border border-amber-200">
                        <Coins className="w-4 h-4" />
                        {course.price} Coin
                      </span>
                      <span className="text-xs text-amber-600 mt-1">
                        Trả bằng coin
                      </span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="col-span-3 text-center">
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
                      className={`rounded-xl cursor-pointer px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          : isNotStarted
                          ? "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Ôn tập
                        </>
                      ) : isNotStarted ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Bắt đầu học
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Tiếp tục học
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFirstCourse) {
                          handleEnrollCourseFree(course.courseId);
                        } else {
                          handleEnrollCourseNotFree(course.courseId);
                        }
                      }}
                      className={`rounded-xl cursor-pointer px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
                        isFirstCourse
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          : "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                      }`}
                    >
                      {isFirstCourse ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Bắt đầu học
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Mở khóa ngay
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4 max-w-3xl mx-auto">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 text-left space-y-2">
              <h4 className="font-semibold text-gray-800 text-sm">
                Lưu ý quan trọng
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  <p className="text-sm text-gray-700">
                    Hãy bắt đầu với khoá học
                    <span className="font-semibold text-green-600">
                      {" "}
                      miễn phí
                    </span>{" "}
                    để mở quyền mua các khoá học trả phí.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  <p className="text-sm text-gray-700">
                    Học theo thứ tự - Cần{" "}
                    <span className="font-semibold text-blue-600">
                      hoàn thành khóa trước
                    </span>{" "}
                    mới được học khóa tiếp theo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
