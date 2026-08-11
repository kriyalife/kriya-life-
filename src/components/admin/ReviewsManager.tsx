import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Star, Trash2, Search, MessageSquare, AlertCircle } from 'lucide-react';

export const ReviewsManager: React.FC = () => {
  const { products, deleteReview } = useShop();
  const [searchQuery, setSearchQuery] = useState('');

  const allReviews = products.flatMap((product) =>
    (product.reviews || []).map((review) => ({
      ...review,
      productName: product.name,
      productId: product.id,
    }))
  );

  const filteredReviews = allReviews.filter(
    (review) =>
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by date descending
  filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white">Reviews Moderation</h2>
          <p className="text-sm text-emerald-100/70 mt-1">Review customer feedback and manage product reviews.</p>
        </div>
      </div>

      <div className="bg-stone-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950/60">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Search reviews by user, product, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-200 font-medium whitespace-nowrap">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Total Reviews: {allReviews.length}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-stone-950 border border-white/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-emerald-400/60" />
            </div>
            <div>
              <p className="text-white font-medium">No reviews found</p>
              <p className="text-emerald-100/60 text-sm">Try adjusting your search filters.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stone-950 text-emerald-300 font-semibold uppercase text-[11px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 min-w-[300px]">Review Content</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white max-w-[150px] truncate block">
                        {review.productName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{review.userName}</span>
                        {review.verified && (
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-current' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[300px] whitespace-normal">
                      <p className="font-bold text-white text-sm mb-1">{review.title}</p>
                      <p className="text-emerald-100/80 text-xs line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-emerald-100/70 text-xs">
                      {review.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this review?')) {
                            deleteReview(review.productId, review.id);
                          }
                        }}
                        className="p-2 text-emerald-100/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors inline-flex cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
