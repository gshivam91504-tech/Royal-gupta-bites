import React, { useState } from 'react';
import { Star, Crown, Sparkles, CheckCircle2, MessageSquarePlus, User, Heart } from 'lucide-react';
import { CustomerReview, Dish } from '../types';

interface ReviewsAndHeritageProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
  dishes: Dish[];
  isDarkMode: boolean;
  activeView: 'story' | 'reviews';
}

export const ReviewsAndHeritage: React.FC<ReviewsAndHeritageProps> = ({
  reviews,
  onAddReview,
  dishes,
  isDarkMode,
  activeView,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [selectedDishName, setSelectedDishName] = useState(dishes[0]?.name || 'Gupta Shahi Galouti Kebab');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !comment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerName: authorName,
      dishName: selectedDishName,
      rating,
      comment,
      date: 'Just now',
      verifiedOrder: true,
    };

    onAddReview(newRev);
    setAuthorName('');
    setComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto">
      {/* 1. HERITAGE STORY VIEW */}
      {activeView === 'story' && (
        <div className="space-y-8">
          <div
            className={`p-6 sm:p-10 rounded-3xl border relative overflow-hidden ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#1E1712] via-[#141822] to-[#0D1017] border-[#38281A]'
                : 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
            }`}
          >
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706]">
                <Crown className="w-3.5 h-3.5" />
                <span>The Culinary Lineage of Royal Gupta Bites</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Crafted in Copper Handis, Inspired by the Imperial Awadhi Courts
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-[#CBD5E1]' : 'text-gray-600'}`}>
                Founded on the secret culinary parchment notebooks of the royal Khansamas of Lucknow and Old Delhi, Royal Gupta Bites honors ancient culinary arts. From our 36-hour slow-simmered Dal Bukhara to the dough-sealed (purdah) Nawabi Dum Biryani infused with hand-plucked Kashmiri saffron, every dish is an offering of regal hospitality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div>
                  <div className="font-serif text-2xl font-bold text-[#D97706]">32 Spices</div>
                  <div className="text-xs text-[#8E98A8] mt-0.5">Secret Galouti Potli blend</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#D97706]">36 Hours</div>
                  <div className="text-xs text-[#8E98A8] mt-0.5">Dal Bukhara slow-coal simmer</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#D97706]">100% Desi Ghee</div>
                  <div className="text-xs text-[#8E98A8] mt-0.5">Bilona Gir Cow A2 Ghee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOMER REVIEWS & RATINGS VIEW */}
      {activeView === 'reviews' && (
        <div className="space-y-6">
          {/* Rating Snapshot Banner */}
          <div
            className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
              isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/30 flex flex-col items-center justify-center text-[#D97706]">
                <span className="font-serif text-3xl font-bold">4.95</span>
                <span className="text-[10px] uppercase font-bold">out of 5</span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold">Guest Dining Accolades</h3>
                <div className="flex items-center gap-1 text-[#F59E0B] mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                  <span className="text-xs text-[#8E98A8] ml-2">Based on 1,420+ verified reviews</span>
                </div>
                <p className="text-xs text-[#8E98A8] mt-1">
                  Recognized among city's top fine dining heritage establishments.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showReviewForm ? 'Close Review Form' : 'Write Royal Review'}</span>
            </button>
          </div>

          {/* Write Review Form Modal/Drawer */}
          {showReviewForm && (
            <div
              className={`p-5 rounded-3xl border space-y-4 animate-fadeIn ${
                isDarkMode ? 'bg-[#181E2B] border-[#2B3547]' : 'bg-amber-50 border-amber-200'
              }`}
            >
              <h4 className="font-serif text-base font-bold text-[#D97706]">
                Share Your Dining Experience
              </h4>

              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. S. Kapoor"
                      className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Dish Savored</label>
                    <select
                      value={selectedDishName}
                      onChange={(e) => setSelectedDishName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                    >
                      {dishes.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-gray-500'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold ml-2">{rating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the aromatics, texture, and hospitality..."
                    className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md"
                >
                  Submit Royal Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 ${
                  isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#8E98A8]">{rev.date}</span>
                  </div>

                  <p className="text-xs leading-relaxed italic">"{rev.comment}"</p>
                </div>

                <div className="pt-3 border-t border-black/10 dark:border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const match = dishes.find((d) => d.name === rev.dishName);
                      return match ? (
                        <img
                          src={match.imageUrl}
                          alt={rev.dishName}
                          className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : null;
                    })()}
                    <div>
                      <div className="font-bold text-[11px]">{rev.customerName}</div>
                      <div className="text-[10px] text-[#D97706] font-medium truncate max-w-[170px]">
                        {rev.dishName}
                      </div>
                    </div>
                  </div>

                  {rev.verifiedOrder && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
