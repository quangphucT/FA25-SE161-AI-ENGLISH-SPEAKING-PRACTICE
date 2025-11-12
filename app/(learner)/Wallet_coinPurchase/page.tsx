"use client";
import PaymentInforSection from "@/components/PaymentInforSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useBuyingCoinServicePackages } from "@/features/learner/hooks/servicePackages/useBuyingServicePackageMutation";
import { useGetCoinServicePackage } from "@/hooks/coin-hooks/useGetCoinServicePackage";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { ChevronRight, Coins, Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useGetOrderCodeStatusQuery } from "@/features/learner/hooks/servicePackages/useGetStatusOfServicePackageAfterChart";
import { useCancelBuyingCoinServicePackages } from "@/features/learner/hooks/servicePackages/useCancelBuyingServicePackageMutation";

const WalletCoinPurchase = () => {
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const { refetch: refetchOrderStatus } = useGetOrderCodeStatusQuery(orderCode || "");
  const {mutate: cancelBuyingCoin} = useCancelBuyingCoinServicePackages();
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const { data: userData } = useGetMeQuery();
  const { data: coinPackages } = useGetCoinServicePackage();
  const { mutate: buyCoin, isPending } = useBuyingCoinServicePackages();

  const handleBuyCoin = (servicePackageId: string) => {
    // set loading for this package id so the button shows spinner/disabled state
    setLoadingPackageId(servicePackageId);
    buyCoin(
      { servicePackageId },
      {
        onSuccess: (data) => {
          setQrCodeImage(data?.qrBase64);
          setOrderCode(data?.orderCode);
          // reset any previous image error state (no-op since we removed imageError)
          setShowCoinModal(false);
          setShowQrModal(true);
          setIsPollingStatus(true);
        },
        onSettled: () => {
          // always clear loading state when mutation is settled
          setLoadingPackageId(null);
        },
      }
    );
  };

  const clearPaymentState = (options?: { reopenPackages?: boolean }) => {
    setShowQrModal(false);
    setQrCodeImage(null);
    setOrderCode(null);
    // no image error state to reset
    setIsPollingStatus(false);
    if (options?.reopenPackages) setShowCoinModal(true);
  };

  useEffect(() => {
    if (!orderCode || !showQrModal) return;
    if (!isPollingStatus) return;

    const poll = async () => {
      try {
        const res = await refetchOrderStatus();
        const status: string | undefined = res.data?.status;
        if (!status) return;
        if (status === "Paid" || status === "Cancelled") {
          // Dừng polling ngay
          setIsPollingStatus(false);
          if (status === "Paid") {
            toast.success("Thanh toán thành công! Coin sẽ được cộng sớm.");
            clearPaymentState();
          } else if (status === "Cancelled") {
            toast.error("Giao dịch đã bị hủy.");
            clearPaymentState({ reopenPackages: true });
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    poll();
    const intervalId = setInterval(poll, 3000);
    return () => clearInterval(intervalId);
  }, [orderCode, showQrModal, isPollingStatus, refetchOrderStatus]);

  // Copy current QR (data URL) to clipboard
  const copyQrToClipboard = async () => {
    if (!qrCodeImage) return;
    try {
      await navigator.clipboard.writeText(qrCodeImage);
      toast.success("Đã sao chép QR vào clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Không thể sao chép QR");
    }
  };

  // Download current QR as an image file
  const downloadQrImage = () => {
    if (!qrCodeImage) return;
    const link = document.createElement("a");
    link.href = qrCodeImage;
    link.download = "speakai_qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">💰 Ví & Nạp Coin</h3>
          <p className="text-sm text-gray-600">
            Quản lý số dư và mua coin để mở khoá các khoá học Premium
          </p>
        </div>
      </div>

      {/* Current Balance Card - Compact */}
      <Card className="mb-6 p-5 bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Số dư hiện tại</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {userData?.coinBalance || 0}
                </h3>
                <span className="text-sm text-gray-600 font-semibold">Coin</span>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs font-semibold cursor-pointer hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-700 transition-colors"
          >
            Lịch sử
          </Button>
        </div>
      </Card>

      {/* Section Title */}
      <div className="mb-5">
        <h4 className="text-lg font-bold text-gray-900 mb-1">
          Chọn gói Coin
        </h4>
        <p className="text-xs text-gray-600">
          Gói càng lớn, bonus càng nhiều 🎁
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coinPackages?.data?.map((pkg, index) => {
          const hasBonus = pkg.bonusPercent > 0;
          const isPopular = index === 1; // Middle package
          const isLoading = loadingPackageId === pkg.servicePackageId;

          return (
            <div key={pkg.servicePackageId} className="relative">
              <Card className={`relative overflow-hidden transition-all duration-300 h-full bg-white
                ${isPopular 
                  ? 'border border-blue-500 shadow-lg hover:shadow-xl' 
                  : 'border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }
              `}>
                {/* Popular Badge - Top Left */}
                {isPopular && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      PHỔ BIẾN
                    </div>
                  </div>
                )}

                {/* Bonus Badge - Top Right */}
                {hasBonus && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      +{pkg.bonusPercent}%
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Package Header */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Coin Display - Compact */}
                  <div className="mb-4 text-center py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Coins className="w-6 h-6 text-yellow-500" />
                      <span className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        {pkg.numberOfCoin.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Coin</p>
                  </div>

                  {/* Price Section - Compact */}
                  <div className="mb-4 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black text-gray-900">
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-base text-gray-500 font-semibold">₫</span>
                    </div>
                    {hasBonus && (
                      <p className="text-[10px] text-green-600 font-semibold mt-1">
                        Tiết kiệm {pkg.bonusPercent}%
                      </p>
                    )}
                  </div>

                  {/* Buy Button - Clean */}
                  <Button
                    onClick={() => handleBuyCoin(pkg.servicePackageId)}
                    disabled={isLoading}
                    className="w-full h-10 cursor-pointer font-semibold text-sm transition-all duration-300 bg-blue-50 hover:bg-blue-200 text-black rounded-full shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Mua ngay
                      </>
                    )}
                  </Button>
                </div>

                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
              </Card>
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {!coinPackages?.data && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải các gói coin...</p>
        </div>
      )}

      {/* Payment Info Section */}
      <div className="mt-8">
        <PaymentInforSection />
      </div>

      {/* Coin Purchase Modal */}
      <Dialog open={showCoinModal} onOpenChange={setShowCoinModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Nạp Coin</DialogTitle>
          </VisuallyHidden>

          {/* Simple Header */}
          <div className="border-b pb-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">💰 Nạp Coin</h3>
            <p className="text-gray-500 text-sm mt-1">
              Chọn gói coin phù hợp để mở khoá các khoá học Premium
            </p>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coinPackages?.data?.map((pkg, index) => {
              const hasBonus = pkg.bonusPercent > 0;
              const isPopular = index === 1;
              const isLoading = loadingPackageId === pkg.servicePackageId;

              return (
                <div key={pkg.servicePackageId} className="relative">
                  <Card className={`relative overflow-hidden transition-all duration-300 h-full  bg-white
                    ${isPopular 
                      ? 'border border-blue-500 shadow-lg hover:shadow-xl' 
                      : 'border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                    }
                  `}>
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                          PHỔ BIẾN
                        </div>
                      </div>
                    )}

                    {/* Bonus Badge */}
                    {hasBonus && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                          +{pkg.bonusPercent}%
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Package Name */}
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {pkg.name}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Coin Display */}
                      <div className="mb-4 text-center py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Coins className="w-6 h-6 text-yellow-500" />
                          <span className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            {pkg.numberOfCoin.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Coin</p>
                      </div>

                      {/* Price Section */}
                      <div className="mb-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-black text-gray-900">
                            {pkg.price.toLocaleString()}
                          </span>
                          <span className="text-base text-gray-500 font-semibold">₫</span>
                        </div>
                        {hasBonus && (
                          <p className="text-[10px] text-green-600 font-semibold mt-1">
                            Tiết kiệm {pkg.bonusPercent}%
                          </p>
                        )}
                      </div>

                      {/* Buy Button */}
                      <Button
                        onClick={() => handleBuyCoin(pkg.servicePackageId)}
                        disabled={isLoading}
                        className="w-full h-10 cursor-pointer font-semibold text-sm transition-all duration-300 bg-blue-100 hover:bg-blue-200 text-black rounded-full shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-4 h-4 mr-2" />
                            Mua ngay
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Loading State */}
          {!coinPackages?.data && (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">
                Đang tải các gói coin...
              </p>
            </div>
          )}

          {/* Payment Info */}
          <div className="mt-6 border-t pt-6">
            <PaymentInforSection />
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Payment Modal */}
      <Dialog
        open={showQrModal}
        onOpenChange={(open) => {
          if (!open) {
            // User closed via outside click or escape
            if (orderCode) {
              cancelBuyingCoin({ orderCode });
            }
            setQrCodeImage(null);
            setOrderCode(null);
            // no image error state to reset
            setIsPollingStatus(false);
          }
          setShowQrModal(open);
        }}
      >
        <DialogContent className="max-w-3xl">
          <VisuallyHidden>
            <DialogTitle>QR Code Thanh Toán</DialogTitle>
          </VisuallyHidden>

          <div className="p-6">
            <div className="flex items-start gap-6">
              {/* LEFT: QR container */}
              <div className="flex-shrink-0">
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 flex items-center justify-center">
                  <div className="w-72 h-72 bg-white p-4 rounded-xl flex flex-col items-center justify-center">
                    {qrCodeImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrCodeImage}
                        alt="QR Code thanh toán"
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                      </div>
                    )}
                    {/* {orderCode && (
                      <div className="mt-3 w-full text-center">
                        <p className="text-xs text-gray-500">
                          Mã đơn: <span className="font-medium">{orderCode}</span>
                        </p>
                        <p className="text-xs mt-1">
                          Trạng thái: {orderStatusData?.status ? (
                            <span className="font-semibold text-blue-600">{orderStatusData.status}</span>
                          ) : (
                            <span className="text-gray-400">Đang kiểm tra...</span>
                          )}
                        </p>
                        {isPollingStatus && !FINAL_STATUSES.includes(orderStatusData?.status as FinalStatus) && (
                          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Đang cập nhật thanh toán...</span>
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>

                  {/* Scanning Line */}
                  <div className="absolute inset-0 pointer-events-none rounded-3xl">
                    <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-full" />
                  </div>
                </div>

                {/* small actions */}
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={downloadQrImage}
                    className="flex-1 cursor-pointer"
                  >
                    Tải xuống
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={copyQrToClipboard}
                    className="flex-1 cursor-pointer"
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              {/* RIGHT: Payment details / instructions */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Quét mã QR để thanh toán
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mở ứng dụng ngân hàng, chọn quét mã QR và quét mã phía
                        bên trái.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Số tiền</p>
                      <p className="font-semibold text-gray-900">
                        Xác nhận trong app ngân hàng
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Giao dịch sẽ được ghi có tự động khi hoàn tất thanh toán.
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Hướng dẫn nhanh
                    </p>
                    <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                      <li>Mở app ngân hàng hoặc ví có hỗ trợ quét QR</li>
                      <li>Chọn chức năng Quét QR</li>
                      <li>Hướng camera tới mã QR bên trái</li>
                      <li>Xác nhận thanh toán trong app</li>
                    </ol>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="inline-block px-3 py-1 rounded bg-green-50 text-green-800 font-medium">
                      An toàn • mã hóa
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (orderCode) {
                        cancelBuyingCoin({ orderCode });
                      }
                      setShowQrModal(false);
                      setQrCodeImage(null);
                      setOrderCode(null);
                      // no image error state to reset
                      setIsPollingStatus(false);
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    Đóng
                  </Button>

                  <Button
                    onClick={() => {
                      if (orderCode) {
                        cancelBuyingCoin({ orderCode });
                      }
                      setShowQrModal(false);
                      setShowCoinModal(true);
                      setQrCodeImage(null);
                      setOrderCode(null);
                      // no image error state to reset
                      setIsPollingStatus(false);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Chọn gói khác
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading overlay kept so user knows mutation is in progress */}
            {isPending && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Đang xử lý...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletCoinPurchase;
