"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {  useEnrollFirstCourse, useGetCoursesBasedOnLevelLearner } from "@/features/learner/hooks/coursesBasedOnLevelLearner/coursesBasedOnLevelLearner";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import {BookMarked,BookOpen,Coins,PlayCircle,Target,TrendingUp,Lock,ChevronDown,ChevronRight} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { is } from "date-fns/locale";
interface LearningPathProps {
  setActiveMenu?: (menu: string) => void;
}
const LearningPath = ({ setActiveMenu }: LearningPathProps) => {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  const userLevel = userData?.learnerProfile?.level || "A1";
  const { data: coursesBasedOnLevel, isLoading } = useGetCoursesBasedOnLevelLearner(userLevel);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); 
   // hooks enroll
  const { mutate: enrollFirstCourse } = useEnrollFirstCourse();
  
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    setExpandedChapters([]); // Reset expanded chapters when selecting new course
  };

  const handleEnrollCourseFree = async (courseId: string) => {
    enrollFirstCourse(courseId);
    // Sau khi API thành công, add vào enrolled courses và select course
    setEnrolledCourses((prev) => [...prev, courseId]);
    handleSelectCourse(courseId);
  };

  const handleEnrollCourseNotFree = async (courseId: string, price: number) => {
    // TODO: Gọi API enroll cho khoá học trả phí (đã check coin ở backend)
    console.log("Enrolling paid course:", courseId, "price:", price);
    
    // Sau khi API thành công, add vào enrolled courses và select course
    setEnrolledCourses((prev) => [...prev, courseId]);
    handleSelectCourse(courseId);
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
  const selectedCourseData = courses.find(c => c.courseId === selectedCourse);

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

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6 max-w-[1400px] mx-auto">
        {/* Left Column - Courses List */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-3 text-blue-600" />
            Danh sách khoá học ({courses.length})
          </h4>
          
          {courses.map((course, index) => {
            const isFirstCourse = index === 0;
            const isSelected = selectedCourse === course.courseId;
            const totalExercises =
              course.chapters?.reduce(
                (sum, ch) => sum + ch.numberOfExercise,
                0
              ) || 0;

            return (
              <Card
                key={course.courseId}
                className={`p-3 cursor-pointer border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => enrolledCourses.includes(course.courseId) ? handleSelectCourse(course.courseId) : null}
              >
                {/* Course Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      
                      <h5 className="font-bold text-gray-900 text-base">
                        {course.title}
                      </h5>
                    </div>
                    <p className="text-xs text-gray-500">
                      {course.numberOfChapter} Chương • {totalExercises} Bài tập
                    </p>
                  </div>

                  {/* Badge */}
                  {course.isFree || isFirstCourse ? (
                    <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-[10px] font-bold px-3 rounded-full shadow-md">
                      Miễn phí
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3  rounded-full flex items-center gap-1 shadow-md">
                      <Coins className="w-3 h-3" />
                      {course.price}
                    </span>
                  )}
                </div>

            

                {/* Action Button */}
                {!enrolledCourses.includes(course.courseId) && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      isFirstCourse
                        ? handleEnrollCourseFree(course.courseId)
                        : handleEnrollCourseNotFree(course.courseId, course.price);
                    }}
                    className={`w-[220px] font-bold cursor-pointer rounded-4xl shadow-md text-sm ${
                      isFirstCourse ? 

                     "bg-blue-50 hover:bg-blue-100 text-black"
                     : "bg-red-150 hover:bg-blue-100 text-black"  
                    }`}
                  >
                    {isFirstCourse ? (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Tham gia
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Mở khoá 
                      </>
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right Column - Chapters & Exercises */}
        <div className="sticky top-6 h-fit">
          {selectedCourseData ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
                <h4 className="text-xl font-bold mb-1">{selectedCourseData.title}</h4>
                <p className="text-sm text-blue-100">
                  {selectedCourseData.numberOfChapter} Chapters • Level {selectedCourseData.level}
                </p>
              </div>

              {/* Chapters List */}
              {selectedCourseData.chapters && selectedCourseData.chapters.length > 0 ? (
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                  {selectedCourseData.chapters.map((chapter) => {
                    const isChapterExpanded = expandedChapters.includes(chapter.chapterId);
                    
                    return (
                      <Card
                        key={chapter.chapterId}
                        className="border-2 border-gray-200 hover:border-blue-300 transition-all"
                      >
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => toggleChapter(chapter.chapterId)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h6 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                {isChapterExpanded ? (
                                  <ChevronDown className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                                {chapter.title}
                              </h6>
                              <p className="text-sm text-gray-600">{chapter.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {chapter.numberOfExercise} bài tập
                              </p>
                            </div>
                          </div>

                          {/* Exercises List */}
                          {isChapterExpanded && chapter.exercises && chapter.exercises.length > 0 && (
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartExercise(
                                        selectedCourseData.courseId,
                                        chapter.chapterId,
                                        exercise.exerciseId,
                                        exercise.isFree ||
                                          selectedCourseData.isFree ||
                                          courses.indexOf(selectedCourseData) === 0
                                      );
                                    }}
                                    size="sm"
                                    className={`ml-3 cursor-pointer ${
                                      exercise.isFree ||
                                      selectedCourseData.isFree ||
                                      courses.indexOf(selectedCourseData) === 0
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-gray-400 hover:bg-gray-500"
                                    }`}
                                  >
                                    {exercise.isFree ||
                                    selectedCourseData.isFree ||
                                    courses.indexOf(selectedCourseData) === 0 ? (
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

                          {/* Empty state for no exercises */}
                          {isChapterExpanded &&
                            (!chapter.exercises || chapter.exercises.length === 0) && (
                              <div className="mt-3 p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-sm text-gray-500">Chưa có bài tập</p>
                              </div>
                            )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Chưa có nội dung</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Khoá học đang được cập nhật
                  </p>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50/30">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Chọn một khoá học
              </h4>
              <p className="text-gray-600">
                Click vào khoá học bên trái để xem chi tiết
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50/30 max-w-[1400px] mx-auto mt-6">
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
        <Card className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 max-w-[1400px] mx-auto">
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
