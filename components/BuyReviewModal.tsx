"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, CheckCircle2, Star, Coins } from "lucide-react";
import { useLearnerBuyReview, useLearnerBuyReviewBuyRecord } from "@/features/learner/hooks/useLearnerBuyReview";
import { useState } from "react";
import { useLearnerReviewFeePackagesQuery } from "@/features/learner/hooks/useLearnerReviewFee";
import { LearnerReviewFeePackage } from "@/features/learner/services/learnerReviewFeeService";

interface BuyReviewModalProps {
  open: boolean;
  onClose: () => void;
  learnerAnswerId?: string;
  recordId?: string; // For buyRecord action
  questionId?: string;
}

const BuyReviewModal = ({ open, onClose, learnerAnswerId, recordId }: BuyReviewModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<LearnerReviewFeePackage | null>(null);
  
  // Auto-detect action type based on available props
  const defaultActionType = recordId ? "buyRecord" : "buy";
  const [actionType, setActionType] = useState<"buy" | "buyRecord">(defaultActionType);

  // Get review fee packages using learner hook
  const { data: packagesData, isLoading: isLoadingMenu } = useLearnerReviewFeePackagesQuery();
  
  // Extract packages from response - get reviewFeeId, numberOfReview
  const reviewPackages: LearnerReviewFeePackage[] = packagesData?.data?.items?.filter(
    (pkg) => pkg.currentPricePolicy // Only show packages with active price policy
  ) || [];

  // Check if current action type is valid
  const canBuy = actionType === "buy" ? !!learnerAnswerId : !!recordId;

  // Buy review mutation - dùng useLearnerBuyReview để mua
  const { mutateAsync: buyReview, isPending: isBuyingReview } = useLearnerBuyReview();

  // Buy review record mutation
  const { mutateAsync: buyReviewRecord, isPending: isBuyingRecord } = useLearnerBuyReviewBuyRecord();

  const handleBuy = async () => {
    if (!selectedPackage) {
      return;
    }

    if (actionType === "buy" && !learnerAnswerId) {
      return;
    }

    if (actionType === "buyRecord" && !recordId) {
      return;
    }

    try {
      if (actionType === "buy") {
        await buyReview({
          learnerAnswerId: learnerAnswerId!,
          reviewFeeId: selectedPackage.reviewFeeId,
        });
      } else {
        await buyReviewRecord({
          recordId: recordId!,
          reviewFeeId: selectedPackage.reviewFeeId,
        });
      }
      onClose();
      setSelectedPackage(null);
    } catch (error) {
      // Error is handled by the hook
      console.error("Buy review error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const isProcessing = isBuyingReview || isBuyingRecord;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Mua đánh giá phát âm
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Chọn gói đánh giá phù hợp để nhận phản hồi chi tiết về phát âm của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
            {/* Action Type Selection */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <Button
                variant={actionType === "buy" ? "default" : "outline"}
                onClick={() => {
                  setActionType("buy");
                  setSelectedPackage(null);
                }}
                className="flex-1"
                disabled={isProcessing || !learnerAnswerId}
              >
                <Star className="w-4 h-4 mr-2" />
                Mua đánh giá mới
                {!learnerAnswerId && " (Không khả dụng)"}
              </Button>
              <Button
                variant={actionType === "buyRecord" ? "default" : "outline"}
                onClick={() => {
                  setActionType("buyRecord");
                  setSelectedPackage(null);
                }}
                className="flex-1"
                disabled={isProcessing || !recordId}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mua đánh giá record
                {!recordId && " (Không khả dụng)"}
              </Button>
            </div>

            {/* Warning message if current action type is not available */}
            {!canBuy && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <p>
                      {actionType === "buy"
                        ? "Bạn cần có thông tin câu trả lời để mua đánh giá mới."
                        : "Bạn cần có thông tin record để mua đánh giá record."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoadingMenu ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Đang tải danh sách gói...</span>
              </div>
            ) : reviewPackages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Hiện tại không có gói đánh giá nào khả dụng.
              </div>
            ) : (
              <>
                {/* Package List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviewPackages.map((pkg) => {
                    const pricePerReview = pkg.currentPricePolicy?.pricePerReviewFee || 0;
                    const totalPrice = pricePerReview * pkg.numberOfReview;
                    
                    return (
                      <Card
                        key={pkg.reviewFeeId}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPackage?.reviewFeeId === pkg.reviewFeeId
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : "hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                              {pkg.numberOfReview} đánh giá
                            </CardTitle>
                            {selectedPackage?.reviewFeeId === pkg.reviewFeeId && (
                              <Badge className="bg-blue-600">Đã chọn</Badge>
                            )}
                          </div>
                          <CardDescription>
                            {pricePerReview.toLocaleString("vi-VN")} VND / đánh giá
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Coins className="w-4 h-4" />
                              <span className="text-sm">Tổng giá:</span>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              {formatCurrency(totalPrice)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleBuy}
                    disabled={!selectedPackage || isProcessing || !canBuy}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        {actionType === "buy" ? (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Mua đánh giá
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mua đánh giá record
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Lưu ý:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          {actionType === "buy"
                            ? "Đánh giá mới sẽ được thực hiện bởi reviewer chuyên nghiệp"
                            : "Đánh giá record sẽ được thực hiện trên bản ghi âm hiện tại"}
                        </li>
                        <li>Thanh toán sẽ được trừ từ số coin trong tài khoản của bạn</li>
                        <li>Kết quả đánh giá sẽ được gửi đến bạn sau khi hoàn tất</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyReviewModal;
