import * as faceapi from '@vladmandic/face-api';
import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';

export interface GenderDetectionResult {
  gender: 'male' | 'female';
  confidence: number;
}

const MODELS_PATH = path.join(__dirname, '../../ml-models/face-api');

class FaceAnalysisService {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Detect gender from an image buffer using face-api.js
   */
  async detectGender(imageBuffer: Buffer): Promise<GenderDetectionResult> {
    console.log('Starting face-api.js gender detection...');

    // Ensure models are loaded first
    await this.ensureInitialized();

    // Decode image using tfjs-node (no canvas required)
    const tensor = tf.node.decodeImage(imageBuffer, 3);

    try {
      // Detect face with gender
      console.log('Detecting face and gender...');
      const detection = await faceapi
        .detectSingleFace(tensor as unknown as faceapi.TNetInput)
        .withAgeAndGender();

      console.log('Detection result abcdefg:', detection);

      if (!detection) {
        console.log('No face detected in image');
        return {
          gender: 'male',
          confidence: 0.5 // Below threshold, will be rejected by route validation
        };
      }

      const { gender, genderProbability } = detection;
      console.log(`Gender detection result: ${gender} (${(genderProbability * 100).toFixed(1)}% confidence)`);

      return {
        gender: gender as 'male' | 'female',
        confidence: genderProbability
      };
    } finally {
      // Clean up tensor
      tensor.dispose();
    }
  }

  /**
   * Ensure models are loaded (lazy initialization)
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        console.log(`Loading face-api.js models from ${MODELS_PATH}...`);

        // Load face detection and gender models
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH),
          faceapi.nets.ageGenderNet.loadFromDisk(MODELS_PATH),
        ]);

        this.initialized = true;
        console.log('Face-api.js models loaded successfully');
      } catch (error) {
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }
}

// Create singleton instance
export const faceAnalysisService = new FaceAnalysisService();
