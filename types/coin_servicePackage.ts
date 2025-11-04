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
export interface BuyCoinResponse {
    isSuccess: boolean; 
    message: string;
    
}