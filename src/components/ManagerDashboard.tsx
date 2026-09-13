import React, { useState } from 'react';
import {
  Sliders,
  Package,
  Utensils,
  Tag,
  AlertTriangle,
  Plus,
  RefreshCw,
  Edit2,
  Check,
  X,
  Crown,
  Search,
  DollarSign,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Dish, InventoryItem, Coupon, Category, Currency } from '../types';
import { formatRupees, formatUSD, INR_EXCHANGE_RATE } from '../utils/currency';

interface ManagerDashboardProps {
  dishes: Dish[];
  categories: Category[];
  onToggleDishAvailability: (dishId: string) => void;
  onUpdateDishPrice: (dishId: string, newPrice: number, newPriceInRupees?: number) => void;
  onAddNewDish: (newDish: Dish) => void;
  inventory: InventoryItem[];
  onRestockItem: (itemId: string, addedAmount: number) => void;
  coupons: Coupon[];
  onToggleCoupon: (code: string) => void;
  onAddNewCoupon: (coupon: Coupon) => void;
  isDarkMode: boolean;
  currency?: Currency;
  activeManagerSection: 'menu' | 'inventory' | 'coupons';
  onChangeManagerSection: (section: 'menu' | 'inventory' | 'coupons') => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  dishes,
  categories,
  onToggleDishAvailability,
  onUpdateDishPrice,
  onAddNewDish,
  inventory,
  onRestockItem,
  coupons,
  onToggleCoupon,
  onAddNewCoupon,
  isDarkMode,
  currency = 'INR',
  activeManagerSection,
  onChangeManagerSection,
}) => {
  // Editing price state
  const [editingPriceDishId, setEditingPriceDishId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState('');
  const [tempPriceInr, setTempPriceInr] = useState('');

  // Add dish modal state
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('kebabs-starters');
  const [newDishPriceUSD, setNewDishPriceUSD] = useState('');
  const [newDishPriceINR, setNewDishPriceINR] = useState('');
  const [newDishImageUrl, setNewDishImageUrl] = useState('');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishDesc, setNewDishDesc] = useState('');

  // Add coupon state
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('40');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Inventory search
  const [inventorySearch, setInventorySearch] = useState('');

  const handleSavePrice = (dishId: string) => {
    const usd = parseFloat(tempPrice);
    const inr = parseInt(tempPriceInr, 10);
    if (!isNaN(usd) && usd > 0) {
      onUpdateDishPrice(dishId, usd, !isNaN(inr) && inr > 0 ? inr : Math.round(usd * INR_EXCHANGE_RATE));
    }
    setEditingPriceDishId(null);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    const usd = parseFloat(newDishPriceUSD);
    const inr = parseInt(newDishPriceINR, 10) || Math.round(usd * INR_EXCHANGE_RATE);
    if (!newDishName || isNaN(usd)) return;

    const defaultImg = newDishIsVeg
      ? 'https://images.unsplash.com/photo-1567184109411-b28f2bafb975?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80';

    const chosenImg = newDishImageUrl.trim() || defaultImg;

    const dish: Dish = {
      id: `dish-custom-${Date.now()}`,
      name: newDishName,
      categoryId: newDishCategory,
      price: usd,
      priceInRupees: inr,
      description: newDishDesc || 'Freshly prepared royal culinary delicacy with authentic spices.',
      imageUrl: chosenImg,
      galleryImages: [chosenImg],
      isVeg: newDishIsVeg,
      isChefSpecial: true,
      isAvailable: true,
      spiceLevel: 2,
      prepTime: '15-18 mins',
      rating: 5.0,
      ratingCount: 1,
      tags: ['New Creation', newDishIsVeg ? 'Pure Veg' : 'Non-Veg'],
    };

    onAddNewDish(dish);
    setShowAddDishModal(false);
    setNewDishName('');
    setNewDishPriceUSD('');
    setNewDishPriceINR('');
    setNewDishImageUrl('');
    setNewDishDesc('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const c: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountPercent: parseFloat(newCouponDiscount) || 10,
      minOrder: parseFloat(newCouponMinOrder) || 30,
      maxDiscount: 30,
      description: newCouponDesc || 'Exclusive royal discount privilege',
      isActive: true,
      usageCount: 0,
    };

    onAddNewCoupon(c);
    setShowAddCouponModal(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minThreshold);

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Sub-Navigation */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151A24] border-[#252C3B]' : 'bg-white border-gray-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#10B981]/20 text-[#10B981]">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold">
              Restaurant Manager Suite
            </h1>
          </div>
          <p className="text-xs text-[#8E98A8] mt-1">
            Real-time food availability, automatic stock replenishment & promotional campaigns
          </p>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/10 dark:bg-black/30 border border-black/10 dark:border-white/10">
          <button
            onClick={() => onChangeManagerSection('menu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeManagerSection === 'menu'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menu & 86'ing</span>
          </button>

          <button
            onClick={() => onChangeManagerSection('inventory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeManagerSection === 'inventory'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory ({lowStockItems.length} alerts)</span>
          </button>

          <button
            onClick={() => onChangeManagerSection('coupons')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeManagerSection === 'coupons'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons</span>
          </button>
        </div>
      </div>

      {/* 1. MENU MANAGEMENT VIEW */}
      {activeManagerSection === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Dishes Catalog & Live Availability
            </span>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  !dish.isAvailable ? 'opacity-65 border-dashed border-rose-900/50' : ''
                } ${
                  isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs truncate">{dish.name}</h4>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                      </div>
                      <div className="text-[10px] text-[#8E98A8] capitalize">
                        {dish.categoryId.replace('-', ' ')}
                      </div>

                      {/* Price display / editor */}
                      <div className="mt-1">
                        {editingPriceDishId === dish.id ? (
                          <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-black/40 border border-[#D97706]/40">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-[#D97706] font-bold w-4">₹</span>
                              <input
                                type="number"
                                value={tempPriceInr}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempPriceInr(val);
                                  const n = parseInt(val, 10);
                                  if (!isNaN(n)) setTempPrice((n / INR_EXCHANGE_RATE).toFixed(2));
                                }}
                                placeholder="Rupees"
                                className="w-20 p-1 rounded-md text-xs bg-black text-white border border-gray-700"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-[#8E98A8] font-bold w-4">$</span>
                              <input
                                type="number"
                                step="0.5"
                                value={tempPrice}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempPrice(val);
                                  const n = parseFloat(val);
                                  if (!isNaN(n)) setTempPriceInr(Math.round(n * INR_EXCHANGE_RATE).toString());
                                }}
                                placeholder="USD"
                                className="w-20 p-1 rounded-md text-xs bg-black text-white border border-gray-700"
                              />
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <button
                                onClick={() => handleSavePrice(dish.id)}
                                className="px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 text-[10px] font-bold flex items-center gap-0.5"
                              >
                                <Check className="w-3 h-3" /> Save
                              </button>
                              <button
                                onClick={() => setEditingPriceDishId(null)}
                                className="px-2 py-1 rounded-md bg-gray-700 text-white text-[10px]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-serif font-bold text-sm text-[#D97706]">
                              {currency === 'INR'
                                ? formatRupees(dish.priceInRupees || Math.round(dish.price * INR_EXCHANGE_RATE))
                                : formatUSD(dish.price)}
                            </span>
                            <span className="text-[10px] text-[#8E98A8]">
                              {currency === 'INR'
                                ? `(${formatUSD(dish.price)})`
                                : `(${formatRupees(dish.priceInRupees || Math.round(dish.price * INR_EXCHANGE_RATE))})`}
                            </span>
                            <button
                              onClick={() => {
                                setEditingPriceDishId(dish.id);
                                setTempPrice(dish.price.toString());
                                setTempPriceInr(
                                  (dish.priceInRupees || Math.round(dish.price * INR_EXCHANGE_RATE)).toString()
                                );
                              }}
                              className="text-[10px] text-[#8E98A8] hover:text-white p-0.5"
                              title="Edit Price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Toggle: Available vs 86'd */}
                <div className="mt-4 pt-2.5 border-t border-black/10 dark:border-white/5 flex items-center justify-between text-xs">
                  <span
                    className={`text-[11px] font-bold ${
                      dish.isAvailable ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {dish.isAvailable ? '● Available in Kitchen' : '○ 86’d (Out of Stock)'}
                  </span>

                  <button
                    onClick={() => onToggleDishAvailability(dish.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                      dish.isAvailable
                        ? 'border-rose-900/80 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60'
                        : 'border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    {dish.isAvailable ? '86 Dish (Hide)' : 'Mark In-Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. INVENTORY VIEW */}
      {activeManagerSection === 'inventory' && (
        <div className="space-y-4">
          {/* Low stock notice banner */}
          {lowStockItems.length > 0 && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDarkMode
                  ? 'bg-[#2B1812] border-[#78350F] text-[#FBBF24]'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold">
                    {lowStockItems.length} Ingredient(s) Running Below Critical Par Levels!
                  </div>
                  <div className="text-[11px] opacity-85">
                    {lowStockItems.map((i) => i.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & Stats */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Live Ingredient Stock & Automatic Order Deduction
            </span>
            <span className="text-xs text-[#8E98A8]">
              {inventory.length} Tracked Ingredients
            </span>
          </div>

          {/* Inventory Table */}
          <div
            className={`rounded-3xl border overflow-hidden ${
              isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDarkMode
                      ? 'bg-[#181E2A] border-[#252C3B] text-[#8E98A8]'
                      : 'bg-gray-100 border-gray-200 text-gray-600'
                  }`}
                >
                  <tr>
                    <th className="p-3.5 pl-5">Ingredient</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Current Stock</th>
                    <th className="p-3.5">Min Par Level</th>
                    <th className="p-3.5">Supplier</th>
                    <th className="p-3.5 pr-5 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/5">
                  {inventory.map((item) => {
                    const isLow = item.currentStock <= item.minThreshold;
                    const percent = Math.min(
                      100,
                      Math.round((item.currentStock / (item.minThreshold * 2.5)) * 100)
                    );

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                          isLow ? 'bg-amber-950/20' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-5">
                          <div className="font-bold">{item.name}</div>
                          <div className="text-[10px] text-[#8E98A8]">
                            Unit cost: ${item.costPerUnit.toFixed(2)} / {item.unit}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/20 dark:bg-white/10">
                            {item.category}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <span className={isLow ? 'text-amber-400 font-extrabold' : ''}>
                              {item.currentStock} {item.unit}
                            </span>
                            {isLow && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold">
                                LOW
                              </span>
                            )}
                          </div>
                          {/* Stock bar */}
                          <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isLow ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </td>

                        <td className="p-3.5 text-[#8E98A8]">
                          {item.minThreshold} {item.unit}
                        </td>

                        <td className="p-3.5 text-[#8E98A8] text-[11px]">{item.supplier}</td>

                        <td className="p-3.5 pr-5 text-right">
                          <button
                            onClick={() => onRestockItem(item.id, item.minThreshold * 2)}
                            className="px-3 py-1 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981] text-[#10B981] hover:text-white border border-[#10B981]/30 text-xs font-bold transition-all"
                          >
                            + Restock +{item.minThreshold * 2} {item.unit}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. COUPONS & PROMOS VIEW */}
      {activeManagerSection === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              Active Royal Privileges & Promotional Codes
            </span>
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  c.isActive
                    ? 'border-[#10B981]/40 bg-[#151922]'
                    : 'border-gray-700/50 bg-[#12151B] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base tracking-wider text-[#FBBF24]">
                      {c.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {c.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <div className="font-serif text-2xl font-bold mt-2 text-white">
                    {c.discountPercent}% OFF
                  </div>

                  <p className="text-xs text-[#8E98A8] mt-1">{c.description}</p>

                  <div className="mt-3 text-[11px] text-[#8E98A8] space-y-0.5">
                    <div>
                      Min Order:{' '}
                      {currency === 'INR'
                        ? `${formatRupees(Math.round(c.minOrder * INR_EXCHANGE_RATE))} (${formatUSD(c.minOrder)})`
                        : `${formatUSD(c.minOrder)} (${formatRupees(Math.round(c.minOrder * INR_EXCHANGE_RATE))})`}
                    </div>
                    {c.maxDiscount && (
                      <div>
                        Max Cap:{' '}
                        {currency === 'INR'
                          ? `${formatRupees(Math.round(c.maxDiscount * INR_EXCHANGE_RATE))} (${formatUSD(c.maxDiscount)})`
                          : `${formatUSD(c.maxDiscount)} (${formatRupees(Math.round(c.maxDiscount * INR_EXCHANGE_RATE))})`}
                      </div>
                    )}
                    <div>Redemptions: {c.usageCount} times</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
                  <button
                    onClick={() => onToggleCoupon(c.code)}
                    className="text-xs font-bold px-3 py-1 rounded-xl border border-gray-600 hover:border-white transition-colors"
                  >
                    {c.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#151A25] border-[#252C3B] text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-[#D97706]">
                Add Royal Culinary Dish
              </h3>
              <button onClick={() => setShowAddDishModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Kashmiri Rogan Josh"
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                  >
                    <option value="kebabs-starters">Kebabs & Starters</option>
                    <option value="royal-curries">Heritage Curries</option>
                    <option value="dum-biryani">Dum Biryani</option>
                    <option value="artisan-breads">Artisan Breads</option>
                    <option value="desserts-drinks">Desserts & Drinks</option>
                  </select>
                </div>
              </div>

              {/* Dual Price Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Price in Rupees (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newDishPriceINR}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewDishPriceINR(val);
                      const n = parseInt(val, 10);
                      if (!isNaN(n)) setNewDishPriceUSD((n / INR_EXCHANGE_RATE).toFixed(2));
                    }}
                    placeholder="e.g. 595"
                    className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Price in USD ($) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newDishPriceUSD}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewDishPriceUSD(val);
                      const n = parseFloat(val);
                      if (!isNaN(n)) setNewDishPriceINR(Math.round(n * INR_EXCHANGE_RATE).toString());
                    }}
                    placeholder="e.g. 18.50"
                    className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="font-bold block mb-1">Dish Image URL (or select preset)</label>
                <input
                  type="url"
                  value={newDishImageUrl}
                  onChange={(e) => setNewDishImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {[
                    {
                      label: 'Biryani',
                      url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
                    },
                    {
                      label: 'Curry',
                      url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
                    },
                    {
                      label: 'Kebab',
                      url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
                    },
                    {
                      label: 'Paneer',
                      url: 'https://images.unsplash.com/photo-1567184109411-b28f2bafb975?auto=format&fit=crop&w=800&q=80',
                    },
                    {
                      label: 'Naan',
                      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewDishImageUrl(preset.url)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all shrink-0 ${
                        newDishImageUrl === preset.url
                          ? 'border-[#D97706] bg-[#D97706]/20 text-[#D97706]'
                          : 'border-white/10 text-[#8E98A8] hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vegCheck"
                  checked={newDishIsVeg}
                  onChange={(e) => setNewDishIsVeg(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <label htmlFor="vegCheck" className="font-semibold cursor-pointer">
                  Pure Vegetarian Dish
                </label>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Ingredients and culinary cooking style..."
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition-colors shadow-md mt-2"
              >
                Add Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4 ${
              isDarkMode ? 'bg-[#151A25] border-[#252C3B] text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-[#D97706]">Create Promo Code</h3>
              <button onClick={() => setShowAddCouponModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI25"
                  className="w-full p-2.5 rounded-xl border bg-black/20 uppercase font-bold focus:border-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    placeholder="20"
                    className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(e.target.value)}
                    placeholder="50"
                    className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description / Conditions</label>
                <textarea
                  rows={2}
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="e.g. 20% privilege on orders over $50"
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition-colors shadow-md mt-2"
              >
                Publish Promo Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
