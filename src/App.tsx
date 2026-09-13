import React, { useState } from 'react';
import {
  UserRole,
  UserProfile,
  Dish,
  Category,
  CartItem,
  OrderType,
  PaymentMethod,
  Coupon,
  Order,
  OrderStatus,
  Reservation,
  InventoryItem,
  StaffMember,
  ServiceCall,
  AuditLog,
  CustomerReview,
  CartCustomization,
  Currency,
} from './types';
import {
  CATEGORIES,
  DISHES_SEED,
  COUPONS_SEED,
  INITIAL_ORDERS,
  RESERVATIONS_SEED,
  INVENTORY_SEED,
  STAFF_MEMBERS_SEED,
  SERVICE_CALLS_SEED,
  REVIEWS_SEED,
  AUDIT_LOGS_SEED,
} from './data/royalData';
import { RoyalNavbar } from './components/RoyalNavbar';
import { CustomerMenu } from './components/CustomerMenu';
import { DishCustomizerModal } from './components/DishCustomizerModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { LiveOrderTrackerModal } from './components/LiveOrderTrackerModal';
import { TableReservationModal } from './components/TableReservationModal';
import { KitchenDisplaySystem } from './components/KitchenDisplaySystem';
import { ManagerDashboard } from './components/ManagerDashboard';
import { AdminAnalyticsDashboard } from './components/AdminAnalyticsDashboard';
import { AuthModal } from './components/AuthModal';
import { ReviewsAndHeritage } from './components/ReviewsAndHeritage';

export default function App() {
  // Theme & Role & Currency
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('menu');

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-8841',
    name: 'Maharaja Vikramaditya',
    email: 'vikramaditya@royalguptabites.com',
    phone: '+1 (555) 234-8901',
    role: 'customer',
    loyaltyPoints: 1250,
    savedAddresses: ['Penthouse 4B, Emerald Royal Residences, West Wing'],
  });

  // Core Data State
  const [dishes, setDishes] = useState<Dish[]>(DISHES_SEED);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS_SEED);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(COUPONS_SEED[0]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS_SEED);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_SEED);
  const [staffMembers] = useState<StaffMember[]>(STAFF_MEMBERS_SEED);
  const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>(SERVICE_CALLS_SEED);
  const [reviews, setReviews] = useState<CustomerReview[]>(REVIEWS_SEED);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS_SEED);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'init-galouti',
      dish: DISHES_SEED[0],
      quantity: 1,
      customization: {
        selectedVariantId: 'v-6pc',
        selectedAddonIds: ['add-sheermaal'],
        spiceLevel: 2,
        kitchenNote: 'Extra soft mini saffron sheermaal',
      },
      unitPrice: 28.99,
      unitPriceInRupees: 2420,
    },
    {
      cartItemId: 'init-biryani',
      dish: DISHES_SEED[8],
      quantity: 1,
      customization: {
        selectedVariantId: 'v-single',
        selectedAddonIds: ['add-burani'],
        spiceLevel: 2,
        kitchenNote: '',
      },
      unitPrice: 26.5,
      unitPriceInRupees: 2212,
    },
  ]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('Table 14');

  // Modals
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState<boolean>(false);
  const [reservationModalOpen, setReservationModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Manager sub-section
  const [activeManagerSection, setActiveManagerSection] = useState<'menu' | 'inventory' | 'coupons'>('menu');

  // Admin sub-section
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'logs' | 'settings'>('analytics');

  // --- Handlers ---
  const handleQuickAdd = (dish: Dish) => {
    const newItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity: 1,
      customization: {
        selectedVariantId: dish.variants?.[0]?.id,
        selectedAddonIds: [],
        spiceLevel: dish.spiceLevel || 2,
        kitchenNote: '',
      },
      unitPrice: dish.price,
      unitPriceInRupees: dish.priceInRupees || Math.round(dish.price * 83.5),
    };
    setCartItems((prev) => [...prev, newItem]);
    setCartDrawerOpen(true);
  };

  const handleCustomAddToCart = (
    dish: Dish,
    quantity: number,
    customization: CartCustomization,
    unitPrice: number,
    unitPriceInRupees?: number
  ) => {
    const inr =
      unitPriceInRupees ||
      (dish.priceInRupees
        ? Math.round((unitPrice / (dish.price || 1)) * dish.priceInRupees)
        : Math.round(unitPrice * 83.5));
    const newItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity,
      customization,
      unitPrice,
      unitPriceInRupees: inr,
    };
    setCartItems((prev) => [...prev, newItem]);
    setCustomizingDish(null);
    setCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleApplyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid Royal coupon code.' };
    }
    if (!found.isActive) {
      return { success: false, message: 'This privilege code is currently inactive.' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place order & Deduct Inventory!
  const handlePlaceOrder = (details: {
    orderType: OrderType;
    tableNumber?: string;
    deliveryAddress?: string;
    pickupTime?: string;
    paymentMethod: PaymentMethod;
    tip: number;
    specialInstructions: string;
  }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
      const raw = (subtotal * appliedCoupon.discountPercent) / 100;
      discount = appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    }
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
    const deliveryFee = details.orderType === 'delivery' ? 4.99 : 0;
    const total = Math.max(0, subtotal - discount + tax + deliveryFee + details.tip);

    const newOrderNumber = `RGB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderType: details.orderType,
      tableNumber: details.tableNumber,
      deliveryAddress: details.deliveryAddress,
      pickupTime: details.pickupTime,
      items: [...cartItems],
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      tax,
      deliveryFee,
      tip: details.tip,
      total,
      status: 'received',
      paymentMethod: details.paymentMethod,
      paymentStatus: 'paid',
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      specialInstructions: details.specialInstructions,
      estimatedMinutesRemaining: 22,
    };

    // Auto-deduct inventory based on dish recipe requirements
    const updatedInventory = [...inventory];
    let deductedNotes: string[] = [];

    cartItems.forEach((cartItem) => {
      if (cartItem.dish.ingredientRequirements) {
        cartItem.dish.ingredientRequirements.forEach((req) => {
          const invIdx = updatedInventory.findIndex((i) => i.id === req.ingredientId);
          if (invIdx > -1) {
            const deductAmt = req.quantityRequired * cartItem.quantity;
            updatedInventory[invIdx].currentStock = Math.max(
              0,
              Math.round((updatedInventory[invIdx].currentStock - deductAmt) * 100) / 100
            );
            deductedNotes.push(
              `${deductAmt}${updatedInventory[invIdx].unit} ${updatedInventory[invIdx].name}`
            );
          }
        });
      }
    });

    setInventory(updatedInventory);
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackedOrder(newOrder);
    setCartItems([]);
    setTrackerModalOpen(true);

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser.name,
      role: currentRole,
      action: 'Order Placed & Stock Deducted',
      details: `Order #${newOrderNumber} placed. Deducted: ${deductedNotes.slice(0, 3).join(', ')}`,
      category: 'Orders',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // KDS Status Advancer
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: nextStatus,
              estimatedMinutesRemaining:
                nextStatus === 'ready' || nextStatus === 'completed' ? 0 : 8,
            }
          : o
      )
    );

    if (activeTrackedOrder && activeTrackedOrder.id === orderId) {
      setActiveTrackedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              estimatedMinutesRemaining:
                nextStatus === 'ready' || nextStatus === 'completed' ? 0 : 8,
            }
          : null
      );
    }

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: 'Chef Ranveer',
      role: 'staff',
      action: 'Order Status Bumped',
      details: `Order marked as ${nextStatus.toUpperCase()}`,
      category: 'Orders',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Tableside service calls
  const handleRequestServiceCall = (
    type: 'Water Refill' | 'Call Captain' | 'Request Bill' | 'Cutlery Request'
  ) => {
    const newCall: ServiceCall = {
      id: `call-${Date.now()}`,
      tableNumber,
      requestType: type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };
    setServiceCalls((prev) => [newCall, ...prev]);
  };

  const handleResolveServiceCall = (callId: string) => {
    setServiceCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: 'resolved' } : c))
    );
  };

  // Manager: toggle dish availability
  const handleToggleDishAvailability = (dishId: string) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const handleUpdateDishPrice = (dishId: string, newPrice: number, newPriceInRupees?: number) => {
    setDishes((prev) =>
      prev.map((d) =>
        d.id === dishId
          ? {
              ...d,
              price: newPrice,
              priceInRupees:
                newPriceInRupees || Math.round(newPrice * (currency === 'INR' ? 83.5 : 83.5)),
            }
          : d
      )
    );
  };

  const handleAddNewDish = (newDish: Dish) => {
    setDishes((prev) => [newDish, ...prev]);
  };

  const handleRestockItem = (itemId: string, addedAmount: number) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              currentStock: i.currentStock + addedAmount,
              lastRestocked: new Date().toISOString().split('T')[0],
            }
          : i
      )
    );
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleAddNewCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const handleAddReservation = (res: Reservation) => {
    setReservations((prev) => [res, ...prev]);
  };

  const handleAddReview = (rev: CustomerReview) => {
    setReviews((prev) => [rev, ...prev]);
  };

  const pendingServiceCallsCount = serviceCalls.filter((c) => c.status === 'pending').length;

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-[#D97706] selection:text-white transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0A0D12] text-[#F3EFE6]' : 'bg-[#F8FAFC] text-[#1E293B]'
      }`}
    >
      {/* Universal Royal Header & Role Switcher */}
      <RoyalNavbar
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          setCurrentUser((prev) => ({ ...prev, role }));
          if (role === 'customer') setActiveTab('menu');
          else if (role === 'staff') setActiveTab('kds');
          else if (role === 'manager') setActiveTab('manager-menu');
          else if (role === 'admin') setActiveTab('admin-analytics');
        }}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenReservations={() => setReservationModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        currentUser={currentUser}
        pendingServiceCallsCount={pendingServiceCallsCount}
        onOpenTracker={() => setTrackerModalOpen(true)}
        hasActiveOrder={Boolean(activeTrackedOrder)}
        currency={currency}
        onToggleCurrency={() => setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'))}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* CUSTOMER PORTAL VIEWS */}
        {currentRole === 'customer' && (
          <>
            {activeTab === 'menu' && (
              <CustomerMenu
                categories={categories}
                dishes={dishes.filter((d) => d.isAvailable)}
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => setSelectedCategory(id)}
                onOpenDishDetail={(dish) => setCustomizingDish(dish)}
                onQuickAdd={handleQuickAdd}
                isDarkMode={isDarkMode}
                currency={currency}
                orderType={orderType}
                onChangeOrderType={(t) => setOrderType(t)}
                tableNumber={tableNumber}
                onChangeTableNumber={(t) => setTableNumber(t)}
                onOpenReservation={() => setReservationModalOpen(true)}
              />
            )}

            {(activeTab === 'story' || activeTab === 'reviews') && (
              <ReviewsAndHeritage
                reviews={reviews}
                onAddReview={handleAddReview}
                dishes={dishes}
                isDarkMode={isDarkMode}
                activeView={activeTab as 'story' | 'reviews'}
              />
            )}
          </>
        )}

        {/* STAFF / KITCHEN DISPLAY PORTAL */}
        {currentRole === 'staff' && (
          <KitchenDisplaySystem
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            serviceCalls={serviceCalls}
            onResolveServiceCall={handleResolveServiceCall}
            staffMembers={staffMembers}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}

        {/* RESTAURANT MANAGER PORTAL */}
        {currentRole === 'manager' && (
          <ManagerDashboard
            dishes={dishes}
            categories={categories}
            onToggleDishAvailability={handleToggleDishAvailability}
            onUpdateDishPrice={handleUpdateDishPrice}
            onAddNewDish={handleAddNewDish}
            inventory={inventory}
            onRestockItem={handleRestockItem}
            coupons={coupons}
            onToggleCoupon={handleToggleCoupon}
            onAddNewCoupon={handleAddNewCoupon}
            isDarkMode={isDarkMode}
            currency={currency}
            activeManagerSection={activeManagerSection}
            onChangeManagerSection={(sec) => setActiveManagerSection(sec)}
          />
        )}

        {/* ADMIN / SAAS ANALYTICS PORTAL */}
        {currentRole === 'admin' && (
          <AdminAnalyticsDashboard
            auditLogs={auditLogs}
            isDarkMode={isDarkMode}
            currency={currency}
            activeAdminTab={activeAdminTab}
            onChangeAdminTab={(tab) => setActiveAdminTab(tab)}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <DishCustomizerModal
        dish={customizingDish}
        isOpen={Boolean(customizingDish)}
        onClose={() => setCustomizingDish(null)}
        onAddToCart={handleCustomAddToCart}
        isDarkMode={isDarkMode}
        currency={currency}
      />

      <CartCheckoutDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        onChangeOrderType={(t) => setOrderType(t)}
        tableNumber={tableNumber}
        onChangeTableNumber={(t) => setTableNumber(t)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onPlaceOrder={handlePlaceOrder}
        isDarkMode={isDarkMode}
        currency={currency}
        availableCoupons={coupons.filter((c) => c.isActive)}
      />

      <LiveOrderTrackerModal
        order={activeTrackedOrder}
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        isDarkMode={isDarkMode}
        currency={currency}
        onRequestServiceCall={handleRequestServiceCall}
      />

      <TableReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        onAddReservation={handleAddReservation}
        isDarkMode={isDarkMode}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(u) => {
          setCurrentUser(u);
          setCurrentRole(u.role);
          if (u.role === 'customer') setActiveTab('menu');
          else if (u.role === 'staff') setActiveTab('kds');
          else if (u.role === 'manager') setActiveTab('manager-menu');
          else if (u.role === 'admin') setActiveTab('admin-analytics');
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
