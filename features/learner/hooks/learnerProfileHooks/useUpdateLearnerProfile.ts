import { useMutation } from "@tanstack/react-query";
import {
  editLearnerProfileService,
  EditLearnerProfileRequest,
  EditLearnerProfileResponse,
} from "../../services/learnerProfileService/learnerProfile";

export const useEditLearnerProfile = () => {
  return useMutation<EditLearnerProfileResponse, Error, EditLearnerProfileRequest>(
    {
      mutationFn: (payload) => editLearnerProfileService(payload),
    }
  );
};
