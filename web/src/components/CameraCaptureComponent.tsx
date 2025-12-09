import React, { useRef, useState, useCallback, useEffect } from 'react';
import { photoUploadService, type UploadProgress } from '../services/photoUpload';
// TODO: Import from shared package once workspace is properly configured
interface CameraCapture {
  blob: Blob;
  dataUrl: string;
  timestamp: number;
  uploadResult?: {
    id: string;
    url: string;
    thumbnailUrl?: string;
  };
}

interface CameraCaptureProps {
  onCapture: (capture: CameraCapture) => void;
  onError: (error: string) => void;
  className?: string;
  userId?: string;
  autoUpload?: boolean;
  onUploadProgress?: (progress: UploadProgress) => void;
}

export const CameraCaptureComponent: React.FC<CameraCaptureProps> = ({
  onCapture,
  onError,
  className = '',
  userId,
  autoUpload = true,
  onUploadProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setPermissionDenied(false);
      
      // Request camera permissions with optimal settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user', // Front-facing camera
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      setPermissionDenied(true);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          onError('Camera permission denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
          onError('No camera found on this device.');
        } else {
          onError('Failed to access camera. Please check your device settings.');
        }
      }
    }
  }, [onError]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreamActive(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreamActive) return;

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob for upload
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          'image/jpeg',
          0.8 // Quality setting
        );
      });

      // Create data URL for preview
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);

      // Create initial capture object
      let capture: CameraCapture = {
        blob,
        dataUrl,
        timestamp: Date.now(),
      };

      // Upload if autoUpload is enabled
      if (autoUpload) {
        try {
          setIsUploading(true);
          setUploadProgress({ loaded: 0, total: blob.size, percentage: 0 });

          const uploadResult = await photoUploadService.uploadWebcamPhoto(
            blob,
            userId,
            (progress) => {
              setUploadProgress(progress);
              onUploadProgress?.(progress);
            }
          );

          capture.uploadResult = uploadResult;
          setUploadProgress({ loaded: blob.size, total: blob.size, percentage: 100 });
          
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          onError('Photo captured but upload failed. You can retry later.');
          // Continue with local capture even if upload fails
        } finally {
          setIsUploading(false);
          setUploadProgress(null);
        }
      }

      onCapture(capture);
      
      // Stop camera after successful capture
      stopCamera();
      
    } catch (error) {
      console.error('Photo capture failed:', error);
      onError('Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isStreamActive, onCapture, onError, stopCamera, autoUpload, userId, onUploadProgress]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  return (
    <div className={`camera-capture relative ${className}`}>
      {/* Video Preview */}
      {!capturedImage && (
        <div className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror effect for selfie
          />
          
          {/* Overlay Guide */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Face guide circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 border-2 border-white/50 rounded-full" />
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white/80 text-sm font-medium">
                Position your face within the circle
              </p>
            </div>
          </div>

          {/* Permission Denied Overlay */}
          {permissionDenied && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📷</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Camera Access Required
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  We need camera access to take your profile photo
                </p>
                <button
                  onClick={startCamera}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden">
          <img
            src={capturedImage}
            alt="Captured photo"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex gap-3">
            <button
              onClick={retakePhoto}
              className="flex-1 bg-gray-700/80 backdrop-blur text-white py-3 px-4 rounded-lg font-medium"
            >
              Retake
            </button>
            <button
              onClick={() => {/* Photo is already captured via onCapture */}}
              className="flex-1 bg-green-600/80 backdrop-blur text-white py-3 px-4 rounded-lg font-medium"
            >
              Use Photo
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <div className="mt-4 p-4 bg-gray-800/80 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Uploading photo...</span>
            <span className="text-white text-sm">{uploadProgress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Capture Button */}
      {isStreamActive && !capturedImage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={capturePhoto}
            disabled={isCapturing || !isStreamActive || isUploading}
            className={`w-20 h-20 rounded-full border-4 border-white bg-transparent transition-all duration-200 ${
              isCapturing || !isStreamActive || isUploading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/20 active:scale-95'
            }`}
          >
            <div className="w-16 h-16 bg-white rounded-full mx-auto" />
          </button>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
};