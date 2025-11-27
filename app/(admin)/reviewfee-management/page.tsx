"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAdminReviewFeePackagesQuery, useAdminReviewFeeCreateMutation } from "@/features/admin/hooks/useAdminReviewFee";
import { CreateReviewFeeRequest } from "@/features/admin/services/adminReviewFeeService";
import { Loader2, FileText, Plus, Package, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAdminReviewFeeDetailQuery } from "@/features/admin/hooks/useAdminReviewFee";

const PAGE_SIZE = 10;

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const createReviewFeeSchema = z.object({
  reviewFeeId: z.string().min(1, "Vui lòng nhập mã gói phí đánh giá"),
  appliedDate: z.string().min(1, "Vui lòng chọn ngày áp dụng"),
  percentOfSystem: z.number().min(0).max(100, "Phần trăm hệ thống phải từ 0-100"),
  percentOfReviewer: z.number().min(0).max(100, "Phần trăm reviewer phải từ 0-100"),
  pricePerReviewFee: z.number().min(0, "Giá mỗi đánh giá phải lớn hơn 0"),
}).refine(
  (data) => data.percentOfSystem + data.percentOfReviewer <= 100,
  {
    message: "Tổng phần trăm hệ thống và reviewer không được vượt quá 100%",
    path: ["percentOfReviewer"],
  }
);

type CreateReviewFeeFormData = z.infer<typeof createReviewFeeSchema>;

export default function ReviewFeeManagement() {
  const [pageNumber, setPageNumber] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedReviewFeeId, setSelectedReviewFeeId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);


  const { data, isLoading, isError, error, refetch } = useAdminReviewFeePackagesQuery(
    pageNumber,
    PAGE_SIZE
  );

  const { mutate: createReviewFee, isPending: isCreating } = useAdminReviewFeeCreateMutation();

  const {
    data: detailData,
    isLoading: isDetailLoading,
  } = useAdminReviewFeeDetailQuery(selectedReviewFeeId);
 

  const form = useForm<CreateReviewFeeFormData>({
    resolver: zodResolver(createReviewFeeSchema),
    defaultValues: {
      reviewFeeId: "",
      appliedDate: new Date().toISOString().split("T")[0],
      percentOfSystem: 0,
      percentOfReviewer: 0,
      pricePerReviewFee: 0,
    },
  });

  const onSubmit = async (values: CreateReviewFeeFormData) => {
    const requestData: CreateReviewFeeRequest = {
      reviewFeeId: values.reviewFeeId,
      appliedDate: new Date(values.appliedDate).toISOString(),
      percentOfSystem: values.percentOfSystem,
      percentOfReviewer: values.percentOfReviewer,
      pricePerReviewFee: values.pricePerReviewFee,
    };

    createReviewFee(requestData, {
      onSuccess: () => {
        setShowCreateModal(false);
        form.reset();
        refetch();
      },
    });
  };

  const packages = data?.data?.items ?? [];
  const totalItems = data?.data?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const activePackages = packages.filter(pkg => pkg.currentPricePolicy).length;
  const inactivePackages = packages.length - activePackages;
const InfoItem = ({ label, value, className = "" }: any) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`font-semibold text-gray-900 mt-1 ${className}`}>{value}</p>
  </div>
);




  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý gói phí đánh giá</h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý các gói phí đánh giá và chính sách giá hiện tại
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm px-4 py-2 border-gray-300">
            <Package className="w-4 h-4 mr-2" />
            {packages.length} gói
          </Badge>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tạo gói phí đánh giá
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng số gói</p>
                <div className="text-3xl font-bold text-gray-900">
                  {packages.length}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Đang áp dụng</p>
                <div className="text-3xl font-bold text-gray-900">
                  {activePackages}
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Chưa có chính sách</p>
                <div className="text-3xl font-bold text-gray-900">
                  {inactivePackages}
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isError ? (
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <p className="font-medium text-lg">Không thể tải dữ liệu</p>
              <p className="text-sm mt-1 text-gray-600">
                {error?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900">Danh sách gói phí đánh giá</span>
              </CardTitle>
            </div>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100">
                      <TableHead className="font-bold text-sm text-gray-700">Mã gói</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">Số lượng đánh giá</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">Giá mỗi đánh giá</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">% Hệ thống</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">% Reviewer</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">Ngày áp dụng</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">Trạng thái</TableHead>
                      <TableHead className="font-bold text-sm text-gray-700">Hành động</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                            <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : packages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Package className="w-16 h-16 text-gray-300" />
                            <p className="text-gray-500 font-medium">Chưa có gói phí đánh giá nào</p>
                            <p className="text-sm text-gray-400">Nhấn nút &quot;Tạo gói phí đánh giá&quot; để bắt đầu</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      packages.map((pkg) => (
                        <TableRow key={pkg.reviewFeeId} className="hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded">
                              </div>
                              <span className="text-sm font-mono font-semibold text-gray-900">
                                {pkg.reviewFeeId.slice(0, 8)}...
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                             
                              <span className="font-semibold text-gray-900">
                                {pkg.numberOfReview}
                              </span>
                              <span className="text-sm text-gray-500">đánh giá</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                            
                              <span className="font-semibold text-green-700">
                                {formatCurrency(pkg.currentPricePolicy?.pricePerReviewFee)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              
                              <span className="font-semibold text-purple-700">
                                {((pkg.currentPricePolicy?.percentOfSystem ?? 0) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              
                              <span className="font-semibold text-orange-700">
                                {((pkg.currentPricePolicy?.percentOfReviewer ?? 0) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                 
                              <span className="text-sm text-gray-700">
                                {formatDate(pkg.currentPricePolicy?.appliedDate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                pkg.currentPricePolicy ? "default" : "secondary"
                              }
                              className={
                                pkg.currentPricePolicy
                                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 font-medium"
                                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 font-medium"
                              }
                            >
                              <div className="flex items-center gap-1.5">
                                {pkg.currentPricePolicy ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                                {pkg.currentPricePolicy ? "Đang áp dụng" : "Chưa có chính sách"}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
      setSelectedReviewFeeId(pkg.reviewFeeId);
      setShowDetailModal(true);
    }}
    className="cursor-pointer"
  >
    Xem chi tiết
  </Button>
</TableCell>

                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {packages.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Trang {pageNumber} / {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1 || isLoading}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  disabled={pageNumber >= totalPages || isLoading}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}

      {/* Create Review Fee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto w-full mx-4 no-scrollbar">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Tạo gói phí đánh giá mới
                    </h2>
                    <p className="text-sm text-green-100 mt-0.5">
                      Điền thông tin để tạo gói phí đánh giá mới
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateModal(false);
                    form.reset();
                  }}
                  className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6 bg-gray-50">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Thông tin gói phí đánh giá */}
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="bg-white border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Thông tin gói phí đánh giá
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="reviewFeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mã gói phí đánh giá *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="VD: 296fb9bf-d7a2-4482-8c0f-26a312397e82"
                                {...field}
                                className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="appliedDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày áp dụng *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pricePerReviewFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá mỗi đánh giá (VND) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="VD: 10000"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="percentOfSystem"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>% Hệ thống *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="VD: 30"
                                  min="0"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="percentOfReviewer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>% Reviewer *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="VD: 70"
                                  min="0"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nút thao tác */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setShowCreateModal(false);
                      }}
                      className="cursor-pointer border-gray-300 hover:bg-gray-50 px-6"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer px-6 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Tạo gói phí đánh giá
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
   {/* ============================
    MODAL CHI TIẾT GÓI PHÍ ĐÁNH GIÁ
============================= */}
{showDetailModal && (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={() => {
      setShowDetailModal(false);
      setSelectedReviewFeeId(null);
    }}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl 
                 max-h-[90vh] flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER – sticky */}
      <div className="p-6 border-b bg-white flex items-center justify-between sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-gray-900">
          Chi tiết gói phí đánh giá
        </h2>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full hover:bg-gray-100"
          onClick={() => setShowDetailModal(false)}
        >
          ✕
        </Button>
      </div>

      {/* BODY – scroll only content */}
      <div className="p-6 overflow-y-auto space-y-8">

        {/* THÔNG TIN CHUNG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border">
          <InfoItem label="Mã gói" value={detailData?.data?.reviewFeeId} />
          <InfoItem label="Số lượng đánh giá" value={detailData?.data?.numberOfReview} />

          <InfoItem
            label="Giá mỗi đánh giá"
            value={formatCurrency(detailData?.data?.currentPolicy?.pricePerReviewFee)}
            className="text-green-600 font-bold"
          />

          <InfoItem
            label="% Reviewer"
value={((detailData?.data?.currentPolicy?.percentOfReviewer ?? 0) * 100).toFixed(0) + "%"}
            className="text-orange-600 font-bold"
          />

       
          <InfoItem
            label="Ngày áp dụng"
            value={formatDate(detailData?.data?.currentPolicy?.appliedFrom)}
          />
        </div>

        {/* LỊCH SỬ CHÍNH SÁCH */}
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-3">
            Lịch sử chính sách
          </h3>

          <div className="max-h-[280px] overflow-y-auto pr-2 space-y-3">
            {detailData?.data?.historyPolicies?.map((h: any) => (
              <div
                key={h.reviewFeeDetailId}
                className="p-4 bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <p><strong>Giá:</strong> {formatCurrency(h.pricePerReviewFee)}</p>
                <p><strong>% Reviewer:</strong> {(h.percentOfReviewer * 100).toFixed(0)}%</p>
                <p><strong>% Hệ thống:</strong> {(h.percentOfSystem * 100).toFixed(0)}%</p>
                <p><strong>Ngày áp dụng:</strong> {formatDate(h.appliedDate)}</p>

                <p className="mt-1">
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={
                      h.isCurrent
                        ? "text-green-600 font-semibold"
                        : "text-gray-500"
                    }
                  >
                    {h.isCurrent ? "Đang áp dụng" : "Cũ"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
)}
 
        </>
      )}
    </div>
  );
}
