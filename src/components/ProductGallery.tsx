import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, Sparkles, RefreshCw, Play, Pause } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
}

interface ProductGalleryProps {
  media?: MediaItem[];
  images?: string[];
  productName: string;
  isBestseller?: boolean;
  isOrganic?: boolean;
  isFavorite: boolean;
  onToggleWishlist: () => void;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  media,
  images = [],
  productName,
  isBestseller,
  isOrganic,
  isFavorite,
  onToggleWishlist
}) => {
  const activeMedia = media || images.map(src => ({ type: 'image' as const, src }));
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAiEnhanced, setIsAiEnhanced] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Default false so we don't spam video play
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, activeMedia.length]);

  const handleNextImage = () => {
    setSwipeDirection(1);
    setActiveImageIndex((prev) => (prev + 1) % activeMedia.length);
  };

  const handlePrevImage = () => {
    setSwipeDirection(-1);
    setActiveImageIndex((prev) => (prev === 0 ? activeMedia.length - 1 : prev - 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSwipeDirection(index > activeImageIndex ? 1 : -1);
    setActiveImageIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    })
  };

  const currentMedia = activeMedia[activeImageIndex] || activeMedia[0];
  const sanitizeVideoSrc = (srcStr?: string) => {
    if (!srcStr) return '/video-1.mp4';
    let s = srcStr.trim();
    if (s.startsWith('./')) s = '/' + s.slice(2);
    return s;
  };
  const [videoSrc, setVideoSrc] = useState<string>(() => sanitizeVideoSrc(currentMedia?.src));

  useEffect(() => {
    setVideoSrc(sanitizeVideoSrc(currentMedia?.src));
  }, [currentMedia?.src]);

  useEffect(() => {
    if (currentMedia?.type === 'video' && videoRef.current) {
       videoRef.current.defaultMuted = true;
       videoRef.current.muted = true;
       videoRef.current.play().catch(e => console.warn('Autoplay prevented:', e));
    }
  }, [activeImageIndex, currentMedia]);

  return (
    <div className="space-y-4">
      <div 
        className="relative aspect-square rounded-[32px] bg-white border border-[#E8F3E9] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] group"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence initial={false} custom={swipeDirection}>
          <motion.div
            key={activeImageIndex}
            custom={swipeDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.5, ease: "easeInOut" },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4, ease: "easeOut" },
              filter: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                handleNextImage();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrevImage();
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
          >
            {/* Zoom lens effect & AI enhancement container */}
            <div 
              className="w-full h-full"
              style={{
                transform: isHovered ? 'scale(1.5)' : 'scale(1.02)',
                transformOrigin: isHovered ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
                filter: isAiEnhanced ? 'contrast(1.1) saturate(1.2) brightness(1.05) drop-shadow(0px 4px 12px rgba(0,0,0,0.1))' : 'none',
                transition: 'transform 0.2s ease-out, filter 0.3s ease-in-out'
              }}
            >
              {currentMedia.type === 'video' ? (
                <UniversalVideoPlayer
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  autoPlay
                  onError={() => {
                    if (videoSrc !== '/video-1.mp4') {
                      setVideoSrc('/video-1.mp4');
                    }
                  }}
                />
              ) : (
                <ImageWithFallback
                  src={currentMedia.src}
                  alt={`${productName} image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Lighting Glare Effect */}
        <div 
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Navigation Arrows */}
        {activeMedia.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-[#153323] opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-white hover:scale-110 active:scale-95"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-[#153323] opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-white hover:scale-110 active:scale-95"
              aria-label="Next media"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20 pointer-events-none">
          {isOrganic && (
            <span className="bg-[#6B8E4E] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              100% NATURAL
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className={`absolute top-6 right-6 p-3.5 rounded-full backdrop-blur-md shadow-lg transition-all z-20 hover:scale-110 active:scale-95 ${
            isFavorite ? 'bg-[#4CAF50] text-white' : 'bg-white/90 text-[#153323] hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      {activeMedia.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 px-1 snap-x no-scrollbar">
          {activeMedia.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-[12px] overflow-hidden transition-all duration-300 shrink-0 snap-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#153323] ${
                activeImageIndex === idx 
                  ? 'border-2 border-[#153323] scale-105 shadow-md opacity-100' 
                  : 'border-2 border-transparent opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              {item.type === 'video' ? (
                <UniversalVideoPlayer src={sanitizeVideoSrc(item.src)} className="w-full h-full object-cover" />
              ) : (
                <ImageWithFallback src={item.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              )}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-6 h-6 text-white opacity-80" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
