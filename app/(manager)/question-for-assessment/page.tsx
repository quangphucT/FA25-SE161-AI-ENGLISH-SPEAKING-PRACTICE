"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuestionType = "word" | "sentence" | "paragraph";

interface QuestionAssessment {
  QuestionAssessmentID: string; // PK
  Type: QuestionType;
  Content: string;
}

const initialQuestions: QuestionAssessment[] = [
  { QuestionAssessmentID: "q-1", Type: "word", Content: "Apple" },
  { QuestionAssessmentID: "q-2", Type: "word", Content: "Banana" },
  { QuestionAssessmentID: "q-3", Type: "word", Content: "Computer" },
  { QuestionAssessmentID: "q-4", Type: "sentence", Content: "I like apples." },
  {
    QuestionAssessmentID: "q-5",
    Type: "sentence",
    Content: "She goes to school every day.",
  },
  {
    QuestionAssessmentID: "q-6",
    Type: "sentence",
    Content: "They are watching a movie.",
  },
  {
    QuestionAssessmentID: "q-7",
    Type: "paragraph",
    Content:
      "Reading is a wonderful way to explore different worlds and ideas.",
  },
];

function generateId(): string {
  return `q-${Date.now()}`;
}

export default function QuestionForAssessmentPage() {
  const [questions, setQuestions] =
    useState<QuestionAssessment[]>(initialQuestions);
  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionAssessment | null>(null);
  const [formType, setFormType] = useState<QuestionType>("word");
  const [formContent, setFormContent] = useState("");

  const filtered = useMemo(() => {
    if (typeFilter === "all") return questions;
    return questions.filter((q) => q.Type === typeFilter);
  }, [questions, typeFilter]);

  function openAddModal() {
    setEditing(null);
    setFormType("word");
    setFormContent("");
    setIsModalOpen(true);
  }

  function openEditModal(q: QuestionAssessment) {
    setEditing(q);
    setFormType(q.Type);
    setFormContent(q.Content);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function saveForm() {
    if (editing) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.QuestionAssessmentID === editing.QuestionAssessmentID
            ? { ...q, Type: formType, Content: formContent }
            : q
        )
      );
    } else {
      const newItem: QuestionAssessment = {
        QuestionAssessmentID: generateId(),
        Type: formType,
        Content: formContent.trim(),
      };
      setQuestions((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý câu hỏi đầu vào</h1>
        <div className="flex items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(v: string) =>
              setTypeFilter(v as "all" | QuestionType)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Lọc loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="sentence">Sentence</SelectItem>
              <SelectItem value="paragraph">Paragraph</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openAddModal}>Thêm câu hỏi</Button>
        </div>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => (
              <TableRow key={q.QuestionAssessmentID}>
                <TableCell>{q.QuestionAssessmentID}</TableCell>
                <TableCell className="capitalize">{q.Type}</TableCell>
                <TableCell className="max-w-[480px] truncate">
                  {q.Content}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(q)}
                  >
                    Sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative z-10 w-[min(560px,92vw)] rounded-xl border bg-background p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">
                {editing ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
              </div>
              <Button variant="ghost" onClick={closeModal}>
                Đóng
              </Button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Loại</div>
                <Select
                  value={formType}
                  onValueChange={(v) => setFormType(v as QuestionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="sentence">Sentence</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Nội dung</div>
                <Input
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={closeModal}>
                  Hủy
                </Button>
                <Button onClick={saveForm} disabled={!formContent.trim()}>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
