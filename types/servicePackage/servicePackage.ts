export interface GetServicePackagesResponse {
    isSucess: boolean;
    data: {
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        items: ServicePackage[];
    };
    businessCode: string;
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