"use client";

import { useState } from "react";
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

import { useCreateQuestionTest } from "@/features/manager/hook/useCreateQuestionTestAsssessmentMutation";
import { useGetQuestionTestQuery } from "@/features/manager/hook/useGetQuestionTestAssessment";

import { QuestionAssessmentItem, QuestionType } from "@/types/questionTest";
import { updateQuestionTest } from "@/features/manager/hook/useUpdateQuestionTestAssessment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useChooseQuestionForTestAssessment } from "@/features/manager/hook/useChooseQuestionForTest";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal , Pencil, XCircle } from "lucide-react";


export default function QuestionForAssessmentPage() {
  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionAssessmentItem | null>(null);
  const [formType, setFormType] = useState<QuestionType>("Word");
  const [formContent, setFormContent] = useState("");
  // pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // số câu hỏi mỗi trang

  // gọi API lấy danh sách câu hỏi
  const {
    data: questionTests,
    isLoading,
    refetch,
  } = useGetQuestionTestQuery(
    page,
    limit,
    typeFilter === "all" ? "" : typeFilter
  );


type QuestionTypeInput = number | string | null | undefined;

const normalizeQuestionType = (type: QuestionTypeInput): QuestionType => {
  if (typeof type === "number") {
    switch (type) {
      case 0:
        return "Word";
      case 1:
        return "Phrase";
      case 2:
        return "Sentence";
      default:
        return "Word";
    }
  }

  if (typeof type === "string") {
    const normalized = type.trim();
    if (
      normalized === "Word" ||
      normalized === "Phrase" ||
      normalized === "Sentence"
    ) {
      return normalized;
    }
  }

  return "Word";
};


const detectQuestionType = (content: string): QuestionType => {
  const normalized = content.trim().replace(/\s+/g, " ");
  if (!normalized) return "Word";

  const wordCount = normalized.split(" ").length;

  if (wordCount === 1) return "Word";
  if (wordCount === 2) return "Phrase";
  return "Sentence";
};



const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  Word: "Từ đơn",
  Phrase: "Cụm từ",
  Sentence: "Câu",
};


  
  // gọi hook API tạo câu hỏi mới
  const { mutate: createQuestionTest, isPending } = useCreateQuestionTest();
  // gọi hook API cập nhật câu hỏi
  const { mutate: updateQuestionMutation } = updateQuestionTest();
 // gọi hook API chọn câu hỏi
  const { mutate: chooseQuestionMutation } = useChooseQuestionForTestAssessment();
  function openAddModal() {
    setEditing(null);
    setFormType("Word");
    setFormContent("");
    setIsModalOpen(true);
  }

  function openEditModal(q: QuestionAssessmentItem) {
    setEditing(q);
    setFormType(q.type);
    setFormContent(q.content);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function saveForm() {
    const payload = {
      type: formType,
      content: formContent.trim(),
    };
    if (editing) {
      updateQuestionMutation(
        { ...payload, id: editing.questionAssessmentId },
        {
          onSuccess: () => {
            refetch();
            setEditing(null);
            setFormContent("");
            setIsModalOpen(false);
          },
        }
      );

      return; // ✅ Dừng hàm tại đây, không chạy phần tạo mới
    }

    // 👇 Chỉ chạy khi thêm mới
    createQuestionTest(payload, {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false);
        setFormContent("");
      },
    });
  }

  // Lọc theo loại
const filteredQuestions =
  typeFilter === "all"
    ? questionTests?.data?.items ?? []
    : questionTests?.data?.items?.filter(
        (q) => normalizeQuestionType(q.type) === typeFilter
      ) ?? [];


  if (isLoading) return <div className="p-4">Đang tải dữ liệu...</div>;

  // ✅ Dữ liệu BE trả về
  const items = questionTests?.data?.items ?? [];
  const totalPages = questionTests?.data?.totalPages ?? 1;
  const total = items.length; // BE không có totalItems
  function handleSelectAsQuestion(id: string, status: boolean) {
    // gọi API hoặc cập nhật trạng thái tại đây
    // const payload = {
    //   id,
    //   status: !status, 
    // }
    // console.log("Status:", payload)
    chooseQuestionMutation({questionId: id, status: !status});
    // ví dụ gọi API update status
    // useUpdateQuestionTest(
    //   { id, status: true },
    //   {
    //     onSuccess: () => {
    //       toast.success("Đã chọn làm câu hỏi đầu vào!");
    //       refetch();
    //     },
    //     onError: () => {
    //       toast.error("Thao tác thất bại");
    //     },
    //   }
    // );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý câu hỏi đầu vào</h1>
        <div className="flex items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(v: string) => {
              setTypeFilter(v as "all" | QuestionType);
              setPage(1); // reset về trang 1 khi lọc thay đổi
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lọc loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
             <SelectItem value="Word">Từ đơn</SelectItem>
<SelectItem value="Phrase">Cụm từ</SelectItem>
<SelectItem value="Sentence">Câu</SelectItem>

            </SelectContent>
          </Select>
          <Button className="cursor-pointer" onClick={openAddModal}>
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Câu hỏi được chọn</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((q) => (
              <TableRow key={q.questionAssessmentId}>
                <TableCell>{q.questionAssessmentId}</TableCell>
<TableCell>
  {QUESTION_TYPE_LABEL[normalizeQuestionType(q.type)]}
</TableCell>

                <TableCell className="max-w-[480px] truncate">
                  {q.content}
                </TableCell>
                <TableCell className="max-w-[480px] truncate">
               {q.status ? (
  <FaCheckCircle className="text-green-600" title="Đã chọn" />
) : (
  <FaTimesCircle className="text-red-500" title="Chưa chọn" />
)}

                </TableCell>

                


             <TableCell className="text-center">
  <div className="flex flex-col items-center gap-1">
   

    {/* NÚT 3 CHẤM */}
   <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-48">
    {/* SỬA */}
    <DropdownMenuItem
      onClick={() => openEditModal(q)}
      className="gap-2 cursor-pointer"
    >
      <Pencil className="h-4 w-4" />
      <span>Sửa</span>
    </DropdownMenuItem>

    {/* CHỌN / BỎ CHỌN */}
    {q.status ? (
      <DropdownMenuItem
        onClick={() =>
          handleSelectAsQuestion(q.questionAssessmentId, q.status)
        }
        className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
      >
        <XCircle className="h-4 w-4 text-red-600" />
        <span>Bỏ chọn câu hỏi</span>
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem
        onClick={() =>
          handleSelectAsQuestion(q.questionAssessmentId, q.status)
        }
        className="gap-2 cursor-pointer text-green-600 focus:text-green-600"
      >
        <FaCheckCircle className="h-4 w-4 text-green-600" />
        <span>Chọn làm câu hỏi</span>
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>

  </div>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ⚡ PHÂN TRANG */}
        <div className="flex items-center justify-between mt-4">
          <div>
            Trang {page}/{totalPages || 1} ({total} câu hỏi)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
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
                <div className="text-sm font-medium">Nội dung</div>
               <Input
  value={formContent}
  onChange={(e) => {
    const value = e.target.value;
    setFormContent(value);
    setFormType(detectQuestionType(value)); // ✅ AUTO DETECT
  }}
  placeholder="Nhập nội dung câu hỏi"
/>
<div className="text-sm text-gray-500">
  Loại tự động:{" "}
  <span className="font-medium text-black">
    {QUESTION_TYPE_LABEL[formType]}
  </span>
</div>

              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={closeModal}>
                  Hủy
                </Button>
                <Button
                  onClick={saveForm}
                  disabled={!formContent.trim() || isPending}
                >
                  {isPending ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
