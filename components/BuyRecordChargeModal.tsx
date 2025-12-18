"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, FileAudio, Coins, Mic } from "lucide-react";
import { useLearnerBuyRecordCharge } from "@/features/learner/hooks/useLearnerRecord";
import { useState } from "react";
import { useAdminRecordChargeActive } from "@/features/admin/hooks/useAdminRecordCharge";
import type { RecordChargeActiveItem } from "@/features/admin/services/adminRecordChargeService";

interface BuyRecordChargeModalProps {
  open: boolean;
  onClose: () => void;
  folderId: string; // Required for buying record charge
}

const BuyRecordChargeModal = ({ open, onClose, folderId }: BuyRecordChargeModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<RecordChargeActiveItem | null>(null);

  // Get active record charge packages using admin hook
  const { data: packagesData, isLoading: isLoadingMenu } = useAdminRecordChargeActive();
  
  // Extract packages from response
  const recordChargePackages: RecordChargeActiveItem[] = packagesData?.data || [];

  // Buy record charge mutation
  const { mutateAsync: buyRecordCharge, isPending: isBuying } = useLearnerBuyRecordCharge();

  const handleBuy = async () => {
    if (!selectedPackage || !folderId) {
      return;
    }

    try {
      await buyRecordCharge({
        folderId: folderId,
        recordChargeId: selectedPackage.recordChargeId,
      });
      onClose();
      setSelectedPackage(null);
    } catch (error) {
      // Error is handled by the hook
      console.error("Buy record charge error:", error);
    }
  };

  const isProcessing = isBuying;
  const canBuy = !!folderId && !!selectedPackage;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-6 h-6 text-purple-600" />
            Mua gói ghi âm
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Chọn gói ghi âm phù hợp để có thêm lượt ghi âm cho folder của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning message if folderId is not available */}
          {!folderId && (
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
                  <p>Bạn cần có thông tin folder để mua gói ghi âm.</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingMenu ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Đang tải danh sách gói...</span>
            </div>
          ) : recordChargePackages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileAudio className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Hiện tại không có gói ghi âm nào khả dụng.</p>
            </div>
          ) : (
            <>
              {/* Package List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recordChargePackages.map((pkg) => {
                  const pricePerRecord = pkg.amountCoin / pkg.allowedRecordCount;
                  
                  return (
                    <Card
                      key={pkg.recordChargeId}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedPackage?.recordChargeId === pkg.recordChargeId
                          ? "ring-2 ring-purple-500 bg-purple-50"
                          : "hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <FileAudio className="w-5 h-5 text-purple-600" />
                            {pkg.allowedRecordCount} lượt ghi âm
                          </CardTitle>
                          {selectedPackage?.recordChargeId === pkg.recordChargeId && (
                            <Badge className="bg-purple-600">Đã chọn</Badge>
                          )}
                        </div>
                        <CardDescription>
                          {pricePerRecord.toFixed(1)} Coin / lượt ghi âm
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Coins className="w-4 h-4" />
                              <span className="text-sm">Tổng giá:</span>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              {pkg.amountCoin.toLocaleString("vi-VN")} Coin
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm text-gray-500">Số lượt ghi âm:</span>
                            <span className="text-sm font-semibold text-purple-700">
                              {pkg.allowedRecordCount} lượt
                            </span>
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FileAudio className="w-4 h-4 mr-2" />
                      Mua gói ghi âm
                    </>
                  )}
                </Button>
              </div>

              {/* Info Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-purple-600"
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
                  <div className="text-sm text-purple-800">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Gói ghi âm sẽ được thêm vào folder hiện tại của bạn</li>
                      <li>Thanh toán sẽ được trừ từ số coin trong tài khoản của bạn</li>
                      <li>Bạn có thể sử dụng các lượt ghi âm này để tạo record mới trong folder</li>
                      <li>Số lượt ghi âm sẽ được cộng vào số lượt còn lại của folder</li>
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

export default BuyRecordChargeModal;

