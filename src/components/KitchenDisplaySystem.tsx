import React, { useState } from 'react';
import {
  ChefHat,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Utensils,
  Filter,
  User,
  Check,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus, ServiceCall, StaffMember, Currency } from '../types';
import { formatRupees, formatUSD } from '../utils/currency';

interface KitchenDisplaySystemProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  serviceCalls: ServiceCall[];
  onResolveServiceCall: (callId: string) => void;
  staffMembers: StaffMember[];
  isDarkMode: boolean;
  currency?: Currency;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({
  orders,
  onUpdateOrderStatus,
  serviceCalls,
  onResolveServiceCall,
  staffMembers,
  isDarkMode,
  currency = 'INR',
}) => {
  const [stationFilter, setStationFilter] = useState('all');

  // Filter orders by status
  const incomingOrders = orders.filter((o) => o.status === 'received');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const completedOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'out-for-delivery'
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner: Station Filters & Live Staff On Duty */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151A24] border-[#252C3B]' : 'bg-white border-gray-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E85738]/20 text-[#E85738]">
              <ChefHat className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold">
              Kitchen Display System (KDS)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-[#8E98A8] mt-1">
            Real-time bump bar, course pacing, station filters & floor buzzer requests
          </p>
        </div>

        {/* Station Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-[#8E98A8] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Station:
          </span>
          {[
            { id: 'all', label: 'All Stations' },
            { id: 'tandoor', label: 'Tandoor Hearth' },
            { id: 'curry', label: 'Curries & Handi' },
            { id: 'biryani', label: 'Dum Biryani' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStationFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                stationFilter === s.id
                  ? 'bg-[#E85738] border-[#E85738] text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-[#1C222E] border-[#2B3446] text-[#8E98A8]'
                  : 'bg-gray-100 border-gray-200 text-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Calls Buzzer Alerts (If any pending) */}
      {serviceCalls.some((c) => c.status !== 'resolved') && (
        <div
          className={`p-4 rounded-3xl border space-y-3 ${
            isDarkMode
              ? 'bg-[#2A1613] border-[#7F231C]'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Pending Tableside Service Calls ({serviceCalls.filter((c) => c.status !== 'resolved').length})</span>
            </div>
            <span className="text-[11px] text-rose-300/80 font-medium">
              Floor staff attention required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {serviceCalls
              .filter((c) => c.status !== 'resolved')
              .map((call) => (
                <div
                  key={call.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    isDarkMode
                      ? 'bg-[#190E0D] border-[#5E1A14] text-white'
                      : 'bg-white border-rose-200 text-gray-900'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className="text-[#F59E0B]">{call.tableNumber}</span>
                      <span>·</span>
                      <span className="text-rose-400 font-bold">{call.requestType}</span>
                    </div>
                    <div className="text-[10px] text-[#8E98A8]">Requested at {call.timestamp}</div>
                  </div>

                  <button
                    onClick={() => onResolveServiceCall(call.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Attend</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* KDS Columns: Incoming, Cooking, Ready, Completed */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. INCOMING TICKETS */}
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider">
                1. Incoming Orders
              </h3>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              {incomingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {incomingOrders.length === 0 ? (
              <div
                className={`p-6 rounded-2xl border border-dashed text-center text-xs text-[#8E98A8] ${
                  isDarkMode ? 'border-[#222938]' : 'border-gray-300'
                }`}
              >
                No pending incoming tickets
              </div>
            ) : (
              incomingOrders.map((order) => (
                <TicketCard
                  key={order.id}
                  order={order}
                  isDarkMode={isDarkMode}
                  currency={currency}
                  onAdvance={() => onUpdateOrderStatus(order.id, 'preparing')}
                  advanceLabel="Start Fire / Cooking"
                  advanceColor="bg-blue-600 hover:bg-blue-500"
                />
              ))
            )}
          </div>
        </div>

        {/* 2. ACTIVE COOKING & TANDOOR */}
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E85738] animate-pulse"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#E85738]">
                2. On Stove / Tandoor
              </h3>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-[#E85738]/20 text-[#E85738]">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {preparingOrders.length === 0 ? (
              <div
                className={`p-6 rounded-2xl border border-dashed text-center text-xs text-[#8E98A8] ${
                  isDarkMode ? 'border-[#222938]' : 'border-gray-300'
                }`}
              >
                No tickets actively cooking
              </div>
            ) : (
              preparingOrders.map((order) => (
                <TicketCard
                  key={order.id}
                  order={order}
                  isDarkMode={isDarkMode}
                  currency={currency}
                  onAdvance={() => onUpdateOrderStatus(order.id, 'ready')}
                  advanceLabel="Bump to Ready / Plated"
                  advanceColor="bg-[#E85738] hover:bg-[#D44728]"
                />
              ))
            )}
          </div>
        </div>

        {/* 3. READY FOR SERVICE */}
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                3. Plated & Ready
              </h3>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {readyOrders.length === 0 ? (
              <div
                className={`p-6 rounded-2xl border border-dashed text-center text-xs text-[#8E98A8] ${
                  isDarkMode ? 'border-[#222938]' : 'border-gray-300'
                }`}
              >
                No orders waiting on pass counter
              </div>
            ) : (
              readyOrders.map((order) => (
                <TicketCard
                  key={order.id}
                  order={order}
                  isDarkMode={isDarkMode}
                  currency={currency}
                  onAdvance={() =>
                    onUpdateOrderStatus(
                      order.id,
                      order.orderType === 'delivery' ? 'out-for-delivery' : 'completed'
                    )
                  }
                  advanceLabel={
                    order.orderType === 'delivery' ? 'Dispatch Courier' : 'Mark Served to Table'
                  }
                  advanceColor="bg-amber-600 hover:bg-amber-500"
                />
              ))
            )}
          </div>
        </div>

        {/* 4. COMPLETED / DISPATCHED */}
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                4. Completed / Dispatched
              </h3>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {completedOrders.length === 0 ? (
              <div
                className={`p-6 rounded-2xl border border-dashed text-center text-xs text-[#8E98A8] ${
                  isDarkMode ? 'border-[#222938]' : 'border-gray-300'
                }`}
              >
                Recent completed orders will appear here
              </div>
            ) : (
              completedOrders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className={`p-3.5 rounded-2xl border text-xs opacity-75 ${
                    isDarkMode ? 'bg-[#141822] border-[#222938]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span>{order.orderNumber}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {order.status === 'out-for-delivery' ? 'Out for Delivery' : 'Served'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8E98A8] mt-1">
                    {order.orderType === 'dine-in' ? order.tableNumber : order.customerName} · {order.items.length} items
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Staff Shift Roster */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border space-y-3 ${
          isDarkMode ? 'bg-[#151922] border-[#242C3B]' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-[#D97706] flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>Active Shift Staff & Brigade</span>
          </span>
          <span className="text-xs text-[#8E98A8]">
            {staffMembers.filter((s) => s.status === 'on-duty').length} Khansamas & Captains On Duty
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                isDarkMode ? 'bg-[#181D28] border-[#263143]' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-xl">{member.avatar}</div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs truncate">{member.name}</div>
                <div className="text-[10px] text-[#D97706] font-semibold">{member.role}</div>
                <div className="text-[9px] text-[#8E98A8] truncate">{member.assignedSection}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable KDS Ticket Card Component
interface TicketCardProps {
  order: Order;
  isDarkMode: boolean;
  currency: Currency;
  onAdvance: () => void;
  advanceLabel: string;
  advanceColor: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  order,
  isDarkMode,
  currency,
  onAdvance,
  advanceLabel,
  advanceColor,
}) => {
  return (
    <div
      className={`rounded-2xl border p-4 space-y-3 shadow-md flex flex-col justify-between transition-all ${
        isDarkMode
          ? 'bg-[#161B26] border-[#273244] hover:border-[#3C4D6B]'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div>
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="font-serif font-bold text-sm text-[#D97706]">
              {order.orderNumber}
            </div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">
              {order.orderType === 'dine-in'
                ? order.tableNumber || 'Table 14'
                : order.orderType === 'takeaway'
                ? 'Takeaway Pickup'
                : 'Delivery'}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/30 border border-white/10 text-[#8E98A8] font-bold">
              {order.createdAt}
            </span>
          </div>
        </div>

        {/* Customer & Notes */}
        <div className="py-2 text-xs">
          <div className="font-semibold text-[11px] text-[#8E98A8]">
            Guest: <span className="text-white">{order.customerName}</span>
          </div>
          {order.specialInstructions && (
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-medium mt-1.5">
              ⚠️ Note: "{order.specialInstructions}"
            </div>
          )}
        </div>

        {/* Items List with thumbnails */}
        <div className="space-y-2 py-1">
          {order.items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-start justify-between gap-2 text-xs border-b border-black/5 dark:border-white/5 pb-1.5"
            >
              <div className="flex items-start gap-2">
                <img
                  src={item.dish.imageUrl}
                  alt={item.dish.name}
                  className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div>
                  <div className="font-bold leading-tight flex items-center gap-1.5">
                    <span className="text-[#D97706] font-bold">{item.quantity}x</span>
                    <span>{item.dish.name}</span>
                  </div>
                  <div className="text-[10px] text-[#8E98A8]">
                    Spice: {item.customization.spiceLevel}/3
                    {item.customization.kitchenNote && (
                      <span className="text-amber-400 block italic">
                        "{item.customization.kitchenNote}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Total in Rupees & USD */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#8E98A8]">Ticket Value:</span>
          <span className="font-serif font-bold text-[#D97706]">
            {currency === 'INR'
              ? formatRupees(order.totalInRupees || Math.round(order.total * 83.5))
              : formatUSD(order.total)}
          </span>
        </div>
      </div>

      {/* Bump Bar Action */}
      <button
        onClick={onAdvance}
        className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${advanceColor}`}
      >
        <span>{advanceLabel}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
