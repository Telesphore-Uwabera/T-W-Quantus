import sharp from "sharp";

/** MIME types we upload as-is (no raster WebP conversion). */
const SKIP_WEBP = /^(image\/svg\+xml|image\/x-icon|image\/vnd\.microsoft\.icon)/i;

export type RasterToWebpResult = { buffer: Buffer; converted: boolean };

/**
 * Raster images → WebP for smaller Cloudinary storage. SVG and unknown/failed inputs stay unchanged.
 */
export async function rasterToWebp(buffer: Buffer, mimeType?: string): Promise<RasterToWebpResult> {
  if (mimeType && SKIP_WEBP.test(mimeType)) {
    return { buffer, converted: false };
  }
  try {
    const webp = await sharp(buffer).rotate().webp({ quality: 82, effort: 4 }).toBuffer();
    return { buffer: webp, converted: true };
  } catch {
    return { buffer, converted: false };
  }
}
