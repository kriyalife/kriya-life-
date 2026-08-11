import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80';

const sanitizeSrc = (source?: string, fallback: string = DEFAULT_FALLBACK): string => {
  if (!source || typeof source !== 'string') return fallback;
  let trimmed = source.trim();
  if (trimmed.startsWith('data:image/svg+xml;utf8,')) {
    trimmed = 'data:image/svg+xml;charset=utf-8,' + trimmed.slice('data:image/svg+xml;utf8,'.length);
  }
  if (trimmed.startsWith('./')) {
    trimmed = '/' + trimmed.slice(2);
  }
  if (trimmed.startsWith('/src/assets/images/')) {
    trimmed = trimmed.replace('/src/assets/images/', '/images/');
  } else if (trimmed.startsWith('/src/assets/')) {
    trimmed = trimmed.replace('/src/assets/', '/');
  }
  return trimmed || fallback;
};

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => sanitizeSrc(src, fallbackSrc));
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(sanitizeSrc(src, fallbackSrc));
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt || 'Botanical product'}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
};

