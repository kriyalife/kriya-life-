import React, { useState } from 'react';
import { Plus, Trash2, Video, Film, Upload, CheckCircle, Play, Star, Sparkles, X, Clapperboard, Check, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../../context/ShopContext';
import { VideoMedia } from '../../types';
import { UniversalVideoPlayer } from '../UniversalVideoPlayer';

export const VideosManager: React.FC = () => {
  const { mediaList, addVideoMedia, deleteVideoMedia, products } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');
  const [previewVideoSrc, setPreviewVideoSrc] = useState<string>('/video-1.mp4');
  const [reviewerName, setReviewerName] = useState('Verified Customer');
  const [videoTitle, setVideoTitle] = useState('');
  const [targetProductId, setTargetProductId] = useState(products[0]?.id || 'kriya-vit-c-facewash');
  const [reviewQuote, setReviewQuote] = useState('');
  const [tag, setTag] = useState('Product Showcase');

  const libraryClips = [
    { src: '/video-1.mp4', label: 'Cleanse', duration: '0:15' },
    { src: '/video-2.mp4', label: 'Glow', duration: '0:22' },
    { src: '/video-3.mp4', label: 'Night', duration: '0:18' },
    { src: '/video-4.mp4', label: 'Unboxing', duration: '0:30' },
    { src: '/video-5.mp4', label: 'Ritual', duration: '0:25' },
    { src: '/video-6.mp4', label: 'Radiance', duration: '0:20' },
    { src: '/video-7.mp4', label: 'Restore', duration: '0:28' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewVideoSrc(url);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewVideoSrc) return;

    const newMedia: Omit<VideoMedia, 'id'> = {
      type: 'video',
      src: previewVideoSrc,
      title: videoTitle || 'Product Video Showcase',
      reviewer: reviewerName || 'Verified Buyer',
      tag: tag || 'Showcase',
      rating: 5,
      productId: targetProductId,
      quote: reviewQuote || 'Formulated with 100% natural botanical actives for vibrant, healthy skin.'
    };

    addVideoMedia(newMedia);
    setIsModalOpen(false);

    // Reset Form
    setUploadedFile(null);
    setCustomVideoUrl('');
    setPreviewVideoSrc('/video-1.mp4');
    setVideoTitle('');
    setReviewQuote('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#153323] via-[#1A3D2A] to-[#254A34] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full mb-3 border border-white/10">
            <Clapperboard className="w-3.5 h-3.5 text-emerald-400" /> Storefront Video Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">Video Showcase Clips</h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
            Curate live ritual reels and video reviews for customers. Only authenticated administrators can publish or remove video clips.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 inline-flex items-center justify-center gap-2 bg-white text-[#153323] px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#153323]" /> Add New Video
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mediaList.map((video, idx) => {
          const matchedProd = products.find(p => p.id === video.productId);
          return (
            <div
              key={video.id || idx}
              className="bg-stone-900/80 backdrop-blur-xl rounded-3xl border border-white/15 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between group text-white"
            >
              <div>
                {/* Video Preview */}
                <div className="relative aspect-[9/14] bg-stone-950 overflow-hidden">
                  <UniversalVideoPlayer
                    src={video.src}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="bg-stone-950/90 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md border border-emerald-500/30">
                        {video.tag}
                      </span>
                      <button
                        onClick={() => deleteVideoMedia(video.id || video.src)}
                        className="p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
                        title="Delete Video from Showcase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <h3 className="text-white font-serif font-bold text-base leading-tight drop-shadow-md">
                        {video.title}
                      </h3>
                      <p className="text-emerald-300 text-xs font-medium mt-0.5">By {video.reviewer}</p>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 space-y-2.5">
                  <div className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 w-full truncate">
                    <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">Product: {matchedProd ? matchedProd.name : video.productId}</span>
                  </div>
                  {video.quote && (
                    <p className="text-xs text-emerald-100/80 line-clamp-2 italic leading-relaxed bg-stone-950/60 p-2.5 rounded-xl border border-white/10">
                      "{video.quote}"
                    </p>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 bg-stone-950/80 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100/60">
                <span className="font-medium text-emerald-100/50">Storefront Live</span>
                <button
                  onClick={() => deleteVideoMedia(video.id || video.src)}
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Add Video Premium Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-stone-900 rounded-3xl max-w-xl w-full relative text-white shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-stone-950 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-md">
                    <Video className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                      ADMIN ONLY
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white leading-tight">
                      Publish Video to Showcase
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-emerald-100/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form id="add-video-form" onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-white">
                {/* Video URL or Embed Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-2">
                    1. Video URL or YouTube Embed (e.g., https://www.youtube.com/embed/VIDEO_ID or MP4 link)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/embed/... or /videos/demo.mp4"
                      value={customVideoUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomVideoUrl(val);
                        if (val.trim()) {
                          setPreviewVideoSrc(val.trim());
                          setUploadedFile(null);
                        }
                      }}
                      className="w-full bg-stone-950 border border-white/20 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
                    />
                    <Link className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-2">
                    2. Or Upload Custom Video Clip
                  </label>
                  <div className="border-2 border-dashed border-white/20 hover:border-emerald-400 rounded-2xl p-4 text-center bg-stone-950/60 hover:bg-stone-950 transition-all relative cursor-pointer group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <UniversalVideoPlayer src={previewVideoSrc} className="w-28 h-28 object-cover rounded-2xl mx-auto shadow-lg border border-white/20" autoPlay muted loop />
                        <p className="text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> {uploadedFile.name}
                        </p>
                        <span className="text-[10px] text-emerald-100/60 uppercase font-semibold">Click to replace video file</span>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <div className="w-12 h-12 rounded-2xl bg-stone-900 group-hover:bg-emerald-500 group-hover:text-stone-950 border border-white/10 transition-all flex items-center justify-center mx-auto text-emerald-400">
                          <Film className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">Drag & drop or click to upload</p>
                          <p className="text-[11px] text-emerald-100/60 mt-0.5">Supports MP4, MOV, WebM files</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Library Clip Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                      3. Or Select From Preset Clips
                    </label>
                    <span className="text-[10px] text-emerald-100/60 font-medium">7 High-Quality Pre-loaded Clips</span>
                  </div>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {libraryClips.map((v, idx) => {
                      const isSelected = previewVideoSrc === v.src && !uploadedFile && !customVideoUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPreviewVideoSrc(v.src);
                            setCustomVideoUrl('');
                            setUploadedFile(null);
                          }}
                          className={`relative aspect-[9/14] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group/clip ${
                            isSelected
                              ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-105 shadow-md'
                              : 'border-white/15 hover:border-white/40 opacity-70 hover:opacity-100'
                          }`}
                          title={v.label}
                        >
                          <UniversalVideoPlayer src={v.src} className="w-full h-full object-cover" muted playsInline />
                          <div className={`absolute inset-0 transition-colors flex items-center justify-center ${isSelected ? 'bg-black/30' : 'bg-black/50 group-hover/clip:bg-black/30'}`}>
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-400 text-stone-950 flex items-center justify-center shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center text-white">
                                <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                              </div>
                            )}
                          </div>
                          <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-semibold text-white text-center py-0.5 truncate px-0.5">
                            Clip {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Video Title */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    3. Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g. Vitamin C Radiance Routine"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40 transition-all font-medium"
                  />
                </div>

                {/* Creator Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                      Reviewer / Creator Name
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Sneha Patel"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                      Tag / Badge Label
                    </label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="e.g. Morning Cleanse"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40"
                    />
                  </div>
                </div>

                {/* Linked Product Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Featured Product *
                  </label>
                  <select
                    value={targetProductId}
                    onChange={(e) => setTargetProductId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="bg-stone-900 text-white">
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Testimonial Quote */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1.5">
                    Testimonial / Highlight Quote
                  </label>
                  <textarea
                    rows={2}
                    value={reviewQuote}
                    onChange={(e) => setReviewQuote(e.target.value)}
                    placeholder="e.g. Leaves my skin feeling so clean and refreshed without any dryness!"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-950 text-white placeholder-white/40 resize-none"
                  />
                </div>
              </form>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-stone-950 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-video-form"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-stone-950" />
                  <span>Publish Video</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
