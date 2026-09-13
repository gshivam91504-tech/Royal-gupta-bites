import React, { useState } from 'react';
import { X, Flame, Clock, Star, Plus, Check, Crown, Info, Camera, IndianRupee } from 'lucide-react';
import { Dish, CartCustomization, Currency } from '../types';
import { formatRupees, formatUSD } from '../utils/currency';

interface DishCustomizerModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    customization: CartCustomization,
    unitPrice: number,
    unitPriceInRupees: number
  ) => void;
  isDarkMode: boolean;
  currency: Currency;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
  isDarkMode,
  currency,
}) => {
  if (!isOpen || !dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    dish.variants && dish.variants.length > 0 ? dish.variants[0].id : undefined
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<1 | 2 | 3>(dish.spiceLevel || 2);
  const [kitchenNote, setKitchenNote] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images =
    dish.galleryImages && dish.galleryImages.length > 0 ? dish.galleryImages : [dish.imageUrl];
  const activeImage = images[selectedImageIndex % images.length];

  // Base price in INR and USD
  const baseInr = dish.priceInRupees || Math.round(dish.price * 83.5);
  const baseUsd = dish.price;

  // Variant deltas
  const activeVariant = dish.variants?.find((v) => v.id === selectedVariantId);
  const variantDeltaUsd = activeVariant?.priceDelta || 0;
  const variantDeltaInr =
    activeVariant?.priceDeltaInRupees !== undefined
      ? activeVariant.priceDeltaInRupees
      : Math.round(variantDeltaUsd * 83.5);

  // Addons totals
  const selectedAddons = (dish.addons || []).filter((addon) =>
    selectedAddonIds.includes(addon.id)
  );
  const addonsTotalUsd = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const addonsTotalInr = selectedAddons.reduce(
    (sum, item) => sum + (item.priceInRupees || Math.round(item.price * 83.5)),
    0
  );

  const calculatedUnitPriceUsd = baseUsd + variantDeltaUsd + addonsTotalUsd;
  const calculatedUnitPriceInr = baseInr + variantDeltaInr + addonsTotalInr;

  const grandTotalUsd = calculatedUnitPriceUsd * quantity;
  const grandTotalInr = calculatedUnitPriceInr * quantity;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAdd = () => {
    onAddToCart(
      dish,
      quantity,
      {
        selectedVariantId,
        selectedAddonIds,
        spiceLevel,
        kitchenNote,
      },
      calculatedUnitPriceUsd,
      calculatedUnitPriceInr
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isDarkMode
            ? 'bg-[#121620] border-[#252C3B] text-[#F3EFE6]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header with image & gallery thumbnails */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black shrink-0">
          <img src={activeImage} alt={dish.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/20 z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Gallery image switcher thumbnails */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedImageIndex
                      ? 'border-[#D97706] scale-105 shadow-md shadow-[#D97706]/50'
                      : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  dish.isVeg ? 'bg-emerald-900/80 text-emerald-300' : 'bg-rose-900/80 text-rose-300'
                }`}
              >
                {dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </span>
              {dish.isChefSpecial && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-900/80 text-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Chef Signature
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug">{dish.name}</h2>
            {dish.hindiName && (
              <p className="text-xs text-[#FBBF24] font-medium">{dish.hindiName}</p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* Description & Base Price in Rupees */}
          <div className="flex items-start justify-between gap-4">
            <p className={isDarkMode ? 'text-[#94A3B8]' : 'text-gray-600'}>{dish.description}</p>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-[#8E98A8] uppercase font-bold block">Base Price</span>
              <span className="font-serif font-bold text-base sm:text-lg text-[#D97706]">
                {currency === 'INR' ? formatRupees(baseInr) : formatUSD(baseUsd)}
              </span>
              <span className="text-[10px] text-[#8E98A8] block">
                {currency === 'INR' ? formatUSD(baseUsd) : formatRupees(baseInr)}
              </span>
            </div>
          </div>

          {/* Portion / Variant Selector */}
          {dish.variants && dish.variants.length > 0 && (
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-[#D97706] block">
                1. Choose Royal Portion / Cut
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dish.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  const deltaInr =
                    v.priceDeltaInRupees !== undefined
                      ? v.priceDeltaInRupees
                      : Math.round(v.priceDelta * 83.5);

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                          : isDarkMode
                          ? 'border-[#242A38] bg-[#161B24] text-[#CBD5E1] hover:border-[#384358]'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{v.name}</div>
                        {v.weight && <div className="text-[10px] text-[#8E98A8]">{v.weight}</div>}
                      </div>
                      <div className="text-xs font-bold">
                        {v.priceDelta > 0
                          ? `+${currency === 'INR' ? formatRupees(deltaInr) : formatUSD(v.priceDelta)}`
                          : 'Included'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level Adjuster */}
          <div className="space-y-2">
            <label className="font-bold text-xs uppercase tracking-wider text-[#D97706] block">
              2. Custom Spice Calibration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 1, label: 'Mild & Creamy', desc: 'Saffron & Cashews', flames: 1 },
                { level: 2, label: 'Royal Balanced', desc: 'Authentic Nawabi', flames: 2 },
                { level: 3, label: 'Fiery Awadhi', desc: 'Slow Heat & Chillies', flames: 3 },
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpiceLevel(s.level as 1 | 2 | 3)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    spiceLevel === s.level
                      ? 'border-[#E85738] bg-[#E85738]/10 text-[#E85738]'
                      : isDarkMode
                      ? 'border-[#242A38] bg-[#161B24] text-[#8E98A8]'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex justify-center gap-0.5 text-[#EF4444] mb-1">
                    {Array.from({ length: s.flames }).map((_, i) => (
                      <Flame key={i} className="w-3.5 h-3.5 fill-[#EF4444]" />
                    ))}
                  </div>
                  <div className="font-bold text-[11px] leading-tight">{s.label}</div>
                  <div className="text-[9px] text-[#8E98A8] mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Royal Accompaniments & Add-ons with Image Thumbnails */}
          {dish.addons && dish.addons.length > 0 && (
            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-[#D97706] block">
                3. Royal Accompaniments & Add-ons
              </label>
              <div className="space-y-2">
                {dish.addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  const addonInr = addon.priceInRupees || Math.round(addon.price * 83.5);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                          : isDarkMode
                          ? 'border-[#242A38] bg-[#161B24] text-[#CBD5E1]'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-[#D97706] border-[#D97706] text-white' : 'border-gray-500'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        {addon.imageUrl && (
                          <img
                            src={addon.imageUrl}
                            alt={addon.name}
                            className="w-10 h-10 rounded-lg object-cover border border-black/20"
                          />
                        )}
                        <span className="font-medium text-xs">{addon.name}</span>
                      </div>
                      <span className="font-bold text-xs">
                        +{currency === 'INR' ? formatRupees(addonInr) : formatUSD(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Kitchen Notes */}
          <div className="space-y-2">
            <label className="font-bold text-xs uppercase tracking-wider text-[#8E98A8] block">
              4. Special Instructions for Royal Chef (Optional)
            </label>
            <textarea
              rows={2}
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              placeholder="e.g. Less ghee, extra lime wedges, serve piping hot..."
              className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:border-[#D97706] ${
                isDarkMode
                  ? 'bg-[#151922] border-[#252C3B] text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            />
          </div>
        </div>

        {/* Modal Footer: Quantity Stepper + Add to Cart */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 shrink-0 ${
            isDarkMode ? 'bg-[#151A24] border-[#252C3B]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          {/* Stepper */}
          <div className="flex items-center gap-2 p-1 rounded-2xl border bg-black/10 dark:bg-black/30 dark:border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-xl font-bold text-sm hover:bg-black/20 flex items-center justify-center"
            >
              -
            </button>
            <span className="w-5 text-center font-bold text-xs">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-xl font-bold text-sm hover:bg-black/20 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-lg shadow-[#D97706]/30 active:scale-95"
          >
            <span>Add to Royal Order</span>
            <div className="text-right">
              <span className="font-serif font-bold text-base">
                {currency === 'INR' ? formatRupees(grandTotalInr) : formatUSD(grandTotalUsd)}
              </span>
              <span className="text-[10px] opacity-80 block">
                {currency === 'INR' ? formatUSD(grandTotalUsd) : formatRupees(grandTotalInr)}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
