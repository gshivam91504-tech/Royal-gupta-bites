import React, { useState } from 'react';
import {
  X,
  Trash2,
  Tag,
  CreditCard,
  QrCode,
  Banknote,
  Utensils,
  ShoppingBag,
  Bike,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  IndianRupee,
} from 'lucide-react';
import { CartItem, OrderType, PaymentMethod, Coupon, Currency } from '../types';
import { formatRupees, formatUSD } from '../utils/currency';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  tableNumber: string;
  onChangeTableNumber: (table: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  onPlaceOrder: (details: {
    orderType: OrderType;
    tableNumber?: string;
    deliveryAddress?: string;
    pickupTime?: string;
    paymentMethod: PaymentMethod;
    tip: number;
    tipInRupees: number;
    specialInstructions: string;
    subtotal: number;
    subtotalInRupees: number;
    discount: number;
    discountInRupees: number;
    tax: number;
    taxInRupees: number;
    deliveryFee: number;
    deliveryFeeInRupees: number;
    total: number;
    totalInRupees: number;
  }) => void;
  isDarkMode: boolean;
  availableCoupons: Coupon[];
  currency: Currency;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  onChangeOrderType,
  tableNumber,
  onChangeTableNumber,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
  isDarkMode,
  availableCoupons,
  currency,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(10);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Penthouse 4B, Emerald Royal Residences, West Wing, Connaught Heritage'
  );
  const [pickupTime, setPickupTime] = useState('Within 25 mins');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subtotals in USD and INR
  const subtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const subtotalInr = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.unitPriceInRupees ||
        (item.dish.priceInRupees ? item.dish.priceInRupees : Math.round(item.unitPrice * 83.5))) *
        item.quantity,
    0
  );

  // Coupon Discounts
  let discountUsd = 0;
  let discountInr = 0;
  if (appliedCoupon) {
    const minOrderReq = currency === 'INR' ? (appliedCoupon.minOrderInRupees || 499) : appliedCoupon.minOrder;
    const currentSubtotal = currency === 'INR' ? subtotalInr : subtotalUsd;

    if (currentSubtotal >= minOrderReq) {
      // INR discount
      const rawInrDiscount = (subtotalInr * appliedCoupon.discountPercent) / 100;
      const maxInr = appliedCoupon.maxDiscountInRupees || (appliedCoupon.maxDiscount ? appliedCoupon.maxDiscount * 83.5 : 500);
      discountInr = Math.round(Math.min(rawInrDiscount, maxInr));

      // USD discount
      const rawUsdDiscount = (subtotalUsd * appliedCoupon.discountPercent) / 100;
      discountUsd = appliedCoupon.maxDiscount ? Math.min(rawUsdDiscount, appliedCoupon.maxDiscount) : rawUsdDiscount;
    }
  }

  // Taxes & Levies
  const taxUsd = Math.round((subtotalUsd - discountUsd) * 0.08 * 100) / 100;
  const taxInr = Math.round((subtotalInr - discountInr) * 0.05); // 5% GST on dining

  // Delivery Fees
  const deliveryFeeUsd = orderType === 'delivery' ? 4.99 : 0;
  const deliveryFeeInr = orderType === 'delivery' ? 49 : 0;

  // Gratuity Tip
  const tipUsd = Math.round(((subtotalUsd * selectedTipPercent) / 100) * 100) / 100;
  const tipInr = Math.round((subtotalInr * selectedTipPercent) / 100);

  // Grand Totals
  const grandTotalUsd = Math.max(0, subtotalUsd - discountUsd + taxUsd + deliveryFeeUsd + tipUsd);
  const grandTotalInr = Math.max(0, subtotalInr - discountInr + taxInr + deliveryFeeInr + tipInr);

  const handleApplyCouponCode = () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleSubmit = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onPlaceOrder({
        orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        pickupTime: orderType === 'takeaway' ? pickupTime : undefined,
        paymentMethod,
        tip: tipUsd,
        tipInRupees: tipInr,
        specialInstructions,
        subtotal: subtotalUsd,
        subtotalInRupees: subtotalInr,
        discount: discountUsd,
        discountInRupees: discountInr,
        tax: taxUsd,
        taxInRupees: taxInr,
        deliveryFee: deliveryFeeUsd,
        deliveryFeeInRupees: deliveryFeeInr,
        total: grandTotalUsd,
        totalInRupees: grandTotalInr,
      });
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity">
      <div
        className={`w-full max-w-lg h-full flex flex-col shadow-2xl transition-transform border-l ${
          isDarkMode
            ? 'bg-[#0F131A] border-[#222938] text-[#F3EFE6]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'border-[#222938] bg-[#141923]' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
              <span>Royal Dastarkhwan Cart</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30">
                {cartItems.length} items
              </span>
            </h2>
            <p className="text-[11px] text-[#8E98A8] mt-0.5">
              Review courses & settle in Indian Rupees (₹) or USD ($)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-500 hover:text-rose-400 p-1.5"
                title="Clear All"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gray-700/50 hover:bg-black/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Type Toggle Strip */}
        <div
          className={`p-3 border-b flex items-center justify-between gap-1 text-xs font-bold ${
            isDarkMode ? 'border-[#222938] bg-[#121620]' : 'border-gray-200 bg-gray-100'
          }`}
        >
          <button
            onClick={() => onChangeOrderType('dine-in')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              orderType === 'dine-in'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dine-In</span>
          </button>

          <button
            onClick={() => onChangeOrderType('takeaway')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              orderType === 'takeaway'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Takeaway</span>
          </button>

          <button
            onClick={() => onChangeOrderType('delivery')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              orderType === 'delivery'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Delivery</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
          {/* Destination Specific Details */}
          {orderType === 'dine-in' && (
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-[#161B26] border-[#252D3E]' : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D97706] block">
                  Service Table
                </span>
                <span className="font-bold text-sm">{tableNumber} (Salon Noir)</span>
              </div>
              <select
                value={tableNumber}
                onChange={(e) => onChangeTableNumber(e.target.value)}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#1C2230] border-[#313C52] text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <option value="Table 14">Table 14</option>
                <option value="Table 08">Table 08</option>
                <option value="Booth M-3">Booth M-3</option>
                <option value="Diwan Suite 1">Diwan Suite 1</option>
              </select>
            </div>
          )}

          {orderType === 'takeaway' && (
            <div
              className={`p-3 rounded-2xl border space-y-1.5 ${
                isDarkMode ? 'bg-[#161B26] border-[#252D3E]' : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#D97706]">
                  Takeaway Ready Counter
                </span>
                <span className="text-[11px] font-bold text-[#10B981] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Ready in 20-25m
                </span>
              </div>
              <input
                type="text"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:border-[#D97706] ${
                  isDarkMode
                    ? 'bg-[#1C2230] border-[#313C52] text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          )}

          {orderType === 'delivery' && (
            <div
              className={`p-3 rounded-2xl border ${
                isDarkMode ? 'bg-[#161B26] border-[#252D3E]' : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-[#D97706] block mb-1">
                Royal Delivery Destination
              </span>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter complete street & apartment address"
                className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:border-[#D97706] ${
                  isDarkMode
                    ? 'bg-[#1C2230] border-[#313C52] text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
              <span className="text-[10px] text-[#8E98A8] mt-1 block">
                Thermal porcelain handi packaging guarantee
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E98A8] block">
              Dishes & Customizations ({cartItems.length})
            </span>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <Utensils className="w-8 h-8 text-[#8E98A8] mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-sm">Your royal cart is empty</p>
                <p className="text-[11px] text-[#8E98A8] mt-0.5">
                  Select authentic Awadhi dishes from the menu to feast.
                </p>
              </div>
            ) : (
              cartItems.map((item) => {
                const variant = item.dish.variants?.find(
                  (v) => v.id === item.customization.selectedVariantId
                );
                const itemTotalUsd = item.unitPrice * item.quantity;
                const unitInr =
                  item.unitPriceInRupees ||
                  (item.dish.priceInRupees ? item.dish.priceInRupees : Math.round(item.unitPrice * 83.5));
                const itemTotalInr = unitInr * item.quantity;

                return (
                  <div
                    key={item.cartItemId}
                    className={`p-3 rounded-2xl border flex gap-3 transition-all ${
                      isDarkMode
                        ? 'bg-[#141822] border-[#242C3B]'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <img
                      src={item.dish.imageUrl}
                      alt={item.dish.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-xs truncate">
                          {item.dish.name}
                        </h4>
                        <div className="text-right">
                          <span className="font-serif font-bold text-xs text-[#D97706] block">
                            {currency === 'INR' ? formatRupees(itemTotalInr) : formatUSD(itemTotalUsd)}
                          </span>
                          <span className="text-[9px] text-[#8E98A8]">
                            {currency === 'INR' ? formatUSD(itemTotalUsd) : formatRupees(itemTotalInr)}
                          </span>
                        </div>
                      </div>

                      {/* Customization Details */}
                      <div className="text-[10px] text-[#8E98A8] mt-0.5 space-y-0.5">
                        {variant && (
                          <div>
                            Portion: <span className="text-[#CBD5E1] font-medium">{variant.name}</span>
                          </div>
                        )}
                        {item.customization.selectedAddonIds.length > 0 && (
                          <div>
                            Addons:{' '}
                            <span className="text-[#CBD5E1] font-medium">
                              {item.customization.selectedAddonIds
                                .map((aid) => item.dish.addons?.find((a) => a.id === aid)?.name)
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        <div>
                          Spice:{' '}
                          <span className="text-[#EF4444] font-medium">
                            Level {item.customization.spiceLevel}/3
                          </span>
                        </div>
                        {item.customization.kitchenNote && (
                          <div className="italic">"{item.customization.kitchenNote}"</div>
                        )}
                      </div>

                      {/* Stepper + Remove */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-1.5 p-0.5 rounded-lg border bg-black/10 dark:bg-black/40 dark:border-white/10">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-5 h-5 rounded font-bold hover:bg-black/20 flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-bold text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-5 h-5 rounded font-bold hover:bg-black/20 flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-[#8E98A8] hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Coupon Code Section */}
          {cartItems.length > 0 && (
            <div
              className={`p-3.5 rounded-2xl border space-y-2 ${
                isDarkMode ? 'bg-[#141822] border-[#222938]' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Royal Privilege Promo Codes</span>
                </span>
                {appliedCoupon && (
                  <button
                    onClick={onRemoveCoupon}
                    className="text-[10px] text-rose-400 hover:underline font-bold"
                  >
                    Remove ({appliedCoupon.code})
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold text-xs">
                        {appliedCoupon.code} applied ({appliedCoupon.discountPercent}% Off)
                      </div>
                      <div className="text-[10px] text-emerald-400/80">
                        {currency === 'INR'
                          ? `Saved ${formatRupees(discountInr)} on this banquet`
                          : `Saved ${formatUSD(discountUsd)} on this banquet`}
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter promo code (e.g. ROYAL15)"
                      className={`flex-1 p-2 rounded-xl text-xs uppercase border focus:outline-none focus:border-[#D97706] ${
                        isDarkMode
                          ? 'bg-[#1C2230] border-[#313C52] text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                    <button
                      onClick={handleApplyCouponCode}
                      className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-rose-400 text-[10px]">{couponError}</p>}

                  {/* Available Coupon Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => onApplyCoupon(c.code)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border flex items-center gap-1 transition-colors ${
                          isDarkMode
                            ? 'bg-[#1D2330] border-[#2C384D] text-[#CBD5E1] hover:border-[#D97706]'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-[#D97706]'
                        }`}
                      >
                        <span className="font-bold text-[#D97706]">{c.code}</span>
                        <span>({c.discountPercent}%)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gratuity Tip Selection */}
          {cartItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E98A8] block">
                Hospitality Gratuity for Royal Kitchen & Servers
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setSelectedTipPercent(pct)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      selectedTipPercent === pct
                        ? 'border-[#D97706] bg-[#D97706]/15 text-[#D97706]'
                        : isDarkMode
                        ? 'border-[#222938] bg-[#141822] text-[#8E98A8]'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Instrument Picker */}
          {cartItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] block">
                Settlement Instrument
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', name: 'UPI / QR (₹)', icon: QrCode, desc: 'GPay/PhonePe' },
                  { id: 'card', name: 'Credit Card', icon: CreditCard, desc: 'Visa/Master' },
                  { id: 'cash', name: 'Pay at Desk', icon: Banknote, desc: 'Cash/POD' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                          : isDarkMode
                          ? 'border-[#242C3B] bg-[#141822] text-[#8E98A8]'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{m.name}</span>
                      <span className="text-[8px] opacity-70">{m.desc}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'upi' && (
                <div className="p-3 rounded-2xl bg-[#171E2B] border border-[#2B374D] flex items-center gap-3">
                  <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-black" />
                  </div>
                  <div className="text-[11px]">
                    <div className="font-bold text-white flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-[#D97706]" />
                      <span>Instant UPI Payment</span>
                    </div>
                    <p className="text-[#8E98A8] text-[10px] mt-0.5">
                      VPA: <span className="text-[#D97706] font-mono">royalgupta@okhdfcbank</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Financial Breakdown Table in Rupee (₹) & USD ($) */}
          {cartItems.length > 0 && (
            <div
              className={`p-3.5 rounded-2xl border space-y-1.5 text-xs ${
                isDarkMode ? 'bg-[#141923] border-[#222938]' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between text-[#8E98A8]">
                <span>Course Subtotal</span>
                <span className="font-medium text-white">
                  {currency === 'INR' ? formatRupees(subtotalInr) : formatUSD(subtotalUsd)}
                </span>
              </div>

              {discountInr > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Royal Privilege Discount</span>
                  <span>
                    -{currency === 'INR' ? formatRupees(discountInr) : formatUSD(discountUsd)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#8E98A8]">
                <span>GST & Regal Taxes (5%)</span>
                <span>{currency === 'INR' ? formatRupees(taxInr) : formatUSD(taxUsd)}</span>
              </div>

              {deliveryFeeInr > 0 && (
                <div className="flex justify-between text-[#8E98A8]">
                  <span>Thermal Courier Fee</span>
                  <span>
                    {currency === 'INR' ? formatRupees(deliveryFeeInr) : formatUSD(deliveryFeeUsd)}
                  </span>
                </div>
              )}

              {tipInr > 0 && (
                <div className="flex justify-between text-[#8E98A8]">
                  <span>Hospitality Gratuity ({selectedTipPercent}%)</span>
                  <span>{currency === 'INR' ? formatRupees(tipInr) : formatUSD(tipUsd)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-between items-baseline font-serif text-base font-bold text-[#D97706]">
                <span>Grand Total</span>
                <div className="text-right">
                  <span className="text-lg">
                    {currency === 'INR' ? formatRupees(grandTotalInr) : formatUSD(grandTotalUsd)}
                  </span>
                  <span className="text-[10px] text-[#8E98A8] block font-sans font-normal">
                    {currency === 'INR' ? `(${formatUSD(grandTotalUsd)})` : `(${formatRupees(grandTotalInr)})`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Button */}
        {cartItems.length > 0 && (
          <div
            className={`p-4 sm:p-5 border-t ${
              isDarkMode ? 'border-[#222938] bg-[#141923]' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm flex items-center justify-between transition-all shadow-lg shadow-[#D97706]/30 active:scale-95 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {orderType === 'dine-in'
                    ? 'Fire Royal Order to Kitchen'
                    : orderType === 'delivery'
                    ? 'Confirm Home Delivery'
                    : 'Confirm Takeaway Order'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-serif text-base font-bold">
                <span>{currency === 'INR' ? formatRupees(grandTotalInr) : formatUSD(grandTotalUsd)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
