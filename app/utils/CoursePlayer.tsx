'use client'
import React, { FC, useEffect, useRef, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useUpdateWatchTimeMutation } from "@/redux/features/user/userApi";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
  const [showOverlay, setShowOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [updateWatchTime] = useUpdateWatchTimeMutation();

  let faceNotDetectedStart = useRef<number | null>(null);
  let faceDetectedStart = useRef<number | null>(null);
  const sessionWatchTimeRef = useRef(0);

  // Load face-api dynamically
  useEffect(() => {
    let faceapi: any;

    const loadModels = async () => {
      faceapi = await import('@vladmandic/face-api');
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setShowOverlay(true);
      }
    };

    const detectLoop = async () => {
      await loadModels();
      await startCamera();

      const interval = setInterval(async () => {
        if (!webcamRef.current) return;

        const detections = await faceapi.detectAllFaces(
          webcamRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        const hasFace = detections.length > 0;
        const now = Date.now();

        if (!hasFace) {
          faceDetectedStart.current = null;
          if (!faceNotDetectedStart.current) faceNotDetectedStart.current = now;

          const timeWithoutFace = now - (faceNotDetectedStart.current || now);
          if (timeWithoutFace > 1000) {
            setShowOverlay(true);
            pauseVideo();
          }
        } else {
          faceNotDetectedStart.current = null;
          if (!faceDetectedStart.current) faceDetectedStart.current = now;

          const timeWithFace = now - (faceDetectedStart.current || now);
          if (timeWithFace > 1000) {
            setShowOverlay(false);
          }
        }
      }, 2000);

      return () => clearInterval(interval);
    };

    detectLoop();
  }, []);

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    console.log("⏸️ Video paused");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended) {
        sessionWatchTimeRef.current += 10;
        console.log("⏱️ Local session watchTime:", sessionWatchTimeRef.current);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionWatchTimeRef.current > 0) {
        updateWatchTime({ watchTime: sessionWatchTimeRef.current });
        console.log("📤 Synced total session watchTime:", sessionWatchTimeRef.current);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [updateWatchTime]);

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
      <video
        ref={videoRef}
        controls
        src={"/videos/video.mp4"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
      <video
        ref={webcamRef}
        autoPlay
        muted
        playsInline
        style={{ display: "none" }}
      />
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            zIndex: 10,
          }}
        >
          Face not detected. Please stay attentive and resume when ready.
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
