import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, X, ShoppingBag, Star, ShieldCheck, Heart, ChevronRight, ChevronLeft, Plus, Upload, Video, CheckCircle, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ImageWithFallback } from './ImageWithFallback';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';

interface VideoMedia {
  type: string;
  src: string;
  title: string;
  reviewer: string;
  tag: string;
  rating: number;
  productId: string;
  quote?: string;
}

const MEDIA: VideoMedia[] = [
  { 
    type: 'video', 
    src: "/videos/video1.mp4", 
    title: "Overnight Transformation Review", 
    reviewer: "Ananya M.", 
    tag: "Olive Night Cream", 
    rating: 5,
    productId: "kriya-night-cream",
    quote: "I absolutely love this! KRIYA Life Science Olive Night Cream has completely transformed my skin."
  },
  { 
    type: 'video', 
    src: "/videos/video2.mp4", 
    title: "Vitamin C Natural Glow Cleanse", 
    reviewer: "Priya S.", 
    tag: "Face Wash Cleanse", 
    rating: 5,
    productId: "kriya-vit-c-facewash",
    quote: "Simply natural glowing! Kriya Vitamin C Face Wash gives skin an instant healthy radiance and deep refreshing cleanse."
  },
  { 
    type: 'video', 
    src: "/videos/video3.mp4", 
    title: "Complete Botanical Beauty Ritual", 
    reviewer: "Dr. Sneha Patel", 
    tag: "Glow & Renew Combo", 
    rating: 5,
    productId: "kriya-glow-renew-combo",
    quote: "The ultimate handcrafted organic skincare duo! Vitamin C Face Wash and Olive Night Cream for round-the-clock radiance."
  },
  { 
    type: 'video', 
    src: "/videos/video1.mp4", 
    title: "Overnight Moisture Barrier Repair", 
    reviewer: "Meera R.", 
    tag: "Night Routine", 
    rating: 5,
    productId: "kriya-night-cream",
    quote: "Deeply restores skin barrier while you sleep. Wake up with smooth, plump, and deeply hydrated skin every morning."
  },
  { 
    type: 'video', 
    src: "/videos/video2.mp4", 
    title: "Morning Refreshing Cleanse Demo", 
    reviewer: "Sara K.", 
    tag: "Daily Routine", 
    rating: 5,
    productId: "kriya-vit-c-facewash",
    quote: "100% natural and gentle on skin. Gently cleanses away dirt and excess oil without stripping moisture!"
  },
  { 
    type: 'video', 
    src: "/videos/video3.mp4", 
    title: "Organic Skincare Unboxing & Routine", 
    reviewer: "Kavita Roy", 
    tag: "Botanical Skincare", 
    rating: 5,
    productId: "kriya-glow-renew-combo",
    quote: "Handcrafted organic formulations designed for ultimate skin wellness and natural luminescence."
  }
];

const MediaCard: React.FC<{ 
  media: VideoMedia, 
  isFocused: boolean,
  onClick: () => void,
}> = ({ media, isFocused, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "0px", threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.defaultMuted = isMuted;
    video.muted = isMuted;

    if (isInView) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play prevented
        });
      }
    } else {
      video.pause();
    }
  }, [isInView, isMuted]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const sanitizeVideo = (s?: string) => {
    if (!s) return '/videos/video1.mp4';
    let trimmed = s.trim();
    if (trimmed.startsWith('./')) trimmed = '/' + trimmed.slice(2);
    return trimmed;
  };

  const [vSrc, setVSrc] = useState(() => sanitizeVideo(media.src));

  useEffect(() => {
    setVSrc(sanitizeVideo(media.src));
  }, [media.src]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`shrink-0 w-[65vw] max-w-[240px] sm:max-w-none sm:w-[280px] aspect-[9/16] overflow-hidden rounded-2xl relative bg-black group cursor-pointer border transition-all duration-300 ${
        isFocused ? 'border-[#4CAF50] ring-2 ring-[#4CAF50]/50 shadow-xl' : 'border-transparent hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <UniversalVideoPlayer
        src={vSrc}
        className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
        autoPlay
        playsInline
        muted={isMuted}
        loop
        onError={() => {
          if (vSrc !== '/videos/video1.mp4') setVSrc('/videos/video1.mp4');
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 pointer-events-none" />
      
      {/* Mute/Unmute Toggle Button */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={toggleSound}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Play Center Indicator on Hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-xl scale-90 group-hover:scale-100 transition-transform">
          <Play className="w-5 h-5 ml-0.5 fill-white" />
        </div>
      </div>

      {/* Title Info */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none text-white">
        <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wider">
          {media.tag}
        </span>
        <h4 className="text-sm font-serif font-medium leading-tight text-white drop-shadow line-clamp-2">
          {media.title}
        </h4>
        <p className="text-xs text-white/80 mt-1 font-sans truncate">{media.reviewer}</p>
      </div>
    </div>
  );
};

export const CinematicGallery: React.FC = () => {
  const { products, setSelectedProduct, setCurrentView, addToCart, mediaList } = useShop();
  const [selectedVideo, setSelectedVideo] = useState<VideoMedia | null>(null);
  const [modalMuted, setModalMuted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Smooth Horizontal Scrolling Script
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.clientWidth * 0.8; // Scroll by 80% of container width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Drag to scroll functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    if (selectedVideo && modalVideoRef.current) {
      modalVideoRef.current.defaultMuted = modalMuted;
      modalVideoRef.current.muted = modalMuted;
    }
  }, [selectedVideo, modalMuted]);

  const handleCardClick = (media: VideoMedia) => {
    // If we were dragging, don't trigger click
    if (isDragging) return;
    setSelectedVideo(media);
  };

  const displayMedia = (mediaList && mediaList.length >= 3) ? mediaList : MEDIA;

  const matchedProduct = selectedVideo 
    ? products.find(p => p.id === selectedVideo.productId) || products[0]
    : null;

  return (
    <section className="w-full bg-[#0D2217] text-white py-20 sm:py-24 overflow-hidden relative border-y border-[#1C4430]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
          Product Video Showcase
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 tracking-tight">
          The Ritual in Action
        </h2>
        <p className="text-emerald-100/80 max-w-2xl mx-auto text-base sm:text-lg font-light">
          See KRIYA Life Science formulations transforming skin with 100% natural, science-backed care.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative group max-w-[1400px] mx-auto">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-stone-900/90 text-white border border-white/20 backdrop-blur shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-stone-950 hover:scale-110 hidden md:flex cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-stone-900/90 text-white border border-white/20 backdrop-blur shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-stone-950 hover:scale-110 hidden md:flex cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-8 md:px-16 pb-12 pt-4 hide-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {displayMedia.map((media, idx) => (
            <div key={idx} className="snap-center sm:snap-start shrink-0 first:pl-4 sm:first:pl-0">
              <MediaCard 
                media={media} 
                isFocused={selectedVideo?.title === media.title}
                onClick={() => handleCardClick(media)}
              />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* UGC Reel Modal Viewer */}
      <AnimatePresence>
        {selectedVideo && matchedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md sm:max-w-4xl bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player */}
              <div className="relative w-full md:w-[45%] aspect-[9/16] md:aspect-auto md:h-[80vh] bg-black flex items-center justify-center">
                <UniversalVideoPlayer
                  src={selectedVideo.src}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  muted={modalMuted}
                  controls={false}
                  onError={(e) => {
                    (e.target as HTMLVideoElement).src = '/video-1.mp4';
                  }}
                />
                
                {/* Audio Button */}
                <button
                  onClick={() => setModalMuted(!modalMuted)}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black transition-colors"
                >
                  {modalMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* Close Button on Video (Mobile) */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 left-4 z-10 md:hidden p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Details Sidebar */}
              <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-between bg-white text-[#153323] overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight">
                      {selectedVideo.title}
                    </h3>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="hidden md:flex p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Reviewer Info */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      {[...Array(selectedVideo.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm italic mb-2">
                      "{selectedVideo.quote || "I love this product, it has completely transformed my skincare routine. The texture and results are amazing!"}"
                    </p>
                    <p className="font-medium text-sm text-[#153323]">— {selectedVideo.reviewer}</p>
                  </div>

                  {/* Featured Product Card */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Featured Product</h4>
                    <div className="group flex gap-4 p-3.5 rounded-2xl border border-gray-200 hover:border-[#153323]/30 hover:shadow-md transition-all cursor-pointer bg-white"
                         onClick={() => {
                           setSelectedProduct(matchedProduct);
                           setCurrentView('product-detail');
                           setSelectedVideo(null);
                         }}>
                      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <ImageWithFallback 
                          src={matchedProduct.images[0]} 
                          alt={matchedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <h5 className="font-semibold text-base leading-snug mb-0.5 group-hover:text-[#4CAF50] transition-colors">{matchedProduct.name}</h5>
                        <p className="text-xs text-gray-500 mb-1.5 line-clamp-1">{matchedProduct.tagline}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg text-[#153323]">₹{matchedProduct.price}</span>
                          {matchedProduct.originalPrice && <span className="text-xs text-gray-400 line-through">₹{matchedProduct.originalPrice}</span>}
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {Math.round(((matchedProduct.originalPrice! - matchedProduct.price) / matchedProduct.originalPrice!) * 100)}% OFF
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                             onClick={(e) => {
                              e.stopPropagation();
                              addToCart(matchedProduct, 1);
                              setCurrentView('checkout');
                              const navigate = (window as any)._navigate;
                              if (navigate) navigate('/checkout');
                            }}
                            className="text-xs font-bold uppercase tracking-wider bg-[#153323] text-white px-4 py-2 rounded-full hover:bg-black transition-colors cursor-pointer"
                          >
                            Buy Now
                          </button>
                          <span className="text-xs text-[#153323]/70 underline font-medium hover:text-[#153323]">
                            View Details &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Key Details & Ingredients */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Formulation Highlights</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(matchedProduct.highlights || []).map((h, i) => (
                        <span key={i} className="text-[11px] font-medium bg-[#F5F3EF] text-[#153323] px-2.5 py-1 rounded-md border border-[#153323]/10">
                          {h}
                        </span>
                      ))}
                    </div>

                    {matchedProduct.detailedIngredients && matchedProduct.detailedIngredients.length > 0 && (
                      <div className="bg-[#FAFCFA] p-3 rounded-xl border border-[#E8F3E9] text-xs text-gray-700 space-y-1 mt-2">
                        <span className="font-bold text-[#153323] block mb-1">Key Actives:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-600">
                          {matchedProduct.detailedIngredients.slice(0, 3).map((ing, idx) => (
                            <li key={idx}>
                              <strong className="text-gray-800">{ing.name}:</strong> {ing.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Badges */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-3 mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50]" /> Clinically Proven
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Heart className="w-3.5 h-3.5 text-red-500" /> 100% Natural
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
