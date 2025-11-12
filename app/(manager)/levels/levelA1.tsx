"use client";

import { useGetCoursesOfLevelMutation } from "@/features/manager/hook/coursesHooks/courseHooks";
import React, { useState } from "react";
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
import {Plus,Pencil,Trash2,BookOpen,Layers,ChevronRight,FolderOpen,FileText,HelpCircle,FileImage,ArrowLeft} from "lucide-react";
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

interface Course {
  courseId: string;
  title: string;
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
  orderIndex: number;
  numberOfExercise?: number;
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
  phonemeJson?: string;
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

  // State for multiple questions
  const [questionsList, setQuestionsList] = useState<Array<{text: string;type: number;orderIndex: number;
      phonemeJson: string;
    }>
  >([]);

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
  const [viewMode, setViewMode] = useState<"course" | "chapter" | "exercise" | "question">("course");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    null
  );
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null
  );
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [viewingMediaDetails, setViewingMediaDetails] = useState<Media | null>(null);
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
    expandedExerciseId || "",
    !!expandedExerciseId
  );
  const {
    data: mediaData,
    isLoading: isMediaLoading,
    isError: isMediaError,
    error: mediaError,
    refetch: refetchMedia,
  } = useGetMediaFollowingQuestionId(
    expandedQuestionId || "",
    !!expandedQuestionId
  );
  const {
    data: exercisesData,
    isLoading: isExercisesLoading,
    isError: isExercisesError,
    error: exercisesError,
    refetch: refetchExercises,
  } = useGetExcerciseFollowingChapterId(
    expandedChapterId || "",
    !!expandedChapterId
  );


  const {
    data: chaptersData,
    isLoading: isChaptersLoading,
    isError: isChaptersError,
    error: chaptersError,
    refetch: refetchChapters,
  } = useGetChapterFollowingCourseId(
    selectedCourse?.courseId || "",
    viewMode === "chapter" && !!selectedCourse?.courseId
  );



  const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const questionTypeOptions = [
    { label: "word", value: 0 },
    { label: "sentence", value: 2 },
    { label: "phrase", value: 1 },
  ];

  // Course Schema and Form
  const courseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"], "Level is required"),
    numberOfChapter: z.coerce.number().int().min(0, "Must be >= 0"),
    price: z.coerce.number().min(0, "Price must be >= 0"),
    orderIndex: z.coerce.number().int().min(0, "Order index must be >= 0"),
    duration: z.coerce.number().int().min(0, "Duration must be >= 0"),
    status: z.enum(["Active", "Inactive"], "Status is required"),
  });

  type CourseFormValues = z.infer<typeof courseSchema>;

  const courseFormMethods = useForm<CourseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      title: "",
      level: "A1",
      numberOfChapter: 0,
      price: 0,
      orderIndex: 0,
      duration: 0,
      status: "Active",
    },
  });

  // Chapter Schema and Form
  const chapterSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    numberOfExercise: z.coerce.number().int().min(0, "Must be >= 0").default(0),
    courseId: z.string().optional(), // Optional courseId for moving chapter
  });

  type ChapterFormValues = z.infer<typeof chapterSchema>;

  const chapterFormMethods = useForm<ChapterFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(chapterSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      numberOfExercise: 0,
      courseId: undefined,
    },
  });

  // Exercise Schema and Form
  const exerciseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    orderIndex: z.coerce.number().int().min(0, "Order index must be >= 0"),
    numberOfQuestion: z.coerce.number().int().min(0, "Must be >= 0").default(0),
  });

  type ExerciseFormValues = z.infer<typeof exerciseSchema>;

  const exerciseFormMethods = useForm<ExerciseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(exerciseSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      orderIndex: 0,
      numberOfQuestion: 0,
    },
  });

  // Question Schema and Form
  const questionSchema = z.object({
    text: z.string().min(1, "Question text is required"),
    type: z.coerce.number().int().min(0, "Type must be >= 0").default(0),
    orderIndex: z.coerce.number().int().min(0, "Order index must be >= 0"),
    phonemeJson: z.string().min(1, "Phoneme JSON is required"),
  });

  type QuestionFormValues = z.infer<typeof questionSchema>;

  const questionFormMethods = useForm<QuestionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questionSchema) as any,
    defaultValues: {
      text: "",
      type: 0,
      orderIndex: 0,
      phonemeJson: "",
    },
  });

  // Edit Single Question Form (separate from multi-create)
  const editQuestionFormMethods = useForm<QuestionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(questionSchema) as any,
    defaultValues: {
      text: "",
      type: 0,
      orderIndex: 0,
      phonemeJson: "",
    },
  });

  const mediaSchema = z.object({
    accent: z.string().min(1, "Accent is required"),
    audioUrl: z.string().url("Must be valid URL").or(z.literal("")),
    videoUrl: z.string().url("Must be valid URL").or(z.literal("")),
    imageUrl: z.string().url("Must be valid URL").or(z.literal("")),
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
      level: "A1",
      numberOfChapter: 0,
      price: 0,
      orderIndex: 0,
      status: "Active",
      duration: 0,
    });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseFormMethods.reset({
      title: course.title,
      level: course.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
      numberOfChapter: course.numberOfChapter,
      price: course.price,
      orderIndex: course.orderIndex ?? 0,
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

  const handleEditChapter = (chapter: Record<string, unknown>) => {
    setEditingChapter(chapter as unknown as Chapter);
    chapterFormMethods.reset({
      title: chapter.title as string,
      description: chapter.description as string,
      numberOfExercise: (chapter.numberOfExercise as number) || 0,
      courseId: selectedCourse?.courseId || "", // Set current course as default
    });
    setShowChapterModal(true);
  };

  const onSubmitChapter = (values: ChapterFormValues) => {
    // For create: must have selectedCourse
    // For update: can use values.courseId (if moving) or selectedCourse
    const targetCourseId = editingChapter
      ? values.courseId || selectedCourse?.courseId
      : selectedCourse?.courseId;

    if (!targetCourseId) {
      console.error("No course selected");
      toast.error("Please select a course first");
      return;
    }

    if (editingChapter) {
      updateChapterMutation({
        id: editingChapter.chapterId,
        payload: {
          courseId: targetCourseId,
          title: values.title,
          description: values.description,
          numberOfExercise: values.numberOfExercise,
        },
      });
    } else {
      createChapterMutation({
        courseId: targetCourseId,
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
      orderIndex: 0,
      numberOfQuestion: 0,
    });
    setShowExerciseModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    exerciseFormMethods.reset({
      title: exercise.title,
      description: exercise.description,
      orderIndex: exercise.orderIndex,
      numberOfQuestion: 0, // hoặc lấy từ exercise nếu có field này
    });
    setShowExerciseModal(true);
  };

  const onSubmitExercise = (values: ExerciseFormValues) => {
    if (!expandedChapterId && !editingExercise) {
      console.error("No chapter selected");
      toast.error("Please select a chapter first");
      return;
    }

    if (editingExercise) {
      updateExerciseMutation({
        id: editingExercise.exerciseId,
        payload: {
          chapterId: expandedChapterId || "", // Use current expanded chapter
          title: values.title,
          description: values.description,
          orderIndex: values.orderIndex,
          numberOfQuestion: values.numberOfQuestion,
        },
      });
    } else {
      createExerciseMutation({
        chapterId: expandedChapterId!,
        title: values.title,
        description: values.description,
        orderIndex: values.orderIndex,
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
      orderIndex: 0,
      phonemeJson: "",
    });
    setQuestionsList([]); // Reset questions list
    setShowQuestionModal(true);
  };

  const handleAddQuestionToList = (values: QuestionFormValues) => {
    setQuestionsList([
      ...questionsList,
      {
        text: values.text,
        type: values.type,
        orderIndex: values.orderIndex,
        phonemeJson: values.phonemeJson,
      },
    ]);

    // Reset form for next question
    questionFormMethods.reset({
      text: "",
      type: 0,
      orderIndex: questionsList.length + 1, // Auto increment order
      phonemeJson: "",
    });

    toast.success("Question added to list");
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
    toast.success("Question removed");
  };

  const onSubmitQuestion = () => {
    if (!expandedExerciseId) {
      console.error("No exercise selected");
      toast.error("Please select an exercise first");
      return;
    }

    if (questionsList.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    createQuestionMutation({
      exerciseId: expandedExerciseId,
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

  const onSubmitEditQuestion = (values: QuestionFormValues) => {
    if (!editingQuestion) return;

    updateQuestionMutation({
      id: editingQuestion.questionId,
      payload: {
        text: values.text,
        type: values.type,
        orderIndex: values.orderIndex,
        phonemeJson: values.phonemeJson,
      },
    });

    setShowEditQuestionModal(false);
    setEditingQuestion(null);
  };

  // Media Handlers
  const handleToggleMedia = (questionId: string) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
    } else {
      setExpandedQuestionId(questionId);
      setTimeout(() => refetchMedia(), 0);
    }
  };

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
  const handleEditMedia = (media: any) => {
    setEditingMedia(media);
    mediaFormMethods.reset({
      accent: media.accent,
      audioUrl: media.audioUrl,
      videoUrl: media.videoUrl,
      imageUrl: media.imageUrl,
      source: media.source,
    });
    setShowMediaModal(true);
  };

  const onSubmitMedia = (values: MediaFormValues) => {
    if (!expandedQuestionId) {
      toast.error("Please select a question first");
      return;
    }

    if (editingMedia) {
      updateMediaMutation({
        id: editingMedia.questionMediaId,
        payload: {
          accent: values.accent,
          audioUrl: values.audioUrl,
          videoUrl: values.videoUrl,
          imageUrl: values.imageUrl,
          source: values.source,
        },
      });
    } else {
      createMediaMutation({
        questionId: expandedQuestionId,
        accent: values.accent,
        audioUrl: values.audioUrl,
        videoUrl: values.videoUrl,
        imageUrl: values.imageUrl,
        source: values.source,
      });
    }
    setShowMediaModal(false);
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

  const handleViewChapters = (course: Course) => {
    setSelectedCourse(course);
    setViewMode("chapter");
    setExpandedChapterId(null); // Reset expanded chapter when switching courses
    // Trigger refetch when switching to chapter view
    setTimeout(() => refetchChapters(), 0);
  };

  const handleToggleExercises = (chapterId: string) => {
    if (expandedChapterId === chapterId) {
      setExpandedChapterId(null); // Collapse if already expanded
      setExpandedExerciseId(null); // Also collapse any expanded exercises
    } else {
      setExpandedChapterId(chapterId); // Expand this chapter
      setExpandedExerciseId(null); // Reset expanded exercise
      setTimeout(() => refetchExercises(), 0);
    }
  };

  const handleToggleQuestions = (exerciseId: string) => {
    if (expandedExerciseId === exerciseId) {
      setExpandedExerciseId(null); // Collapse if already expanded
    } else {
      setExpandedExerciseId(exerciseId); // Expand this exercise
      setTimeout(() => refetchQuestions(), 0);
    }
  };



  const handleViewQuestions = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setViewMode("question");
    // TODO: Fetch questions for this exercise
  };

  const handleBackToCourses = () => {
    setViewMode("course");
    setSelectedCourse(null);
    setSelectedChapter(null);
    setSelectedExercise(null);
  };

 

  return (
    <div className="space-y-6">
   

      {/* Course Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Course Management</h2>
                <p className="text-sm text-slate-500 font-normal">Manage all courses for level {level}</p>
              </div>
            </div>
            <Button
              onClick={handleCreateCourse}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Error loading courses
              </div>
              <p className="text-slate-600">Please try again later</p>
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 text-lg font-semibold mb-2">
                No courses found
              </div>
              <p className="text-slate-600 mb-4">
                Get started by creating your first course
              </p>
              <Button onClick={handleCreateCourse} variant="outline" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Create First Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-24 font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="text-center font-semibold w-32">Chapters</TableHead>
                    <TableHead className="text-center font-semibold w-24">Order</TableHead>
                    <TableHead className="text-center font-semibold w-28">Price</TableHead>
                    <TableHead className="text-center font-semibold w-20">Level</TableHead>
                    <TableHead className="text-center font-semibold w-28">Duration</TableHead>
                    <TableHead className="text-center font-semibold w-28">Status</TableHead>
                    <TableHead className="text-center font-semibold w-52">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCourses.map((course: Course) => (
                    <TableRow key={course.courseId} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono text-xs text-slate-500">
                        <div className="truncate max-w-[80px]" title={course.courseId}>
                          {course.courseId.substring(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          {course.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-medium bg-blue-50 text-blue-700 border-blue-200">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {course.numberOfChapter}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-medium">
                          #{course.orderIndex}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-slate-700">
                          {course.price === 0 ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">Free</Badge>
                          ) : (
                            <span className="text-orange-600">{course.price} Xu</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 font-semibold">
                          {course.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-slate-600 font-medium">
                          {course.duration || 0}h
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          className={
                            course.status === "Active" 
                              ? "bg-green-100 text-green-700 border-green-200 font-medium" 
                              : "bg-gray-100 text-gray-600 border-gray-200 font-medium"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 cursor-pointer transition-all"
                            onClick={() => handleViewChapters(course)}
                            title="View Chapters"
                          >
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCourse(course)}
                            className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer transition-all"
                            title="Edit Course"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                            onClick={() => handleDelete(course)}
                            title="Delete Course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Create/Edit Modal */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Create New Course"}
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
                    <FormLabel>Course Title</FormLabel>
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

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  name="level"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
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
                      <FormLabel>Number of Chapters</FormLabel>
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
                  name="orderIndex"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Index</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="price"
                  control={courseFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="5" {...field} />
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
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="5" {...field} />
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
                        <FormLabel>Status</FormLabel>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className=" text-white cursor-pointer"
                >
                  {editingCourse ? "Update" : "Create"} Course
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
              {editingChapter ? "Edit Chapter" : "Create New Chapter"}
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
                    <FormLabel>Chapter Title</FormLabel>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Chapter description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Course Select - Only show when editing */}
              {editingChapter && (
                <FormField
                  name="courseId"
                  control={chapterFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Move to Course (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course to move this chapter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sortedCourses.map((course) => (
                            <SelectItem
                              key={course.courseId}
                              value={course.courseId}
                            >
                              {course.title}
                              {course.courseId === selectedCourse?.courseId &&
                                " (Current)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                name="numberOfExercise"
                control={chapterFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Exercises</FormLabel>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className=" text-white cursor-pointer"
                  
                >
                  {editingChapter ? "Update Chapter" : "Create Chapter"}
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
              {editingExercise ? "Edit Exercise" : "Create New Exercise"}
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
                    <FormLabel>Exercise Title</FormLabel>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Exercise description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="orderIndex"
                control={exerciseFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Index</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
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
                    <FormLabel>Number of Questions</FormLabel>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                >
                  Create Exercise
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
            <DialogTitle>Create Questions for Exercise</DialogTitle>
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
                          Type: {questionTypeOptions.find(opt => opt.value === q.type)?.label || q.type} | Order: {q.orderIndex} | Phoneme:{" "}
                          {q.phonemeJson || "N/A"}
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
              <h3 className="text-sm font-semibold mb-4">Add Question:</h3>
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
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the question..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="type"
                      control={questionFormMethods.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {questionTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="orderIndex"
                      control={questionFormMethods.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Index</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="phonemeJson"
                    control={questionFormMethods.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phoneme JSON (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phoneme JSON..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
            <DialogTitle>Edit Question</DialogTitle>
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
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the question..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="type"
                  control={editQuestionFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {questionTypeOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value.toString()}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="orderIndex"
                  control={editQuestionFormMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Index</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="phonemeJson"
                control={editQuestionFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phoneme JSON (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phoneme JSON..."
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
                  className="cursor-pointer"
                  onClick={() => {
                    setShowEditQuestionModal(false);
                    setEditingQuestion(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                 className="cursor-pointer "
                >
                  Update Question
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
              {editingMedia ? "Edit Media" : "Create Media"}
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
                    <FormLabel>Accent</FormLabel>
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
                    <FormLabel>Audio URL (Optional)</FormLabel>
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
                    <FormLabel>Video URL (Optional)</FormLabel>
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
                    <FormLabel>Image URL (Optional)</FormLabel>
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

              <FormField
                name="source"
                control={mediaFormMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
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
                  {editingMedia ? "Update Media" : "Create Media"}
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
              Media Details
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
                <label className="text-sm font-semibold text-slate-700">Audio URL</label>
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
                <label className="text-sm font-semibold text-slate-700">Image URL</label>
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
                <label className="text-sm font-semibold text-slate-700">Source</label>
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
              Close
            </Button>
            <Button
              onClick={() => {
                handleEditMedia(viewingMediaDetails);
                setViewingMediaDetails(null);
              }}
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Media
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
              Delete this course?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              This action cannot be undone. This will permanently delete the course.
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
                Cancel
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
              This action cannot be undone. This will permanently delete the chapter.
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
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteChapter}
                className="flex-1 h-11 cursor-pointer bg-red-600 hover:bg-red-700 rounded-2xl font-bold text-white shadow-sm"
              >
                Delete Chapter
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
              Delete this exercise?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              This action cannot be undone. This will permanently delete the exercise.
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
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteExercise}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Delete Exercise
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
              Delete this question?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              This action cannot be undone. This will permanently delete the question.
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
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteQuestion}
                className="flex-1 h-11 bg-red-600 rounded-md cursor-pointer hover:bg-red-700 text-white shadow-sm"
              >
                Delete Question
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
              Delete this media?
            </AlertDialogTitle>
            
            <AlertDialogDescription className="text-slate-600 mb-6">
              This action cannot be undone. This will permanently delete the media file.
            </AlertDialogDescription>

            <div className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FileImage className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900 mb-1">
                    Accent: {deletingMedia?.accent}
                  </p>
                 
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <AlertDialogCancel className="flex-1 h-11 border-slate-300 hover:bg-slate-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteMedia}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Delete Media
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Chapter View - When viewMode === 'chapter' */}
      {viewMode === "chapter" && selectedCourse && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleBackToCourses}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Chapter Management</h2>
                  <p className="text-sm text-slate-500 font-normal">
                    Course: <span className="font-medium text-slate-700">{selectedCourse.title}</span>
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCreateChapter}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Chapter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isChaptersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : isChaptersError ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Error loading chapters
                </div>
                <p className="text-slate-600 mb-4">
                  {chaptersError?.message || "Please try again later"}
                </p>
                <Button onClick={() => refetchChapters()} variant="outline" className="cursor-pointer">
                  Retry
                </Button>
              </div>
            ) : chaptersData?.data && chaptersData.data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-24 font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="text-center font-semibold w-32">Exercises</TableHead>
                      <TableHead className="text-center font-semibold w-32">Created</TableHead>
                      <TableHead className="text-center font-semibold w-64">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chaptersData.data.map((chapter) => (
                      <React.Fragment key={chapter.chapterId}>
                        <TableRow className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-mono text-xs text-slate-500">
                            <div className="truncate max-w-[80px]" title={chapter.chapterId}>
                              {chapter.chapterId.substring(0, 8)}...
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-slate-900">
                              {chapter.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-600 max-w-md truncate" title={chapter.description || "No description"}>
                              {chapter.description || <span className="italic text-slate-400">No description</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-medium bg-blue-50 text-blue-700 border-blue-200">
                              <FileText className="h-3 w-3 mr-1" />
                              {chapter.numberOfExercise}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-sm text-slate-600 font-medium">
                            {new Date(chapter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                size="sm"
                                variant={
                                  expandedChapterId === chapter.chapterId
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  expandedChapterId === chapter.chapterId
                                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                    : "bg-white border border-gray-300 text-black hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 cursor-pointer shadow-sm transition-all"
                                }
                                onClick={() =>
                                  handleToggleExercises(chapter.chapterId)
                                }
                                title={expandedChapterId === chapter.chapterId ? "Hide Exercises" : "View Exercises"}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer transition-all"
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditChapter(chapter as unknown as Record<string, unknown>)}
                                title="Edit Chapter"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                                onClick={() => handleDeleteChapter(chapter)}
                                title="Delete Chapter"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                      {/* Expanded Exercises Row */}
                      {expandedChapterId === chapter.chapterId && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-slate-50 p-0">
                            <div className="p-6">
                              <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                  <FileText className="h-5 w-5 mr-2 " />
                                  Exercises
                                </h3>
                                <Button
                                  size="sm"
                                  className="bg-white border border-gray-300 text-black hover:bg-gray-100 cursor-pointer shadow-sm"
                                  onClick={handleCreateExercise}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Exercise
                                </Button>
                              </div>

                              {isExercisesLoading ? (
                                <div className="space-y-3">
                                  {[1, 2].map((i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                  ))}
                                </div>
                              ) : isExercisesError ? (
                                <div className="text-center py-8 bg-white rounded-md">
                                  <div className="text-red-500 font-semibold mb-2">
                                    Error loading exercises
                                  </div>
                                  <p className="text-slate-600 text-sm mb-3">
                                    {exercisesError?.message ||
                                      "Please try again"}
                                  </p>
                                  <Button
                                    onClick={() => refetchExercises()}
                                    size="sm"
                                    variant="outline"
                                    className="cursor-pointer"
                                  >
                                    Retry
                                  </Button>
                                </div>
                              ) : exercisesData?.data &&
                                exercisesData.data.length > 0 ? (
                                <div className="bg-white rounded-md border overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-50">
                                        <TableHead className="w-24 font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Title</TableHead>
                                        <TableHead className="font-semibold">Description</TableHead>
                                        <TableHead className="text-center font-semibold w-24">Order</TableHead>
                                        <TableHead className="text-center font-semibold w-32">Questions</TableHead>
                                        <TableHead className="text-center font-semibold w-64">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {[...exercisesData.data]
                                        .sort(
                                          (a, b) => a.orderIndex - b.orderIndex
                                        )
                                        .map((exercise, idx) => (
                                          <React.Fragment
                                            key={exercise.exerciseId}
                                          >
                                            <TableRow className="hover:bg-slate-50/50 transition-colors">
                                              <TableCell className="font-mono text-xs text-slate-500">
                                                <div className="truncate max-w-[80px]" title={exercise.exerciseId}>
                                                  {exercise.exerciseId.substring(0, 8)}...
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                <div className="font-semibold text-slate-900">
                                                  {exercise.title}
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                <div className="text-sm text-slate-600 max-w-xs truncate" title={exercise.description || "No description"}>
                                                  {exercise.description || <span className="italic text-slate-400">No description</span>}
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <Badge variant="secondary" className="font-medium">
                                                  #{exercise.orderIndex}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <Badge variant="outline" className="font-medium bg-purple-50 text-purple-700 border-purple-200">
                                                  <HelpCircle className="h-3 w-3 mr-1" />
                                                  {exercise.numberOfQuestion}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                  <Button
                                                    size="sm"
                                                    variant={
                                                      expandedExerciseId ===
                                                      exercise.exerciseId
                                                        ? "default"
                                                        : "outline"
                                                    }
                                                    className={
                                                      expandedExerciseId === exercise.exerciseId
                                                        ? "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                                                        : "bg-white border border-gray-300 text-black hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 cursor-pointer shadow-sm transition-all"
                                                    }
                                                    onClick={() =>
                                                      handleToggleQuestions(
                                                        exercise.exerciseId
                                                      )
                                                    }
                                                    title={expandedExerciseId === exercise.exerciseId ? "Hide Questions" : "View Questions"}
                                                  >
                                                    <HelpCircle className="h-4 w-4" />
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditExercise(exercise)}
                                                    className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer transition-all"
                                                    title="Edit Exercise"
                                                  >
                                                    <Pencil className="h-4 w-4" />
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteExercise(exercise)}
                                                    className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                                                    title="Delete Exercise"
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </TableCell>
                                            </TableRow>

                                            {/* Expanded Questions Row */}
                                            {expandedExerciseId ===
                                              exercise.exerciseId && (
                                              <TableRow>
                                                <TableCell
                                                  colSpan={6}
                                                  className="bg-purple-50 p-0"
                                                >
                                                  <div className="p-6">
                                                    <div className="mb-4 flex items-center justify-between">
                                                      <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                                                        <HelpCircle className="h-5 w-5 mr-2 text-purple-600" />
                                                        Questions
                                                      </h3>
                                                      <Button
                                                        size="sm"
                                                        className="bg-white border border-gray-300 text-black hover:bg-gray-100 cursor-pointer shadow-sm"
                                                        onClick={
                                                          handleCreateQuestion
                                                        }
                                                      >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Question
                                                      </Button>
                                                    </div>

                                                    {isQuestionsLoading ? (
                                                      <div className="space-y-3">
                                                        {[1, 2].map((i) => (
                                                          <Skeleton
                                                            key={i}
                                                            className="h-12 w-full"
                                                          />
                                                        ))}
                                                      </div>
                                                    ) : isQuestionsError ? (
                                                      <div className="text-center py-8 bg-white rounded-md">
                                                        <div className="text-red-500 font-semibold mb-2">
                                                          Error loading
                                                          questions
                                                        </div>
                                                        <p className="text-slate-600 text-sm mb-3">
                                                          {questionsError?.message ||
                                                            "Please try again"}
                                                        </p>
                                                        <Button
                                                          onClick={() =>
                                                            refetchQuestions()
                                                          }
                                                          size="sm"
                                                          variant="outline"
                                                          className="cursor-pointer"
                                                        >
                                                          Retry
                                                        </Button>
                                                      </div>
                                                    ) : questionsData?.data &&
                                                      questionsData.data
                                                        .length > 0 ? (
                                                      <div className="bg-white rounded-md border overflow-x-auto">
                                                        <Table>
                                                          <TableHeader>
                                                            <TableRow className="bg-slate-50">
                                                              <TableHead className="w-24 font-semibold">ID</TableHead>
                                                              <TableHead className="font-semibold">Text</TableHead>
                                                              <TableHead className="text-center font-semibold w-24">Type</TableHead>
                                                              <TableHead className="text-center font-semibold w-24">Order</TableHead>
                                                              <TableHead className="text-center font-semibold w-32">Phoneme</TableHead>
                                                              <TableHead className="text-center font-semibold w-64">Actions</TableHead>
                                                            </TableRow>
                                                          </TableHeader>
                                                          <TableBody>
                                                            {[
                                                              ...questionsData.data,
                                                            ]
                                                              .sort(
                                                                (a, b) =>
                                                                  a.orderIndex -
                                                                  b.orderIndex
                                                              )
                                                              .map(
                                                                (question) => (
                                                                  <React.Fragment
                                                                    key={
                                                                      question.questionId
                                                                    }
                                                                  >
                                                                    <TableRow className="hover:bg-slate-50/50 transition-colors">
                                                                      <TableCell className="font-mono text-xs text-slate-500">
                                                                        <div className="truncate max-w-[80px]" title={question.questionId}>
                                                                          {question.questionId.substring(0, 8)}...
                                                                        </div>
                                                                      </TableCell>
                                                                      <TableCell>
                                                                        <div className="text-sm font-semibold text-slate-900">
                                                                          {
                                                                            question.text
                                                                          }
                                                                        </div>
                                                                      </TableCell>
                                                                      <TableCell className="text-center">
                                                                        <Badge variant="outline" className="font-medium bg-indigo-50 text-indigo-700 border-indigo-200">
                                                                          {questionTypeOptions.find(
                                                                            opt => opt.value === parseInt(question.type)
                                                                          )?.label || question.type}
                                                                        </Badge>
                                                                      </TableCell>
                                                                      <TableCell className="text-center">
                                                                        <Badge variant="secondary" className="font-medium">
                                                                          #{
                                                                            question.orderIndex
                                                                          }
                                                                        </Badge>
                                                                      </TableCell>
                                                                      <TableCell className="text-center">
                                                                        <Badge variant="outline" className="font-mono text-xs truncate max-w-[100px]" title={String(question.phonemeJson)}>
                                                                          {String(question.phonemeJson).substring(0, 10)}...
                                                                        </Badge>
                                                                      </TableCell>
                                                                      <TableCell className="text-center">
                                                                        <div className="flex items-center justify-center gap-1.5">
                                                                          <Button
                                                                            size="sm"
                                                                            variant={
                                                                              expandedQuestionId ===
                                                                              question.questionId
                                                                                ? "default"
                                                                                : "outline"
                                                                            }
                                                                            className={
                                                                              expandedQuestionId === question.questionId
                                                                                ? "bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                                                                                : "bg-white border border-gray-300 text-black hover:bg-pink-50 hover:text-pink-700 hover:border-pink-300 cursor-pointer shadow-sm transition-all"
                                                                            }
                                                                            onClick={() =>
                                                                              handleToggleMedia(
                                                                                question.questionId
                                                                              )
                                                                            }
                                                                            title={expandedQuestionId === question.questionId ? "Hide Media" : "View Media"}
                                                                          >
                                                                            <FileImage className="h-4 w-4" />
                                                                          </Button>
                                                                          <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => handleEditQuestion(question)}
                                                                            className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer transition-all"
                                                                            title="Edit Question"
                                                                          >
                                                                            <Pencil className="h-4 w-4" />
                                                                          </Button>
                                                                          <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                                                                            onClick={() => handleDeleteQuestion(question)}
                                                                            title="Delete Question"
                                                                          >
                                                                            <Trash2 className="h-4 w-4" />
                                                                          </Button>
                                                                        </div>
                                                                      </TableCell>
                                                                    </TableRow>

                                                                    {/* Expanded Media Row */}
                                                                    {expandedQuestionId ===
                                                                      question.questionId && (
                                                                      <TableRow>
                                                                        <TableCell
                                                                          colSpan={
                                                                            6
                                                                          }
                                                                          className="bg-purple-50 p-0"
                                                                        >
                                                                          <div className="p-6">
                                                                            <div className="mb-4 flex items-center justify-between">
                                                                              <h4 className="text-md font-semibold text-slate-800 flex items-center">
                                                                                <FileImage className="h-5 w-5 mr-2 text-purple-600" />
                                                                                Media
                                                                                Library
                                                                              </h4>
                                                                              <Button
                                                                                size="sm"
                                                                             className="bg-white border border-gray-300 text-black hover:bg-gray-100 cursor-pointer shadow-sm"
                                                                                onClick={
                                                                                  handleCreateMedia
                                                                                }
                                                                              >
                                                                                <Plus className="h-4 w-4 mr-2" />
                                                                                Add
                                                                                Media
                                                                              </Button>
                                                                            </div>

                                                                            {isMediaLoading ? (
                                                                              <div className="text-center py-4">
                                                                                <div className="text-slate-500">
                                                                                  Loading
                                                                                  media...
                                                                                </div>
                                                                              </div>
                                                                            ) : isMediaError ? (
                                                                              <div className="text-center py-4 text-red-500">
                                                                                Error
                                                                                loading
                                                                                media:{" "}
                                                                                {
                                                                                  mediaError?.message
                                                                                }
                                                                              </div>
                                                                            ) : mediaData?.data &&
                                                                              mediaData
                                                                                .data
                                                                                .length >
                                                                                0 ? (
                                                                              <div className="overflow-x-auto">
                                                                                <Table>
                                                                                  <TableHeader>
                                                                                    <TableRow className="bg-slate-50">
                                                                                      <TableHead className="w-24 font-semibold">
                                                                                        ID
                                                                                      </TableHead>
                                                                                      <TableHead className="w-24 font-semibold">
                                                                                        Accent
                                                                                      </TableHead>
                                                                                      <TableHead className="text-center font-semibold">
                                                                                        Actions
                                                                                      </TableHead>
                                                                                    </TableRow>
                                                                                  </TableHeader>
                                                                                  <TableBody>
                                                                                    {mediaData.data.map(
                                                                                      (
                                                                                        media
                                                                                      ) => (
                                                                                        <TableRow
                                                                                          key={
                                                                                            media.questionMediaId
                                                                                          }
                                                                                          className="hover:bg-slate-50/50 transition-colors"
                                                                                        >
                                                                                          <TableCell className="text-xs font-mono text-slate-500">
                                                                                            <div className="truncate max-w-[80px]" title={media.questionMediaId}>
                                                                                              {media.questionMediaId.substring(0, 8)}...
                                                                                            </div>
                                                                                          </TableCell>
                                                                                          <TableCell>
                                                                                            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 font-medium">
                                                                                              {
                                                                                                media.accent
                                                                                              }
                                                                                            </Badge>
                                                                                          </TableCell>
                                                                                          <TableCell className="text-center">
                                                                                            <div className="flex items-center justify-center gap-1.5">
                                                                                              <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                onClick={() => setViewingMediaDetails(media)}
                                                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                                                                                                title="View Details"
                                                                                              >
                                                                                                <FileText className="h-4 w-4" />
                                                                                              </Button>
                                                                                              <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                onClick={() =>
                                                                                                  handleEditMedia(
                                                                                                    media
                                                                                                  )
                                                                                                }
                                                                                                className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 cursor-pointer transition-all"
                                                                                                title="Edit Media"
                                                                                              >
                                                                                                <Pencil className="h-4 w-4" />
                                                                                              </Button>
                                                                                              <Button
                                                                                                size="sm"
                                                                                                variant="outline"
                                                                                                onClick={() => handleDeleteMedia(media)}
                                                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all"
                                                                                                title="Delete Media"
                                                                                              >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                              </Button>
                                                                                            </div>
                                                                                          </TableCell>
                                                                                        </TableRow>
                                                                                      )
                                                                                    )}
                                                                                  </TableBody>
                                                                                </Table>
                                                                              </div>
                                                                            ) : (
                                                                              <div className="text-center py-8 bg-white rounded-md">
                                                                                <FileImage className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                                                                <div className="text-slate-500 font-semibold mb-2">
                                                                                  No
                                                                                  media
                                                                                  yet
                                                                                </div>
                                                                                <p className="text-slate-600 text-sm mb-3">
                                                                                  Add
                                                                                  media
                                                                                  files
                                                                                  for
                                                                                  this
                                                                                  question
                                                                                </p>
                                                                                <Button
                                                                                  onClick={
                                                                                    handleCreateMedia
                                                                                  }
                                                                                  size="sm"
                                                                                  variant="outline"
                                                                                  className="cursor-pointer"
                                                                                >
                                                                                  <Plus className="h-4 w-4 mr-2" />
                                                                                  Add
                                                                                  First
                                                                                  Media
                                                                                </Button>
                                                                              </div>
                                                                            )}
                                                                          </div>
                                                                        </TableCell>
                                                                      </TableRow>
                                                                    )}
                                                                  </React.Fragment>
                                                                )
                                                              )}
                                                          </TableBody>
                                                        </Table>
                                                      </div>
                                                    ) : (
                                                      <div className="text-center py-8 bg-white rounded-md">
                                                        <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                                        <div className="text-slate-500 font-semibold mb-2">
                                                          No questions yet
                                                        </div>
                                                        <p className="text-slate-600 text-sm mb-3">
                                                          Create the first
                                                          question for this
                                                          exercise
                                                        </p>
                                                        <Button
                                                          onClick={
                                                            handleCreateQuestion
                                                          }
                                                          size="sm"
                                                          variant="outline"
                                                        >
                                                          <Plus className="h-4 w-4 mr-2" />
                                                          Create Question
                                                        </Button>
                                                      </div>
                                                    )}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </React.Fragment>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <div className="text-center py-8 bg-white rounded-md">
                                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                  <div className="text-slate-500 font-semibold mb-2">
                                    No exercises yet
                                  </div>
                                  <p className="text-slate-600 text-sm mb-3">
                                    Create the first exercise for this chapter
                                  </p>
                                  <Button
                                    onClick={handleCreateExercise}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Exercise
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-500 text-lg font-semibold mb-2">
                  No chapters yet
                </div>
                <p className="text-slate-600 mb-4">
                  Start by creating your first chapter for this course
                </p>
                <Button className="cursor-pointer" onClick={handleCreateChapter} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Chapter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Exercise View - When viewMode === 'exercise' */}
      {viewMode === "exercise" && selectedChapter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Exercises List</span>
              <div className="ml-auto">
                <Button
                  onClick={handleCreateExercise}
                  size="sm"
                  className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isExercisesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : isExercisesError ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Error loading exercises
                </div>
                <p className="text-slate-600 mb-4">
                  {exercisesError?.message || "Please try again later"}
                </p>
                <Button onClick={() => refetchExercises()} variant="outline" className="cursor-pointer">
                  Retry
                </Button>
              </div>
            ) : exercisesData?.data && exercisesData.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ExerciseId</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Order Index</TableHead>
                    <TableHead className="text-center">Questions</TableHead>
                    <TableHead className="text-center">Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...exercisesData.data]
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((exercise) => (
                      <TableRow
                        key={exercise.exerciseId}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-medium text-slate-600">
                          {exercise.exerciseId}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-800">
                            {exercise.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-slate-600 max-w-md truncate">
                            {exercise.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{exercise.orderIndex}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {exercise.numberOfQuestion || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm text-slate-600">
                          {new Date(exercise.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                              onClick={() =>
                                handleViewQuestions({
                                  exerciseId: exercise.exerciseId,
                                  title: exercise.title,
                                  description: exercise.description,
                                  orderIndex: exercise.orderIndex,
                                })
                              }
                            >
                              <HelpCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Questions</span>
                            </Button>
                            <Button size="sm" variant="outline" className="cursor-pointer">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-500 text-lg font-semibold mb-2">
                  No exercises yet
                </div>
                <p className="text-slate-600 mb-4">
                  Start by creating your first exercise for this chapter
                </p>
                <Button onClick={handleCreateExercise} variant="outline" className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Exercise
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Question View - When viewMode === 'question' */}
      {viewMode === "question" && selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Questions List</span>
              <div className="ml-auto">
                <Button
                  onClick={handleCreateQuestion}
                  size="sm"
                  className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock data - replace with actual API call */}
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 text-lg font-semibold mb-2">
                No questions yet
              </div>
              <p className="text-slate-600 mb-4">
                Start by creating your first question for this exercise
              </p>
              <Button onClick={handleCreateQuestion} variant="outline" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Create First Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LevelA1;
