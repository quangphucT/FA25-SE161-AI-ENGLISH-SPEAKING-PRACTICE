export type UploadCertificateRequest = FormData;


export interface UploadCertificateResponse {
   isSucess: boolean;
  data: {
    certificateId: string;
    name: string;
    url: string;
    newStatus: "Pending" | "Approved" | "Rejected"; // nếu biết trước ENUM thì để luôn
  };
  businessCode: number;
  message: string;
}