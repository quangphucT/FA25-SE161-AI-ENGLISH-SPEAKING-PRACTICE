"use client";

import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PracticeMainLayout = () => {
  const [language, setLanguage] = useState<"en-gb" | "en">("en-gb");
  const [score, setScore] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<
    "random" | "easy" | "medium" | "hard"
  >("easy");
  const [recording, setRecording] = useState<boolean>(false);
  const [uiBlocked, setUiBlocked] = useState<boolean>(false);
  const [mainTitle, setMainTitle] = useState<string>(
    "AI Pronunciation Trainer"
  );
  const [pronunciationAccuracy, setPronunciationAccuracy] =
    useState<string>("");
  const [originalScriptHtml, setOriginalScriptHtml] = useState<string>(
   // "Click on t
  );
  const [ipaScript, setIpaScript] = useState<string>(

  );
  const [recordedIpaScript, setRecordedIpaScript] = useState<string>(

  );
  const [translatedScript, setTranslatedScript] = useState<string>(
  
  );
  const [singleWordPair, setSingleWordPair] =
    useState<string>("Reference | Spoken");
  const [currentSample, setCurrentSample] = useState<number>(0);
  const [currentSoundRecorded, setCurrentSoundRecorded] =
    useState<boolean>(false);
  const [scoreMultiplier, setScoreMultiplier] = useState<number>(1);
  const [serverIsInitialized, setServerIsInitialized] =
    useState<boolean>(false);
  const [serverWorking, setServerWorking] = useState<boolean>(true);
  // removed native/recording toggle state (not used in UI)
  // removed unused lettersOfWordAreCorrect state
  const [shouldFetchNext, setShouldFetchNext] = useState<boolean>(false);
  const [languageFound, setLanguageFound] = useState<boolean>(true);

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
  const soundFileGoodRef = useRef<AudioBuffer | null>(null);
  const soundFileOkayRef = useRef<AudioBuffer | null>(null);
  const soundFileBadRef = useRef<AudioBuffer | null>(null);

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
  const apiMainPathSample = "http://127.0.0.1:8000/";// "https://ai.aespwithai.com"; // Empty like original
  const apiMainPathSTS = "http://127.0.0.1:8000/";// "https://ai.aespwithai.com"; // Empty like original

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
      setScore((s) => Math.round(s + parsedAcc * scoreMultiplier));

    setMainTitle("Processing new sample...");
    const difficultyIdx =
      difficulty === "random"
        ? 0
        : difficulty === "easy"
        ? 1
        : difficulty === "medium"
        ? 2
        : 3;
    const nextMultiplier =
      difficulty === "random"
        ? 1.3
        : difficulty === "easy"
        ? 1.0
        : difficulty === "medium"
        ? 1.3
        : 1.6;
    setScoreMultiplier(nextMultiplier);

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
          category: String(difficultyIdx),
          language: AILanguage,
          question: "I love to learn new languages.",
        }),
        headers: { "X-Api-Key": STScoreAPIKey },
      });
      const data = await res.json();

      setCurrentText([data.real_transcript]);
      setOriginalScriptHtml(data.real_transcript);
      setIpaScript(`/ ${data.ipa_transcript} /`);
      setRecordedIpaScript("");
      setPronunciationAccuracy("");
      setSingleWordPair("Reference | Spoken");
      setCurrentSample((s) => s + 1);
      setMainTitle("AI Pronunciation Trainer");
      setTranslatedScript(data.transcript_translation);
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
    difficulty,
    pronunciationAccuracy,
    scoreMultiplier,
    serverIsInitialized,
    serverWorking,
    initializeServer,
    cacheSoundFiles,
  ]);

  const refresh = useCallback(() => {
    if (typeof window !== "undefined") window.location.reload();
  }, []);

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

  // Fetch initial sample on component mount
  useEffect(() => {
    getNextSample();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Update refs when functions change - use useEffect to avoid stale closures
  useEffect(() => {
    generateWordModalRef.current = generateWordModal;
    playNativeAndRecordedWordRef.current = playNativeAndRecordedWord;
    playReferenceWordRef.current = playReferenceWord;
    playSpokenWordRef.current = playSpokenWord;
  }, [
    generateWordModal,
    playNativeAndRecordedWord,
    playReferenceWord,
    playSpokenWord,
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

            const acc = parseFloat(data.pronunciation_accuracy);
            if (!Number.isNaN(acc)) playSoundForAnswerAccuracy(acc);
            setRecordedIpaScript(`/ ${data.ipa_transcript} /`);
            setMainTitle("AI Pronunciation Trainer");
            setPronunciationAccuracy(`${data.pronunciation_accuracy}%`);

            const isLetterCorrectAll: string[] = String(
              data.is_letter_correct_all_words || ""
            ).split(" ");

            // Store word-level data for playback
            const realTranscriptsIpaData =
              data.real_transcripts_ipa?.split(" ") || [];
            const matchedTranscriptsIpaData =
              data.matched_transcripts_ipa?.split(" ") || [];
            const wordCategoriesData =
              data.pair_accuracy_category?.split(" ") || [];
            const startTimeData = data.start_time?.split(" ") || [];
            const endTimeData = data.end_time?.split(" ") || [];

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
      <div className="min-h-screen w-full bg-white max-w-[90%] mx-auto relative">
        <div className="flex flex-row items-center gap-4 py-4">
          <button
            onClick={refresh}
            className="inline-block ml-6 text-gray-700 hover:text-gray-900"
          >
            <i className="material-icons text-[3.5em] align-middle">home</i>
          </button>
          <h1 id="main_title" className="text-2xl font-semibold">
            {mainTitle}
          </h1>
        </div>

        <div className="mx-auto">
          <div className="flex flex-row items-center gap-4">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#363850] to-[#153C57] text-2xl ml-2">
              Language:
            </p>

            <div className="relative inline-block">
              <button
                id="languageBox"
                onClick={() => setDropdownOpen((o) => !o)}
                disabled={uiBlocked}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#363850] to-[#153C57] text-base px-2 py-1 border border-transparent rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {languageLabel}
              </button>
              {dropdownOpen && (
                <div className="absolute mt-1 w-40 bg-white rounded shadow-md z-10">
                  <button
                    onClick={() => changeLanguage("en-gb")}
                    disabled={uiBlocked}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    English-UK
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    disabled={uiBlocked}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    English-USA
                  </button>
                </div>
              )}
            </div>

            <p id="section_accuracy" className="text-black text-lg">
              | Score: {score} - ({currentSample})
            </p>
          </div>
        </div>

        <div className="mb-[200px]"></div>

        {/* Main card container */}
        <div className="block absolute left-[2%] top-[18%] h-[59%] w-[96%] max-w-[96%] bg-white overflow-hidden rounded-2xl shadow-[0_0_20px_8px_#d0d0d0]">
          {/* Left floating controls */}
          <div className="absolute top-[2%] left-0 flex flex-col items-start gap-6 p-2">
            <button
              id="playSampleAudio"
              onClick={playAudio}
              disabled={uiBlocked}
              className={`box-border w-12 h-12 rounded-full border-[6px] border-white text-white bg-[#467387] flex items-center justify-center transition disabled:opacity-50`}
            >
              <i className="material-icons text-base">play_arrow</i>
            </button>

            <button
              id="playRecordedAudio"
              onClick={() => playRecording()}
              disabled={uiBlocked || !currentSoundRecorded}
              className={`box-border w-12 h-12 rounded-full border-[6px] border-white text-white bg-[#467387] flex items-center justify-center transition disabled:opacity-50`}
            >
              <i className="material-icons text-base">record_voice_over</i>
            </button>

            <p id="pronunciation_accuracy" className="text-center text-black">
              {pronunciationAccuracy || "-"}
            </p>
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

          {/* Next button on right side */}
          <div id="nextButtonDiv" className="absolute left-[90%] top-0 h-full">
            <button
              id="buttonNext"
              onClick={getNextSample}
              disabled={uiBlocked}
              className="rounded block border-0 text-white text-left text-[3em] box-border absolute top-0 left-0 right-[2%] bottom-[2%] bg-[#58636d] w-[10em] transition-all hover:bg-[#6383a1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span></span>
            </button>
          </div>
        </div>

        {/* Small container for single word pair */}
        <div className="fixed left-[68%] top-[79%] h-[7%] w-[30%] bg-white overflow-hidden rounded-2xl shadow-[0_0_20px_8px_#d0d0d0] flex items-center justify-center text-center">
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
            <i id="recordIcon" className="material-icons text-[2.5em]">
              mic
            </i>
          </button>
        </div>

        {/* Difficulty radio buttons */}
        <div
          id="radio-difficulty"
          className="fixed bottom-2 left-2 bg-[#f6f7fd] p-1 rounded shadow-[inset_0_0_0_3px_rgba(35,33,45,0.3),0_0_0_3px_rgba(185,185,185,0.3)] flex gap-1"
        >
          <label className="px-2 py-1">
            <input
              type="radio"
              name="length"
              checked={difficulty === "random"}
              onChange={() => {
                setDifficulty("random");
                getNextSample();
              }}
            />
            <span className="ml-1">Random</span>
          </label>
          <label className="px-2 py-1">
            <input
              type="radio"
              name="length"
              checked={difficulty === "easy"}
              onChange={() => {
                setDifficulty("easy");
                getNextSample();
              }}
            />
            <span className="ml-1">Easy</span>
          </label>
          <label className="px-2 py-1">
            <input
              type="radio"
              name="length"
              checked={difficulty === "medium"}
              onChange={() => {
                setDifficulty("medium");
                getNextSample();
              }}
            />
            <span className="ml-1">Medium</span>
          </label>
          <label className="px-2 py-1">
            <input
              type="radio"
              name="length"
              checked={difficulty === "hard"}
              onChange={() => {
                setDifficulty("hard");
                getNextSample();
              }}
            />

            <span className="ml-1">Hard</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default PracticeMainLayout;
