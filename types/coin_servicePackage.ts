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

    checkoutUrl: string;  
    orderCode: string;
    qrCode: string;
    qrBase64: string;

}

export interface CreateCoinServicePackageRequest {
    name: string;
    description: string; 
    price: number; 
    numberOfCoin: number; 
    bonusPercent: number;
    status: "Active" | "Inactive";
}
export interface CreateCoinServicePackageResponse {
    isSuccess: boolean; 
    data: CoinPackage;
    message: string;
}
export interface DeleteCoinServicePackageResponse {
    isSuccess: boolean; 
    message: string;
}
export interface UpdateCoinServicePackageRequest {
  servicePackageId: string;
  name: string;
  description: string;
  price: number;
  numberOfCoin: number;
  bonusPercent: number;
  status: "Active" | "Inactive";
}

export interface UpdateCoinServicePackageResponse {
  isSuccess: boolean;
  message: string;
}
export interface CancelBuyingCoinRequest{
    orderCode: string;
}
export interface CancelBuyingCoinResponse{
    message: string;
}
export interface getOrderCodeStatusResponse{
    orderCode: string;
    status: string;
}