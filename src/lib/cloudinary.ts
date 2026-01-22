const CLOUD_NAME = "dlnn95ku7";

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:low" | "auto:good" | "auto:best";
  format?: "auto" | "webp" | "avif";
  crop?: "fill" | "fit" | "scale" | "thumb";
}

interface VideoOptions {
  quality?: "auto" | "auto:low" | "auto:good";
  format?: "auto" | "mp4" | "webm";
  width?: number;
}

// Generate optimized image URL
export const getImageUrl = (path: string, options: ImageOptions = {}): string => {
  // If it's already a full URL or local path, return as-is
  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  const transforms = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    crop && `c_${crop}`,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${path}`;
};

// Generate optimized video URL
export const getVideoUrl = (path: string, options: VideoOptions = {}): string => {
  // If it's already a full URL or local path, return as-is
  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  const { quality = "auto", format = "auto", width } = options;

  const transforms = [width && `w_${width}`, `q_${quality}`, `f_${format}`]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${path}`;
};

// Responsive image srcset for different screen sizes
export const getResponsiveSrcSet = (
  path: string,
  widths: number[] = [400, 800, 1200]
): string => {
  // If it's already a full URL or local path, return empty srcset
  if (path.startsWith("http") || path.startsWith("/")) {
    return "";
  }

  return widths
    .map((w) => `${getImageUrl(path, { width: w })} ${w}w`)
    .join(", ");
};

// Get blur placeholder URL for loading states
export const getBlurPlaceholder = (path: string): string => {
  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_50,q_auto:low,f_auto,e_blur:1000/${path}`;
};

// Generate URL for 3D files (GLB, USDZ, etc.) uploaded as image type
export const getRawFileUrl = (publicId: string): string => {
  if (publicId.startsWith("http") || publicId.startsWith("/")) {
    return publicId;
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;
};
