import { apiRequest, API_CONFIG } from '../config/api';

export interface PhotoUploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  status: 'uploaded' | 'pending' | 'processing';
  size?: number;
}

export interface PresignedUploadData {
  uploadUrl: string;
  fields: Record<string, string>;
  key: string;
  publicUrl: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type UploadMethod = 'direct' | 'presigned';

export interface PhotoUploadOptions {
  method?: UploadMethod;
  onProgress?: (progress: UploadProgress) => void;
  userId?: string;
  prefix?: string;
}

class PhotoUploadService {
  
  /**
   * Upload photo using direct backend upload
   */
  private async uploadDirect(
    file: File | Blob, 
    options: PhotoUploadOptions = {}
  ): Promise<PhotoUploadResult> {
    const formData = new FormData();
    formData.append('photo', file);
    
    if (options.userId) {
      formData.append('userId', options.userId);
    }

    const response = await apiRequest('/api/photos', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload photo');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.photo;
  }

  /**
   * Upload photo using webcam endpoint (for camera captures)
   */
  async uploadWebcamPhoto(
    blob: Blob, 
    userId?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUploadResult> {
    const formData = new FormData();
    formData.append('photo', blob, 'webcam-capture.jpg');
    
    if (userId) {
      formData.append('userId', userId);
    }

    // Track upload progress if supported
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        });
      }

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.success) {
              resolve(result.photo);
            } else {
              reject(new Error(result.error || 'Upload failed'));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${API_CONFIG.baseURL}/api/photos/webcam`);
      xhr.send(formData);
    });
  }

  /**
   * Get presigned URL for direct R2 upload
   */
  private async getPresignedUploadData(prefix?: string): Promise<PresignedUploadData> {
    const response = await apiRequest('/api/photos/presigned', {
      method: 'POST',
      body: JSON.stringify({
        prefix: prefix || 'uploads',
        expiresIn: 300, // 5 minutes
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get presigned URL');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get presigned URL');
    }

    return result.upload;
  }

  /**
   * Upload directly to R2 using presigned URL
   */
  private async uploadToR2(
    file: File | Blob,
    presignedData: PresignedUploadData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUploadResult> {
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // R2 upload successful - return the public URL
          resolve({
            id: presignedData.key,
            url: presignedData.publicUrl,
            status: 'uploaded',
          });
        } else {
          reject(new Error(`R2 upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during R2 upload'));
      });

      // Prepare form data for R2
      const formData = new FormData();
      
      // Add required fields
      Object.entries(presignedData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add the file (must be last)
      formData.append('file', file);

      xhr.open('PUT', presignedData.uploadUrl);
      xhr.send(file); // For PUT requests, send file directly
    });
  }

  /**
   * Upload photo using presigned URL method
   */
  private async uploadPresigned(
    file: File | Blob,
    options: PhotoUploadOptions = {}
  ): Promise<PhotoUploadResult> {
    // Get presigned URL from backend
    const presignedData = await this.getPresignedUploadData(options.prefix);
    
    // Upload directly to R2
    return this.uploadToR2(file, presignedData, options.onProgress);
  }

  /**
   * Main upload method that chooses the best strategy
   */
  async uploadPhoto(
    file: File | Blob, 
    options: PhotoUploadOptions = {}
  ): Promise<PhotoUploadResult> {
    const { method = 'direct' } = options;

    try {
      if (method === 'presigned') {
        // Try presigned upload first
        return await this.uploadPresigned(file, options);
      } else {
        // Use direct backend upload
        return await this.uploadDirect(file, options);
      }
    } catch (error) {
      // If presigned fails, fallback to direct upload
      if (method === 'presigned') {
        console.warn('Presigned upload failed, falling back to direct upload:', error);
        return await this.uploadDirect(file, options);
      }
      throw error;
    }
  }

  /**
   * Delete photo by ID or URL
   */
  async deletePhoto(idOrUrl: string): Promise<boolean> {
    try {
      const isUrl = idOrUrl.startsWith('http');
      const endpoint = isUrl ? `/api/photos/${encodeURIComponent(idOrUrl)}` : `/api/photos/${idOrUrl}`;
      
      const response = await apiRequest(endpoint, {
        method: 'DELETE',
        body: JSON.stringify(isUrl ? { url: idOrUrl } : {}),
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to delete photo:', error);
      return false;
    }
  }

  /**
   * Helper to determine optimal upload method based on file size and browser support
   */
  getOptimalUploadMethod(fileSize: number): UploadMethod {
    // Use presigned URLs for larger files (> 2MB) to reduce backend load
    if (fileSize > 2 * 1024 * 1024) {
      return 'presigned';
    }
    
    // Use direct upload for smaller files for simplicity
    return 'direct';
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File | Blob): { valid: boolean; error?: string } {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check file type if it's a File object
    if (file instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'File must be a JPEG, PNG, or WebP image' };
      }
    }

    return { valid: true };
  }

  /**
   * Optimize image before upload (resize if too large)
   */
  async optimizeImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Create singleton instance
export const photoUploadService = new PhotoUploadService();