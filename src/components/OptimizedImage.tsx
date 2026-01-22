import { useState } from "react";
import { getImageUrl, getResponsiveSrcSet, getBlurPlaceholder } from "@/lib/cloudinary";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  showBlurPlaceholder?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width = 800,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = "lazy",
  showBlurPlaceholder = true,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isCloudinaryPath = !src.startsWith("http") && !src.startsWith("/");
  const srcSet = getResponsiveSrcSet(src, [400, 600, 800, 1200]);
  const mainSrc = isCloudinaryPath ? getImageUrl(src, { width, height }) : src;
  const placeholderSrc = isCloudinaryPath ? getBlurPlaceholder(src) : undefined;

  // Fallback to local path if Cloudinary fails
  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {showBlurPlaceholder && placeholderSrc && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        src={hasError ? src : mainSrc}
        srcSet={hasError ? undefined : srcSet || undefined}
        sizes={hasError ? undefined : sizes}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded || hasError ? "opacity-100" : "opacity-0"
        }`}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
