"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useReviewReviewPending, useReviewReviewSubmit, useReviewReviewStatistics } from "@/features/reviewer/hooks/useReviewReview";
import { useReviewFeedback } from "@/features/reviewer/hooks/useReviewFeedback";
import { ReviewerFeedbackHistory } from "@/features/reviewer/services/reviewerFeedbackService";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { signalRService } from "@/lib/realtime/realtime";
import { ReviewCompleted } from "@/lib/realtime/realtime";
import { useRealtime } from "@/providers/RealtimeProvider";
import { CircleCheck, Mic, MessageSquare, User, FileText, Calendar, Star, CheckCircle2, XCircle, Clock, Headphones, Play, Coins } from "lucide-react";
import { uploadAudioToCloudinary } from "@/utils/upload";
import { formatAiFeedbackHtml } from "@/utils/formatAiFeedback";
import { toast } from "sonner";
import { z } from "zod";

const reviewFormSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Feedback cannot be empty"),
  score: z
    .coerce.number()
    .int("Score must be an integer")
    .min(1, "Score must be between 1 and 10")
    .max(10, "Score must be between 1 and 10"),
});

// Helper function to format dates
const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    // Format manually to ensure dd/MM/yyyy format
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    
    let formatted = `${day}/${month}/${year}`;
    
    if (includeTime) {
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const seconds = String(dateObj.getSeconds()).padStart(2, "0");
      formatted += ` ${hours}:${minutes}:${seconds}`;
    }
    
    return formatted;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const StatisticsForMentor = () => {
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  
  // Pagination state for "Answers needing review"
  const [pendingPageNumber, setPendingPageNumber] = useState(1);
  const [pendingPageSize] = useState(5); // Show 5 pending reviews per page
  
  // Pagination state for feedback summary
  const [feedbackPageNumber, setFeedbackPageNumber] = useState(1);
  const [feedbackPageSize] = useState(5); // Show 5 feedbacks in summary
  
  // Pagination state for modal (all feedback)
  const [modalPageNumber, setModalPageNumber] = useState(1);
  const [modalPageSize] = useState(10); // Show 10 feedbacks per page in modal
  
  // Fetch statistics from API
  const { data: statisticsData, isLoading: isLoadingStats, isError: isErrorStats } = useReviewReviewStatistics();
  
  // Fetch feedback from API with pagination
  const { data: feedbackData, isLoading: isLoadingFeedback } = useReviewFeedback(feedbackPageNumber, feedbackPageSize);
  const { data: allFeedbackData, isLoading: isLoadingAllFeedback } = useReviewFeedback(modalPageNumber, modalPageSize);
  
  // Map API response to mentorStats format
  const mentorStats = useMemo(() => {
    if (!statisticsData?.isSucess || !statisticsData?.data) {
      return {
        totalFeedbacks: 0,
        totalReviews: 0,
        avgRating: 0,
        AmountOfMoneyEarned: "0",
      };
    }
    
    const stats = statisticsData.data;
    return {
      totalFeedbacks: stats.totalFeedback || 0,
      totalReviews: stats.totalReviews || 0,
      avgRating: stats.averageRating || 0,
      AmountOfMoneyEarned: (stats.coinBalance || 0).toLocaleString("vi-VN"),
    };
  }, [statisticsData]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Map API feedback data to component format
  const feedbackSummary = useMemo(() => {
    if (!feedbackData?.isSucess || !feedbackData?.data?.items) return [];
    
    return feedbackData.data.items.map((item) => ({
      id: item.feedbackId,
      studentName: item.learnerName,
      rating: item.rating,
      comment: item.content,
      sessionType: item.reviewType || "Pronunciation review",
      date: formatDate(item.createdAt),
      avatar: getInitials(item.learnerName),
    }));
  }, [feedbackData]);

  // Calculate pagination info for summary
  const feedbackPagination = useMemo(() => {
    if (!feedbackData?.data) {
      return { totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const totalItems = feedbackData.data.totalItems || 0;
    const totalPages = Math.ceil(totalItems / feedbackPageSize);
    return {
      totalPages,
      currentPage: feedbackPageNumber,
      totalItems,
    };
  }, [feedbackData, feedbackPageNumber, feedbackPageSize]);

  const feedbackStartItem =
    feedbackPagination.totalItems === 0
      ? 0
      : (feedbackPageNumber - 1) * feedbackPageSize + 1;
  const feedbackEndItem = Math.min(
    feedbackPageNumber * feedbackPageSize,
    feedbackPagination.totalItems
  );

  // Calculate pagination info for modal
  const modalPagination = useMemo(() => {
    if (!allFeedbackData?.data) {
      return { totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const totalItems = allFeedbackData.data.totalItems || 0;
    const totalPages = Math.ceil(totalItems / modalPageSize);
    return {
      totalPages,
      currentPage: modalPageNumber,
      totalItems,
    };
  }, [allFeedbackData, modalPageNumber, modalPageSize]);

  const [reviewedAnswers, setReviewedAnswers] = useState<string[]>([]);
  // Track numberOfReview updates from SignalR events
  const [numberOfReviewUpdates, setNumberOfReviewUpdates] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<{ 
    id: string; 
    questionText: string; 
    audioUrl: string; 
    submittedAt: string; 
    type: string; 
    aiFeedback: string;
    transcribedText: string;
    aiScore: number;
    learnerFullName: string;
    expectedReviewerCoin: number;
  } | null>(null);
  const [isFeedbackDetailModalOpen, setIsFeedbackDetailModalOpen] = useState(false);
  const [selectedFeedbackDetail, setSelectedFeedbackDetail] = useState<ReviewerFeedbackHistory | null>(null);
  const [comment, setComment] = useState("");
  const [score, setScore] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordedAudioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");
  const [rewardMessage, setRewardMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  // Fetch pending reviews with pagination
  const { data: pendingReviewsData, isLoading, error } = useReviewReviewPending(pendingPageNumber, pendingPageSize);
  
  // Get user info for reviewerProfileId
  const { data: userData } = useGetMeQuery();
  
  // Submit review mutation
  const submitReviewMutation = useReviewReviewSubmit();

  // Get SignalR connection state from RealtimeProvider
  const { isConnected } = useRealtime();

  const handleOpenReviewModal = (reviewId: string) => {
    const review = pendingReviews?.find((r) => r.id === reviewId);
    if (review) {
      setSelectedReview({
        id: review.id,
        questionText: review.questionText,
        audioUrl: review.audioUrl,
        submittedAt: review.submittedAt,
        type: review.type,
        aiFeedback: review.aiFeedback,
        transcribedText: review.transcribedText,
        aiScore: review.aiScore,
        learnerFullName: review.learnerFullName,
        expectedReviewerCoin: review.expectedReviewerCoin,
      });
      setIsModalOpen(true);
      setComment("");
      setScore("");
      setShowAnswer(false);
      setShowRewardForm(false);
      setRewardAmount("");
      setRewardMessage("");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
    setShowAnswer(false);
    setComment("");
    setScore("");
    setShowRewardForm(false);
    setRewardAmount("");
    setRewardMessage("");
    setRecording(false);
    setIsSubmittingReview(false);
    recordedAudioBlobMp3Ref.current = null;
    audioChunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (recordedAudioPreviewRef.current) {
      recordedAudioPreviewRef.current.pause();
      recordedAudioPreviewRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setRecordedAudioUrl(null);
  };

  const handleOpenFeedbackDetail = (feedbackId: string) => {
    const feedback = feedbackData?.data?.items?.find((item) => item.feedbackId === feedbackId) ||
                     allFeedbackData?.data?.items?.find((item) => item.feedbackId === feedbackId);
    if (feedback) {
      setSelectedFeedbackDetail(feedback);
      setIsFeedbackDetailModalOpen(true);
    }
  };

  const handleCloseFeedbackDetailModal = () => {
    setIsFeedbackDetailModalOpen(false);
    setSelectedFeedbackDetail(null);
  };

  const handlePlayRecordedAudio = useCallback(() => {
    if (!recordedAudioUrl || !recordedAudioPreviewRef.current) {
      return;
    }

    const audio = recordedAudioPreviewRef.current;
    audio.currentTime = 0;
    
    // Set playing state to true
    setIsPlayingAudio(true);
    
    // Add event listeners to track when audio ends
    const handleEnded = () => {
      setIsPlayingAudio(false);
      audio.removeEventListener("ended", handleEnded);
    };
    
    const handlePause = () => {
      setIsPlayingAudio(false);
      audio.removeEventListener("pause", handlePause);
    };
    
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    
    audio
      .play()
      .catch(() => {
        setIsPlayingAudio(false);
        toast.error("Không thể phát bản ghi. Vui lòng thử lại.");
      });
  }, [recordedAudioUrl]);
 

  
  const handleSaveAndFinish = useCallback(async () => {
    if (!selectedReview || isSubmittingReview) return;
    
    const validationResult = reviewFormSchema.safeParse({
      comment,
      score,
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      if (firstIssue) {
        toast.error(firstIssue.message);
      }
      return;
    }

    const { score: scoreValue, comment: normalizedComment } = validationResult.data;
    setIsSubmittingReview(true);
    try {
      let audioUrl: string | null = null;
      
      // Upload audio if recorded
      const recordedMp3Blob = recordedAudioBlobMp3Ref.current;
      if (recordedMp3Blob) {
        // Convert blob to File
        const audioFile = new File(
          [recordedMp3Blob],
          `record-${Date.now()}.mp3`,
          { type: "audio/mp3" }
        );
        audioUrl = await uploadAudioToCloudinary(audioFile);
        toast.success("Upload audio to Cloudinary successfully");
        if (!audioUrl) {
          console.error("Failed to upload audio to Cloudinary");
          // Continue without audio URL if upload fails
        }
      }
      
      if(selectedReview.type === "Record"){
        await submitReviewMutation.mutateAsync({
          learnerAnswerId: null,
          recordId: selectedReview.id,
          reviewerProfileId: userData?.reviewerProfile?.reviewerProfileId || null,
          score: scoreValue,
          comment: normalizedComment,
          recordAudioUrl: audioUrl || null,
        });
      } else {
        await submitReviewMutation.mutateAsync({
          learnerAnswerId: selectedReview.id,
          recordId: null,
          reviewerProfileId: userData?.reviewerProfile?.reviewerProfileId || null,
          score: scoreValue,
          comment: normalizedComment,
          recordAudioUrl: audioUrl || null,
        });
      }
      
      // Remove review from current reviewer's list immediately
      // SignalR event will handle updates for other reviewers
      setReviewedAnswers((prev) => [...prev, selectedReview.id]);
      
      // Reset audio blob after successful submission
      recordedAudioBlobMp3Ref.current = null;
      
      // Close modal
      handleCloseModal();
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  }, [selectedReview, comment, score, userData, submitReviewMutation, isSubmittingReview]);

  // Transform API data to component format
  // Merge with numberOfReview updates from SignalR events
  const pendingReviews = useMemo(() => {
    if (!pendingReviewsData?.data?.items) return [];
    return pendingReviewsData.data.items.map((item) => ({
      id: item.id,
      questionText: item.questionText,
      audioUrl: item.audioUrl,
      submittedAt: formatDate(item.submittedAt, true),
      status: "Pending",
      learnerFullName: item.learnerFullName,
      type: item.type,
      aiFeedback: item.aiFeedback,
      transcribedText: item.transcribedText,
      aiScore: item.aiScore,
      expectedReviewerCoin: item.expectedReviewerCoin,
      // Use updated numberOfReview from SignalR if available, otherwise use from API
      numberOfReview:
        numberOfReviewUpdates[item.id] !== undefined
          ? numberOfReviewUpdates[item.id]
          : item.numberOfReview,
    }));
  }, [pendingReviewsData, numberOfReviewUpdates]);

  // Filter out reviewed answers (local state)
  const availableReviews = pendingReviews.filter(
    (review) => !reviewedAnswers.includes(review.id)
  );

  // Pagination info for "Answers needing review"
  const pendingPagination = useMemo(() => {
    if (!pendingReviewsData?.data) {
      return { totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const totalItems = pendingReviewsData.data.totalItems || 0;
    const totalPages = Math.ceil(totalItems / pendingPageSize);
    return {
      totalPages,
      currentPage: pendingPageNumber,
      totalItems,
    };
  }, [pendingReviewsData, pendingPageNumber, pendingPageSize]);

  const pendingStartItem =
    pendingPagination.totalItems === 0
      ? 0
      : (pendingPageNumber - 1) * pendingPageSize + 1;
  const pendingEndItem = Math.min(
    pendingPageNumber * pendingPageSize,
    pendingPagination.totalItems
  );

  // Setup SignalR listener for reviewCompleted events
  useEffect(() => {
    // Only setup handler when connection is established
    if (!isConnected) {
      return;
    }

    const handleReviewCompleted = (review: ReviewCompleted) => {
      console.log('🔔 SignalR: Review completed event received', review);
      
      // Get both IDs from the event
      const learnerAnswerId = review.learnerAnswerId;
      const recordId = review.recordId;
      
      if (!learnerAnswerId && !recordId) {
        console.warn('⚠️ SignalR: Review completed event missing both learnerAnswerId and recordId');
        return;
      }

      // Normalize IDs for comparison (convert to lowercase string)
      const normalizeId = (id: string | null) => id ? String(id).toLowerCase().trim() : null;
      const normalizedLearnerAnswerId = normalizeId(learnerAnswerId);
      const normalizedRecordId = normalizeId(recordId);

      // Find the actual review ID in pending reviews data
      // This handles the case where backend sends one ID but review uses the other
      let actualReviewId: string | null = null;
      
      if (pendingReviewsData?.data?.items) {
        console.log('🔍 Searching in pending reviews, total items:', pendingReviewsData.data.items.length);
        
        // Try to find review by either ID (case-insensitive comparison)
        const foundReview = pendingReviewsData.data.items.find(
          (item) => {
            const normalizedItemId = normalizeId(item.id);
            return (
              (normalizedLearnerAnswerId && normalizedItemId === normalizedLearnerAnswerId) ||
              (normalizedRecordId && normalizedItemId === normalizedRecordId)
            );
          }
        );
        
        if (foundReview) {
          actualReviewId = foundReview.id;
          console.log('✅ Found review in pending list:', actualReviewId, 'Current numberOfReview:', foundReview.numberOfReview);
        } else {
          console.warn('⚠️ Review not found in pending list. LearnerAnswerId:', learnerAnswerId, 'RecordId:', recordId);
          console.log('Available IDs:', pendingReviewsData.data.items.map(item => item.id).slice(0, 5));
        }
      }
      
      // Fallback to the ID from event if not found in pending reviews
      if (!actualReviewId) {
        actualReviewId = learnerAnswerId || recordId;
        console.log('📝 Using fallback ID:', actualReviewId);
      }

      // Early return if we still don't have a valid ID
      if (!actualReviewId) {
        console.warn('⚠️ Cannot update: no valid review ID found');
        return;
      }

      console.log('📊 Updating review remaining:', {
        actualReviewId,
        remaining: review.remaining,
        currentState: actualReviewId ? numberOfReviewUpdates[actualReviewId] : undefined
      });

      // Case 1: If remaining = 0, remove from all reviewers' lists
      if (review.remaining === 0) {
        console.log('🗑️ Removing review (remaining = 0):', actualReviewId);
        setReviewedAnswers((prev) => {
          if (prev.includes(actualReviewId!)) {
            return prev;
          }
          return [...prev, actualReviewId!];
        });
      } 
      // Case 2: If remaining > 0, only update numberOfReview for other reviewers
      else {
        console.log('🔄 Updating numberOfReview:', actualReviewId, '→', review.remaining);
        setNumberOfReviewUpdates((prev) => {
          const updated = {
            ...prev,
            [actualReviewId!]: review.remaining,
          };
          console.log('✅ Updated numberOfReviewUpdates:', updated);
          return updated;
        });
      }
    };

    // Register handler
    signalRService.setReviewCompletedHandler(handleReviewCompleted);

    // Cleanup when component unmounts or connection changes
    return () => {
      signalRService.setReviewCompletedHandler(null);
    };
  }, [isConnected, pendingReviewsData]);

  // Full feedback data for modal - mapped from API
  const allFeedbackDataForModal = useMemo(() => {
    if (!allFeedbackData?.isSucess || !allFeedbackData?.data?.items) return [];
    
    return allFeedbackData.data.items.map((item) => ({
      id: item.feedbackId,
      studentName: item.learnerName,
      rating: item.rating,
      comment: item.content,
      sessionType: item.reviewType || "Pronunciation review",
      date: formatDate(item.createdAt),
      avatar: getInitials(item.learnerName),
    }));
  }, [allFeedbackData]);
  const [recording, setRecording] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedAudioBlobMp3Ref = useRef<Blob | null>(null); // Store recorded audio blob
  
  const updateRecordingState = useCallback(() => {
    if (recording) {
      setRecording(false);
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    } else {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "recording"
      ) {
        audioChunksRef.current = [];
        setRecordedAudioUrl(null);
        setRecording(true);
        mediaRecorderRef.current.start();
      }
    }
  }, [recording]);

  // Initialize MediaRecorder on component mount
  useEffect(() => {
    const constraints: MediaStreamConstraints = {
      audio: { channelCount: 1, sampleRate: 48000 },
    };
    
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        streamRef.current = stream;
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        
        mr.ondataavailable = (ev) => {
          // Some browsers use ev.data.size
          if (ev.data && ev.data.size > 0) {
            audioChunksRef.current.push(ev.data);
          }
        };
        
        mr.onstop = async () => {
          const blobMp3 = new Blob(audioChunksRef.current, { type: "audio/mp3" });
          recordedAudioBlobMp3Ref.current = blobMp3; // Store blob for later upload
          const previewUrl = URL.createObjectURL(blobMp3);
          setRecordedAudioUrl(previewUrl);
          console.log("Recording stopped, blob stored:", blobMp3.size, "bytes");
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (recordedAudioPreviewRef.current && recordedAudioUrl) {
      recordedAudioPreviewRef.current.load();
    }

    if (!recordedAudioUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(recordedAudioUrl);
    };
  }, [recordedAudioUrl]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-dashed border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-24">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total feedback
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mentorStats.totalFeedbacks}
                  </p>
                </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-blue-600"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mentorStats.totalReviews}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-green-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average rating
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mentorStats.avgRating}/5
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="text-yellow-500"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Wallet balance
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mentorStats.AmountOfMoneyEarned} coin
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="text-purple-600"
                >
                  <path d="M9 11l3 3 8-8" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.34 0 2.6.29 3.74.82" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Answers needing review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg font-medium">
                    Loading...
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-lg font-medium">
                    Failed to load data: {error.message}
                  </div>
                </div>
              ) : availableReviews.length === 0 ? (
                <div className="text-center py-12">
                 <CircleCheck size={64} color="green" className="text-6xl mb-4 text-center w-full"/>
                  <div className="text-gray-500 text-lg font-medium">
                    All answers have been reviewed
                  </div>  
                </div>
              ) : (
                availableReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-5 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => handleOpenReviewModal(review.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Learner Name & Question */}
                        <div className="mb-3">
                          <div className="flex items-start gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <span className="font-semibold text-gray-900 text-sm mr-2">Question:</span>
                                <span className="text-sm text-gray-700 leading-relaxed">
                                  {review.questionText}
                                </span>
                              </div>
                              {review.expectedReviewerCoin > 0 && (
                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                                  <Coins className="w-3 h-3" />
                                  Expected Reward: {review.expectedReviewerCoin}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Transcribed Text Preview */}
                        {review.transcribedText && (
                          <div className="mb-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 flex items-start gap-2">
                                <span className="text-xs font-medium text-gray-600 flex-shrink-0">Transcribed:</span>
                                <span className="text-xs text-gray-600 italic">
                                  {review.transcribedText}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Audio Player */}
                        <div className="mb-3">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full flex items-center justify-center text-white transition-all shadow-md">
                              <Headphones className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  Audio Response
                                </span>
                                {review.aiScore >= 0 && review.aiScore <= 100 && (
                                  <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                    <Star className="w-3 h-3 fill-purple-700" />
                                    AI: {review.aiScore}/100
                                  </div>
                                )}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                                  style={{ width: "0%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {review.submittedAt}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                              <Clock className="w-3 h-3" />
                              Reviews remaining: {review.numberOfReview}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination for pending reviews */}
            {pendingPagination.totalItems > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {pendingStartItem}-{pendingEndItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {pendingPagination.totalItems}
                  </span>{" "}
                  answers
                </div>
                <div className="inline-flex items-center justify-center gap-1 rounded-full bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    onClick={() =>
                      setPendingPageNumber((prev) => Math.max(1, prev - 1))
                    }
                    disabled={pendingPageNumber === 1 || isLoading}
                  >
                    <span className="text-xs">‹</span>
                  </Button>
                  <span className="text-xs sm:text-sm text-gray-700 px-1">
                    Page{" "}
                    <span className="font-semibold">
                      {pendingPagination.currentPage}
                    </span>{" "}
                    / {pendingPagination.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    onClick={() =>
                      setPendingPageNumber((prev) =>
                        Math.min(pendingPagination.totalPages, prev + 1)
                      )
                    }
                    disabled={
                      pendingPageNumber >= pendingPagination.totalPages ||
                      isLoading
                    }
                  >
                    <span className="text-xs">›</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback summary</CardTitle>
            <p className="text-sm text-gray-500">
              Recent feedback from your learners
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingFeedback ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">Loading feedback...</div>
                </div>
              ) : feedbackSummary.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-sm">No feedback yet</div>
                </div>
              ) : (
                feedbackSummary.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {feedback.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {feedback.studentName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="14"
                            height="14"
                            fill={i < feedback.rating ? "#fbbf24" : "#e5e7eb"}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      &quot;{feedback.comment}&quot;
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {feedback.sessionType}
                      </span>
                      <span>{feedback.date}</span>
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFeedbackDetail(feedback.id);
                        }}
                        className="text-xs h-7"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              )))}
            </div>
            
            {/* Pagination for summary */}
            {feedbackPagination.totalItems > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {feedbackStartItem}-{feedbackEndItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {feedbackPagination.totalItems}
                  </span>{" "}
                  feedback
                </div>
                <div className="inline-flex items-center justify-center gap-1 rounded-full bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    onClick={() =>
                      setFeedbackPageNumber((prev) => Math.max(1, prev - 1))
                    }
                    disabled={feedbackPageNumber === 1 || isLoadingFeedback}
                  >
                    <span className="text-xs">‹</span>
                  </Button>
                  <span className="text-xs sm:text-sm text-gray-700 px-1">
                    Page{" "}
                    <span className="font-semibold">
                      {feedbackPagination.currentPage}
                    </span>{" "}
                    / {feedbackPagination.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    onClick={() =>
                      setFeedbackPageNumber((prev) =>
                        Math.min(feedbackPagination.totalPages, prev + 1)
                      )
                    }
                    disabled={
                      feedbackPageNumber >= feedbackPagination.totalPages ||
                      isLoadingFeedback
                    }
                  >
                    <span className="text-xs">›</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Feedback Modal */}
      {showAllFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-1.5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  All learner feedback
                </h2>
                <p className="text-sm text-gray-500">
                  Complete feedback history from your learners
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllFeedback(false)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid gap-4">
                {isLoadingAllFeedback ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg">Loading feedback...</div>
                  </div>
                ) : allFeedbackDataForModal.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No feedback yet</div>
                  </div>
                ) : (
                  allFeedbackDataForModal.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {feedback.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {feedback.studentName}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                width="16"
                                height="16"
                                fill={
                                  i < feedback.rating ? "#fbbf24" : "#e5e7eb"
                                }
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          &quot;{feedback.comment}&quot;
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feedback.sessionType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {feedback.date}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFeedbackDetail(feedback.id);
                            }}
                            className="text-xs h-7"
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Total feedback:{" "}
                    <span className="font-semibold">
                      {modalPagination.totalItems}
                    </span>{" "}
                    reviews
                  </p>
                  
                  {/* Pagination Controls */}
                  {modalPagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalPageNumber((prev) => Math.max(1, prev - 1))}
                        disabled={modalPageNumber === 1 || isLoadingAllFeedback}
                      >
                        Trước
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {modalPagination.currentPage} / {modalPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalPageNumber((prev) => Math.min(modalPagination.totalPages, prev + 1))}
                        disabled={modalPageNumber >= modalPagination.totalPages || isLoadingAllFeedback}
                      >
                        Sau
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setShowAllFeedback(false);
                    setModalPageNumber(1); // Reset to first page when closing
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-5xl min-h-[65vh] max-h-[90vh] overflow-y-auto data-[state=open]:!animate-none data-[state=closed]:!animate-none"
        >
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-xl">{selectedReview?.questionText}</DialogTitle>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedReview?.transcribedText}
                  </p>
              </div>
              {selectedReview && selectedReview.expectedReviewerCoin > 0 && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex-shrink-0">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">
                    Expected Reward: {selectedReview.expectedReviewerCoin} coins
                  </span>
                </div>
              )}
            </div>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-5 mt-3">
              {/* Transcribed Text */}
              {/* Audio Player */}
              {selectedReview.audioUrl && (
                <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Headphones className="w-4 h-4 text-blue-600" />
                    <div className="text-sm font-semibold text-slate-700">
                      Audio Response
                    </div>
                    
                  </div>
                  <audio ref={audioRef} controls className="w-full">
                    <source src={selectedReview.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label
                    htmlFor="modal-comment"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Comment
                  </Label>
                  <textarea
                    id="modal-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback..."
                    className="mt-2 w-full h-28 text-sm border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                  />
                </div>
                <div className="relative">
                  <Label
                    htmlFor="modal-score"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Score
                  </Label>
                  <Input
                    id="modal-score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="0 - 10"
                    className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter a numeric score, e.g., 8.5
                  </p>
                  
                </div>
              </div>

              {/* AI Feedback Display */}
              {showAnswer && selectedReview?.aiFeedback && (
                <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
                    <div className="text-sm font-semibold text-purple-800">
                      AI Feedback
                    </div>
                    {selectedReview.aiScore > 0 && (
                      <div className="ml-auto bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                        AI Score: {selectedReview.aiScore}/100
                      </div>
                    )}
                  </div>
                  <div
                    className="text-sm leading-relaxed text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formatAiFeedbackHtml(selectedReview.aiFeedback),
                    }}
                  />
                </div>
              )}

              {/* Bottom Section: AI Feedback Toggle, Mic button, and Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* AI Feedback Toggle */}
                <div className="flex justify-start">
                  {selectedReview.aiFeedback && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="cursor-pointer border-purple-300 hover:bg-purple-50"
                      disabled={recording || isSubmittingReview}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {showAnswer ? "Hide AI Feedback" : "View AI Feedback"}
                      {selectedReview.aiScore > 0 && (
                        <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Score: {selectedReview.aiScore}/100
                        </span>
                      )}
                    </Button>
                  )}
                </div>

                {/* Mic button */}
                <div
                  id="btn-record"
                  className="flex flex-col items-center justify-center gap-3"
                >
                  <div className="relative flex items-center justify-center">
                    {recording && (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute inline-flex h-[6em] w-[6em] rounded-full bg-[#49d67d]/30 animate-ping"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inline-flex h-[5em] w-[5em] rounded-full border border-[#49d67d]/50 animate-pulse"
                        />
                      </>
                    )}
                    <button
                      id="recordAudio"
                      onClick={updateRecordingState}
                      disabled={
                        !mediaRecorderRef.current ||
                        submitReviewMutation.isPending ||
                        isSubmittingReview ||
                        isPlayingAudio
                      }
                      className={`relative z-10 box-border w-[4.5em] h-[4.5em] rounded-full border-[6px] border-white text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                        recording ? "bg-[#477c5b] hover:bg-[#3a6549]" : "bg-[#49d67d] hover:bg-[#3db868]"
                      }`}
                      title={recording ? "Click to stop recording" : "Click to start recording"}
                      type="button"
                    >
                      <Mic id="recordIcon" className={`w-10 h-10 ${recording ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                  {recordedAudioUrl && (
                    <>
                      <audio
                        ref={recordedAudioPreviewRef}
                        src={recordedAudioUrl}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlePlayRecordedAudio}
                        disabled={
                          recording ||
                          isSubmittingReview ||
                          submitReviewMutation.isPending
                        }
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Play recording
                      </Button>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="cursor-pointer"
                    disabled={recording || isSubmittingReview || isPlayingAudio}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAndFinish}
                    disabled={
                      recording ||
                      isSubmittingReview ||
                      submitReviewMutation.isPending ||
                      isPlayingAudio
                    }
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingReview || submitReviewMutation.isPending
                      ? "Processing..."
                      : "Complete"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Detail Modal */}
      <Dialog open={isFeedbackDetailModalOpen} onOpenChange={setIsFeedbackDetailModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Feedback Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedFeedbackDetail && (
            <div className="space-y-6 mt-4">
              {/* Feedback Information Card */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r  border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Feedback Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rating - Highlighted */}
                    <div className="md:col-span-2">
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          Rating
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-6 h-6 ${
                                  i < selectedFeedbackDetail.rating 
                                    ? "text-yellow-500 fill-yellow-500" 
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {selectedFeedbackDetail.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-500" />
                        Status
                      </Label>
                      <div>
                        {selectedFeedbackDetail.feedbackStatus === "Approved" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle2 className="w-4 h-4" />
                            {selectedFeedbackDetail.feedbackStatus}
                          </span>
                        ) : selectedFeedbackDetail.feedbackStatus === "Rejected" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-4 h-4" />
                            {selectedFeedbackDetail.feedbackStatus}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Clock className="w-4 h-4" />
                            {selectedFeedbackDetail.feedbackStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Feedback Type
                      </Label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {selectedFeedbackDetail.feedbackType  === "ReviewerFeedback" ? "Feedback" : "Report"}   
                      </p>
                    </div>

                    {/* Created At */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Created At
                      </Label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDate(selectedFeedbackDetail.createdAt, true)}
                      </p>
                    </div>


                    {/* Content */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        Feedback Content
                      </Label>
                      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                          {selectedFeedbackDetail.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Review Information Card */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r  border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                    Review Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Review Score - Highlighted */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-green-600" />
                        Review Score
                      </Label>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                        <p className="text-2xl font-bold text-green-700">
                          {selectedFeedbackDetail.reviewScore}/10
                        </p>
                      </div>
                    </div>

                    {/* Review Status */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-500" />
                        Review Status
                      </Label>
                      <div>
                        {selectedFeedbackDetail.reviewStatus === "Completed" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle2 className="w-4 h-4" />
                            {selectedFeedbackDetail.reviewStatus}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Clock className="w-4 h-4" />
                            {selectedFeedbackDetail.reviewStatus === "Reported_Pending" ? "Reported Pending" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Type */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Review Type
                      </Label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {selectedFeedbackDetail.reviewType === "Record" ? "Record" : "Feedback"}   
                      </p>
                    </div>

                    {/* Review Created At */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Review Created At
                      </Label>
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        {formatDate(selectedFeedbackDetail.reviewCreatedAt, true)}
                      </p>
                    </div>


                    {/* Review Comment */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        Reviewer Comment
                      </Label>
                      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-100">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                          {selectedFeedbackDetail.reviewComment}
                        </p>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Question Content
                      </Label>
                      <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-100">
                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                          {selectedFeedbackDetail.questionContent || selectedFeedbackDetail.questionOrContent}
                        </p>
                      </div>
                    </div>

                    {/* Audio Player */}
                    {selectedFeedbackDetail.learnerRecordAudioUrl && (
                      <div className="md:col-span-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                          <Headphones className="w-4 h-4 text-gray-500" />
                          Learner Audio
                        </Label>
                        <div className="rounded-lg border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                          <audio controls className="w-full">
                            <source src={selectedFeedbackDetail.learnerRecordAudioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={handleCloseFeedbackDetailModal} 
                  variant="outline"
                  className="min-w-[100px]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatisticsForMentor;
