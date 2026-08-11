import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80';

const sanitizeSrc = (source?: string, fallback: string = DEFAULT_FALLBACK): string => {
  if (!source || typeof source !== 'string') return fallback;
  let trimmed = source.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith('data:image/svg+xml;utf8,')) {
    trimmed = 'data:image/svg+xml;charset=utf-8,' + trimmed.slice('data:image/svg+xml;utf8,'.length);
  }

  // Handle local dev / Vite asset paths
  if (trimmed.startsWith('./')) {
    trimmed = '/' + trimmed.slice(2);
  }
  if (trimmed.startsWith('/src/assets/images/')) {
    trimmed = trimmed.replace('/src/assets/images/', '/images/');
  } else if (trimmed.startsWith('/src/assets/')) {
    trimmed = trimmed.replace('/src/assets/', '/');
  } else if (trimmed.startsWith('src/assets/images/')) {
    trimmed = trimmed.replace('src/assets/images/', '/images/');
  } else if (trimmed.startsWith('src/assets/')) {
    trimmed = trimmed.replace('src/assets/', '/');
  }

  // Handle Supabase bucket relative paths (e.g. "storage/v1/object/public/products/item.jpg" or "products/item.jpg")
  if (trimmed.startsWith('storage/v1/object/public/')) {
    const defaultSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hojixnilttishopaeljo.supabase.co';
    trimmed = `${defaultSupabaseUrl.replace(/\/+$/, '')}/${trimmed}`;
  } else if (trimmed.startsWith('products/') && !trimmed.includes('http')) {
    const defaultSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hojixnilttishopaeljo.supabase.co';
    trimmed = `${defaultSupabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${trimmed}`;
  }

  // If relative path without protocol or leading slash (e.g. "product1.jpg" or "images/kriya.jpg")
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:') && !trimmed.startsWith('blob:') && !trimmed.startsWith('/')) {
    if (trimmed.startsWith('images/')) {
      trimmed = '/' + trimmed;
    } else {
      trimmed = '/images/' + trimmed;
    }
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

