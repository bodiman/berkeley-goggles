import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
  endpoint: string;
}

export interface ImageUploadOptions {
  quality?: number;
  width?: number;
  height?: number;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface UploadResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
}

export interface PresignedUploadData {
  uploadUrl: string;
  fields: Record<string, string>;
  key: string;
  publicUrl: string;
}

class CloudflareR2Service {
  private client: S3Client;
  private config: R2Config;

  constructor() {
    this.config = {
      accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      publicDomain: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN!,
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
    };

    // Validate required environment variables
    const missingVars = Object.entries(this.config)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing required R2 environment variables: ${missingVars.join(', ')}`);
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  /**
   * Generate a unique key for storing images
   */
  private generateImageKey(prefix: string, extension: string = 'jpg'): string {
    const timestamp = Date.now();
    const uuid = uuidv4();
    return `${prefix}/${timestamp}-${uuid}.${extension}`;
  }

  /**
   * Process image with Sharp - resize and optimize
   */
  private async processImage(
    buffer: Buffer,
    options: ImageUploadOptions = {}
  ): Promise<{ main: Buffer; thumbnail?: Buffer }> {
    const {
      quality = 85,
      width = 800,
      height = 800,
      generateThumbnail = true,
      thumbnailSize = 200,
    } = options;

    // Process main image
    const mainImage = await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'centre',
      })
      .jpeg({ quality })
      .toBuffer();

    // Generate thumbnail if requested
    let thumbnail: Buffer | undefined;
    if (generateThumbnail) {
      thumbnail = await sharp(buffer)
        .resize(thumbnailSize, thumbnailSize, {
          fit: 'cover',
          position: 'centre',
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    return { main: mainImage, thumbnail };
  }

  /**
   * Upload image buffer directly to R2
   */
  async uploadImage(
    buffer: Buffer,
    prefix: string = 'images',
    options: ImageUploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const { main, thumbnail } = await this.processImage(buffer, options);
      const imageId = uuidv4();
      const mainKey = this.generateImageKey(prefix);
      const thumbnailKey = thumbnail ? this.generateImageKey(`${prefix}/thumbnails`) : undefined;

      // Upload main image
      const mainUploadCommand = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: mainKey,
        Body: main,
        ContentType: 'image/jpeg',
        Metadata: {
          imageId,
          originalSize: buffer.length.toString(),
          processedAt: new Date().toISOString(),
        },
      });

      await this.client.send(mainUploadCommand);

      // Upload thumbnail if generated
      let thumbnailUrl: string | undefined;
      if (thumbnail && thumbnailKey) {
        const thumbnailUploadCommand = new PutObjectCommand({
          Bucket: this.config.bucketName,
          Key: thumbnailKey,
          Body: thumbnail,
          ContentType: 'image/jpeg',
          Metadata: {
            imageId,
            isThumbnail: 'true',
            processedAt: new Date().toISOString(),
          },
        });

        await this.client.send(thumbnailUploadCommand);
        thumbnailUrl = `https://${this.config.publicDomain}/${thumbnailKey}`;
      }

      return {
        id: imageId,
        url: `https://${this.config.publicDomain}/${mainKey}`,
        thumbnailUrl,
        filename: mainKey,
        size: main.length,
      };
    } catch (error) {
      console.error('R2 upload error:', error);
      throw new Error('Failed to upload image to R2');
    }
  }

  /**
   * Generate presigned URL for direct frontend uploads
   */
  async generatePresignedUpload(
    prefix: string = 'uploads',
    expiresIn: number = 300 // 5 minutes
  ): Promise<PresignedUploadData> {
    try {
      const key = this.generateImageKey(prefix);
      
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: 'image/jpeg',
      });

      const uploadUrl = await getSignedUrl(this.client, command, {
        expiresIn,
      });

      return {
        uploadUrl,
        fields: {
          key,
          'Content-Type': 'image/jpeg',
        },
        key,
        publicUrl: `https://${this.config.publicDomain}/${key}`,
      };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate presigned upload URL');
    }
  }

  /**
   * Delete image from R2
   */
  async deleteImage(key: string): Promise<boolean> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error('R2 delete error:', error);
      return false;
    }
  }

  /**
   * Upload sample image with specific processing
   */
  async uploadSampleImage(
    buffer: Buffer,
    filename: string,
    metadata: { gender?: string; age?: number } = {}
  ): Promise<UploadResult> {
    const options: ImageUploadOptions = {
      quality: 90,
      width: 640,
      height: 640,
      generateThumbnail: true,
      thumbnailSize: 160,
    };

    const result = await this.uploadImage(buffer, 'samples', options);

    // Store additional metadata for sample images
    const metadataKey = `samples/metadata/${result.id}.json`;
    const metadataCommand = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: metadataKey,
      Body: JSON.stringify({
        ...metadata,
        originalFilename: filename,
        uploadedAt: new Date().toISOString(),
        imageId: result.id,
      }),
      ContentType: 'application/json',
    });

    try {
      await this.client.send(metadataCommand);
    } catch (error) {
      console.warn('Failed to upload metadata for sample image:', error);
    }

    return result;
  }

  /**
   * Upload user profile photo with specific processing
   */
  async uploadUserPhoto(
    buffer: Buffer,
    userId: string
  ): Promise<UploadResult> {
    const options: ImageUploadOptions = {
      quality: 85,
      width: 640,
      height: 640,
      generateThumbnail: true,
      thumbnailSize: 160,
    };

    const result = await this.uploadImage(buffer, `users/${userId}`, options);

    return result;
  }

  /**
   * Get public URL for a given key
   */
  getPublicUrl(key: string): string {
    return `https://${this.config.publicDomain}/${key}`;
  }

  /**
   * Extract key from a public URL
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === this.config.publicDomain || 
          urlObj.hostname.endsWith('.r2.dev')) {
        return urlObj.pathname.substring(1); // Remove leading slash
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Batch upload images with progress callback
   */
  async batchUpload(
    images: Array<{ buffer: Buffer; filename: string; metadata?: any }>,
    prefix: string = 'batch',
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const { buffer, filename, metadata = {} } = images[i];
      
      try {
        const result = await this.uploadImage(buffer, prefix);
        results.push(result);
        
        if (onProgress) {
          onProgress(i + 1, images.length);
        }
      } catch (error) {
        console.error(`Failed to upload ${filename}:`, error);
        // Continue with other uploads instead of failing completely
      }
    }

    return results;
  }
}

// Lazy-loaded singleton instance
let _r2ServiceInstance: CloudflareR2Service | null = null;

export const r2Service = {
  get instance(): CloudflareR2Service {
    if (!_r2ServiceInstance) {
      _r2ServiceInstance = new CloudflareR2Service();
    }
    return _r2ServiceInstance;
  },

  // Proxy all methods
  uploadImage: (...args: Parameters<CloudflareR2Service['uploadImage']>) => 
    r2Service.instance.uploadImage(...args),
  
  generatePresignedUpload: (...args: Parameters<CloudflareR2Service['generatePresignedUpload']>) => 
    r2Service.instance.generatePresignedUpload(...args),
  
  deleteImage: (...args: Parameters<CloudflareR2Service['deleteImage']>) => 
    r2Service.instance.deleteImage(...args),
  
  uploadSampleImage: (...args: Parameters<CloudflareR2Service['uploadSampleImage']>) => 
    r2Service.instance.uploadSampleImage(...args),
  
  uploadUserPhoto: (...args: Parameters<CloudflareR2Service['uploadUserPhoto']>) => 
    r2Service.instance.uploadUserPhoto(...args),
  
  getPublicUrl: (...args: Parameters<CloudflareR2Service['getPublicUrl']>) => 
    r2Service.instance.getPublicUrl(...args),
  
  extractKeyFromUrl: (...args: Parameters<CloudflareR2Service['extractKeyFromUrl']>) => 
    r2Service.instance.extractKeyFromUrl(...args),
  
  batchUpload: (...args: Parameters<CloudflareR2Service['batchUpload']>) => 
    r2Service.instance.batchUpload(...args),
};

// Helper function to check if R2 is configured
export const isR2Configured = (): boolean => {
  return !!(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME &&
    process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN &&
    process.env.CLOUDFLARE_R2_ENDPOINT
  );
};

/**
 * Validates if a URL is a proper R2 URL for sample images
 */
export const isValidR2SampleUrl = (url: string): boolean => {
  if (!isR2Configured()) return false;
  
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;
  return url.startsWith(`https://${publicDomain}/samples/`);
};

/**
 * Converts a local sample image path to R2 URL format
 */
export const convertLocalToR2SampleUrl = (localPath: string): string => {
  if (!isR2Configured()) return localPath;
  
  const filename = localPath.replace('/sample-images/', '');
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;
  return `https://${publicDomain}/samples/local/${filename}`;
};