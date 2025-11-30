export interface GetChapterFollowingCourseIdResponse {
  isSuccess: boolean;
  data: Chapter[];
  message: string;
}

export interface Chapter {
chapterId: string;
title: string;
description: string;
numberOfExercise: number;
createdAt: string;
}

export interface CreateChapterRequest {
courseId: string;
title: string;
description: string;
numberOfExercise: number;
}
export interface CreateChapterResponse {
isSuccess: boolean;
data: Chapter;
message: string;
}