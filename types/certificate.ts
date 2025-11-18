import { Certificate } from "crypto";

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

export interface CertificateUploaded {
  certificateId: string;
  name: string;
  url: string;
}
export interface GetCertificationResponse {
  isSucess: boolean;
  data: CertificateUploaded[];
  message: string;
}