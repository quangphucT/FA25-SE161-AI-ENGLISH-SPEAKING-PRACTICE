"use client";

import { useState } from "react";
import { useEnrolledCourseBuyers } from "@/features/admin/hooks/useAdminPurchase";
import type { Buyer } from "@/features/admin/services/adminPurchaseService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2,
  Users,
  Coins,
  BookOpen,
  Eye,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

export default function EnrollCourseManagement() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [isBuyersDialogOpen, setIsBuyersDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [buyersPageNumber, setBuyersPageNumber] = useState(1);
  const buyersPageSize = 5;

  // Fetch enrolled courses data
  const { data: coursesData, isPending: isLoading } = useEnrolledCourseBuyers(
    pageNumber,
    pageSize,
    buyersPageNumber,
    buyersPageSize
  );

  // Handle view buyers
  const handleViewBuyers = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsBuyersDialogOpen(true);
    setBuyersPageNumber(1);
  };

  // Process courses data from API response
  const courses = coursesData?.data?.items || [];

  // Calculate totals from all courses (not just current page)
  const totalCourses = coursesData?.data?.totalPackages || 0;
  const totalPurchases = courses.reduce((sum, course) => sum + (course.totalPurchase || 0), 0);
  const totalCoins = courses.reduce((sum, course) => sum + (course.totalAmountCoin || 0), 0);

  // Pagination for courses - API already handles pagination
  const totalPages = Math.ceil(totalCourses / pageSize);
  const paginatedCourses = courses; // API returns paginated results

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "A1":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "A2":
        return "bg-blue-200 text-blue-900 border-blue-300";
      case "B1":
        return "bg-green-100 text-green-800 border-green-200";
      case "B2":
        return "bg-green-200 text-green-900 border-green-300";
      case "C1":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "C2":
        return "bg-yellow-200 text-yellow-900 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Quản lý khóa học đã đăng ký
          </h1>
          <p className="text-gray-600 mt-2">
            Xem thống kê và chi tiết người đăng ký các khóa học
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số khóa học</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCourses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng lượt đăng ký</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPurchases}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng coin</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCoins.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách khóa học
          </h3>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Chưa có khóa học nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-16" />
                    <col className="w-auto" />
                    <col className="w-24" />
                    <col className="w-32" />
                    <col className="w-40" />
                    <col className="w-36" />
                    <col className="w-40" />
                  </colgroup>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        <div className="flex justify-center">STT</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex justify-center">Tên khóa học</div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex justify-center">Level</div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex justify-center">Giá</div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex justify-center">Số người đăng ký</div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex justify-center">Tổng coin</div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex justify-center">Thao tác</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCourses.map((course, index) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {(pageNumber - 1) * pageSize + index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex justify-center">
                            {course.title || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Badge
                              variant="outline"
                              className={getLevelBadgeColor(course.level)}
                            >
                              {course.level || "N/A"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-center gap-2">
                            <Coins className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            <span className="font-semibold text-yellow-700">
                              {course.price?.toLocaleString() || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-medium">
                              {course.totalPurchase || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-center gap-2">
                            <Coins className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="font-semibold text-green-700">
                              {course.totalAmountCoin?.toLocaleString() || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewBuyers(course.courseId)}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalCourses > 0 && (
                <div className="flex justify-between items-center px-4 py-4 border-t text-sm text-gray-700 mt-4">
                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <span className="font-medium">{pageSize}</span>
                  </div>

                  <div>
                    {totalCourses === 0
                      ? "0–0 of 0"
                      : `${(pageNumber - 1) * pageSize + 1}–${Math.min(pageNumber * pageSize, totalCourses)} of ${totalCourses}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageNumber === 1}
                      onClick={() => setPageNumber(pageNumber - 1)}
                      className="cursor-pointer"
                    >
                      Previous
                    </Button>

                    <span className="px-3 py-1 border rounded-md bg-gray-50">
                      {pageNumber} / {totalPages || 1}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageNumber >= totalPages}
                      onClick={() => setPageNumber(pageNumber + 1)}
                      className="cursor-pointer"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Buyers Detail Dialog */}
      <Dialog
        open={isBuyersDialogOpen}
        onOpenChange={(open) => {
          setIsBuyersDialogOpen(open);
          if (!open) {
            setSelectedCourseId(null);
            setBuyersPageNumber(1);
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Chi tiết người đăng ký khóa học
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (() => {
              // Find the selected course from the courses data
              const selectedCourse = courses.find(
                (course) => course.courseId === selectedCourseId
              );

              if (!selectedCourse) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Không tìm thấy thông tin khóa học</p>
                  </div>
                );
              }

              const buyers: Buyer[] = selectedCourse.buyers ?? [];
              const totalPurchase = selectedCourse.totalPurchase || 0;
              const totalAmountCoin = selectedCourse.totalAmountCoin || 0;
              const courseTitle = selectedCourse.title || " ";
              const courseLevel = selectedCourse.level || " ";

              // Calculate pagination info for buyers
              const totalBuyers = selectedCourse.totalBuyers || buyers.length;
              const totalPages = Math.ceil(totalBuyers / buyersPageSize);
              const startIndex = (buyersPageNumber - 1) * buyersPageSize;
              const endIndex = startIndex + buyersPageSize;
              const paginatedBuyers = buyers.slice(startIndex, endIndex);

              return (
                <div className="space-y-6">
                  {/* Course Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {courseTitle}
                    </h4>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={getLevelBadgeColor(courseLevel)}
                      >
                        Level: {courseLevel}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Giá: {selectedCourse.price?.toLocaleString() || 0} coin
                      </span>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border-l-4 border-l-blue-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng người đăng ký</p>
                          <p className="text-xl font-bold text-gray-900">
                            {totalPurchase}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-yellow-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Coins className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng coin</p>
                          <p className="text-xl font-bold text-gray-900">
                            {totalAmountCoin.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Buyers Table */}
                  {buyers.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Danh sách người đăng ký ({totalBuyers})
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>STT</TableHead>
                              <TableHead>Họ tên</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Số coin</TableHead>
                              <TableHead>Ngày đăng ký</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedBuyers.map((buyer: Buyer, index: number) => (
                              <TableRow key={buyer.userId}>
                                <TableCell className="font-medium">
                                  {startIndex + index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {buyer.fullName}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {buyer.email}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-yellow-600" />
                                    <span className="font-semibold text-yellow-700">
                                      {buyer.amountCoin}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {dayjs(buyer.createdAt).format("DD/MM/YYYY HH:mm")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalBuyers > 0 && (
                        <div className="flex justify-between items-center px-4 py-4 border-t text-sm text-gray-700 mt-4">
                          <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <span className="font-medium">{buyersPageSize}</span>
                          </div>

                          <div>
                            {totalBuyers === 0
                              ? "0–0 of 0"
                              : `${startIndex + 1}–${Math.min(endIndex, totalBuyers)} of ${totalBuyers}`}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={buyersPageNumber === 1}
                              onClick={() => setBuyersPageNumber(buyersPageNumber - 1)}
                              className="cursor-pointer"
                            >
                              Previous
                            </Button>

                            <span className="px-3 py-1 border rounded-md bg-gray-50">
                              {buyersPageNumber} / {totalPages}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={buyersPageNumber >= totalPages}
                              onClick={() => setBuyersPageNumber(buyersPageNumber + 1)}
                              className="cursor-pointer"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Chưa có người đăng ký khóa học này</p>
                    </div>
                  )}
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
