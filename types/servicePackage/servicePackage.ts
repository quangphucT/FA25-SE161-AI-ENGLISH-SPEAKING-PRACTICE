export interface GetServicePackagesResponse {
    isSuccess: boolean;
    data: ServicePackage[];
    message: string;
}
export interface ServicePackage {
    servicePackageId: string;
    name: string;
    description: string;
    price: number;
    numberOfCoin: number;
    bonusPercent: number;
    status: string;
    createdAt: string;
    updatedAt: string;

}