import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  ChefHat,
  Sparkles,
  Utensils,
  Bell,
  PhoneCall,
  FileText,
  Crown,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Order, Currency } from '../types';
import { formatRupees, formatUSD } from '../utils/currency';

interface LiveOrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onRequestServiceCall: (type: 'Water Refill' | 'Call Captain' | 'Request Bill' | 'Cutlery Request') => void;
  currency: Currency;
}

export const LiveOrderTrackerModal: React.FC<LiveOrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  isDarkMode,
  onRequestServiceCall,
  currency,
}) => {
  if (!isOpen || !order) return null;

  const [serviceMessage, setServiceMessage] = useState('');

  // Status mapping
  const steps = [
    {
      id: 'received',
      title: 'Royal Order Received',
      desc: 'Ticket dispatched to Royal Kitchen hearth',
      icon: FileText,
    },
    {
      id: 'preparing',
      title: 'Active Simmer & Tandoor',
      desc: 'Infusing saffron and slow-cooking over coal embers',
      icon: Flame,
    },
    {
      id: 'ready',
      title: 'Plated & Quality Approved',
      desc: 'Inspected with silver vark and fresh coriander',
      icon: ChefHat,
    },
    {
      id: order.orderType === 'delivery' ? 'out-for-delivery' : 'completed',
      title: order.orderType === 'delivery' ? 'Dispatched with Thermal Courier' : 'Served at Royal Table',
      desc: order.orderType === 'delivery' ? 'Arriving warm at your doorstep' : 'Presented on royal copperware',
      icon: Utensils,
    },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'received':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'out-for-delivery':
      case 'completed':
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleCall = (type: 'Water Refill' | 'Call Captain' | 'Request Bill' | 'Cutlery Request') => {
    onRequestServiceCall(type);
    setServiceMessage(`Buzzer sent: "${type}". Royal Captain has been notified!`);
    setTimeout(() => setServiceMessage(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isDarkMode
            ? 'bg-[#121620] border-[#252C3B] text-[#F3EFE6]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#151A25] border-[#252D3E]' : 'bg-amber-50/50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-[#D97706]">
                  {order.orderNumber}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/20 border border-white/10 text-white">
                  {order.orderType}
                </span>
              </div>
              <p className="text-[11px] text-[#8E98A8]">
                {order.orderType === 'dine-in'
                  ? `Seated at ${order.tableNumber || 'Table 14'}`
                  : order.orderType === 'takeaway'
                  ? 'Takeaway Counter'
                  : 'Royal Delivery'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-700/50 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Estimated Time Card */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDarkMode
                ? 'bg-gradient-to-r from-[#21160F] to-[#161B26] border-[#4A2814]'
                : 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706]">
                  Estimated Prep Completion
                </span>
                <div className="font-serif text-2xl font-bold">
                  {order.estimatedMinutesRemaining > 0
                    ? `~${order.estimatedMinutesRemaining} Minutes`
                    : 'Order Plated & Ready!'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#8E98A8] block">Kitchen Station</span>
              <span className="text-xs font-bold text-[#F59E0B]">Tandoor & Dum Biryani</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] block">
              Live Kitchen & Hospitality Progression
            </span>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.id} className="relative flex items-start gap-3">
                    {/* Circle Icon */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#D97706] text-white ring-4 ring-[#D97706]/20'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : isDarkMode
                          ? 'bg-[#1C222E] text-gray-500 border border-gray-700'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Icon className="w-3 h-3" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-bold text-xs ${
                            isCurrent
                              ? 'text-[#D97706]'
                              : isPassed
                              ? 'text-white'
                              : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D97706]/20 text-[#D97706] font-bold animate-pulse">
                            Active
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isDarkMode ? 'text-[#8E98A8]' : 'text-gray-600'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dine-In Hospitality Buzzer (Tableside Service) */}
          {order.orderType === 'dine-in' && (
            <div
              className={`p-4 rounded-2xl border space-y-2.5 ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Tableside Service Assistance</span>
                </span>
                <span className="text-[10px] text-[#8E98A8]">
                  Table {order.tableNumber || '14'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Water Refill', type: 'Water Refill' as const },
                  { label: 'Call Captain', type: 'Call Captain' as const },
                  { label: 'Request Bill', type: 'Request Bill' as const },
                  { label: 'Fresh Cutlery', type: 'Cutlery Request' as const },
                ].map((b) => (
                  <button
                    key={b.type}
                    onClick={() => handleCall(b.type)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition-all hover:border-[#D97706] hover:text-[#D97706] ${
                      isDarkMode
                        ? 'bg-[#1C222E] border-[#2A3446] text-[#CBD5E1]'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {serviceMessage && (
                <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs font-semibold text-center animate-fadeIn">
                  {serviceMessage}
                </div>
              )}
            </div>
          )}

          {/* Itemized Order Summary */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E98A8] block">
              Dastarkhwan Selections ({order.items.length} items)
            </span>

            <div
              className={`rounded-2xl border divide-y ${
                isDarkMode
                  ? 'bg-[#141822] border-[#222938] divide-[#222938]'
                  : 'bg-gray-50 border-gray-200 divide-gray-200'
              }`}
            >
              {order.items.map((item) => (
                <div key={item.cartItemId} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-[#D97706]/20 text-[#D97706] font-bold text-xs flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <div>
                      <div className="font-bold text-xs">{item.dish.name}</div>
                      <div className="text-[10px] text-[#8E98A8]">
                        Spice {item.customization.spiceLevel}/3
                        {item.customization.kitchenNote && ` · "${item.customization.kitchenNote}"`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-xs text-[#D97706] block">
                      {currency === 'INR'
                        ? formatRupees((item.unitPriceInRupees || Math.round(item.unitPrice * 83.5)) * item.quantity)
                        : formatUSD(item.unitPrice * item.quantity)}
                    </span>
                    <span className="text-[9px] text-[#8E98A8]">
                      {currency === 'INR'
                        ? formatUSD(item.unitPrice * item.quantity)
                        : formatRupees((item.unitPriceInRupees || Math.round(item.unitPrice * 83.5)) * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center px-1 pt-1 text-xs">
              <span className="text-[#8E98A8]">
                Settled via {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
              </span>
              <div className="text-right">
                <span className="font-serif font-bold text-sm text-[#D97706] block">
                  Total: {currency === 'INR'
                    ? formatRupees(order.totalInRupees || Math.round(order.total * 83.5))
                    : formatUSD(order.total)}
                </span>
                <span className="text-[10px] text-[#8E98A8]">
                  {currency === 'INR'
                    ? `(${formatUSD(order.total)})`
                    : `(${formatRupees(order.totalInRupees || Math.round(order.total * 83.5))})`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isDarkMode ? 'bg-[#151A25] border-[#252D3E]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition-colors shadow-md"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
