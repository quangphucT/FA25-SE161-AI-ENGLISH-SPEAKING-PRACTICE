export type ID = string;

export type CourseStatus = "draft" | "published";

export interface Course {
  id: ID;
  title: string;
  description?: string;
  status: CourseStatus;
  orderIndex: number;
  level: string;
  numberOfChapter: number;
  createdAt: string;
  updatedAt: string;
  chapters: ID[];
}

export interface Chapter {
  id: ID;
  courseId: ID;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  exercises: ID[];
}

export type ExerciseType = "practice" | "quiz";

export interface Exercise {
  id: ID;
  chapterId: ID;
  title: string;
  type: ExerciseType;
  durationMinutes?: number;
  orderIndex: number;
  contentHtml?: string;
  createdAt: string;
  updatedAt: string;
  questions: ID[];
}

export type QuestionType = "word" | "phrase" | "sentence" | "paragraph";

export interface Question {
  id: ID;
  exerciseId: ID;
  type: QuestionType;
  text: string;
  // JSON for phoneme for phrase/sentence
  phoneme_json?: unknown;
  orderIndex: number;
}

export type SourceType = "AI" | "HUMAN";

export interface QuestionMedia {
  id: string;
  question_id: ID;
  accent: string;
  AudioURL?: string;
  VideoURL?: string;
  source: SourceType;
  ImageURL?: string;
}

export interface PhonemeTemplate {
  id: string;
  questionid: string;
  symbol: string;
  orderIndex: number;
}

export interface Stress {
  id: string;
  phonemeTemplateid: string;
  syllable_index: number;
}
