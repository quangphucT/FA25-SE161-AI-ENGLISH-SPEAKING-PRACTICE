"use client";
import PaymentInforSection from "@/components/PaymentInforSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useBuyingCoinServicePackages } from "@/features/learner/hooks/servicePackages/useBuyingServicePackageMutation";
import { useGetCoinServicePackage } from "@/hooks/coin-hooks/useGetCoinServicePackage";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { Coins, Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useGetOrderCodeStatusQuery } from "@/features/learner/hooks/servicePackages/useGetStatusOfServicePackageAfterChart";
import { useCancelBuyingCoinServicePackages } from "@/features/learner/hooks/servicePackages/useCancelBuyingServicePackageMutation";
import { useGetDepositHistoryQuery } from "@/features/learner/hooks/coinHistoryHooks/useGetCoinDepositHistory";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const WalletCoinPurchase = () => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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

const { data: depositHistory, isLoading: isLoadingHistory } = useGetDepositHistoryQuery();


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
    <div className="max-w-5xl mx-auto">
      {/* Hero Balance Section */}
      <div className="relative mb-10 p-8  rounded-3xl overflow-hidden">
        {/* Decorative elements */}

        
        <div className="relative flex items-center justify-between py-6 px-6 rounded-[15px] bg-[rgba(0,0,0,0.05)]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Số dư của bạn</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-yellow-500">{userData?.coinBalance || 0}</span>
                  <span className="text-yellow-500 font-semibold">COIN</span>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm">Nạp thêm coin để mở khóa các khóa học Premium!</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}
            className="bg-white rounded-3xl text-black  border-gray-300 cursor-pointer"
          >
             Lịch sử giao dịch
          </Button>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔥 Gói Coin</h2>
          <p className="text-gray-500 mt-1">Chọn gói phù hợp với bạn</p>
        </div>
      </div>

      {/* Coin Packages - Premium Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coinPackages?.data?.map((pkg) => {
          const isLoading = loadingPackageId === pkg.servicePackageId;
          
          return (
            <div
              key={pkg.servicePackageId}
              className="group bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-violet-300"
            >
              {/* Coin Display - Highlighted */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-amber-200/50">
                  <Coins className="w-8 h-8 text-amber-600" />
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl py-3 px-4 relative">
                  {pkg.bonusPercent > 0 && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      +{pkg.bonusPercent}%
                    </div>
                  )}
                  <p className="text-4xl font-black text-amber-600 mb-0.5">
                    {pkg.numberOfCoin.toLocaleString()}
                  </p>
                  {pkg.bonusPercent > 0 && (
                    <p className="text-xs font-medium text-green-600 mb-1">
                      + {Math.floor(pkg.numberOfCoin * pkg.bonusPercent / 100).toLocaleString()} coin bonus
                    </p>
                  )}
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide">Coin</p>
                </div>
              </div>

              {/* Package Info */}
              <div className="text-center mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{pkg.description}</p>
              </div>

              {/* Price - Highlighted */}
              <div className="text-center mb-5 py-3  rounded-xl">
                <span className="text-2xl font-black text-amber-600">{pkg.price.toLocaleString()}</span>
                <span className="text-amber-600 font-semibold ml-1">₫</span>
              </div>

              {/* Buy Button */}
              <Button
                onClick={() => handleBuyCoin(pkg.servicePackageId)}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 cursor-pointer font-semibold rounded-2xl border-2 border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Mua ngay"
                )}
              </Button>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>Nạp Coin</DialogTitle>
          </VisuallyHidden>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">🔥 Chọn gói Coin</h3>
            <p className="text-gray-500 mt-1">Mở khoá các khoá học Premium ngay!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {coinPackages?.data?.map((pkg) => {
              const isLoading = loadingPackageId === pkg.servicePackageId;

              return (
                <div
                  key={pkg.servicePackageId}
                  className="bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-lg hover:border-violet-200"
                >
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-3 shadow-sm">
                      <Coins className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 relative">
                      {pkg.bonusPercent > 0 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                          +{pkg.bonusPercent}%
                        </div>
                      )}
                      <p className="text-2xl font-black text-amber-600">{pkg.numberOfCoin.toLocaleString()}</p>
                      {pkg.bonusPercent > 0 && (
                        <p className="text-[10px] font-medium text-green-600">
                          + {Math.floor(pkg.numberOfCoin * pkg.bonusPercent / 100).toLocaleString()} bonus
                        </p>
                      )}
                      <p className="text-[10px] font-semibold text-amber-500 uppercase">Coin</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center mb-3">{pkg.name}</p>
                  <div className="text-center mb-4 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                    <span className="text-lg font-bold text-violet-600">{pkg.price.toLocaleString()}</span>
                    <span className="text-violet-500 ml-1">₫</span>
                  </div>
                  <Button
                    onClick={() => handleBuyCoin(pkg.servicePackageId)}
                    disabled={isLoading}
                    className="w-full cursor-pointer font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mua ngay"}
                  </Button>
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
                    <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
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


             {/* =================== ✅ POPUP LỊCH SỬ =================== */}
  <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
  <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden p-0">
    <VisuallyHidden>
      <DialogTitle>Lịch sử nạp Coin</DialogTitle>
    </VisuallyHidden>

    {/* ===== HEADER ===== */}
    <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-900">📜 Lịch sử nạp Coin</h3>
        <p className="text-sm text-gray-600 mt-1">
          Theo dõi toàn bộ giao dịch nạp Coin của bạn
        </p>
      </div>

    
    </div>

    {/* ===== BODY ===== */}
    <div className="p-6 overflow-y-auto max-h-[65vh] bg-white">
      {isLoadingHistory ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : depositHistory?.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Chưa có giao dịch nào
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-right">Số tiền</th>
                <th className="px-4 py-3 text-right">Coin</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thời gian</th>
                <th className="px-4 py-3 text-left">Mô tả</th>
              </tr>
            </thead>

            <tbody>
              {depositHistory?.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.orderCode}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    {item.amountMoney.toLocaleString()} ₫
                  </td>

                  <td className="px-4 py-3 text-right font-semibold text-orange-600">
                    +{item.amountCoin}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        item.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-center text-gray-600">
                    {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                  </td>

                  <td className="px-4 py-3 max-w-[260px] truncate text-gray-600">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>



    </div>




  );


};

export default WalletCoinPurchase;
