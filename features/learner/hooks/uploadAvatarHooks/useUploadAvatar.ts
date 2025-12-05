import { useMutation } from "@tanstack/react-query";
import {
  uploadAvatarService,
  UploadAvatarResponse,
} from "../../services/uploadAvatarService/uploadAvatar";

export const useUploadAvatar = () => {
  return useMutation<UploadAvatarResponse, Error, File>({
    mutationFn: (file) => uploadAvatarService(file),
  });
};
