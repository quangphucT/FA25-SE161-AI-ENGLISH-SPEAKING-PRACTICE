"use client";
import { useEffect, useMemo, useState } from "react";
// Mock mode: remove react-query and API usage

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Course, ID } from "@/types/curriculum";
import { useCurriculumUiStore } from "@/store/curriculumUiStore";
// import { toast } from "sonner";

// Mock data
const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Phát âm cơ bản",
    description: "Khóa nhập môn phát âm",
    status: "draft",
    orderIndex: 0,
    level: "beginner",
    numberOfChapter: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: ["ch-1", "ch-2"],
  },
  {
    id: "course-2",
    title: "Ngữ điệu nâng cao",
    status: "published",
    orderIndex: 1,
    level: "intermediate",
    numberOfChapter: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chapters: ["ch-3"],
  },
];

type ChapterLite = { id: ID; title: string };
const mockChaptersByCourse: Record<string, ChapterLite[]> = {
  "course-1": [
    { id: "ch-1", title: "Nguyên âm" },
    { id: "ch-2", title: "Phụ âm" },
  ],
  "course-2": [{ id: "ch-3", title: "Ngữ điệu câu hỏi" }],
};

export default function CurriculumManagementPage() {
  const {
    role,
    setRole,
    selectedCourseId,
    selectCourse,
    selectedChapterId,
    selectChapter,
    previewMode,
    setPreview,
  } = useCurriculumUiStore();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const currentCourse: Course | undefined = useMemo(
    () => courses?.find((c) => c.id === selectedCourseId) ?? courses?.[0],
    [courses, selectedCourseId]
  );

  useEffect(() => {
    if (!selectedCourseId && currentCourse) selectCourse(currentCourse.id);
  }, [selectedCourseId, currentCourse, selectCourse]);

  const chapters: ChapterLite[] = useMemo(() => {
    if (!currentCourse?.id) return [];
    return mockChaptersByCourse[currentCourse.id] ?? [];
  }, [currentCourse?.id]);

  // Local mutations (mock)
  const createCourse = {
    mutate: (title: string) => {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title,
        status: "draft",
        orderIndex: courses.length,
        level: "beginner",
        numberOfChapter: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chapters: [],
      };
      setCourses((prev) => [...prev, newCourse]);
    },
  };
  const createChapter = {
    mutate: (title: string) => {
      if (!currentCourse) return;
      mockChaptersByCourse[currentCourse.id] =
        mockChaptersByCourse[currentCourse.id] ?? [];
      const newId = `ch-${Date.now()}`;
      mockChaptersByCourse[currentCourse.id].push({ id: newId, title });
      // also update order state
      setChapterOrder((prev) => [...prev, newId]);
    },
  };
  const reorderChapters = {
    mutate: (order: ID[]) => {
      if (!currentCourse) return;
      const current = mockChaptersByCourse[currentCourse.id] ?? [];
      const byId = new Map(current.map((c) => [c.id, c] as const));
      mockChaptersByCourse[currentCourse.id] = order
        .map((id) => byId.get(id)!)
        .filter(Boolean);
    },
  };

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [chapterOrder, setChapterOrder] = useState<ID[]>([]);

  useEffect(() => {
    setChapterOrder(chapters.map((c) => c.id));
  }, [chapters]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = chapterOrder.indexOf(active.id as ID);
    const newIndex = chapterOrder.indexOf(over.id as ID);
    const newOrder = arrayMove(chapterOrder, oldIndex, newIndex);
    setChapterOrder(newOrder);
    // optimistic save
    reorderChapters.mutate(newOrder);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Quản lý Chương trình</h1>
          <Select
            value={role}
            onValueChange={(v) => setRole(v as "instructor" | "viewer")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instructor">Giảng viên</SelectItem>
              <SelectItem value="viewer">Người xem</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <label className="text-sm">Xem trước</label>
            <input
              type="checkbox"
              aria-label="Bật chế độ xem trước"
              checked={previewMode}
              onChange={(e) => setPreview(e.target.checked)}
            />
          </div>
        </div>
        {role === "instructor" && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tên khoá học"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className="w-56"
            />
            <Button
              onClick={() =>
                newCourseTitle && createCourse.mutate(newCourseTitle)
              }
            >
              + Khoá học
            </Button>
          </div>
        )}
      </div>

      {/* 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[70vh]">
        {/* Left: Tree */}
        <Card
          className="lg:col-span-3 p-3 overflow-auto"
          role="navigation"
          aria-label="Cây khoá học"
        >
          <div className="flex items-center justify-between mb-2">
            <Select
              value={currentCourse?.id}
              onValueChange={(id) => selectCourse(id)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn khoá học" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {role === "instructor" && (
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Tên chương"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
              <Button
                disabled={!currentCourse}
                onClick={() =>
                  newChapterTitle && createChapter.mutate(newChapterTitle)
                }
              >
                + Chương
              </Button>
            </div>
          )}
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              items={chapterOrder}
              strategy={verticalListSortingStrategy}
            >
              <ul
                className="space-y-1"
                role="tree"
                aria-label="Danh sách chương"
              >
                {chapters.map((ch) => (
                  <li
                    key={ch.id}
                    role="treeitem"
                    aria-selected={selectedChapterId === ch.id}
                  >
                    <Button
                      variant={
                        selectedChapterId === ch.id ? "default" : "secondary"
                      }
                      className="w-full justify-start"
                      onClick={() => selectChapter(ch.id)}
                    >
                      <span className="truncate">{ch.title}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </Card>

        {/* Center: List/Detail */}
        <Card className="lg:col-span-5 p-4 overflow-auto" aria-live="polite">
          <h2 className="font-medium mb-3">Nội dung</h2>
          {selectedChapterId ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Chương đã chọn:{" "}
                {chapters.find((c) => c.id === selectedChapterId)?.title}
              </p>
              {role === "instructor" && <Button>+ Bài tập</Button>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chọn một chương để quản lý nội dung.
            </p>
          )}
        </Card>

        {/* Right: Editor/Preview */}
        <Card className="lg:col-span-4 p-4 overflow-auto">
          <h2 className="font-medium mb-3">Trình soạn thảo</h2>
          {previewMode ? (
            <div className="prose max-w-none">
              <p>Xem trước nội dung bài tập (demo).</p>
            </div>
          ) : (
            <div>
              <textarea
                aria-label="Soạn nội dung"
                className="w-full h-64 border rounded p-2"
                placeholder="Soạn nội dung bài tập (TipTap sẽ được tích hợp)."
              />
              {role === "instructor" && (
                <div className="mt-2">
                  <Button>Lưu nội dung</Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
