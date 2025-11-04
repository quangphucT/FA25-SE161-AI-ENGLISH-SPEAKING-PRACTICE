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
import { toast } from "sonner";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function QuestionForAssessmentPage() {
  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionAssessmentItem | null>(null);
  const [formType, setFormType] = useState<QuestionType>("word");
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

  // gọi hook API tạo câu hỏi mới
  const { mutate: createQuestionTest, isPending } = useCreateQuestionTest();
  // gọi hook API cập nhật câu hỏi
  const { mutate: useUpdateQuestionTest } = updateQuestionTest();
 // gọi hook API chọn câu hỏi
  const { mutate: useChooseQuestionTest } = useChooseQuestionForTestAssessment();
  function openAddModal() {
    setEditing(null);
    setFormType("word");
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
      useUpdateQuestionTest(
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
      : questionTests?.data?.items?.filter((q) => q.type === typeFilter) ?? [];

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
    useChooseQuestionTest({questionId: id, status: !status});
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
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="sentence">Sentence</SelectItem>
              <SelectItem value="paragraph">Paragraph</SelectItem>
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
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((q) => (
              <TableRow key={q.questionAssessmentId}>
                <TableCell>{q.questionAssessmentId}</TableCell>
                <TableCell className="capitalize">{q.type}</TableCell>
                <TableCell className="max-w-[480px] truncate">
                  {q.content}
                </TableCell>
                <TableCell className="max-w-[480px] truncate">
                 {q.status ? (
  <FaCheckCircle style={{ color: "green" }} />
) : (
  <FaTimesCircle style={{ color: "red" }} />
)}
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

                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {q.status
                          ? "Bỏ chọn câu hỏi"
                          : "Chọn làm câu hỏi đầu vào"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {q.status
                            ? "Xác nhận bỏ chọn"
                            : "Xác nhận chọn câu hỏi"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {q.status
                            ? "Bạn có chắc muốn bỏ chọn câu hỏi này làm câu hỏi đầu vào không?"
                            : "Bạn có chắc muốn chọn câu hỏi này làm câu hỏi đầu vào không?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleSelectAsQuestion(
                              q.questionAssessmentId,
                              q.status
                            )
                          }
                        >
                          Xác nhận
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
