import React from 'react';

export interface UniversalVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src?: string;
  className?: string;
  allowFullScreen?: boolean;
}

export function isYouTubeUrl(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('<iframe');
}

export function parseYouTubeEmbedUrl(url?: string, autoplay: boolean = true): string {
  if (!url) return '';
  let src = url.trim();

  // Handle embedded iframe code paste
  const matchIframe = src.match(/src=["']([^"']+)["']/);
  if (matchIframe && matchIframe[1]) {
    src = matchIframe[1];
  }

  // Already an embed URL
  if (src.includes('youtube.com/embed/')) {
    if (!src.includes('autoplay=') && autoplay) {
      src += (src.includes('?') ? '&' : '?') + 'autoplay=1&mute=1';
    }
    return src;
  }

  // watch?v= format
  if (src.includes('youtube.com/watch')) {
    const match = src.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=${autoplay ? 1 : 0}&mute=1&enablejsapi=1`;
    }
  }

  // youtu.be format
  if (src.includes('youtu.be/')) {
    const parts = src.split('youtu.be/');
    if (parts[1]) {
      const id = parts[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&mute=1&enablejsapi=1`;
    }
  }

  return src;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  src,
  className = 'w-full h-full object-cover',
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  onError,
  ...props
}) => {
  if (isYouTubeUrl(src)) {
    const embedUrl = parseYouTubeEmbedUrl(src, autoPlay);
    return (
      <iframe
        src={embedUrl}
        title="Video Embed"
        className={className}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  let finalSrc = src || '/videos/demo.mp4';
  if (finalSrc.startsWith('./')) {
    finalSrc = '/' + finalSrc.slice(2);
  }

  return (
    <video
      src={finalSrc}
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      controls={controls}
      playsInline={playsInline}
      onError={onError}
      {...props}
    />
  );
};
