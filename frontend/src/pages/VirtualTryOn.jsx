import React, { useRef, useEffect, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-wasm";
import { Pose } from "@mediapipe/pose";
import { Camera, CameraOff } from "lucide-react";
import { useLocation } from "react-router-dom";
import Title from "../components/Title";

const VirtualTryOn = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [overlayImg, setOverlayImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const exampleVideos = [
    {
      video: "https://cdn.shopify.com/videos/c/o/v/fd1d3228b14a46a8ab9cf98d7644de90.mp4",
      image: "https://okhai.org/cdn/shop/files/abcd_99d512d1-7752-4dca-bd6c-e71e0d98139c.jpg?v=1717139293",
    },
    {
      video: "https://cdn.shopify.com/videos/c/o/v/5b5ac6ebace54f98b6b182bf010a0d8e.mp4",
      image: "https://okhai.org/cdn/shop/files/6_30d3ac88-1ebc-4266-b286-09e49e8657ca.jpg?v=1717074927",
    },
  ];

  const location = useLocation();
  const productImage = location.state?.image;

  useEffect(() => {
    const loadBackendAndModel = async () => {
      try {
        await tf.setBackend("wasm");
        await tf.ready();
        console.log("Backend:", tf.getBackend());

        const loadedModel = await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.5,
          quantBytes: 2,
        });
        setModel(loadedModel);
      } catch (err) {
        console.error("Error loading BodyPix model:", err);
        setError("Could not load body detection model.");
      }
    };

    loadBackendAndModel();
    return () => stopWebcam();
  }, []);

  useEffect(() => {
    if (productImage) {
      const img = new Image();
      img.src = productImage;
      img.onload = () => setOverlayImg(img);
    }
  }, [productImage]);

  const startPoseDetection = async () => {
    if (!videoRef.current) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => onPoseResults(results));

    const processFrame = async () => {
      if (videoRef.current?.readyState === 4) {
        await pose.send({ image: videoRef.current });
      }
      requestAnimationFrame(processFrame);
    };
    processFrame();
  };

  const onPoseResults = (results) => {
    if (!canvasRef.current || !overlayImg) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(results.image, 0, 0, 640, 480);

    if (results.poseLandmarks) {
      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];

      const shoulderX = ((leftShoulder.x + rightShoulder.x) / 2) * 640;
      const shoulderY = ((leftShoulder.y + rightShoulder.y) / 2) * 480;

      const clothingWidth = Math.abs(leftShoulder.x - rightShoulder.x) * 640 * 1.5;
      const clothingHeight = (clothingWidth * overlayImg.height) / overlayImg.width;

      ctx.globalAlpha = 0.8;
      ctx.drawImage(overlayImg, shoulderX - clothingWidth / 2, shoulderY, clothingWidth, clothingHeight);
      ctx.globalAlpha = 1;
    }
  };

  const startWebcam = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsWebcamActive(true);
          setLoading(false);
          startPoseDetection();
        };
      }
    } catch (err) {
      console.error("Webcam error:", err);
      setError("Could not access webcam. Ensure camera permissions are granted.");
      setLoading(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
    }
  };

  return (
    <div className="min-h-screen m-20 px-6 py-10 bg-primary">
      <div className="text-3xl text-text text-center mb-10">
        <Title text1="Virtual" text2="Try-On" />
      </div>

      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-semibold text-secondary">Virtual Try-On Experience</h2>
          <button
            onClick={isWebcamActive ? stopWebcam : startWebcam}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isWebcamActive ? <CameraOff size={20} /> : <Camera size={20} />}
            {isWebcamActive ? "Stop Camera" : "Start Camera"}
          </button>
        </div>

        {loading && <div className="text-center mt-4 text-blue-600">Loading camera...</div>}
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg mt-4">{error}</div>}

        <div className="relative mt-6 aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className={`absolute inset-0 w-full h-full object-cover ${!isWebcamActive && "hidden"}`} />
          <canvas ref={canvasRef} width={640} height={480} className={`absolute inset-0 w-full h-full object-cover ${!isWebcamActive && "hidden"}`} />

          {!isWebcamActive && <div className="absolute inset-0 flex items-center justify-center text-gray-500">Camera is turned off</div>}
        </div>

        <div className="text-center text-text text-3xl mt-16 mb-4">
          <Title text1="Try" text2="These Looks" />
        </div>

        <div className="flex justify-center gap-6 mt-6">
          {exampleVideos.map((item, index) => (
            <div key={index} className="relative w-[200px] h-[300px] rounded-lg shadow-lg hover:scale-105 transition cursor-pointer" onClick={() => setSelectedVideo(item.video)}>
              <img src={item.image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;