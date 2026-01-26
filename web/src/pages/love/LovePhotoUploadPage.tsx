import React, { useState, useRef, useCallback, useEffect } from 'react';
import { photoUploadService } from '../../services/photoUpload';

interface LovePhotoUploadPageProps {
  userId: string;
  onComplete: () => void;
}

type UploadMode = 'select' | 'camera' | 'preview';

export const LovePhotoUploadPage: React.FC<LovePhotoUploadPageProps> = ({
  userId,
  onComplete,
}) => {
  const [mode, setMode] = useState<UploadMode>('select');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = photoUploadService.validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    setPhotoBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMode('preview');
  };

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setMode('camera');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setError('Camera access denied. Please allow camera permissions or upload a photo instead.');
      setMode('select');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
    });

    if (!blob) {
      setError('Failed to capture photo. Please try again.');
      return;
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhotoBlob(blob);
    setPreviewUrl(dataUrl);
    stopCamera();
    setMode('preview');
  }, [stopCamera]);

  const retakePhoto = () => {
    setPreviewUrl(null);
    setPhotoBlob(null);
    setMode('select');
  };

  const handleUpload = async () => {
    if (!photoBlob) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await photoUploadService.uploadPhoto(photoBlob, {
        userId,
        onProgress: (progress) => {
          setUploadProgress(progress.percentage);
        },
      });

      setUploadProgress(100);
      onComplete();
    } catch (err) {
      console.error('Photo upload failed:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Select mode - choose between upload or camera
  if (mode === 'select') {
    return (
      <div className="min-h-screen flex flex-col safe-area-inset" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      }}>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md mx-auto text-center w-full">
            {/* Icon */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/30">
                <span className="text-5xl">📸</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
              Add Your Photo
            </h1>

            <p className="text-white/80 text-lg mb-8">
              Add a photo so potential matches can see you
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white rounded-2xl font-bold text-purple-600 hover:bg-gray-50 transition-colors shadow-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo
              </button>

              <button
                onClick={startCamera}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white/15 border border-white/30 rounded-2xl font-bold text-white hover:bg-white/25 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photo
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 text-center">
          <p className="text-xs text-white/40 font-medium tracking-wide">
            Love@Berkeley
          </p>
        </footer>
      </div>
    );
  }

  // Camera mode
  if (mode === 'camera') {
    return (
      <div className="min-h-screen flex flex-col safe-area-inset" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-black text-white mb-4 text-center drop-shadow-lg">
              Take a Photo
            </h1>

            {/* Camera View */}
            <div className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* Face guide */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-48 border-2 border-white/50 rounded-full" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white/80 text-sm font-medium">
                    Position your face within the circle
                  </p>
                </div>
              </div>
            </div>

            {/* Capture Button */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  stopCamera();
                  setMode('select');
                }}
                className="px-6 py-3 bg-white/15 border border-white/30 rounded-xl font-bold text-white hover:bg-white/25 transition-colors"
              >
                Cancel
              </button>

              {isCameraActive && (
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 bg-white rounded-full mx-auto" />
                </button>
              )}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Preview mode
  return (
    <div className="min-h-screen flex flex-col safe-area-inset" style={{
      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
    }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-black text-white mb-4 text-center drop-shadow-lg">
            Looking Good!
          </h1>

          {/* Photo Preview */}
          <div className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden mb-6">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Your photo"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Uploading...</span>
                <span className="text-white text-sm">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-4 px-4 rounded-2xl font-bold shadow-xl transition-colors ${
                isUploading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-gray-50'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Continue'}
            </button>

            <button
              onClick={retakePhoto}
              disabled={isUploading}
              className="w-full py-4 px-4 bg-white/15 border border-white/30 rounded-2xl font-bold text-white hover:bg-white/25 transition-colors disabled:opacity-50"
            >
              Choose Different Photo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-white/40 font-medium tracking-wide">
          Love@Berkeley
        </p>
      </footer>
    </div>
  );
};
