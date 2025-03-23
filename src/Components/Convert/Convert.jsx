import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Convert.css";

const Convert = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [recognizedText, setRecognizedText] = useState("Waiting for detection...");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("hi"); // Default to Hindi
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null); // Ref for the audio element
  const lastProcessedTime = useRef(0); // Track the last processed frame time

  // Effect to capture frames at intervals when the camera is on
  useEffect(() => {
    let interval;
    if (isCameraOn) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now - lastProcessedTime.current >= 1000) { // Process frames at most once per second
          captureFrame();
          lastProcessedTime.current = now;
        }
      }, 500); // Check every 500ms
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount or camera off
  }, [isCameraOn, targetLanguage]);

  // Function to start the webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setRecognizedText("Failed to access webcam");
    }
  };

  // Function to stop the webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
    setRecognizedText("Waiting for detection...");
    setTranslatedText("");
  };

  // Function to capture a frame from the webcam
  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas image to a blob and send it to the backend
    canvas.toBlob(sendFrame, "image/jpeg");
  };

  // Function to send the captured frame to the Flask backend
  const sendFrame = async (blob) => {
    const formData = new FormData();
    formData.append("image", blob);

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const detectedText = response.data.recognized_text;
      setRecognizedText(detectedText);
      translateText(detectedText); // Translate the detected text
    } catch (error) {
      console.error("Error sending frame:", error);
      setRecognizedText("Detection failed");
    }
  };

  // Function to translate text from English to the selected Indian regional language
  const translateText = async (text) => {
    if (text && text !== "No sign detected") {
      try {
        const response = await axios.post("http://127.0.0.1:5000/translate", {
          text: text,
          source_language: "en", // Always translate from English
          target_language: targetLanguage, // Translate to the selected Indian regional language
        });

        if (response.data && response.data.translated_text) {
          setTranslatedText(response.data.translated_text);

          // Play the base64-encoded audio
          if (response.data.audio_base64) {
            const audioSrc = `data:audio/mp3;base64,${response.data.audio_base64}`;
            if (audioRef.current) {
              audioRef.current.src = audioSrc;
              audioRef.current.play();
            }
          }
        } else {
          console.error("Unexpected API response structure:", response.data);
          setTranslatedText("Translation failed");
        }
      } catch (error) {
        console.error("Error translating text:", error.response ? error.response.data : error.message);
        setTranslatedText("Translation failed");
      }
    }
  };

  // Function to handle target language change
  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  return (
    <div className="webcam-container">
      <div className="button-container">
        <button onClick={startCamera} disabled={isCameraOn}>
          Open Webcam
        </button>
        <button onClick={stopCamera} disabled={!isCameraOn} className="destructive">
          Close Webcam
        </button>
        <select value={targetLanguage} onChange={handleTargetLanguageChange}>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="bn">Bengali</option>
          <option value="gu">Gujarati</option>
          <option value="mr">Marathi</option>
          <option value="pa">Punjabi</option>
          <option value="ur">Urdu</option>
        </select>
      </div>
      <div className="webcam">
        <div className="webcam-box">
          <video ref={videoRef} autoPlay className="webcam-video" hidden={!isCameraOn} />
          <canvas ref={canvasRef} className="overlay-canvas" hidden />
        </div>
        <div className="result">
          <div className="output-box">
            <h2>Detected Sign:</h2>
            <p className="detected-text">{recognizedText}</p>
          </div>
          <div className="output-box">
            <h2>Translated Text:</h2>
            <p className="translated-text">{translatedText}</p>
          </div>
        </div>
      </div>
      {/* Audio element for playing TTS audio */}
      <audio ref={audioRef} hidden />
    </div>
  );
};

export default Convert;