
export const CONFIG = {
  BACKEND_PORT: 8000,
  FRONTEND_ORIGIN: 'http://localhost:3000',
  VISION_MODE: process.env.VISION_MODE || 'stub',
  DEMO_MODE: process.env.DEMO_MODE === 'true' || true,
  FACE_MATCH_THRESHOLD: parseFloat(process.env.FACE_MATCH_THRESHOLD || '0.5'),
  HEADCOUNT_TOLERANCE: parseInt(process.env.HEADCOUNT_TOLERANCE || '0'),
  MAX_IMAGE_MB: parseInt(process.env.MAX_IMAGE_MB || '5'),
  MAX_HEADCOUNT: parseInt(process.env.MAX_HEADCOUNT || '1000'),
  DATA_RETENTION_DAYS: parseInt(process.env.DATA_RETENTION_DAYS || '30'),
};
