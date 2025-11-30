import React, { useState, useRef } from "react";
import axios from "axios";

function Recorder() {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      try {
        const res = await axios.post(
          "http://13.203.213.200:8000/transcribe",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setText(res.data.text);
      } catch (error) {
        console.error(error);
        setText("Error while transcribing");
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎤 Whisper Voice to Text</h2>

      {!recording && <button onClick={startRecording}>Start Recording</button>}
      {recording && <button onClick={stopRecording}>Stop Recording</button>}

      <h3>Transcription:</h3>
      <p>{text}</p>
    </div>
  );
}

export default Recorder;
