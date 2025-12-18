"use client";

import { useGetCoursesOfLevelMutation } from "@/features/manager/hook/coursesHooks/courseHooks";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {Plus,Pencil,Trash2,BookOpen,Layers,FolderOpen,FileText,HelpCircle,FileImage,ArrowLeft} from "lucide-react";
import { useCreateCourse } from "@/features/manager/hook/coursesHooks/useCreateCourse";
import { useUpdateCourse } from "@/features/manager/hook/coursesHooks/useUpdateCourse";
import { useDeleteCourse } from "@/features/manager/hook/coursesHooks/useDeleteCourse";
import { useGetChapterFollowingCourseId } from "@/features/manager/hook/chaptersHooks/useGetChapterFollowingCourseId";
import { useCreateChapterFollowingCourseId } from "@/features/manager/hook/chaptersHooks/useCreateChapterFollowingCourseId";
import { useUpdateChapter } from "@/features/manager/hook/chaptersHooks/useUpdateChapter";
import { useDeleteChapter } from "@/features/manager/hook/chaptersHooks/useDeleteChapter";
import { useGetExcerciseFollowingChapterId } from "@/features/manager/hook/excerciseHooks/useGetExcerciseFollowingChapterId";
import { useCreateExerciseFollowingChapterId } from "@/features/manager/hook/excerciseHooks/useCreateExcerciseFollowingChapterId";
import { useUpdateExercise } from "@/features/manager/hook/excerciseHooks/useUpdateExercise";
import { useDeleteExercise } from "@/features/manager/hook/excerciseHooks/useDeleteExercise";
import { useGetQuestionsFollowingExerciseId } from "@/features/manager/hook/questionsHooks/useGetQuestionsFollowingExerciseId";
import { useCreateQuestionFollowingExerciseId } from "@/features/manager/hook/questionsHooks/useCreateQuestionFollowingExerciseId";
import { useUpdateQuestion } from "@/features/manager/hook/questionsHooks/useUpdateQuestion";
import { useDeleteQuestion } from "@/features/manager/hook/questionsHooks/useDeleteQuestion";
import { useGetMediaFollowingQuestionId } from "@/features/manager/hook/mediaQuestionHooks/useGetMediaByQuestionId";
import { useCreateMediaFollowingQuestionId } from "@/features/manager/hook/mediaQuestionHooks/useCreateMediaByQuestionId";
import { useDeleteMedia } from "@/features/manager/hook/mediaQuestionHooks/useDeleteMedia";
import { useUpdateMedia } from "@/features/manager/hook/mediaQuestionHooks/useUpdateMedia";
import { useUploadImage } from "@/features/manager/hook/uploadImgHooks/useUploadImage";
import { useUploadVideo } from "@/features/manager/hook/uploadVideoHooks/useUploadVideo";

interface Course {
  courseId: string;
  title: string;
  description?: string;
  type: string;
  numberOfChapter: number;
  orderIndex: number;
  level: string;
  price: number;
  duration?: number;
  status?: string;
  chapters?: Chapter[];
}

interface Chapter {
  chapterId: string;
  title: string;
  description: string;
orderIndex?: number;
  numberOfExercise?: number;
  createdAt?: string;
  exercises?: Exercise[];
}

interface Exercise {
  exerciseId: string;
  title: string;
  description: string;
  orderIndex: number;
  numberOfQuestion?: number;
  questions?: Question[];
}

interface Question {
  questionId: string;
  content?: string;
  text?: string;
  type: string | number;
  orderIndex: number;
phonemeJson?: string | number;
}

interface Media {
  questionMediaId: string;
  accent: string;
  audioUrl: string;
  videoUrl: string;
  imageUrl: string;
  source: string;
}
interface LevelProps {
  level: string;
}

function CourseStatusBadge({ status }: { status?: string }) {
  if (status === "Active") {
    return (
      <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        Đang hoạt động
      </span>
    );
  }

  if (status === "Inactive") {
    return (
      <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        Ngưng hoạt động
      </span>
    );
  }

  return null;
}



const LevelA1 = ({ level }: LevelProps) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetCoursesOfLevelMutation(level);
  const coursesOfLevelA1 = response?.data || [];

  // Modal states for each entity type
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
const { mutateAsync: uploadImage } = useUploadImage();
const { mutateAsync: uploadVideo } = useUploadVideo();

  // State for multiple questions
const [questionsList, setQuestionsList] = useState<Array<{
  text: string;
  type: number;
}>>([]);


  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteChapterDialog, setShowDeleteChapterDialog] = useState(false);
  const [showDeleteExerciseDialog, setShowDeleteExerciseDialog] = useState(false);
  const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] = useState(false);
  const [showDeleteMediaDialog, setShowDeleteMediaDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null);
  const [deletingExercise, setDeletingExercise] = useState<Exercise | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<Media | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [viewingCourseDetails, setViewingCourseDetails] = useState<Course | null>(null);
const [viewingChapterDetails, setViewingChapterDetails] = useState<Chapter | null>(null);
const [viewingExerciseDetails, setViewingExerciseDetails] = useState<Exercise | null>(null);
const [viewingQuestionDetails, setViewingQuestionDetails] = useState<Question | null>(null);

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [viewingMediaDetails, setViewingMediaDetails] = useState<Media | null>(null);


  useEffect(() => {
  // 🔁 Khi đổi Course → reset toàn bộ state con

  // Selection hierarchy
  setSelectedChapter(null);
  setSelectedExercise(null);
  setSelectedQuestion(null);

  // Temporary data
  setQuestionsList([]);

  // Close modals
  setShowChapterModal(false);
  setShowExerciseModal(false);
  setShowQuestionModal(false);
  setShowEditQuestionModal(false);
  setShowMediaModal(false);

  // Clear editing states
  setEditingChapter(null);
  setEditingExercise(null);
  setEditingQuestion(null);
  setEditingMedia(null);

  // Clear viewing states
  setViewingChapterDetails(null);
  setViewingExerciseDetails(null);
  setViewingQuestionDetails(null);
  setViewingMediaDetails(null);

}, [selectedCourse?.courseId]);

  const { mutate: createCourseMutation } = useCreateCourse();
  const { mutate: updateCourseMutation } = useUpdateCourse();
  const { mutate: deleteCourseMutation } = useDeleteCourse();
  const { mutate: createChapterMutation } = useCreateChapterFollowingCourseId();
  const { mutate: updateChapterMutation } = useUpdateChapter();
  const { mutate: deleteChapterMutation } = useDeleteChapter();
  const { mutate: createExerciseMutation } =
    useCreateExerciseFollowingChapterId();
  const { mutate: updateExerciseMutation } = useUpdateExercise();
  const { mutate: deleteExerciseMutation } = useDeleteExercise();
  const { mutate: createQuestionMutation } =
    useCreateQuestionFollowingExerciseId();
  const { mutate: updateQuestionMutation } = useUpdateQuestion();
  const { mutate: deleteQuestionMutation } = useDeleteQuestion();
  const { mutate: createMediaMutation } = useCreateMediaFollowingQuestionId();
  const { mutate: updateMediaMutation } = useUpdateMedia();
  const { mutate: deleteMediaMutation } = useDeleteMedia();
  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
    error: questionsError,
    refetch: refetchQuestions,
  } = useGetQuestionsFollowingExerciseId(
  selectedExercise?.exerciseId || "",
  !!selectedExercise?.exerciseId
);


const detectQuestionType = (text: string): number => {
  const normalized = text
    .trim()
    .replace(/\s+/g, " "); // xoá space dư

  const wordCount = normalized.split(" ").length;

  if (wordCount <= 1) return 0;      // word
  if (wordCount === 2) return 1;     // phrase
  return 2;                          // sentence
};


const {
  data: mediaData,
  refetch: refetchMedia,
} = useGetMediaFollowingQuestionId(
  selectedQuestion?.questionId || "",
  !!selectedQuestion?.questionId
);

useEffect(() => {
  if (selectedQuestion?.questionId) {
    refetchMedia();
  }
}, [selectedQuestion]);

  const {
    data: exercisesData,
    isLoading: isExercisesLoading,
    isError: isExercisesError,
    error: exercisesError,
    refetch: refetchExercises,
  } = useGetExcerciseFollowingChapterId(
  selectedChapter?.chapterId || "",
  !!selectedChapter?.chapterId
);



  const {
    data: chaptersData,
    isLoading: isChaptersLoading,
    isError: isChaptersError,
    error: chaptersError,
    refetch: refetchChapters,
  } = useGetChapterFollowingCourseId(
  selectedCourse?.courseId || "",
  !!selectedCourse?.courseId
);




  const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const questionTypeOptions = [
    { label: "word", value: 0 },
    { label: "sentence", value: 2 },
    { label: "phrase", value: 1 },
  ];

const QUESTION_TYPE_LABEL_VI = (type: string | number) => {
  const normalized =
    typeof type === "number"
      ? type
      : type.toString().toLowerCase();

  switch (normalized) {
    case 0:
    case "word":
      return "Từ đơn";

    case 1:
    case "phrase":
      return "Cụm từ";

    case 2:
    case "sentence":
      return "Câu";

    default:
      return "Không xác định";
  }
};

  
  // Course Schema and Form
  const courseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"], "Level is required"),
    numberOfChapter: z.coerce.number().int().min(0, "Must be >= 0"),
price: z.coerce
  .number()
  .min(0)
  .superRefine((val, ctx) => {
    if (!Number.isInteger(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phải nhập số nguyên",
      });
    }
  }),

duration: z.coerce
  .number()
  .min(0)
  .superRefine((val, ctx) => {
    if (!Number.isInteger(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phải nhập số nguyên",
      });
    }
  }),

    status: z.enum(["Active", "Inactive"], "Status is required"),
  });

  type CourseFormValues = z.infer<typeof courseSchema>;

  const courseFormMethods = useForm<CourseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      level: "A1",
      numberOfChapter: 0,
      price: 0,
      duration: 0,
      status: "Active",
    },
  });

  // Chapter Schema and Form
  const chapterSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    numberOfExercise: z.coerce.number().int().min(0, "Must be >= 0").default(0),
  });

  type ChapterFormValues = z.infer<typeof chapterSchema>;

  const chapterFormMethods = useForm<ChapterFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(chapterSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      numberOfExercise: 0,
    },
  });

  // Exercise Schema and Form
  const exerciseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    numberOfQuestion: z.coerce.number().int().min(0, "Must be >= 0").default(0),
  });

  type ExerciseFormValues = z.infer<typeof exerciseSchema>;

  const exerciseFormMethods = useForm<ExerciseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(exerciseSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      numberOfQuestion: 0,
    },
  });

  // Question Schema and Form
 // ===============================
// CREATE QUESTION (NO orderIndex)
// ===============================
const createQuestionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
type: z.number().int().min(0),
});

type CreateQuestionFormValues = z.infer<typeof createQuestionSchema>;

const questionFormMethods = useForm<CreateQuestionFormValues>({
  resolver: zodResolver(createQuestionSchema),
  defaultValues: {
    text: "",
    type: 0,
  },
});


  // Edit Single Question Form (separate from multi-create)
  const updateQuestionSchema = z.object({
  text: z.string().min(1),
  type: z.number().int().min(0),
orderIndex: z.number().int().min(0),
  phonemeJson: z.string().optional(),
});

type UpdateQuestionFormValues = z.infer<typeof updateQuestionSchema>;

const editQuestionFormMethods = useForm<UpdateQuestionFormValues>({
  resolver: zodResolver(updateQuestionSchema),
  defaultValues: {
    text: "",
    type: 0,
    orderIndex: 0,
    phonemeJson: "",
  },
});

  // const mediaSchema = z.object({
  //   accent: z.string().min(1, "Accent is required"),
  //   audioUrl: z.string().url("Must be valid URL").or(z.literal("")),
  //   videoUrl: z.string().url("Must be valid URL").or(z.literal("")),
  //   imageUrl: z.string().url("Must be valid URL").or(z.literal("")),
  //   source: z.string().min(1, "Source is required"),
  // });


 const mediaSchema = z.object({
  accent: z.string().min(1, "Accent is required"),

  audioUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),

  videoFile: z.any().optional(),
  imageFile: z.any().optional(),

  source: z.string().min(1, "Source is required"),
});


  type MediaFormValues = z.infer<typeof mediaSchema>;

  const mediaFormMethods = useForm<MediaFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mediaSchema) as any,
    defaultValues: {
  accent: "",
  audioUrl: "",
  videoUrl: "",
  imageUrl: "",
  videoFile: null,
  imageFile: null,
  source: "",
},

  });

  // Sort courses by orderIndex
  const sortedCourses = [...coursesOfLevelA1].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  // Course Handlers
  const handleCreateCourse = () => {
    setEditingCourse(null);
    courseFormMethods.reset({
      title: "",
      description: "",
      level: "A1",
      numberOfChapter: 0,
      price: 0,
      status: "Active",
      duration: 0,
    });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseFormMethods.reset({
      title: course.title,
      description: course.description || "",
      level: course.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
      numberOfChapter: course.numberOfChapter,
      price: course.price,
      duration: course.duration || 0,
      status: (course.status as "Active" | "Inactive") || "Active",
    });
    setShowCourseModal(true);
  };

  const onSubmitCourse = (values: CourseFormValues) => {
    const payload = { ...values };
    if (editingCourse) {
      updateCourseMutation({
        id: editingCourse.courseId,
        payload: payload,
      });
    } else {
      createCourseMutation(payload);
    }
    setShowCourseModal(false);
  };

  // Chapter Handlers
  const handleCreateChapter = () => {
    setEditingChapter(null);
    chapterFormMethods.reset({
      title: "",
      description: "",
      numberOfExercise: 0,
    });
    setShowChapterModal(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
  setEditingChapter(chapter);
  chapterFormMethods.reset({
    title: chapter.title,
    description: chapter.description,
    numberOfExercise: chapter.numberOfExercise || 0,
  });
  setShowChapterModal(true);
};


 const onSubmitChapter = (values: ChapterFormValues) => {
  if (!selectedCourse) {
    toast.error("Please select a course first");
    return;
  }

  if (editingChapter) {
    updateChapterMutation({
      id: editingChapter.chapterId,
      payload: {
        courseId: selectedCourse.courseId, // 🔒 FIX CỨNG
        title: values.title,
        description: values.description,
        numberOfExercise: values.numberOfExercise,
      },
    });
  } else {
    createChapterMutation({
      courseId: selectedCourse.courseId,
      title: values.title,
      description: values.description,
      numberOfExercise: values.numberOfExercise,
    });
  }

  setShowChapterModal(false);
};

  // Exercise Handlers
  const handleCreateExercise = () => {
    setEditingExercise(null);
    exerciseFormMethods.reset({
      title: "",
      description: "",
      numberOfQuestion: 0,
    });
    setShowExerciseModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    exerciseFormMethods.reset({
      title: exercise.title,
      description: exercise.description,
      numberOfQuestion: 0, // hoặc lấy từ exercise nếu có field này
    });
    setShowExerciseModal(true);
  };

  const onSubmitExercise = (values: ExerciseFormValues) => {
    if (!selectedChapter && !editingExercise)
 {
      console.error("No chapter selected");
      toast.error("Please select a chapter first");
      return;
    }

    if (editingExercise) {
      updateExerciseMutation({
        id: editingExercise.exerciseId,
        payload: {
          chapterId: selectedChapter!.chapterId || "", // Use current expanded chapter
          title: values.title,
          description: values.description,
          numberOfQuestion: values.numberOfQuestion,
        },
      });
    } else {
      createExerciseMutation({
  chapterId: selectedChapter!.chapterId,
        title: values.title,
        description: values.description,
        numberOfQuestion: values.numberOfQuestion,
      });
    }

    setShowExerciseModal(false);
  };

  // Question Handlers
  const handleCreateQuestion = () => {
    questionFormMethods.reset({
  text: "",
  type: 0,
});

    setQuestionsList([]); // Reset questions list
    setShowQuestionModal(true);
  };

const handleAddQuestionToList = (values: CreateQuestionFormValues) => {
  const autoType = detectQuestionType(values.text);

  setQuestionsList([
    ...questionsList,
    {
      text: values.text,
      type: autoType, // ✅ AUTO
    },
  ]);

  questionFormMethods.reset({
    text: "",
    type: autoType, // optional – chỉ để UI sync
  });

  toast.success("Question added (auto detect type)");
};

const watchedQuestionText = questionFormMethods.watch("text");

useEffect(() => {
  if (!watchedQuestionText) return;

  const autoType = detectQuestionType(watchedQuestionText);
  questionFormMethods.setValue("type", autoType);
}, [watchedQuestionText]);


  const handleRemoveQuestion = (index: number) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
    toast.success("Question removed");
  };

  const onSubmitQuestion = () => {
    if (!selectedExercise)
 {
      console.error("No exercise selected");
      toast.error("Please select an exercise first");
      return;
    }

    if (questionsList.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

  createQuestionMutation({
  exerciseId: selectedExercise!.exerciseId,
  questions: questionsList,
});


    setShowQuestionModal(false);
    setQuestionsList([]);
  };

  // Edit Single Question Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    // Parse type: could be string "0", "1", "2" or number 0, 1, 2
    const typeValue = typeof question.type === 'string' 
      ? parseInt(question.type) 
      : question.type;
    
    editQuestionFormMethods.reset({
      text: question.text,
      type: typeValue || 0,
      orderIndex: question.orderIndex,
      phonemeJson: question.phonemeJson?.toString() || "",
    });
    setShowEditQuestionModal(true);
  };

const onSubmitEditQuestion = (values: UpdateQuestionFormValues) => {
  if (!editingQuestion) return;

  const autoType = detectQuestionType(values.text);

  updateQuestionMutation({
    id: editingQuestion.questionId,
    payload: {
      text: values.text,
      type: autoType, // ✅ FIX
      orderIndex: values.orderIndex,
      phonemeJson: values.phonemeJson ?? "",
    },
  });

  setShowEditQuestionModal(false);
  setEditingQuestion(null);
};


  // Media Handlers
  

  const handleCreateMedia = () => {
    setEditingMedia(null);
    mediaFormMethods.reset({
      accent: "",
      audioUrl: "",
      videoUrl: "",
      imageUrl: "",
      source: "",
    });
    setShowMediaModal(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const handleEditMedia = (media: Media) => {
  setEditingMedia(media);
  mediaFormMethods.reset({
    accent: media.accent,
    audioUrl: media.audioUrl,
    videoUrl: media.videoUrl,
    imageUrl: media.imageUrl,
    videoFile: null,
    imageFile: null,
    source: media.source,
  });
  setShowMediaModal(true);
};


 const onSubmitMedia = async (values: MediaFormValues) => {
  console.log("✅ SUBMIT MEDIA VALUES:", values);

  if (!selectedQuestion) {
    toast.error("Please select a question first");
    return;
  }

  let finalImageUrl = values.imageUrl || "";
  let finalVideoUrl = values.videoUrl || "";

  try {
    // ✅ LOG TRƯỚC KHI UPLOAD IMAGE
    if (values.imageFile) {
      console.log("📤 UPLOADING IMAGE:", values.imageFile);

      const imgRes = await uploadImage(values.imageFile);

      console.log("✅ UPLOAD IMAGE RESPONSE:", imgRes);

      finalImageUrl = imgRes.url;

      console.log("✅ FINAL IMAGE URL:", finalImageUrl);
    }

    // ✅ LOG TRƯỚC KHI UPLOAD VIDEO
   if (values.videoFile) {
  console.log("📤 UPLOADING VIDEO:", values.videoFile);

  const vidRes = await uploadVideo(values.videoFile);

  console.log("✅ UPLOAD VIDEO RESPONSE:", vidRes);

  finalVideoUrl = vidRes.url;

   mediaFormMethods.setValue("videoUrl", vidRes.url); // <-- DÒNG QUAN TRỌNG

  console.log("✅ FINAL VIDEO URL:", finalVideoUrl);
}


    const payload = {
      accent: values.accent,
      audioUrl: values.audioUrl || "",
      imageUrl: finalImageUrl || "",
      videoUrl: finalVideoUrl || "",
      source: values.source,
    };

    console.log("🚀 FINAL PAYLOAD SEND TO API:", payload);

    if (editingMedia) {
      console.log("✏️ UPDATE MEDIA MODE:", editingMedia.questionMediaId);
      updateMediaMutation({
        id: editingMedia.questionMediaId,
        payload,
      });
    } else {
      console.log("➕ CREATE MEDIA MODE:", selectedQuestion.questionId);
      createMediaMutation({
        questionId: selectedQuestion.questionId,
        ...payload,
      });
    }

    toast.success("Media saved successfully");
    setShowMediaModal(false);
    setEditingMedia(null);
    mediaFormMethods.reset();
    refetchMedia();
  } catch (err) {
    console.error("❌ UPLOAD MEDIA FAILED:", err);
    toast.error("Upload media failed");
  }
};


  const handleDelete = (course: Course) => {
    setDeletingCourse(course);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deletingCourse) {
      deleteCourseMutation(deletingCourse.courseId);
    }
    setShowDeleteDialog(false);
    setDeletingCourse(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteChapter = (chapter: any) => {
    setDeletingChapter(chapter);
    setShowDeleteChapterDialog(true);
  };

  const confirmDeleteChapter = () => {
    if (deletingChapter) {
      deleteChapterMutation(deletingChapter.chapterId);
    }
    setShowDeleteChapterDialog(false);
    setDeletingChapter(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteExercise = (exercise: any) => {
    setDeletingExercise(exercise);
    setShowDeleteExerciseDialog(true);
  };

  const confirmDeleteExercise = () => {
    if (deletingExercise) {
      deleteExerciseMutation(deletingExercise.exerciseId);
    }
    setShowDeleteExerciseDialog(false);
    setDeletingExercise(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteQuestion = (question: any) => {
    setDeletingQuestion(question);
    setShowDeleteQuestionDialog(true);
  };

  const confirmDeleteQuestion = () => {
    if (deletingQuestion) {
      deleteQuestionMutation(deletingQuestion.questionId);
    }
    setShowDeleteQuestionDialog(false);
    setDeletingQuestion(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteMedia = (media: any) => {
    setDeletingMedia(media);
    setShowDeleteMediaDialog(true);
  };

  const confirmDeleteMedia = () => {
    if (deletingMedia) {
      deleteMediaMutation(deletingMedia.questionMediaId);
    }
    setShowDeleteMediaDialog(false);
    setDeletingMedia(null);
  };

 

  return (
    <div className="space-y-6">
   

    <div className="flex gap-6">

  {/* LEFT PANEL - COURSE + CHAPTER */}
  <div className="w-1/3 bg-white border p-4 rounded-lg">

<div className="flex justify-between items-center mb-3">
  <h2 className="text-lg font-semibold">Khoá học</h2>
  <Button size="sm" onClick={handleCreateCourse}>
    + Thêm khoá học
  </Button>
</div>
  {sortedCourses.map((course) => (
  <div
    key={course.courseId}
   onClick={() => {
  setSelectedCourse(course);
}}

    className={`p-3 mb-2 rounded-lg cursor-pointer border flex justify-between items-center ${
      selectedCourse?.courseId === course.courseId
        ? "bg-blue-50 border-blue-500"
        : "hover:bg-gray-50"
    }`}
  >
<div className="flex items-center">
  <p className="font-medium">{course.title}</p>
  <CourseStatusBadge status={course.status} />
</div>

<div className="flex gap-2">
  <Button
    size="icon"
    variant="ghost"
    onClick={(e) => {
      e.stopPropagation();
      setViewingCourseDetails(course);
    }}
  >
    👁
  </Button>

  <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleEditCourse(course);
        }}
      >
        ✏️
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(course);
        }}
      >
        🗑
      </Button>
</div>

  </div>
))}

    {selectedCourse && (
      <>
        <h3 className="mt-5 mb-2 font-semibold">Chương</h3>

   {chaptersData?.data?.map((chapter) => (
  <div
    key={chapter.chapterId}
    onClick={() => setSelectedChapter(chapter)}
    className={`p-3 mb-2 rounded-lg cursor-pointer border flex justify-between items-center ${
  selectedChapter?.chapterId === chapter.chapterId
    ? "bg-green-50 border-green-600"
    : selectedCourse?.status === "Inactive"
    ? "opacity-60 hover:bg-gray-50"
    : "hover:bg-gray-50"
}`}

  >
    <p className="font-medium">{chapter.title}</p>

    <div className="flex gap-2">

    <Button
  size="icon"
  variant="ghost"
  onClick={(e) => {
    e.stopPropagation();
    setViewingChapterDetails(chapter);
  }}
>
  👁
</Button>



      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleEditChapter(chapter);
        }}
      >
        ✏️
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteChapter(chapter);
        }}
      >
        🗑
      </Button>
    </div>
  </div>
))}




        <Button
          size="sm"
          className="mt-3 w-full"
          onClick={handleCreateChapter}
        >
          + Thêm chương
        </Button>
      </>
    )}
  </div>

  {/* RIGHT PANEL - TẠM THỜI ĐỂ TRỐNG */}
  <div className="flex-1 bg-white border p-6 rounded-lg">
    {!selectedCourse && (
      <p className="text-gray-500">Chọn khóa học để xem chương</p>
    )}

    {selectedCourse && !selectedChapter && (
      <p className="text-gray-500">Chọn chương để xem bài tập</p>
    )}

  {selectedChapter && (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Bài tập</h2>
      <Button size="sm" onClick={handleCreateExercise}>
        + Thêm bài tập
      </Button>
    </div>

    {isExercisesLoading && <p>Loading exercises...</p>}

    {exercisesData?.data?.map((exercise) => (
      <div
        key={exercise.exerciseId}
onClick={() => {
  setSelectedExercise(exercise);
  setSelectedQuestion(null);     // ✅ reset question
}}
        className={`p-3 mb-2 rounded-lg border cursor-pointer ${
          selectedExercise?.exerciseId === exercise.exerciseId
            ? "bg-yellow-50 border-yellow-500"
            : "hover:bg-gray-50"
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="font-medium">{exercise.title}</p>

          <div className="flex gap-2">



<Button
  size="icon"
  variant="ghost"
  onClick={(e) => {
    e.stopPropagation();
    setViewingExerciseDetails(exercise);
  }}
>
  👁
</Button>




            <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleEditExercise(exercise);
        }}
      >
        ✏️
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteExercise(exercise);
        }}
      >
        🗑
      </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
{selectedExercise && (
  <div className="mt-8 border-t pt-4">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-semibold">Câu hỏi</h2>
      <Button size="sm" onClick={handleCreateQuestion}>
        + Thêm câu hỏi
      </Button>
    </div>

    {isQuestionsLoading && <p>Đang tải câu hỏi...</p>}

  {questionsData?.data?.map((question) => (
  <div
    key={question.questionId}
   onClick={() => setSelectedQuestion(question)}

className={`p-3 mb-2 border rounded-lg cursor-pointer 
${
  selectedQuestion?.questionId === question.questionId
    ? "bg-purple-100 border-purple-500"
    : "hover:bg-purple-50"
}`}
  >
    <div className="flex justify-between">
      <div>
        <p className="font-medium">{question.text}</p>
      <p className="text-sm text-gray-500">
  Loại: {QUESTION_TYPE_LABEL_VI(question.type)}
</p>

      </div>

      <div className="flex gap-2">


<Button
  size="icon"
  variant="ghost"
  onClick={(e) => {
    e.stopPropagation();
    setViewingQuestionDetails(question);
  }}
>
  👁
</Button>


        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleEditQuestion(question);
          }}
        >
          ✏️
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteQuestion(question);
          }}
        >
          🗑
        </Button>
      </div>
    </div>
  </div>
))}

  </div>
)}
{/* MEDIA OF QUESTION */}
{selectedQuestion && (
  <div className="mt-6 border-t pt-4">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-semibold">
        Media của câu hỏi:
        <span className="text-purple-600 ml-2">
          {selectedQuestion.text}
        </span>
      </h2>

      <Button size="sm" onClick={handleCreateMedia}>
        + Thêm phương tiện
      </Button>
    </div>

    {/* LOADING */}
    {!mediaData && (
      <p className="text-gray-500 text-sm">Đang tải phương tiện...</p>
    )}

    {/* EMPTY STATE */}
    {mediaData?.data?.length === 0 && (
      <div className="p-4 border rounded-lg bg-gray-50 text-gray-500 text-sm">
        Chưa có media cho câu hỏi này.  
        Nhấn <b>+ Add Media</b> để tạo.
      </div>
    )}

    {/* MEDIA LIST */}
    {mediaData?.data?.map((media) => (
      <div
        key={media.questionMediaId}
        className="p-3 mb-2 border rounded-lg flex justify-between items-center"
      >
        <div>
          <p className="font-medium">Accent: {media.accent}</p>
          <p className="text-sm text-gray-500 break-all">
            {media.audioUrl || media.videoUrl || media.imageUrl || "No source"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setViewingMediaDetails(media)}
          >
            👁
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleEditMedia(media)}
          >
            ✏️
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteMedia(media)}
          >
            🗑
          </Button>
        </div>
      </div>
    ))}
  </div>
)}


  </div>

</div>


      {/* Course Create/Edit Modal */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Chỉnh sửa Course" : "Tạo Course mới"}
            </DialogTitle>
          </DialogHeader>

          <Form {...courseFormMethods}>
            <form
              onSubmit={courseFormMethods.handleSubmit(onSubmitCourse)}
              className="grid gap-6 py-4"
            >
              <FormField
                name="title"
                control={courseFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề khoá học</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Basic Speaking Practice"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={courseFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Learn basic English speaking skills"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  name="level"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cấp độ</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {levelOptions.map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {lvl}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="numberOfChapter"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng chương</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
               
                <FormField
                  name="price"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  name="duration"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời hạn</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Only show Status field when editing, not when creating */}
                {editingCourse && (
                  <FormField name="status" control={courseFormMethods.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              </div>

              <DialogFooter>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setShowCourseModal(false)}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  className=" text-white cursor-pointer"
                >
                  {editingCourse ? "Cập nhật" : "Tạo"} Course
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Chapter Create/Edit Modal */}
      <Dialog open={showChapterModal} onOpenChange={setShowChapterModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingChapter ? "Chỉnh sửa chương" : "Tạo chương mới"}
            </DialogTitle>
          </DialogHeader>

          <Form {...chapterFormMethods}>
            <form
              onSubmit={chapterFormMethods.handleSubmit(onSubmitChapter)}
              className="grid gap-6 py-4"
            >
              <FormField
                name="title"
                control={chapterFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề chương</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Introduction to English"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={chapterFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chương</FormLabel>
                    <FormControl>
                      <Input placeholder="Chapter description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             

              <FormField
                name="numberOfExercise"
                control={chapterFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng bài tập</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setShowChapterModal(false)}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  className=" text-white cursor-pointer"
                  
                >
                  {editingChapter ? "Cập nhật chương" : "Tạo chương mới"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Exercise Create/Edit Modal */}
      <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
        <DialogContent className="max-w-2xl ">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}
            </DialogTitle>
          </DialogHeader>

          <Form {...exerciseFormMethods}>
            <form
              onSubmit={exerciseFormMethods.handleSubmit(onSubmitExercise)}
              className="grid gap-6 py-4"
            >
              <FormField
                name="title"
                control={exerciseFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề bài tập</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Practice Dialogue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={exerciseFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả bài tập</FormLabel>
                    <FormControl>
                      <Input placeholder="Exercise description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            

              <FormField
                name="numberOfQuestion"
                control={exerciseFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng câu hỏi</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setShowExerciseModal(false)}
                >
                  Huỷ
                </Button>
              <Button type="submit" className="cursor-pointer">
  {editingExercise ? "Cập nhật bài tập" : "Tạo bài tập mới"}
</Button>

              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Question Create Modal */}
      <Dialog open={showQuestionModal} onOpenChange={setShowQuestionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo câu hỏi cho bài tập</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Questions List */}
            {questionsList.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Questions to be created ({questionsList.length}):
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                  {questionsList.map((q, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm">
                          #{index + 1}: {q.text}
                        </p>
                      <p className="text-xs text-gray-600">
  Type: {questionTypeOptions.find(opt => opt.value === q.type)?.label || q.type}
  {" "} 
</p>

                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Question Form */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-4">Thêm câu hỏi:</h3>
              <Form {...questionFormMethods}>
                <form
                  onSubmit={questionFormMethods.handleSubmit(
                    handleAddQuestionToList
                  )}
                  className="grid gap-4"
                >
                  <FormField
                    name="text"
                    control={questionFormMethods.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề câu hỏi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập câu hỏi..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                 

                  
                  </div>

                 

                  <Button
                    type="submit"
                    className="w-full cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300"
                  >
                    + Add Question to List
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowQuestionModal(false);
                setQuestionsList([]);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
              onClick={onSubmitQuestion}
              disabled={questionsList.length === 0}
            >
              Create All Questions ({questionsList.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Single Question Modal */}
      <Dialog open={showEditQuestionModal} onOpenChange={setShowEditQuestionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
          </DialogHeader>

          <Form {...editQuestionFormMethods}>
            <form
              onSubmit={editQuestionFormMethods.handleSubmit(onSubmitEditQuestion)}
              className="space-y-4"
            >
              <FormField
                name="text"
                control={editQuestionFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề câu hỏi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập câu hỏi..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
      


             
              </div>

             

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setShowEditQuestionModal(false);
                    setEditingQuestion(null);
                  }}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                 className="cursor-pointer "
                >
                  Cập nhật câu hỏi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Media Modal */}
      <Dialog open={showMediaModal} onOpenChange={setShowMediaModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMedia ? "Edit Media" : "Tạo phương tiện mới"}
            </DialogTitle>
          </DialogHeader>

          <Form {...mediaFormMethods}>
            <form
              onSubmit={mediaFormMethods.handleSubmit(onSubmitMedia)}
              className="space-y-4"
            >
              <FormField
                name="accent"
                control={mediaFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giọng điệu</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. US, UK, AU..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="audioUrl"
                control={mediaFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âm thanh URL (Lựa chọn khác)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/audio.mp3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="videoUrl"
                control={mediaFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Lựa chọn khác)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/video.mp4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="imageUrl"
                control={mediaFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh URL (Lựa chọn khác)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IMAGE UPLOAD */}
<FormField
  name="imageFile"
  control={mediaFormMethods.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Tải hình ảnh (Lựa chọn khác)</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => field.onChange(e.target.files?.[0] || null)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* VIDEO UPLOAD */}
<FormField
  name="videoFile"
  control={mediaFormMethods.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Tải Video (Lựa chọn khác)</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => field.onChange(e.target.files?.[0] || null)}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


              <FormField
                name="source"
                control={mediaFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nguồn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. YouTube, Internal, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMediaModal(false);
                    setEditingMedia(null);
                    mediaFormMethods.reset();
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer text-white"
                >
                  {editingMedia ? "Cập nhật phương tiện" : "Tạo phương tiện mới"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Media Details Modal */}
      <Dialog open={!!viewingMediaDetails} onOpenChange={() => setViewingMediaDetails(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileImage className="h-5 w-5 mr-2 text-purple-600" />
              Phương tiện chi tiết
            </DialogTitle>
          </DialogHeader>

          {viewingMediaDetails && (
            <div className="space-y-4">
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Media ID</label>
                  <div className="p-3 bg-slate-50 rounded-md border">
                    <code className="text-xs font-mono break-all">{viewingMediaDetails.questionMediaId}</code>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Question ID</label>
                  <div className="p-3 bg-slate-50 rounded-md border">
                    <code className="text-xs font-mono break-all">{viewingMediaDetails.questionId}</code>
                  </div>
                </div>
              </div> */}


              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Âm thanh URL</label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  {viewingMediaDetails.audioUrl ? (
                    <a 
                      href={viewingMediaDetails.audioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {viewingMediaDetails.audioUrl}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">N/A</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Video URL</label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  {viewingMediaDetails.videoUrl ? (
                    <a 
                      href={viewingMediaDetails.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {viewingMediaDetails.videoUrl}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">N/A</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Hình ảnh URL</label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  {viewingMediaDetails.imageUrl ? (
                    <a 
                      href={viewingMediaDetails.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {viewingMediaDetails.imageUrl}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">N/A</span>
                  )}
                </div>
              </div>

               <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Nguồn</label>
                <div className="p-3 bg-slate-50 rounded-md border">
                  {viewingMediaDetails.source ? (
                    <a 
                      href={viewingMediaDetails.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {viewingMediaDetails.source}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">N/A</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingMediaDetails(null)}
              className="cursor-pointer"
            >
              Đóng
            </Button>
            <Button
              onClick={() => {
if (viewingMediaDetails) handleEditMedia(viewingMediaDetails);
                setViewingMediaDetails(null);
              }}
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Chỉnh sửa phương tiện
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Course Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-lg">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Xóa khóa học này?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              Hành động này không thể hoàn tác. Hành động này sẽ xóa vĩnh viễn khóa học.
            </AlertDialogDescription>

            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    {deletingCourse?.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    Level: {deletingCourse?.level} • {deletingCourse?.numberOfChapter} chapters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <AlertDialogCancel className="flex-1 h-11 cursor-pointer border-slate-300 hover:bg-slate-50">
                Huỷ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="flex-1 h-11 bg-red-600 cursor-pointer hover:bg-red-700 rounded-2xl font-bold text-white shadow-sm"
              >
                  Delete Course
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Chapter Confirmation */}
      <AlertDialog open={showDeleteChapterDialog} onOpenChange={setShowDeleteChapterDialog}>
        <AlertDialogContent className="max-w-lg">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 mb-2">
                Delete this chapter?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
                  Hành động này không thể hoàn tác. Hành động này sẽ xóa vĩnh viễn chương.
            </AlertDialogDescription>

            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FolderOpen className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    {deletingChapter?.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {deletingChapter?.numberOfExercise || 0} exercises
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <AlertDialogCancel className="flex-1 h-11 cursor-pointer border-slate-300 hover:bg-slate-50">
                Huỷ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteChapter}
                className="flex-1 h-11 cursor-pointer bg-red-600 hover:bg-red-700 rounded-2xl font-bold text-white shadow-sm"
              >
                Xoá chương
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Exercise Confirmation */}
      <AlertDialog open={showDeleteExerciseDialog} onOpenChange={setShowDeleteExerciseDialog}>
        <AlertDialogContent className="max-w-lg">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Xoá bài tập này?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              Hành động này không thể hoàn tác. Hành động này sẽ xóa vĩnh viễn bài tập.
            </AlertDialogDescription>

            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    {deletingExercise?.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    Order: {deletingExercise?.orderIndex}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <AlertDialogCancel className="flex-1 h-11 border-slate-300 hover:bg-slate-50">
                Huỷ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteExercise}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Xoá bài tập
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Question Confirmation */}
      <AlertDialog open={showDeleteQuestionDialog} onOpenChange={setShowDeleteQuestionDialog}>
        <AlertDialogContent className="max-w-lg">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Xoá câu hỏi này?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              Hành động này không thể hoàn tác. Hành động này sẽ xóa vĩnh viễn câu hỏi.
            </AlertDialogDescription>

            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    {deletingQuestion?.text}
                  </p>
                  <p className="text-sm text-slate-600">
                    Type: {deletingQuestion?.type} • Order: {deletingQuestion?.orderIndex}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <AlertDialogCancel className="flex-1 h-11 cursor-pointer border-slate-300 hover:bg-slate-50">
                Huỷ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteQuestion}
                className="flex-1 h-11 bg-red-600 rounded-md cursor-pointer hover:bg-red-700 text-white shadow-sm"
              >
                Xoá câu hỏi
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Media Confirmation */}
      <AlertDialog open={showDeleteMediaDialog} onOpenChange={setShowDeleteMediaDialog}>
        <AlertDialogContent className="max-w-lg">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Xoá media này?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              Hành động này không thể hoàn tác. Hành động này sẽ xóa vĩnh viễn file media.
            </AlertDialogDescription>

            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FileImage className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    Giọng điệu: {deletingMedia?.accent}
                  </p>
                 
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <AlertDialogCancel className="flex-1 h-11 border-slate-300 hover:bg-slate-50">
                Huỷ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteMedia}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Xoá phương tiện
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
<Dialog
  open={!!viewingCourseDetails}
  onOpenChange={() => setViewingCourseDetails(null)}
>
  <DialogContent className="max-w-3xl bg-white text-black">
    <DialogHeader>
      <DialogTitle>Khoá học chi tiểt</DialogTitle>
    </DialogHeader>

    {viewingCourseDetails && (
      <div className="space-y-3">
        <p><b>Tiêu đề:</b> {viewingCourseDetails.title}</p>
        <p><b>Mô tả:</b> {viewingCourseDetails.description}</p>
        <p><b>Cấp độ:</b> {viewingCourseDetails.level}</p>
        <p><b>Giá:</b> {viewingCourseDetails.price}</p>
        <p><b>Thời hạn:</b> {viewingCourseDetails.duration}</p>
        <p><b>Số lượng chương:</b> {viewingCourseDetails.numberOfChapter}</p>
        <p><b>Trạng thái:</b> {viewingCourseDetails.status}</p>
      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setViewingCourseDetails(null)}>
        Đóng
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>



<Dialog
  open={!!viewingChapterDetails}
  onOpenChange={() => setViewingChapterDetails(null)}
>
  <DialogContent className="max-w-3xl bg-white text-black">
    <DialogHeader>
      <DialogTitle>Chương chi tiết</DialogTitle>
    </DialogHeader>

    {viewingChapterDetails && (
      <div className="space-y-3">
        <p><b>Tiêu đề:</b> {viewingChapterDetails.title}</p>
        <p><b>Mô tả:</b> {viewingChapterDetails.description}</p>
        <p><b>Số lượng bài tập:</b> {viewingChapterDetails.numberOfExercise}</p>
        <p><b>Ngày tạo:</b> {viewingChapterDetails.createdAt}</p>

      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setViewingChapterDetails(null)}>
        Đóng
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog
  open={!!viewingExerciseDetails}
  onOpenChange={() => setViewingExerciseDetails(null)}
>
  <DialogContent className="max-w-3xl bg-white text-black">
    <DialogHeader>
      <DialogTitle>Bài tập chi tiết</DialogTitle>
    </DialogHeader>

    {viewingExerciseDetails && (
      <div className="space-y-3">
        <p><b>Tiêu đề:</b> {viewingExerciseDetails.title}</p>
        <p><b>Mô tả:</b> {viewingExerciseDetails.description}</p>
        <p><b>Thứ tự:</b> {viewingExerciseDetails.orderIndex}</p>
        <p><b>Số lượng câu hỏi:</b> {viewingExerciseDetails.numberOfQuestion}</p>
      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setViewingExerciseDetails(null)}>
        Đóng
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


<Dialog
  open={!!viewingQuestionDetails}
  onOpenChange={() => setViewingQuestionDetails(null)}
>
  <DialogContent className="max-w-3xl bg-white text-black">
    <DialogHeader>
      <DialogTitle>Câu hỏi chi tiết</DialogTitle>
    </DialogHeader>

    {viewingQuestionDetails && (
      <div className="space-y-3">
        <p><b>Văn bản:</b> {viewingQuestionDetails.text}</p>
<p>
  <b>Loại:</b>{" "}
  {QUESTION_TYPE_LABEL_VI(viewingQuestionDetails.type)}
</p>
      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setViewingQuestionDetails(null)}>
        Đóng
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Chapter View - When viewMode === 'chapter' */}
     
    </div>
  );
};

export default LevelA1;