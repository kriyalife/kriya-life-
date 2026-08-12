import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Banknote,
  Film,
  ZoomIn
} from 'lucide-react';
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
  const activeMedia: MediaItem[] = media && media.length > 0 
    ? media 
    : images.map(src => ({ type: 'image' as const, src }));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreenModalOpen) {
        if (e.key === 'Escape') setIsFullscreenModalOpen(false);
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'ArrowLeft') handlePrevImage();
      } else {
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'ArrowLeft') handlePrevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, activeMedia.length, isFullscreenModalOpen]);

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
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePosition({ x, y });
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
    setIsPlaying(true);
  }, [currentMedia?.src]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Container with Amazon/Flipkart Layout (Left sidebar thumbnails on lg screens, main view right) */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Thumbnails List (Desktop Amazon/Flipkart Style) */}
        {activeMedia.length > 1 && (
          <div className="hidden lg:flex lg:flex-col gap-3 overflow-y-auto max-h-[500px] pr-1 py-1 shrink-0 no-scrollbar">
            {activeMedia.map((item, idx) => {
              const isActive = activeImageIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 border-2 shrink-0 cursor-pointer group/thumb ${
                    isActive
                      ? 'border-emerald-400 scale-105 shadow-lg ring-2 ring-emerald-400/30'
                      : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/40 hover:scale-102'
                  }`}
                  aria-label={`Select media item ${idx + 1}`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full relative bg-stone-950">
                      <UniversalVideoPlayer 
                        src={sanitizeVideoSrc(item.src)} 
                        className="w-full h-full object-cover pointer-events-none" 
                      />
                      <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center group-hover/thumb:bg-stone-950/20 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md">
                          <Play className="w-3.5 h-3.5 fill-stone-950 translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-amber-400 text-stone-950 font-bold text-[9px] px-1 py-0.2 rounded uppercase">
                        VIDEO
                      </span>
                    </div>
                  ) : (
                    <ImageWithFallback 
                      src={item.src} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Display Box */}
        <div 
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-square w-full rounded-3xl bg-stone-950 border border-white/15 overflow-hidden shadow-2xl group flex-1"
        >
          <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.div
              key={activeImageIndex}
              custom={swipeDirection}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {currentMedia.type === 'video' ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    playsInline
                    muted={isMuted}
                    loop
                    autoPlay
                    onError={() => {
                      if (videoSrc !== '/video-1.mp4') setVideoSrc('/video-1.mp4');
                    }}
                  />

                  {/* Video Control Bar Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-stone-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 z-20">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlayPause}
                        className="p-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-colors font-bold cursor-pointer flex items-center gap-1.5 text-xs"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-stone-950" /> : <Play className="w-4 h-4 fill-stone-950" />}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                        <span>{isMuted ? 'Unmute Audio' : 'Muted'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Film className="w-3 h-3 text-amber-400 animate-pulse" />
                        HD Product Video
                      </span>

                      <button
                        onClick={() => setIsFullscreenModalOpen(true)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                        title="Fullscreen Video"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full relative cursor-zoom-in overflow-hidden"
                  onClick={() => setIsFullscreenModalOpen(true)}
                >
                  <div 
                    className="w-full h-full transition-transform duration-200 ease-out"
                    style={{
                      transform: isHovered ? 'scale(1.8)' : 'scale(1.0)',
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                    }}
                  >
                    <ImageWithFallback
                      src={currentMedia.src}
                      alt={`${productName} view ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Amazon/Flipkart Hover Zoom Hint */}
                  {!isHovered && (
                    <div className="absolute bottom-4 left-4 bg-stone-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white/90 text-xs font-medium pointer-events-none flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hover to Zoom | Click for Fullscreen</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Top Left Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
            {isBestseller && (
              <span className="bg-amber-400 text-stone-950 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                BESTSELLER
              </span>
            )}
            {isOrganic && (
              <span className="bg-emerald-500 text-stone-950 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                100% ORGANIC
              </span>
            )}
          </div>

          {/* Top Right Wishlist & Fullscreen Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={() => setIsFullscreenModalOpen(true)}
              className="p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white border border-white/20 shadow-lg backdrop-blur-md transition-all cursor-pointer"
              title="Full Screen View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleWishlist}
              className={`p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
                isFavorite 
                  ? 'bg-emerald-500 text-stone-950' 
                  : 'bg-stone-900/80 hover:bg-stone-900 text-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-stone-950' : ''}`} />
            </button>
          </div>

          {/* Prev/Next Navigation Overlay Arrows */}
          {activeMedia.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-950/80 hover:bg-emerald-500 hover:text-stone-950 text-white rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-stone-950/80 hover:bg-emerald-500 hover:text-stone-950 text-white rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Active Counter Indicator */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-stone-950/80 border border-white/15 rounded-full text-[11px] font-mono text-white/80 backdrop-blur-md z-20 pointer-events-none">
            {activeImageIndex + 1} / {activeMedia.length}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Thumbnails Bar */}
      {activeMedia.length > 1 && (
        <div className="flex lg:hidden items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x">
          {activeMedia.map((item, idx) => {
            const isActive = activeImageIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden transition-all duration-300 border-2 shrink-0 snap-center cursor-pointer ${
                  isActive
                    ? 'border-emerald-400 scale-105 shadow-lg'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full relative bg-stone-950">
                    <UniversalVideoPlayer src={sanitizeVideoSrc(item.src)} className="w-full h-full object-cover pointer-events-none" />
                    <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                ) : (
                  <ImageWithFallback src={item.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Amazon & Flipkart Style Trust Badges Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        <div className="flex items-center gap-2.5 p-3 bg-stone-900/60 rounded-2xl border border-white/10">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-white leading-tight">100% Genuine</p>
            <p className="text-[9px] text-emerald-100/60">Verified Product</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 bg-stone-900/60 rounded-2xl border border-white/10">
          <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-white leading-tight">Express Delivery</p>
            <p className="text-[9px] text-emerald-100/60">Ships in 24 Hours</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 bg-stone-900/60 rounded-2xl border border-white/10">
          <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-white leading-tight">COD Available</p>
            <p className="text-[9px] text-emerald-100/60">Pay on Delivery</p>
          </div>
        </div>
      </div>

      {/* Amazon/Flipkart Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreenModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8"
            onClick={() => setIsFullscreenModalOpen(false)}
          >
            {/* Top Modal Controls */}
            <div className="w-full max-w-6xl flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {productName}
                </span>
                <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
                  {activeImageIndex + 1} of {activeMedia.length}
                </span>
              </div>

              <button
                onClick={() => setIsFullscreenModalOpen(false)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Fullscreen Viewer */}
            <div 
              className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center my-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {currentMedia.type === 'video' ? (
                <div className="w-full h-full max-h-[70vh] flex items-center justify-center">
                  <UniversalVideoPlayer
                    src={sanitizeVideoSrc(currentMedia.src)}
                    className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
                    controls
                    autoPlay
                    playsInline
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <ImageWithFallback
                    src={currentMedia.src}
                    alt={productName}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  />
                </div>
              )}

              {/* Prev / Next Modal Arrows */}
              {activeMedia.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-stone-900/90 hover:bg-emerald-500 hover:text-stone-950 text-white rounded-full border border-white/20 shadow-2xl cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-stone-900/90 hover:bg-emerald-500 hover:text-stone-950 text-white rounded-full border border-white/20 shadow-2xl cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Modal Thumbnails Strip */}
            <div 
              className="w-full max-w-3xl flex items-center justify-center gap-3 overflow-x-auto py-2 no-scrollbar z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {activeMedia.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-emerald-400 scale-110 shadow-lg' 
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full relative bg-black flex items-center justify-center">
                      <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  ) : (
                    <ImageWithFallback src={item.src} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
