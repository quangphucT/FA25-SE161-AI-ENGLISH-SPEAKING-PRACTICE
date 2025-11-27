"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManagerAssessmentLearner } from "@/features/manager/hook/useManagerAssessmentLearner";
import { Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const PAGE_SIZE = 5;
const typeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "placement", label: "Placement" },
  { value: "practice", label: "Practice" },
];

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd/MM/yyyy HH:mm");
  } catch {
    return value;
  }
};

const getScoreVariant = (score?: number) => {
  if (score === undefined || score === null) return "secondary";
  if (score >= 80) return "default";
  if (score >= 50) return "outline";
  return "destructive";
};

export default function AssessmentManagement() {
  const [pageNumber, setPageNumber] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>();

  const { data, isLoading, isError, refetch, isFetching } =
    useManagerAssessmentLearner(
      pageNumber,
      PAGE_SIZE,
      typeFilter === "all" ? undefined : typeFilter,
      keyword || undefined
    );

  const assessments = data?.data.items ?? [];
  const totalPages = data?.data.totalPages ?? 1;

  useEffect(() => {
    if (!assessments.length) {
      setSelectedAssessmentId(undefined);
      return;
    }
    if (!selectedAssessmentId || !assessments.some((a) => a.assessmentId === selectedAssessmentId)) {
      setSelectedAssessmentId(assessments[0].assessmentId);
    }
  }, [assessments, selectedAssessmentId]);

  const selectedAssessment = useMemo(
    () => assessments.find((item) => item.assessmentId === selectedAssessmentId),
    [assessments, selectedAssessmentId]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNumber(1);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý bài đánh giá</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi tiến độ đánh giá của học viên theo từng bài kiểm tra
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo learnerId..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Loại bài" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isFetching}>
            {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Tìm kiếm
          </Button>
        </form>
      </div>

      {isError ? (
        <Card className="p-6 text-center text-red-500">Không thể tải dữ liệu. Vui lòng thử lại.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-4 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Danh sách bài đánh giá</h2>
              <Badge variant="outline">{assessments.length} mục</Badge>
            </div>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : assessments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có dữ liệu.</p>
            ) : (
              <ul className="space-y-2">
                {assessments.map((assessment) => (
                  <li key={assessment.assessmentId}>
                    <Button
                      variant={
                        assessment.assessmentId === selectedAssessmentId ? "default" : "secondary"
                      }
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedAssessmentId(assessment.assessmentId)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{assessment.assessmentId}</span>
                        <span className="text-xs text-muted-foreground">
                          Điểm: {assessment.score ?? "-"} • Câu hỏi: {assessment.numberOfQuestion} •{" "}
                          {formatDate(assessment.createdAt)}
                        </span>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber === 1}
              >
                Trước
              </Button>
              <span className="text-sm">
                Trang {pageNumber}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                disabled={pageNumber >= totalPages}
              >
                Sau
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Chi tiết bài đánh giá</h2>
                <p className="text-xs text-muted-foreground">
                  Hiển thị từng câu hỏi trong bài kiểm tra đã chọn
                </p>
              </div>
              {selectedAssessment && (
                <Badge variant={getScoreVariant(selectedAssessment.score)}>
                  Điểm tổng: {selectedAssessment.score ?? "-"}
                </Badge>
              )}
            </div>

            {!selectedAssessment ? (
              <p className="text-sm text-muted-foreground">Chọn một bài đánh giá ở bên trái.</p>
            ) : selectedAssessment.assessmentDetails.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có chi tiết câu hỏi.</p>
            ) : (
              <div className="grid gap-3">
                {selectedAssessment.assessmentDetails.map((detail) => (
                  <div key={detail.assessmentDetailId} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate">
                        Câu hỏi: {detail.questionAssessmentId}
                      </span>
                      <Badge variant={getScoreVariant(detail.score)}>Điểm: {detail.score ?? "-"}</Badge>
                    </div>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      Loại: {detail.type || "Chưa có"} • Phản hồi AI:{" "}
                      {detail.aI_Feedback || "Không có"}
                    </p> */}
                    {detail.answerAudio && (
                      <audio controls className="mt-2 w-full">
                        <source src={detail.answerAudio} />
                        Trình duyệt không hỗ trợ phát audio.
                      </audio>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="lg:col-span-3 p-4 space-y-4">
            <h2 className="font-semibold">Thông tin học viên</h2>
            {!selectedAssessment ? (
              <p className="text-sm text-muted-foreground">Chọn một bài đánh giá để xem thông tin.</p>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Learner Profile ID</p>
                  <p className="font-medium break-all">{selectedAssessment.learnerProfileId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tổng số câu hỏi</p>
                  <p className="font-medium">{selectedAssessment.numberOfQuestion}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{formatDate(selectedAssessment.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nhận xét</p>
                  <p className="font-medium">
                    {selectedAssessment.feedback || "Chưa có nhận xét từ Reviewer"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
