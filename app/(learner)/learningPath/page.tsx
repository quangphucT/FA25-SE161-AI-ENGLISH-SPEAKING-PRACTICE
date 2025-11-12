"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetCoursesBasedOnLevelLearner } from "@/features/learner/hooks/coursesBasedOnLevelLearner/coursesBasedOnLevelLearner";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import {BookMarked,BookOpen,Coins,PlayCircle,Target,TrendingUp,Lock,ChevronUp} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface LearningPathProps {
  setActiveMenu?: (menu: string) => void;
}
const LearningPath = ({ setActiveMenu }: LearningPathProps) => {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";
  const { data: coursesBasedOnLevel, isLoading } = useGetCoursesBasedOnLevelLearner(userLevel);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); 

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnrollCourseFree = async (courseId: string) => {
    // TODO: Gọi API enroll cho khoá học miễn phí
    console.log("Enrolling free course:", courseId);
    
    // Sau khi API thành công, add vào enrolled courses và expand
    setEnrolledCourses((prev) => [...prev, courseId]);
    toggleCourse(courseId);
  };

  const handleEnrollCourseNotFree = async (courseId: string, price: number) => {
    // TODO: Gọi API enroll cho khoá học trả phí (đã check coin ở backend)
    console.log("Enrolling paid course:", courseId, "price:", price);
    
    // Sau khi API thành công, add vào enrolled courses và expand
    setEnrolledCourses((prev) => [...prev, courseId]);
    toggleCourse(courseId);
  };

  const handleStartExercise = (
    courseId: string,
    chapterId: string,
    exerciseId: string,
    isFree: boolean
  ) => {
    if (!isFree) {
      // Check if user has access or needs to purchase
      toast.info("Vui lòng mua khoá học để tiếp tục");
      return;
    }

    // Navigate to exercise page
    router.push(
      `/exercise?courseId=${courseId}&chapterId=${chapterId}&exerciseId=${exerciseId}`
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
  return (
    <div>
      <div className="mb-6 flex flex-col justify-center items-center ">
        <h3 className="text-2xl font-bold text-gray-900">
          Lộ trình luyện Speaking & Pronunciation Level {userLevel}
        </h3>
        <p className="text-gray-500 mt-1">
          {courses.length} khoá học chuyên sâu về phát âm và giao tiếp - Khoá 1
          miễn phí
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-2 w-[900px] flex justify-center mx-auto">
        {courses.map((course, index) => {
          const isExpanded = expandedCourses.includes(course.courseId);
          const isFirstCourse = index === 0;
          const totalExercises =
            course.chapters?.reduce(
              (sum, ch) => sum + ch.numberOfExercise,
              0
            ) || 0;

          return (
            <Card
              key={course.courseId}
              className="bg-white cursor-pointer  border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Course Header */}
              <div className="px-[100px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {course.numberOfChapter} Chapters • {totalExercises}{" "}
                          Bài tập
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex flex-col gap-2 items-end">
                    {course.isFree || isFirstCourse ? (
                      <span className="bg-gradient-to-r  text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        MIỄN PHÍ
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <Coins className="w-4 h-4" />
                        {course.price} COIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">
                      {course.numberOfChapter} Chapters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">
                      {totalExercises} Bài luyện
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Level {course.level}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {enrolledCourses.includes(course.courseId) ? (
                    <Button
                      onClick={() => toggleCourse(course.courseId)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold cursor-pointer shadow-lg"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-5 h-5 mr-2" />
                          Ẩn nội dung
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5 mr-2" />
                          Xem nội dung khoá học
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        isFirstCourse
                          ? handleEnrollCourseFree(course.courseId)
                          : handleEnrollCourseNotFree(
                              course.courseId,
                              course.price
                            )
                      }
                      className={`font-bold cursor-pointer shadow-lg ${
                        isFirstCourse
                          ? "bg-white text-black hover:bg-gray-100 border border-gray-300"
                          : "bg-white text-black hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {isFirstCourse ? (
                        <>
                          <BookOpen className="w-5 h-5 mr-2" />
                          Tham gia khoá học (Miễn phí)
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Mở khoá {course.price} coin
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Expandable Chapters Content */}
              {isExpanded && course.chapters && course.chapters.length > 0 && (
                <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-blue-600" />
                    Danh sách Chapters ({course.numberOfChapter})
                  </h5>

                  <div className="space-y-3">
                    {course.chapters.map((chapter, chIndex) => (
                      <Card
                        key={chapter.chapterId}
                        className="p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h6 className="font-bold text-gray-900 mb-1">
                              {chapter.title}
                            </h6>
                            <p className="text-sm text-gray-600">
                              {chapter.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {chapter.numberOfExercise} bài tập
                            </p>
                          </div>
                        </div>

                        {/* Exercises List */}
                        {chapter.exercises && chapter.exercises.length > 0 && (
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-200">
                            {chapter.exercises.map((exercise) => (
                              <div
                                key={exercise.exerciseId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {exercise.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {exercise.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {exercise.numberOfQuestion} câu hỏi
                                  </p>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleStartExercise(
                                      course.courseId,
                                      chapter.chapterId,
                                      exercise.exerciseId,
                                      exercise.isFree ||
                                        course.isFree ||
                                        isFirstCourse
                                    )
                                  }
                                  size="sm"
                                  className={`ml-3 cursor-pointer ${
                                    exercise.isFree ||
                                    course.isFree ||
                                    isFirstCourse
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-gray-400 hover:bg-gray-500"
                                  }`}
                                >
                                  {exercise.isFree ||
                                  course.isFree ||
                                  isFirstCourse ? (
                                    <>
                                      <PlayCircle className="w-4 h-4 mr-1" />
                                      Bắt đầu
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-4 h-4 mr-1" />
                                      Khoá
                                    </>
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state for no chapters */}
              {isExpanded &&
                (!course.chapters || course.chapters.length === 0) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Chưa có nội dung
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Khoá học đang được cập nhật
                    </p>
                  </div>
                )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có khoá học
          </h4>
          <p className="text-gray-600">
            Hiện tại chưa có khoá học nào cho Level {userLevel}
          </p>
        </Card>
      )}

      {/* Progress Summary */}
      {courses.length > 0 && (
        <Card className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  🎯 Lộ trình học Level {userLevel}
                </h4>
                <p className="text-gray-600">
                  Có {courses.length} khoá học - Khoá đầu tiên miễn phí
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Số dư của bạn</p>
              <p className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {userData?.coinBalance} Coin
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LearningPath;
