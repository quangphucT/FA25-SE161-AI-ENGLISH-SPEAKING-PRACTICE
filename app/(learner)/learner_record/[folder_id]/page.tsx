"use client";

import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { uploadAudioToCloudinary } from "@/utils/upload";
import { useLearnerRecords, useLearnerRecordUpdate } from "@/features/learner/hooks/useLearnerRecord";
import type { Record } from "@/features/learner/services/learnerRecordService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, BookOpen, Play, Volume2, Mic, MessageSquare, X } from "lucide-react";
import BuyReviewModal from "@/components/BuyReviewModal";

const PracticeRecordLayout = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderId = params?.folder_id as string;
  const content = searchParams?.get("content") || "";
  // Nhận recordId đơn lẻ (từ nút "Học" trên từng record)
  const recordId = searchParams?.get("recordId") || "";
  // Lấy tất cả records từ folderId
  const { data: recordsDataResponse } = useLearnerRecords(folderId);
  
  // Parse recordsData từ response
  const recordsList = useMemo<Record[]>(() => {
    if (!recordsDataResponse) return [];
    if (Array.isArray(recordsDataResponse.data)) {
      return recordsDataResponse.data as Record[];
    }
    if (recordsDataResponse.data && typeof recordsDataResponse.data === 'object' && 'recordId' in recordsDataResponse.data) {
      return [recordsDataResponse.data as Record];
    }
    return [];
  }, [recordsDataResponse]);
  
  // State để quản lý câu hỏi hiện tại
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Tìm index của record hiện tại nếu có recordId từ URL
  useEffect(() => {
    if (recordId && recordsList.length > 0) {
      const index = recordsList.findIndex((r: Record) => r.recordId === recordId);
      if (index !== -1) {
        setCurrentQuestionIndex(index);
      }
    }
  }, [recordId, recordsList]);
  
  // Lấy record hiện tại
  const currentRecord = recordsList[currentQuestionIndex] || null;
  const currentRecordId = currentRecord?.recordId || recordId || "";
  const currentContent = currentRecord?.content || content || "";

  const [language, setLanguage] = useState<"en-gb" | "en">("en-gb");
  const [score, setScore] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const [recording, setRecording] = useState<boolean>(false);
  const [uiBlocked, setUiBlocked] = useState<boolean>(false);
  const [mainTitle, setMainTitle] = useState<string>(
    "AI Pronunciation Trainer"
  );
  const [pronunciationAccuracy, setPronunciationAccuracy] =
    useState<string>("");
  const [aiFeedback, setAiFeedback] = useState<string>(""); // Store AI feedback
  const [originalScriptHtml, setOriginalScriptHtml] = useState<string>("");
  const [ipaScript, setIpaScript] = useState<string>("");
  const [recordedIpaScript, setRecordedIpaScript] = useState<string>("");
  const [translatedScript, setTranslatedScript] = useState<string>("");
  const [singleWordPair, setSingleWordPair] =
    useState<string>("Reference | Spoken");

  const [currentSoundRecorded, setCurrentSoundRecorded] =
    useState<boolean>(false);
  const [serverIsInitialized, setServerIsInitialized] =
    useState<boolean>(false);
  const [serverWorking, setServerWorking] = useState<boolean>(true);
  // removed native/recording toggle state (not used in UI)
  // removed unused lettersOfWordAreCorrect state
  const [shouldFetchNext, setShouldFetchNext] = useState<boolean>(false);
  const [languageFound, setLanguageFound] = useState<boolean>(true);
  
  const [openBuyReviewModal, setOpenBuyReviewModal] = useState(false);
  const [openAiFeedbackModal, setOpenAiFeedbackModal] = useState(false);
  // Word-level analysis data
  const [realTranscriptsIpa, setRealTranscriptsIpa] = useState<string[]>([]);
  const [matchedTranscriptsIpa, setMatchedTranscriptsIpa] = useState<string[]>(
    []
  );
  const [wordCategories, setWordCategories] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string[]>([]);
  const [endTime, setEndTime] = useState<string[]>([]);
  const [isNativeSelectedForPlayback, setIsNativeSelectedForPlayback] =
    useState<boolean>(true);

  // Audio and media refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRecordedRef = useRef<HTMLAudioElement | null>(null);
  const recordedAudioBlobRef = useRef<Blob | null>(null); // Store recorded audio blob
  const recordedAudioBlobMp3Ref = useRef<Blob | null>(null); // Store recorded audio blob
  const soundFileGoodRef = useRef<AudioBuffer | null>(null);
  const soundFileOkayRef = useRef<AudioBuffer | null>(null);
  const soundFileBadRef = useRef<AudioBuffer | null>(null);
  
  // Hook for creating record
  const { mutateAsync: updateRecord, isPending: isUpdatingRecord } = useLearnerRecordUpdate();

  // Speech synthesis
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Content and timings
  const [currentText, setCurrentText] = useState<string[]>([
    originalScriptHtml || "",
  ]);
  // removed word timing state (unused in current UI)

  // API config - matching original code
  const AILanguage = language; // "de" | "en"
  const STScoreAPIKey = ""; // Empty like original
  const apiMainPathSample = "https://ai.aespwithai.com"; // Empty like original
  const apiMainPathSTS =  "https://ai.aespwithai.com"; // Empty like original

  const languageLabel = useMemo(() => (language === "en-gb" ? "English-UK" : "English-USA"), [language]);

  const changeLanguage = useCallback(
    (lang: "en-gb" | "en", generateNewSample = true) => {
      setLanguage(lang);
      setDropdownOpen(false);
      // Map to preferred voice names from legacy implementation
      const preferredVoiceName =
        lang === "en-gb"
          ? "Google UK English Female"
          : "Microsoft David - English (United States)";

      // Try exact preferred voice first
      let selected: SpeechSynthesisVoice | null = null;
      for (const v of voices) {
        if (v.name === preferredVoiceName) {
          selected = v;
          break;
        }
      }

      // Fallback: any voice matching language family
      const languagePrefix = lang === "en-gb" ? "en" : "en";
      if (!selected) {
        for (const v of voices) {
          if (v.lang.slice(0, 2).toLowerCase() === languagePrefix) {
            selected = v;
            break;
          }
        }
      }
      if (selected) {
        voiceRef.current = selected;
        setLanguageFound(true);
      } else {
        setLanguageFound(false);
      }
      if (generateNewSample) setShouldFetchNext(true);
    },
    [voices]
  );

  const playSoundBuffer = useCallback((buffer: AudioBuffer | null) => {
    if (!audioContextRef.current || !buffer) return;
    const src = audioContextRef.current.createBufferSource();
    src.buffer = buffer;
    src.connect(audioContextRef.current.destination);
    src.start(audioContextRef.current.currentTime);
  }, []);

  const playSoundForAnswerAccuracy = useCallback(
    (accuracy: number) => {
      let chosen: AudioBuffer | null = soundFileGoodRef.current;
      const badTh = 30;
      const medTh = 70;
      if (accuracy < medTh)
        chosen =
          accuracy < badTh ? soundFileBadRef.current : soundFileOkayRef.current;
      playSoundBuffer(chosen);
    },
    [playSoundBuffer]
  );

  const playWithSpeechSynthesis = useCallback(
    (text: string) => {
      if (!synthRef.current) return;
      if (!languageFound) {
        return;
      }
      setUiBlocked(true);
      if (!voiceRef.current) changeLanguage(AILanguage, false);
      const utter = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utter.voice = voiceRef.current;
      utter.rate = 0.7;
      utter.onend = () => setUiBlocked(false);
      synthRef.current.speak(utter);
    },
    [AILanguage, changeLanguage, languageFound]
  );

  const playAudio = useCallback(() => {
    setMainTitle("Generating sound...");
    if (currentText[0]) playWithSpeechSynthesis(currentText[0]);
    setMainTitle("Current Sound was played");
  }, [currentText, playWithSpeechSynthesis]);

  const playRecording = useCallback(
    async (start?: number | null, end?: number | null) => {
      setUiBlocked(true);
      try {
        const audio = audioRecordedRef.current;
        if (!audio) {
          setUiBlocked(false);
          return;
        }
        if (start == null || end == null) {
          await audio.play();
          audio.addEventListener("ended", function handler() {
            audio.currentTime = 0;
            setUiBlocked(false);
            setMainTitle("Recorded Sound was played");
            audio.removeEventListener("ended", handler);
          });
        } else {
          audio.currentTime = start;
          await audio.play();
          const duration = (end - start) * 1000;
          setTimeout(() => {
            setUiBlocked(false);
            audio.pause();
            audio.currentTime = 0;
            setMainTitle("Recorded Sound was played");
          }, Math.max(0, Math.round(duration)));
        }
      } catch {
        setUiBlocked(false);
        setMainTitle("Browser unsupported");
      }
    },
    []
  );

  const updateRecordingState = useCallback(() => {
    if (recording) {
      setRecording(false);
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setMainTitle("Processing audio...");
      setUiBlocked(true);
    } else {
      setMainTitle("Recording... click again when done speaking");
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "recording"
      ) {
        audioChunksRef.current = [];
        setRecording(true);
        mediaRecorderRef.current.start();
      }
    }
  }, [recording]);

  // Handle submit record - upload audio and update record after API returns result
  const handleSubmitRecord = useCallback(async (apiScore?: number, apiFeedback?: string) => {
    setTimeout(async () => {
      try {
        setUiBlocked(true);
        setMainTitle("Đang tải audio lên...");

        const recordedMp3Blob = recordedAudioBlobMp3Ref.current;
        if (!recordedMp3Blob) {
          setMainTitle("Không tìm thấy audio để tải lên");
          setUiBlocked(false);
          return;
        }

        // Convert blob to File
        const audioFile = new File(
          [recordedMp3Blob],
          `record-${Date.now()}.mp3`,
          { type: "audio/mp3" }
        );
        console.log("audioFile", audioFile);
        // Upload to Cloudinary
        const audioUrl = await uploadAudioToCloudinary(audioFile);
        
        if (!audioUrl) {
          setMainTitle("Lỗi khi tải audio lên");
          setUiBlocked(false);
          return;
        }

        setMainTitle("Đang tạo record...");

        // Validate recordId
        const targetRecordId = currentRecordId || recordId;
        if (!targetRecordId) {
          setMainTitle("Không tìm thấy record ID");
          setUiBlocked(false);
          return;
        }

        // Get score and feedback - use API values if provided, otherwise use state
        let finalScore: number;
        if (apiScore !== undefined && !isNaN(apiScore) && isFinite(apiScore)) {
          finalScore = Math.round(apiScore);
        } else {
          const scoreValue = Number(score);
          finalScore = (!isNaN(scoreValue) && isFinite(scoreValue)) ? Math.round(scoreValue) : 0;
        }
        
        const finalFeedback = apiFeedback || aiFeedback || "";

        // Validate data before sending
        if (!audioUrl || audioUrl.trim() === "") {
          setMainTitle("URL audio không hợp lệ");
          setUiBlocked(false);
          return;
        }

        console.log("Submitting record:", {
          recordId: targetRecordId,
          audioUrl,
          score: finalScore,
          feedback: finalFeedback.substring(0, 50) + "...",
        });

        // Update record
        await updateRecord({
          recordId: targetRecordId,
          reviewData: {
            audioRecordingURL: audioUrl,
            score: finalScore,
            aiFeedback: finalFeedback,
            transcribedText: Array.isArray(matchedTranscriptsIpa) ? matchedTranscriptsIpa.join(" ") : matchedTranscriptsIpa || "",
          },
        });

        setMainTitle("Tạo record thành công!");
      } catch (error) {
        console.error("Error creating record:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Lỗi khi tạo record";
        setMainTitle(`Lỗi: ${errorMessage}`);
        // Show error for 3 seconds before allowing retry
        setTimeout(() => {
          setMainTitle("AI Pronunciation Trainer");
        }, 3000);
      } finally {
        setUiBlocked(false);
      }
    }, 500); // Wait 500ms for onstop handler to complete
  }, [folderId, score, aiFeedback, updateRecord, router, currentRecordId, recordId, matchedTranscriptsIpa]);
  const cacheSoundFiles = useCallback(async () => {
    try {
      if (!audioContextRef.current) return;
      const base = "/sound"; // Changed from original '../static' to match Next.js public folder
      const files = ["ASR_good.wav", "ASR_okay.wav", "ASR_bad.wav"];
      const responses = await Promise.all(
        files.map((f) => fetch(`${base}/${f}`))
      );
      const arrayBuffers = await Promise.all(
        responses.map((r) => r.arrayBuffer())
      );
      const decoded = await Promise.all(
        arrayBuffers.map((b) =>
          audioContextRef.current!.decodeAudioData(b.slice(0))
        )
      );
      soundFileGoodRef.current = decoded[0];
      soundFileOkayRef.current = decoded[1];
      soundFileBadRef.current = decoded[2];
    } catch {}
  }, []);

  const initializeServer = useCallback(async () => {
    let valid = false;
    setMainTitle("Initializing server, this may take up to 2 minutes...");
    let tries = 0;
    const maxTries = 4;
    while (!valid) {
      if (tries > maxTries) {
        setServerWorking(false);
        break;
      }
      try {
        // Try to initialize server
        if (apiMainPathSTS && STScoreAPIKey) {
          await fetch(apiMainPathSTS + "/GetAccuracyFromRecordedAudio", {
            method: "post",
            body: JSON.stringify({
              title: "",
              base64Audio: "",
              language: AILanguage,
            }),
            headers: { "X-Api-Key": STScoreAPIKey },
          });
        }
        valid = true;
        setServerIsInitialized(true);
      } catch {
        tries += 1;
      }
    }
  }, [AILanguage, STScoreAPIKey, apiMainPathSTS]);

  const getNextSample = useCallback(async () => {
    setUiBlocked(true);
    if (!serverIsInitialized) {
      await initializeServer();
    }
    if (!serverWorking) {
      setMainTitle("Server Error");
      setRecordedIpaScript(""); 
      setSingleWordPair("Error");
      setIpaScript("Error");
      setUiBlocked(false);
      return;
    }

    if (!soundFileBadRef.current) {
      try {
        await cacheSoundFiles();
      } catch {}
    }

    const parsedAcc = parseFloat(pronunciationAccuracy || "0");
    if (!Number.isNaN(parsedAcc))
      setScore((s) => Math.round(s + parsedAcc * 1));

    setMainTitle("Processing new sample...");
   

    try {
      // // Try to fetch from API
      // if (!apiMainPathSample || !STScoreAPIKey) {
      //   setMainTitle("API not configured - using demo mode");
      //   setOriginalScriptHtml(
      //     "Demo: This is a sample sentence for pronunciation practice."
      //   );
      //   setIpaScript("/ ˈsæmpl̩ ˈsentəns fər prəˌnʌnsiˈeɪʃən ˈpræktɪs /");
      //   setTranslatedScript("This is a demo translation.");
      //   setCurrentSample((s) => s + 1);
      //   setMainTitle("AI Pronunciation Trainer");
      //   setCurrentSoundRecorded(false);
      //   setUiBlocked(false);
      //   return;
      // }

      const res = await fetch(apiMainPathSample + "/getSample", {
        method: "post",
        body: JSON.stringify({
          category: 1,
          language: AILanguage,
          question: currentContent || content,
        }),
        headers: { "X-Api-Key": STScoreAPIKey },
      });
      const data = await res.json();

      setCurrentText([data.real_transcript || ""]);
      setOriginalScriptHtml(data.real_transcript || "");
      setIpaScript(`/ ${data.ipa_transcript || ""} /`);
      setRecordedIpaScript("");
      setPronunciationAccuracy("");
      setSingleWordPair("Reference | Spoken");
 
      setMainTitle("AI Pronunciation Trainer");
      setTranslatedScript(data.transcript_translation || "");
      setCurrentSoundRecorded(false);
    } catch {
      setMainTitle("Server Error");
      setRecordedIpaScript("");
      setSingleWordPair("Error");
      setIpaScript("Error");
    } finally {
      setUiBlocked(false);
    }
  }, [
    AILanguage,
    STScoreAPIKey,
    apiMainPathSample,
    pronunciationAccuracy,
    serverIsInitialized,
    serverWorking,
    initializeServer,
    cacheSoundFiles,
    currentContent,
    content,
  ]);


  // Handle Next Question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < recordsList.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextRecord = recordsList[nextIndex];
      if (nextRecord) {
        // Reset states for new question
        setRecordedIpaScript("");
        setPronunciationAccuracy("");
        setAiFeedback("");
        setCurrentSoundRecorded(false);
        setOriginalScriptHtml("");
        setIpaScript("");
        setTranslatedScript("");
        setSingleWordPair("Reference | Spoken");
        // Update URL with new recordId and content
        router.replace(
          `/learner_record/${folderId}?recordId=${nextRecord.recordId}&content=${encodeURIComponent(nextRecord.content)}`
        );
        // Fetch new sample for the new question
        setTimeout(() => {
          getNextSample();
        }, 100);
      }
    }
  }, [currentQuestionIndex, recordsList, folderId, router, getNextSample]);

  // Handle Previous Question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prevRecord = recordsList[prevIndex];
      if (prevRecord) {
        // Reset states for new question
        setRecordedIpaScript("");
        setPronunciationAccuracy("");
        setAiFeedback("");
        setCurrentSoundRecorded(false);
        setOriginalScriptHtml("");
        setIpaScript("");
        setTranslatedScript("");
        setSingleWordPair("Reference | Spoken");
        // Update URL with new recordId and content
        router.replace(
          `/learner_record/${folderId}?recordId=${prevRecord.recordId}&content=${encodeURIComponent(prevRecord.content)}`
        );
        // Fetch new sample for the new question
        setTimeout(() => {
          getNextSample();
        }, 100);
      }
    }
  }, [currentQuestionIndex, recordsList, folderId, router, getNextSample]);

  // Handle go back - upload audio and create record
  const handleGoBack = useCallback(async () => {
    if (!folderId) {
      router.push("/dashboard-learner-layout?menu=learnerRecord");
      return;
    }

    // Check if there's recorded audio
    if (!recordedAudioBlobRef.current) {
      // No audio recorded, just go back
      router.push("/dashboard-learner-layout?menu=learnerRecord");
      return;
    }

    try {
      setUiBlocked(true);
      setMainTitle("Đang tải audio lên...");

      const recordedMp3Blob = recordedAudioBlobMp3Ref.current;
      if (!recordedMp3Blob) {
        setMainTitle("Không tìm thấy audio để tải lên");
        setUiBlocked(false);
        return;
      }

      // Convert blob to File
      const audioFile = new File(
        [recordedMp3Blob],
        `record-${Date.now()}.mp3`,
        { type: "audio/mp3" }
      );
      console.log("audioFile", audioFile);
      // Upload to Cloudinary
      const audioUrl = await uploadAudioToCloudinary(audioFile);
      
      if (!audioUrl) {
        setMainTitle("Lỗi khi tải audio lên");
        setTimeout(() => {
          router.push("/dashboard-learner-layout?menu=learnerRecord");
        }, 2000);
        return;
      }

      setMainTitle("Đang tạo record...");

      // Get score and feedback from current state
      const finalScore = score.toString();
      const finalFeedback = aiFeedback || "";

      // Update record
      await updateRecord({
        recordId: currentRecordId || recordId,
        reviewData: {
          audioRecordingURL: audioUrl,
          score: Number(finalScore),
          aiFeedback: finalFeedback,
          transcribedText: Array.isArray(matchedTranscriptsIpa) ? matchedTranscriptsIpa.join(" ") : matchedTranscriptsIpa || "",
        },
      });

      setMainTitle("Tạo record thành công!");
      setTimeout(() => {
        router.push("/dashboard-learner-layout?menu=learnerRecord");
      }, 1500);
    } catch (error) {
      console.error("Error creating record:", error);
      setMainTitle("Lỗi khi tạo record");
      setTimeout(() => {
        router.push("/dashboard-learner-layout?menu=learnerRecord");
      }, 2000);
    } finally {
      setUiBlocked(false);
    }
  }, [folderId, score, aiFeedback, updateRecord, router, currentRecordId, recordId, matchedTranscriptsIpa]);

  // Utility functions from original code
  const convertBlobToBase64 = useCallback(async (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  // Word-level playback functions
  const generateWordModal = useCallback(
    (wordIdx: number) => {
      console.log("generateWordModal called with wordIdx:", wordIdx);
      console.log("realTranscriptsIpa:", realTranscriptsIpa);
      console.log("matchedTranscriptsIpa:", matchedTranscriptsIpa);

      if (
        realTranscriptsIpa.length > wordIdx &&
        matchedTranscriptsIpa.length > wordIdx
      ) {
        const realIpa = realTranscriptsIpa[wordIdx] || "";
        const matchedIpa = matchedTranscriptsIpa[wordIdx] || "";
        const category = wordCategories[wordIdx] || "0";
        const accuracyColors = ["green", "orange", "red"];
        const color = accuracyColors[parseInt(category)] || "black";

        const referenceText = `<span style="color: black; cursor: pointer;" onclick="window.playReferenceWord(${wordIdx})" title="Click to play reference pronunciation">${realIpa}</span>`;
        const spokenText = `<span style="color: ${color}; cursor: pointer;" onclick="window.playSpokenWord(${wordIdx})" title="Click to play your pronunciation">${matchedIpa}</span>`;

        console.log(
          "Setting singleWordPair:",
          `${referenceText} | ${spokenText}`
        );
        setSingleWordPair(`${referenceText} | ${spokenText}`);
      } else {
        console.log("Not enough data for wordIdx:", wordIdx);
      }
    },
    [realTranscriptsIpa, matchedTranscriptsIpa, wordCategories]
  );

  const playCurrentWord = useCallback(
    async (wordIdx: number) => {
      console.log("playCurrentWord called with wordIdx:", wordIdx);
      console.log("currentText:", currentText);

      if (currentText[0]) {
        // Get plain text from HTML string or any other type
        let text = currentText[0];

        // Convert to string if not already
        if (typeof text !== "string") {
          text = String(text);
        }

        // Remove HTML tags
        text = text.replace(/<[^>]*>?/gm, "");

        console.log("Processed text:", text);

        // Check if text is valid before splitting
        if (text && typeof text === "string") {
          const words = text.split(" ");
          console.log("Words array:", words);

          if (words[wordIdx]) {
            console.log("Playing word:", words[wordIdx]);
            setMainTitle("Generating word...");
            playWithSpeechSynthesis(words[wordIdx]);
            setMainTitle("Word was played");
          } else {
            console.log("Word not found at index:", wordIdx);
          }
        } else {
          console.log("Invalid text for splitting:", text);
        }
      } else {
        console.log("No currentText available");
      }
    },
    [currentText, playWithSpeechSynthesis]
  );

  const playRecordedWord = useCallback(
    (wordIdx: number) => {
      if (startTime.length > wordIdx && endTime.length > wordIdx) {
        const start = parseFloat(startTime[wordIdx]);
        const end = parseFloat(endTime[wordIdx]);
        if (!isNaN(start) && !isNaN(end)) {
          playRecording(start, end);
        }
      }
    },
    [startTime, endTime, playRecording]
  );

  const playNativeAndRecordedWord = useCallback(
    async (wordIdx: number) => {
      console.log("playNativeAndRecordedWord called with wordIdx:", wordIdx);
      console.log("isNativeSelectedForPlayback:", isNativeSelectedForPlayback);

      if (isNativeSelectedForPlayback) {
        console.log("Playing current word (native)");
        await playCurrentWord(wordIdx);
      } else {
        console.log("Playing recorded word");
        playRecordedWord(wordIdx);
      }
      setIsNativeSelectedForPlayback(!isNativeSelectedForPlayback);
    },
    [isNativeSelectedForPlayback, playCurrentWord, playRecordedWord]
  );

  // New functions for direct Reference/Spoken playback
  const playReferenceWord = useCallback(
    async (wordIdx: number) => {
      console.log("playReferenceWord called with wordIdx:", wordIdx);
      await playCurrentWord(wordIdx);
    },
    [playCurrentWord]
  );

  const playSpokenWord = useCallback(
    (wordIdx: number) => {
      console.log("playSpokenWord called with wordIdx:", wordIdx);
      playRecordedWord(wordIdx);
    },
    [playRecordedWord]
  );

  useEffect(() => {
    if (shouldFetchNext) {
      setShouldFetchNext(false);
      getNextSample();
    }
  }, [shouldFetchNext, getNextSample]);

  // Fetch initial sample on component mount or when currentContent changes
  useEffect(() => {
    if (currentContent || content) {
      getNextSample();
    }
  }, [currentContent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug: Log when aiFeedback changes
  useEffect(() => {
    console.log("aiFeedback state changed:", aiFeedback, "Type:", typeof aiFeedback, "Length:", aiFeedback?.length, "Trimmed:", aiFeedback?.trim());
  }, [aiFeedback]);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    synthRef.current =
      typeof window !== "undefined" ? window.speechSynthesis : null;
    if (synthRef.current) {
      const loadVoices = () => setVoices(synthRef.current!.getVoices());
      loadVoices();
      synthRef.current.addEventListener("voiceschanged", loadVoices);
      return () =>
        synthRef.current?.removeEventListener("voiceschanged", loadVoices);
    }

    // Clear any existing click handlers on words
    const clearClickHandlers = () => {
      const wordElements = document.querySelectorAll("[data-idx]");
      wordElements.forEach((element) => {
        element.removeAttribute("onclick");
        if (element instanceof HTMLElement) {
          element.style.cursor = "default";
        }
      });
    };

    // Clear handlers after a short delay to ensure DOM is ready
    setTimeout(clearClickHandlers, 100);
  }, []);

  // Use refs to store the latest functions
  const generateWordModalRef = useRef(generateWordModal);
  const playNativeAndRecordedWordRef = useRef(playNativeAndRecordedWord);
  const playReferenceWordRef = useRef(playReferenceWord);
  const playSpokenWordRef = useRef(playSpokenWord);
  const handleSubmitRecordRef = useRef(handleSubmitRecord);

  // Update refs when functions change - use useEffect to avoid stale closures
  useEffect(() => {
    generateWordModalRef.current = generateWordModal;
    playNativeAndRecordedWordRef.current = playNativeAndRecordedWord;
    playReferenceWordRef.current = playReferenceWord;
    playSpokenWordRef.current = playSpokenWord;
    handleSubmitRecordRef.current = handleSubmitRecord;
  }, [
    generateWordModal,
    playNativeAndRecordedWord,
    playReferenceWord,
    playSpokenWord,
    handleSubmitRecord,
  ]);

  // Separate useEffect for exposing functions to window
  useEffect(() => {
    // Expose functions to window for HTML onclick/onmouseover
    if (typeof window !== "undefined") {
      // Use direct assignment to avoid type issues
      (
        window as unknown as { generateWordModal: (wordIdx: number) => void }
      ).generateWordModal = (wordIdx: number) => {
        console.log("generateWordModal called with wordIdx:", wordIdx);
        generateWordModalRef.current(wordIdx);
      };
      (
        window as unknown as {
          playNativeAndRecordedWord: (wordIdx: number) => void;
        }
      ).playNativeAndRecordedWord = (wordIdx: number) => {
        console.log("playNativeAndRecordedWord called with wordIdx:", wordIdx);
        playNativeAndRecordedWordRef.current(wordIdx);
      };
      (
        window as unknown as { playReferenceWord: (wordIdx: number) => void }
      ).playReferenceWord = (wordIdx: number) => {
        console.log("playReferenceWord called with wordIdx:", wordIdx);
        playReferenceWordRef.current(wordIdx);
      };
      (
        window as unknown as { playSpokenWord: (wordIdx: number) => void }
      ).playSpokenWord = (wordIdx: number) => {
        console.log("playSpokenWord called with wordIdx:", wordIdx);
        playSpokenWordRef.current(wordIdx);
      };
      console.log("Functions exposed to window:", {
        generateWordModal: typeof (
          window as unknown as { generateWordModal: (wordIdx: number) => void }
        ).generateWordModal,
        playNativeAndRecordedWord: typeof (
          window as unknown as {
            playNativeAndRecordedWord: (wordIdx: number) => void;
          }
        ).playNativeAndRecordedWord,
        playReferenceWord: typeof (
          window as unknown as { playReferenceWord: (wordIdx: number) => void }
        ).playReferenceWord,
        playSpokenWord: typeof (
          window as unknown as { playSpokenWord: (wordIdx: number) => void }
        ).playSpokenWord,
      });

      // Test if functions are callable
      console.log("Testing function calls:");
      try {
        console.log(
          "generateWordModal test:",
          typeof (
            window as unknown as {
              generateWordModal: (wordIdx: number) => void;
            }
          ).generateWordModal
        );
        console.log(
          "playReferenceWord test:",
          typeof (
            window as unknown as {
              playReferenceWord: (wordIdx: number) => void;
            }
          ).playReferenceWord
        );
        console.log(
          "playSpokenWord test:",
          typeof (
            window as unknown as { playSpokenWord: (wordIdx: number) => void }
          ).playSpokenWord
        );
      } catch (error) {
        console.error("Error testing functions:", error);
      }

      // Backup: Also expose to global object
      (
        globalThis as unknown as {
          generateWordModal: (wordIdx: number) => void;
        }
      ).generateWordModal = (wordIdx: number) => {
        console.log("generateWordModal (global) called with wordIdx:", wordIdx);
        generateWordModalRef.current(wordIdx);
      };
      (
        globalThis as unknown as {
          playReferenceWord: (wordIdx: number) => void;
        }
      ).playReferenceWord = (wordIdx: number) => {
        console.log("playReferenceWord (global) called with wordIdx:", wordIdx);
        playReferenceWordRef.current(wordIdx);
      };
      (
        globalThis as unknown as { playSpokenWord: (wordIdx: number) => void }
      ).playSpokenWord = (wordIdx: number) => {
        console.log("playSpokenWord (global) called with wordIdx:", wordIdx);
        playSpokenWordRef.current(wordIdx);
      };
    }
  }, []); // Empty dependency array to run only once

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
          if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
        };
        mr.onstop = async () => {
          setUiBlocked(true);
          const blob = new Blob(audioChunksRef.current, { type: "audio/ogg;" });
          const blobMp3 = new Blob(audioChunksRef.current, { type: "audio/mp3;" });
          recordedAudioBlobRef.current = blob; // Store blob for later upload
          recordedAudioBlobMp3Ref.current = blobMp3; // Store blob for later upload
          const audioUrl = URL.createObjectURL(blob);
          audioRecordedRef.current = new Audio(audioUrl);

          const base64 = await convertBlobToBase64(blob);

          const minLen = 6;
          if (!base64 || base64.length < minLen) {
            setMainTitle("Recording error, please try again or restart page.");
            setUiBlocked(false);
            return;
          }

          try {
            console.log("API Config:", { apiMainPathSTS, STScoreAPIKey });
            console.log("originalScriptHtml type:", typeof originalScriptHtml);
            console.log("originalScriptHtml value:", originalScriptHtml);

            // Check if API is configured
            // if (!apiMainPathSTS || !STScoreAPIKey) {
            //   console.log("Using demo mode - API not configured");
            //   setMainTitle("API not configured - demo mode");
            //   setRecordedIpaScript("/ demo ˈrekɔrdɪŋ /");
            //   setPronunciationAccuracy("85%");
            //   setMainTitle("AI Pronunciation Trainer");
            //   setCurrentSoundRecorded(true);
            //   setUiBlocked(false);
            //   return;
            // }

            // Get text content from originalScriptHtml, handling both string and HTML
            let text = "";
            if (typeof originalScriptHtml === "string") {
              text = originalScriptHtml.replace(/<[^>]*>?/gm, "");
            } else {
              // If it's not a string, try to get text content
              text = String(originalScriptHtml || "");
            }
            text = text.trim().replace(/\s\s+/g, " ");

            console.log("Processed text:", text);
            const payload = {
              title: text,
              base64Audio: base64,
              language: AILanguage,
            };

            console.log(
              "Sending request to:",
              apiMainPathSTS + "/GetAccuracyFromRecordedAudio"
            );
            console.log("Payload:", payload);

            const res = await fetch(
              apiMainPathSTS + "/GetAccuracyFromRecordedAudio",
              {
                method: "post",
                body: JSON.stringify(payload),
                headers: { "X-Api-Key": STScoreAPIKey },
              }
            );

            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);

            const pronunciationAccuracyValue = data?.pronunciation_accuracy || "0";
            const acc = parseFloat(pronunciationAccuracyValue);
            if (!Number.isNaN(acc)) playSoundForAnswerAccuracy(acc);
            setRecordedIpaScript(`/ ${data?.ipa_transcript || ""} /`); 
            setMainTitle("AI Pronunciation Trainer");
            setPronunciationAccuracy(`${pronunciationAccuracyValue}%`);
            const feedbackValue = data?.AIFeedback || data?.aiFeedback || data?.feedback || "";
            console.log("data?.AIFeedback", data?.AIFeedback);
            console.log("Setting aiFeedback to:", feedbackValue);
            setAiFeedback(feedbackValue);
            
            // Call handleSubmitRecord after API returns result to upload and update record
            // Pass score and feedback directly from API response
            const apiScore = parseFloat(pronunciationAccuracyValue) || 0;
            const apiFeedback = feedbackValue;
            console.log("Passing to handleSubmitRecord - apiScore:", apiScore, "apiFeedback:", apiFeedback);
            setTimeout(() => {
              handleSubmitRecordRef.current(apiScore, apiFeedback);
            }, 100);

            const isLetterCorrectAll: string[] = String(
              data?.is_letter_correct_all_words || ""
            ).split(" ");

            // Store word-level data for playback
            const realTranscriptsIpaData =
              data?.real_transcripts_ipa?.split(" ") || [];
            const matchedTranscriptsIpaData =
              data?.matched_transcripts_ipa?.split(" ") || [];
            const wordCategoriesData =
              data?.pair_accuracy_category?.split(" ") || [];
            const startTimeData = data?.start_time?.split(" ") || [];
            const endTimeData = data?.end_time?.split(" ") || [];

            // Update state with word-level data
            setRealTranscriptsIpa(realTranscriptsIpaData);
            setMatchedTranscriptsIpa(matchedTranscriptsIpaData);
            setWordCategories(wordCategoriesData);
            setStartTime(startTimeData);
            setEndTime(endTimeData);

            const words = text.split(" ");
            let coloredWords = "";
            for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
              const word = words[wordIdx];
              const lettersMask = isLetterCorrectAll[wordIdx] || "";
              let wordTemp = "";
              for (let letterIdx = 0; letterIdx < word.length; letterIdx++) {
                const ok = lettersMask[letterIdx] === "1";
                const color = ok ? "green" : "red";
                wordTemp += `<font color=${color}>${word[letterIdx]}</font>`;
              }
              coloredWords += ` ${wrapWordForIndividualPlayback(
                wordTemp,
                wordIdx
              )}`;
            }
            setOriginalScriptHtml(coloredWords.trim());
            setCurrentSoundRecorded(true);

            // Clear any existing click handlers after updating HTML
            setTimeout(() => {
              const wordElements = document.querySelectorAll("[data-idx]");
              wordElements.forEach((element) => {
                element.removeAttribute("onclick");
                if (element instanceof HTMLElement) {
                  element.style.cursor = "default";
                }
              });
            }, 100);
          } catch (error) {
            console.error("Error in recording processing:", error);
            setMainTitle("Server Error: " + (error as Error).message);
          } finally {
            setUiBlocked(false);
          }
        };
      })
      .catch(() => {
        setMainTitle("Browser unsupported");
        setUiBlocked(false);
      });
    // warm up server (only if API is configured)
    if (apiMainPathSTS && STScoreAPIKey) {
      (async () => {
        try {
          await fetch(apiMainPathSTS + "/GetAccuracyFromRecordedAudio", {
            method: "post",
            body: JSON.stringify({
              title: "",
              base64Audio: "",
              language: AILanguage,
            }),
            headers: { "X-Api-Key": STScoreAPIKey },
          });
        } catch {}
      })();
    }
  }, [
    AILanguage,
    STScoreAPIKey,
    apiMainPathSTS,
    originalScriptHtml,
    playSoundForAnswerAccuracy,
    convertBlobToBase64,
  ]);

  const wrapWordForIndividualPlayback = (wordHtml: string, wordIdx: number) => {
    // Only hover functionality, no click to avoid conflicts with audio playback
    // Remove any existing click handlers by using span instead of anchor
    return `<span style="white-space:nowrap; cursor:default;" onmouseover="window.generateWordModal(${wordIdx})" data-idx="${wordIdx}" title="Hover to see IPA comparison">${wordHtml}</span>`;
  };

  return (
    <>
      <Head>
        <title>AI pronunciation trainer</title>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 max-w-[95%] mx-auto relative">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
          <div className="flex flex-row items-center justify-between gap-4 py-4 px-6 flex-wrap">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGoBack}
                disabled={uiBlocked || isUpdatingRecord}
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                {isUpdatingRecord ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </>
                )}
              </Button>
              <h1 id="main_title" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {mainTitle}
              </h1>
            </div>

            <div className="flex flex-row items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Language:</span>
                <div className="relative">
                  <button
                    id="languageBox"
                    onClick={() => setDropdownOpen((o) => !o)}
                    disabled={uiBlocked}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {languageLabel} ▼
                  </button>
                  {dropdownOpen && (
                    <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => changeLanguage("en-gb")}
                        disabled={uiBlocked}
                        className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        English-UK
                      </button>
                      <button
                        onClick={() => changeLanguage("en")}
                        disabled={uiBlocked}
                        className="block w-full text-left px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        English-USA
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {recordsList.length > 0 && (
                <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-700">
                    Câu {currentQuestionIndex + 1}/{recordsList.length}
                  </p>
                </div>
              )}
              
              {currentRecordId && currentRecord?.audioRecordingURL && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => setOpenBuyReviewModal(true)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Đánh giá phát âm
                </Button>
              )}
            </div>
          </div>
        </div>

        {openBuyReviewModal && currentRecordId && (
          <BuyReviewModal
            open={openBuyReviewModal}
            recordId={currentRecordId}
            onClose={() => setOpenBuyReviewModal(false)}
          />
        )}

        <div className="mb-[200px]"></div>

        {/* Main card container */}
        <div className="block absolute left-[2%] top-[18%] h-[59%] w-[96%] max-w-[96%] bg-white overflow-hidden rounded-3xl shadow-2xl border border-gray-200/50">
          {/* Left floating controls */}
          <div className="absolute top-4 left-4 flex flex-col items-start gap-4 z-10">
            <button
              id="playSampleAudio"
              onClick={playAudio}
              disabled={uiBlocked}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-4 border-white"
              title="Phát âm thanh mẫu"
            >
              <Play className="w-6 h-6" fill="white" />
            </button>

            <button
              id="playRecordedAudio"
              onClick={() => playRecording()}
              disabled={uiBlocked || !currentSoundRecorded}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-4 border-white"
              title="Phát âm thanh đã ghi"
            >
              <Volume2 className="w-6 h-6" fill="white" />
            </button>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-4 py-3 shadow-md border border-emerald-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Điểm số</p>
              <p id="pronunciation_accuracy" className="text-center text-2xl font-bold text-emerald-600">
                {pronunciationAccuracy || "-"}
              </p>
            </div>
            
            {/* AI Feedback Button - Only show when feedback is available */}
            {aiFeedback && aiFeedback.trim() && (
              <button
                onClick={() => setOpenAiFeedbackModal(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl shadow-lg border-4 border-white"
                title="Xem AI Feedback"
              >
                <MessageSquare className="w-6 h-6" fill="white" />
              </button>
            )}
          </div>

          {/* Scrollable text area */}
          <div
            id="text-area"
            className="overflow-y-auto absolute left-[10%] right-[10%] top-[2%] bottom-[2%] pr-2"
          >
            <p
              id="original_script"
              className="text-[2.5em] text-blue-600 max-w-[87%]"
              contentEditable
              dangerouslySetInnerHTML={{ __html: originalScriptHtml || "" }}
            />
            <p
              id="ipa_script"
              className="text-[1.8em] max-w-[87%] text-gray-500"
            >
              {ipaScript}
            </p>
            <p
              id="recorded_ipa_script"
              className="text-[1.8em] text-blue-600 max-w-[87%]"
            >
              {recordedIpaScript}
            </p>
            <p
              id="translated_script"
              className="text-[1.8em] text-gray-500 max-w-[87%]"
            >
              {translatedScript}
            </p>
          </div>


          {/* Navigation buttons */}
          {recordsList.length > 1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              <Button
                onClick={handlePreviousQuestion}
                disabled={uiBlocked || currentQuestionIndex === 0}
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={uiBlocked || currentQuestionIndex >= recordsList.length - 1}
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white border-0 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-7 h-7" />
              </Button>
            </div>
          )}
          {/* Next button on right side (fallback if no records list) */}
          {recordsList.length === 0 && (
            <div id="nextButtonDiv" className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                id="buttonNext"
                onClick={getNextSample}
                disabled={uiBlocked}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Sample
              </button>
            </div>
          )}
        </div>

        {/* AI Feedback Modal - Outside main container for proper z-index */}
        {openAiFeedbackModal && aiFeedback && aiFeedback.trim() && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setOpenAiFeedbackModal(false)}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      AI Feedback
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">Phân tích phát âm chi tiết</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenAiFeedbackModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div 
                  className="text-[1.1em] text-gray-800 leading-relaxed"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: (typeof aiFeedback === 'string' ? aiFeedback : String(aiFeedback || ''))
                      .split('\n')
                      .map((line: string) => {
                        // Handle headers (###)
                        if (line.trim().startsWith('###')) {
                          const text = line.replace(/^###\s*/, '');
                          return `<h3 style="font-size: 1.5em; font-weight: 700; color: #1e40af; margin-top: 1.2em; margin-bottom: 0.8em; padding-bottom: 0.5em; border-bottom: 2px solid #e0e7ff;">${text}</h3>`;
                        }
                        // Handle bold text (**text**)
                        const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #1e40af; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$1</strong>');
                        // Handle numbered lists
                        if (/^\d+\.\s/.test(processedLine.trim())) {
                          return `<div style="margin: 0.8em 0; padding: 1em 1.2em; padding-left: 1.5em; font-size: 1.05em; background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.05)); border-left: 4px solid #3b82f6; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">${processedLine}</div>`;
                        }
                        return `<p style="margin: 0.6em 0; line-height: 1.8;">${processedLine}</p>` || '<br />';
                      })
                      .join('')
                  }} 
                />
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <Button
                  onClick={() => setOpenAiFeedbackModal(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Small container for single word pair */}
        <div className="fixed left-[68%] top-[79%] h-[7%] w-[25%] bg-white overflow-hidden rounded-2xl shadow-[0_0_20px_8px_#d0d0d0] flex items-center justify-center text-center">
          <p
            id="single_word_ipa_pair"
            className="text-[1.5em]"
            dangerouslySetInnerHTML={{ __html: singleWordPair }}
          />
        </div>

        {/* Mic button */}
        <div
          id="btn-record"
          className="fixed left-1/2 top-[80%] -translate-x-1/2"
        >
          <button
            id="recordAudio"
            onClick={updateRecordingState}
            disabled={uiBlocked && !recording}
            className={`box-border w-[4.5em] h-[4.5em] rounded-full border-[6px] border-white text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed ${
              recording ? "bg-[#477c5b]" : "bg-[#49d67d]"
            }`}
          >
            <Mic id="recordIcon" className="w-10 h-10" />
          </button>
        </div>

       
      </div>
    </>
  );
};

export default PracticeRecordLayout;