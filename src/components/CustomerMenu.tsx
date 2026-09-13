import React, { useState } from 'react';
import {
  Search,
  Flame,
  Star,
  Plus,
  SlidersHorizontal,
  Clock,
  Crown,
  Sparkles,
  MapPin,
  Utensils,
  ShoppingBag,
  Bike,
  Check,
  Camera,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
} from 'lucide-react';
import { Dish, Category, OrderType, Currency } from '../types';
import { formatRupees, formatUSD } from '../utils/currency';

interface CustomerMenuProps {
  categories: Category[];
  dishes: Dish[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenDishDetail: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  isDarkMode: boolean;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  tableNumber: string;
  onChangeTableNumber: (table: string) => void;
  onOpenReservation: () => void;
  currency: Currency;
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({
  categories,
  dishes,
  selectedCategory,
  onSelectCategory,
  onOpenDishDetail,
  onQuickAdd,
  isDarkMode,
  orderType,
  onChangeOrderType,
  tableNumber,
  onChangeTableNumber,
  onOpenReservation,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterChefSpecialOnly, setFilterChefSpecialOnly] = useState(false);
  const [selectedSpiceFilter, setSelectedSpiceFilter] = useState<number | 'all'>('all');
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

  // Filtered dishes
  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory !== 'all' && dish.categoryId !== selectedCategory) {
      return false;
    }
    if (filterVegOnly && !dish.isVeg) return false;
    if (filterChefSpecialOnly && !dish.isChefSpecial) return false;
    if (selectedSpiceFilter !== 'all' && dish.spiceLevel !== selectedSpiceFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchHindi = dish.hindiName?.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      const matchTags = dish.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchHindi && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const handleNextDishImage = (dishId: string, maxImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [dishId]: ((prev[dishId] || 0) + 1) % maxImages,
    }));
  };

  const handlePrevDishImage = (dishId: string, maxImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [dishId]: ((prev[dishId] || 0) - 1 + maxImages) % maxImages,
    }));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Royal Hero & Dining Context Selector */}
      <section
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#1E1712] via-[#120F0C] to-[#0A0D12] border-[#38281A]'
            : 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#F3F4F6] border-[#FDE68A]'
        }`}
      >
        {/* Decorative Golden Ambient Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Royal Awadhi & Mughlai Dastarkhwan</span>
          </div>

          <h1
            className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-[#1E293B]'
            }`}
          >
            A Royal Feast of <span className="text-[#D97706] italic font-normal">Centuries-Old</span> Secret Recipes
          </h1>

          <p
            className={`mt-2.5 text-xs sm:text-sm leading-relaxed max-w-2xl ${
              isDarkMode ? 'text-[#CBD5E1]' : 'text-[#475569]'
            }`}
          >
            Every dish is simmered in handcrafted copper handis, perfumed with wild Kashmiri saffron, and priced in authentic Indian Rupees (₹) with dual global currency display.
          </p>

          {/* Dining Mode Picker */}
          <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10">
              <button
                onClick={() => onChangeOrderType('dine-in')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  orderType === 'dine-in'
                    ? 'bg-[#D97706] text-white shadow-sm shadow-[#D97706]/30'
                    : isDarkMode
                    ? 'text-[#94A3B8] hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Dine-In (QR Table)</span>
              </button>

              <button
                onClick={() => onChangeOrderType('takeaway')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-[#D97706] text-white shadow-sm shadow-[#D97706]/30'
                    : isDarkMode
                    ? 'text-[#94A3B8] hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Takeaway Pick-Up</span>
              </button>

              <button
                onClick={() => onChangeOrderType('delivery')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-[#D97706] text-white shadow-sm shadow-[#D97706]/30'
                    : isDarkMode
                    ? 'text-[#94A3B8] hover:text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Royal Home Delivery</span>
              </button>
            </div>

            {/* Dine-In Table Badge or Reservation Quick Action */}
            {orderType === 'dine-in' ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  isDarkMode
                    ? 'bg-[#181C26] border-[#2A3446] text-[#E2E8F0]'
                    : 'bg-white border-amber-200 text-[#1E293B]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Dine-In Active:</span>
                <select
                  value={tableNumber}
                  onChange={(e) => onChangeTableNumber(e.target.value)}
                  className="bg-transparent font-bold text-[#D97706] focus:outline-none cursor-pointer"
                >
                  <option value="Table 14" className="bg-[#151922] text-white">
                    Table 14 (Salon Noir)
                  </option>
                  <option value="Table 08" className="bg-[#151922] text-white">
                    Table 08 (Courtyard)
                  </option>
                  <option value="Booth M-3" className="bg-[#151922] text-white">
                    Booth M-3 (Maharaja)
                  </option>
                  <option value="Diwan Suite 1" className="bg-[#151922] text-white">
                    Diwan Suite 1 (Private)
                  </option>
                </select>
              </div>
            ) : (
              <button
                onClick={onOpenReservation}
                className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 ml-auto"
              >
                <span>Prefer to book a table instead?</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Royal Visual Showcase Strip - Culinary Gallery Carousel */}
      <section
        className={`p-4 sm:p-5 rounded-3xl border ${
          isDarkMode ? 'bg-[#121620] border-[#232A39]' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#D97706]" />
            <h2 className="font-serif text-base font-bold text-[#D97706]">
              Royal Dastarkhwan Visual Gallery
            </h2>
            <span className="text-[11px] text-[#8E98A8] hidden sm:inline">
              · Authentic Handcrafted Dishes in Indian Rupees (₹)
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#D97706] bg-[#D97706]/10 px-2.5 py-0.5 rounded-full border border-[#D97706]/20">
            {currency === 'INR' ? 'Prices shown in ₹ INR' : 'Prices shown in $ USD'}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {dishes.slice(0, 8).map((dish) => (
            <div
              key={`gallery-${dish.id}`}
              onClick={() => onOpenDishDetail(dish)}
              className="relative shrink-0 w-44 sm:w-52 h-32 rounded-2xl overflow-hidden cursor-pointer group border border-white/10 shadow-md"
            >
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-white font-serif font-bold text-xs truncate drop-shadow">
                  {dish.name}
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[#FBBF24] font-bold text-xs">
                    {currency === 'INR'
                      ? formatRupees(dish.priceInRupees || Math.round(dish.price * 83.5))
                      : formatUSD(dish.price)}
                  </span>
                  <span className="text-[10px] text-white/80 bg-black/60 px-1.5 py-0.2 rounded backdrop-blur-sm">
                    {dish.isVeg ? 'Veg 🟢' : 'Non-Veg 🔴'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#8E98A8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Galouti, Biryani, Naan, Bukhara, Korma..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-none focus:border-[#D97706] transition-colors ${
                isDarkMode
                  ? 'bg-[#151922] border-[#252C3B] text-white placeholder-[#64748B]'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8E98A8] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterVegOnly
                  ? 'bg-[#102B1D] border-[#1E603E] text-[#4ADE80]'
                  : isDarkMode
                  ? 'bg-[#151922] border-[#252C3B] text-[#94A3B8] hover:border-[#37455E]'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>Pure Veg Only</span>
            </button>

            <button
              onClick={() => setFilterChefSpecialOnly(!filterChefSpecialOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterChefSpecialOnly
                  ? 'bg-[#2A1D13] border-[#78350F] text-[#FBBF24]'
                  : isDarkMode
                  ? 'bg-[#151922] border-[#252C3B] text-[#94A3B8] hover:border-[#37455E]'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>Chef's Signature</span>
            </button>

            {/* Spice Level Dropdown */}
            <select
              value={selectedSpiceFilter}
              onChange={(e) =>
                setSelectedSpiceFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className={`px-2.5 py-2 rounded-xl text-xs font-semibold border focus:outline-none focus:border-[#D97706] ${
                isDarkMode
                  ? 'bg-[#151922] border-[#252C3B] text-[#CBD5E1]'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <option value="all">All Spice Levels</option>
              <option value="1">Mild & Creamy (🌶️)</option>
              <option value="2">Royal Balanced (🌶️🌶️)</option>
              <option value="3">Fiery Awadhi (🌶️🌶️🌶️)</option>
            </select>
          </div>
        </div>

        {/* Categories Horizontal Rail */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#D97706] border-[#D97706] text-white shadow-md shadow-[#D97706]/20'
                    : isDarkMode
                    ? 'bg-[#151922] border-[#232A39] text-[#94A3B8] hover:border-[#384358] hover:text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredDishes.map((dish) => {
          const images = dish.galleryImages && dish.galleryImages.length > 0 ? dish.galleryImages : [dish.imageUrl];
          const activeImgIdx = activeImageIndices[dish.id] || 0;
          const currentImage = images[activeImgIdx % images.length];

          const inrPrice = dish.priceInRupees || Math.round(dish.price * 83.5);
          const usdPrice = dish.price;

          return (
            <div
              key={dish.id}
              className={`rounded-3xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl group ${
                isDarkMode
                  ? 'bg-[#151922] border-[#242A38] hover:border-[#3B465D]'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Dish Image Banner with Carousel */}
              <div className="relative h-52 overflow-hidden bg-gray-900 group/img">
                <img
                  src={currentImage}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dietary Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border ${
                      dish.isVeg
                        ? 'bg-[#0E2818]/90 border-[#1B5232]'
                        : 'bg-[#2B100E]/90 border-[#5C1A16]'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        dish.isVeg ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                      }`}
                    ></div>
                  </div>

                  {dish.isChefSpecial && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#2B1D12]/90 border border-[#78350F] text-[#FBBF24] flex items-center gap-1 backdrop-blur-sm">
                      <Crown className="w-3 h-3" />
                      Chef Special
                    </span>
                  )}
                </div>

                {/* Multi-Image Controls if available */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => handlePrevDishImage(dish.id, images.length, e)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-10"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleNextDishImage(dish.id, images.length, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-10"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {/* Dots indicator */}
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === activeImgIdx ? 'w-3 bg-[#F59E0B]' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/75 backdrop-blur-sm text-white flex items-center gap-1 border border-white/10 z-10">
                  <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                  <span>{dish.rating.toFixed(2)}</span>
                  <span className="text-[9px] text-[#94A3B8]">({dish.ratingCount})</span>
                </div>

                {/* Prep Time & Calories Ribbon */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-medium text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 z-10">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D97706]" />
                    {dish.prepTime}
                  </span>
                  <span>{dish.calories || '450 kcal'}</span>
                  <span className="flex items-center gap-0.5 text-[#EF4444]">
                    {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                      <Flame key={i} className="w-3 h-3 fill-[#EF4444]" />
                    ))}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3
                        className={`font-serif text-base font-semibold leading-snug ${
                          isDarkMode ? 'text-white' : 'text-[#1E293B]'
                        }`}
                      >
                        {dish.name}
                      </h3>
                      {dish.hindiName && (
                        <p className="text-[11px] text-[#D97706] font-medium mt-0.5">
                          {dish.hindiName}
                        </p>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]'
                    }`}
                  >
                    {dish.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {dish.tags.map((t) => (
                      <span
                        key={t}
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          isDarkMode
                            ? 'bg-[#1D2330] text-[#CBD5E1]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Price (Rupees Primary) + Actions */}
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#8E98A8] uppercase font-semibold block">
                      From
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-lg sm:text-xl font-bold text-[#D97706]">
                        {currency === 'INR' ? formatRupees(inrPrice) : formatUSD(usdPrice)}
                      </span>
                      <span className="text-[11px] text-[#8E98A8] font-medium">
                        {currency === 'INR' ? `(${formatUSD(usdPrice)})` : `(${formatRupees(inrPrice)})`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDishDetail(dish)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                        isDarkMode
                          ? 'bg-[#1C222E] border-[#2A3446] text-[#CBD5E1] hover:border-[#3F4E6A] hover:text-white'
                          : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Customize Portions & Addons"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span className="hidden sm:inline">Customize</span>
                    </button>

                    <button
                      onClick={() => onQuickAdd(dish)}
                      className="px-3 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm shadow-[#D97706]/30 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center mx-auto text-[#D97706] mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white">No Royal Dishes Found</h3>
          <p className="text-xs text-[#8E98A8] mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, dietary filters, or spice preferences.
          </p>
        </div>
      )}
    </div>
  );
};
