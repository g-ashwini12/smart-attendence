
import { CONFIG } from './config';

/**
 * The Vision Module boundary.
 * Hand-coded Vision logic lives here.
 */
export class VisionService {
  /**
   * F2: Extract face template from image.
   * In stub mode, it generates a deterministic 8-value template from the image string.
   */
  static async extractFaceTemplate(imageBase64: string): Promise<{ template: number[], quality: number }> {
    if (CONFIG.VISION_MODE === 'stub') {
      // Deterministic hash to create a fake template for the demo
      const hash = this.stringToHash(imageBase64);
      const template = Array.from({ length: 8 }, (_, i) => (hash + i) % 100 / 100);
      return { template, quality: 1.0 };
    }

    // TODO(manual): Implement real face detection and embedding extraction
    throw new Error('VISION_NOT_CONFIGURED');
  }

  /**
   * F6: Match a face against enrolled students using Euclidean Distance.
   * This is fully implemented as per spec L2.
   */
  static matchFace(template: number[], enrolled: { student_id: string, template: number[] }[], threshold: number) {
    let minDistance = Infinity;
    let matchedStudentId: string | null = null;

    for (const student of enrolled) {
      const dist = this.euclideanDistance(template, student.template);
      if (dist < minDistance) {
        minDistance = dist;
        matchedStudentId = student.student_id;
      }
    }

    if (matchedStudentId && minDistance <= threshold) {
      return { student_id: matchedStudentId, distance: minDistance };
    }

    return { student_id: null, distance: null };
  }

  /**
   * F7: Count people in frame.
   */
  static async countPeople(imageBase64: string): Promise<{ count: number }> {
    if (CONFIG.VISION_MODE === 'stub') {
      throw new Error('VISION_NOT_CONFIGURED');
    }

    // TODO(manual): Implement real people counting
    throw new Error('VISION_NOT_CONFIGURED');
  }

  private static euclideanDistance(v1: number[], v2: number[]): number {
    return Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
  }

  private static stringToHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
