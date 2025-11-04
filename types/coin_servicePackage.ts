export interface CoinServicePackageResponse {
    isSuccess: boolean; 
    data: CoinPackage[];
    message: string;
  
}
export interface CoinPackage {
    servicePackageId: string;
    name: string;
    description: string; 
    price: number; 
    numberOfCoin: number; 
    bonusPercent: number;
    purchaseCount?: number; // Số lượt mua - dùng để xác định gói phổ biến

}

export interface BuyCoinRequest {
    servicePackageId: string;   
}
export interface PayOSCheckoutResponse {
  checkoutUrl: {
    checkoutUrl: string;  
    orderCode: number;
    vietQR: string;
    qrBase64: string;
  };
}
