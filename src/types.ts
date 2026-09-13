export type UserRole = 'customer' | 'staff' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  loyaltyPoints: number;
  savedAddresses: string[];
  jwtToken?: string;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'card' | 'upi' | 'cash';

export type Currency = 'INR' | 'USD';

export interface DishVariant {
  id: string;
  name: string;
  priceDelta: number;
  priceDeltaInRupees?: number;
  weight?: string;
}

export interface DishAddon {
  id: string;
  name: string;
  price: number;
  priceInRupees?: number;
  imageUrl?: string;
  category?: string;
}

export interface IngredientRequirement {
  ingredientId: string;
  quantityRequired: number; // in base units
}

export interface Dish {
  id: string;
  name: string;
  hindiName?: string;
  categoryId: string;
  price: number;
  priceInRupees: number;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  isVeg: boolean;
  isChefSpecial?: boolean;
  isAvailable: boolean;
  spiceLevel: 1 | 2 | 3; // 1 = mild, 2 = medium, 3 = royal fiery
  calories?: string;
  prepTime: string;
  rating: number;
  ratingCount: number;
  tags: string[];
  variants?: DishVariant[];
  addons?: DishAddon[];
  ingredientRequirements?: IngredientRequirement[];
}

export interface CartCustomization {
  selectedVariantId?: string;
  selectedAddonIds: string[];
  spiceLevel: 1 | 2 | 3;
  kitchenNote: string;
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  customization: CartCustomization;
  unitPrice: number; // with variant + addons in USD
  unitPriceInRupees: number; // with variant + addons in INR (₹)
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  pickupTime?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  totalInRupees?: number;
  subtotalInRupees?: number;
  discountInRupees?: number;
  taxInRupees?: number;
  deliveryFeeInRupees?: number;
  tipInRupees?: number;
  currency?: Currency;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  customerName: string;
  customerPhone: string;
  specialInstructions?: string;
  estimatedMinutesRemaining: number;
  assignedStaff?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  section: 'Royal Darbar' | 'Maharaja Booth' | 'Garden Courtyard' | 'Private Diwan';
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  tableAssigned?: string;
  notes?: string;
  specialOccasion?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Grains' | 'Dairy' | 'Meat & Poultry' | 'Spices' | 'Oil & Ghee' | 'Produce';
  currentStock: number;
  unit: string; // 'kg', 'litres', 'packets', 'grams'
  minThreshold: number;
  costPerUnit: number;
  costPerUnitInRupees?: number;
  supplier: string;
  lastRestocked: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  maxDiscountInRupees?: number;
  minOrder: number;
  minOrderInRupees?: number;
  description: string;
  isActive: boolean;
  usageCount: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  dishName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedOrder: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Executive Chef' | 'Sous Chef' | 'Tandoor Master' | 'Floor Captain' | 'Server' | 'Cashier';
  shift: 'Morning (10 AM - 4 PM)' | 'Evening (4 PM - 11 PM)' | 'All Day';
  assignedSection: string;
  status: 'on-duty' | 'on-break' | 'off-duty';
  activeTicketsCount: number;
  avatar: string;
}

export interface ServiceCall {
  id: string;
  tableNumber: string;
  requestType: 'Water Refill' | 'Call Captain' | 'Request Bill' | 'Cutlery Request';
  timestamp: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  category: 'Orders' | 'Inventory' | 'Menu' | 'Auth' | 'Coupons' | 'System';
}

export interface Category {
  id: string;
  name: string;
  hindiName?: string;
  icon: string;
  description: string;
  itemCount: number;
}
