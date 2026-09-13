import React from 'react';
import {
  Crown,
  ShoppingBag,
  Calendar,
  Sun,
  Moon,
  ShieldCheck,
  User,
  ChefHat,
  BarChart3,
  Sliders,
  Bell,
} from 'lucide-react';
import { UserRole, UserProfile, Currency } from '../types';

interface RoyalNavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenReservations: () => void;
  onOpenAuth: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentUser: UserProfile;
  pendingServiceCallsCount: number;
  onOpenTracker?: () => void;
  hasActiveOrder?: boolean;
  currency: Currency;
  onToggleCurrency: () => void;
}

export const RoyalNavbar: React.FC<RoyalNavbarProps> = ({
  currentRole,
  onChangeRole,
  cartItemCount,
  onOpenCart,
  onOpenReservations,
  onOpenAuth,
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  currentUser,
  pendingServiceCallsCount,
  onOpenTracker,
  hasActiveOrder,
  currency,
  onToggleCurrency,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isDarkMode
          ? 'bg-[#0E1116]/95 border-[#232938] text-[#F3EFE6]'
          : 'bg-white/95 border-[#E2E8F0] text-[#1E293B]'
      } backdrop-blur-md`}
    >
      {/* Top Role Selector & System Announcement Strip */}
      <div
        className={`px-4 py-1.5 text-xs border-b flex flex-wrap items-center justify-between gap-2 ${
          isDarkMode
            ? 'bg-[#151922] border-[#202736] text-[#94A3B8]'
            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-[#D97706]">
            <Crown className="w-3.5 h-3.5" />
            <span>Royal Gupta Bites</span>
          </span>
          <span className="hidden sm:inline text-[#64748B]">|</span>
          <span className="hidden sm:inline text-[11px]">
            Awadhi & Mughlai Heritage · Table 14 Salon
          </span>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider mr-1 text-[#64748B] hidden md:inline">
            Active Role:
          </span>

          <button
            onClick={() => {
              onChangeRole('customer');
              onSelectTab('menu');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              currentRole === 'customer'
                ? 'bg-[#D97706] text-white shadow-sm shadow-[#D97706]/30'
                : isDarkMode
                ? 'bg-[#1C222E] text-[#94A3B8] hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => {
              onChangeRole('staff');
              onSelectTab('kds');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              currentRole === 'staff'
                ? 'bg-[#E85738] text-white shadow-sm shadow-[#E85738]/30'
                : isDarkMode
                ? 'bg-[#1C222E] text-[#94A3B8] hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChefHat className="w-3 h-3" />
            <span>Staff / KDS</span>
            {pendingServiceCallsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#E85738] text-[9px] font-extrabold flex items-center justify-center">
                {pendingServiceCallsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              onChangeRole('manager');
              onSelectTab('manager-menu');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              currentRole === 'manager'
                ? 'bg-[#10B981] text-white shadow-sm shadow-[#10B981]/30'
                : isDarkMode
                ? 'bg-[#1C222E] text-[#94A3B8] hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Manager</span>
          </button>

          <button
            onClick={() => {
              onChangeRole('admin');
              onSelectTab('admin-analytics');
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              currentRole === 'admin'
                ? 'bg-[#6366F1] text-white shadow-sm shadow-[#6366F1]/30'
                : isDarkMode
                ? 'bg-[#1C222E] text-[#94A3B8] hover:text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('menu')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#B45309] p-0.5 shadow-md shadow-[#D97706]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#120D0A] rounded-[10px] flex items-center justify-center text-[#F59E0B] group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 fill-[#F59E0B]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-[#D97706] leading-none">
                ROYAL GUPTA
              </span>
              <span
                className={`text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  isDarkMode
                    ? 'bg-[#2A2016] text-[#FBBF24] border border-[#78350F]'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                BITES
              </span>
            </div>
            <p className="text-[10px] text-[#8E98A8] font-medium tracking-wide">
              Mughlai & Awadhi Culinary Grandeur
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Contextual to Role) */}
        <nav className="hidden lg:flex items-center gap-1">
          {currentRole === 'customer' && (
            <>
              <button
                onClick={() => onSelectTab('menu')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'menu'
                    ? 'bg-[#D97706]/15 text-[#D97706]'
                    : 'hover:bg-black/5 hover:text-[#D97706]'
                }`}
              >
                Royal Menu
              </button>
              <button
                onClick={onOpenReservations}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reservations'
                    ? 'bg-[#D97706]/15 text-[#D97706]'
                    : 'hover:bg-black/5 hover:text-[#D97706]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Reserve Table</span>
              </button>
              {hasActiveOrder && (
                <button
                  onClick={onOpenTracker}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E85738]/15 text-[#E85738] flex items-center gap-1.5 animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-[#E85738]"></span>
                  <span>Live Order Status</span>
                </button>
              )}
              <button
                onClick={() => onSelectTab('story')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-black/5"
              >
                Our Heritage
              </button>
              <button
                onClick={() => onSelectTab('reviews')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-black/5"
              >
                Reviews & Ratings
              </button>
            </>
          )}

          {currentRole === 'staff' && (
            <>
              <button
                onClick={() => onSelectTab('kds')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'kds' ? 'bg-[#E85738]/15 text-[#E85738]' : ''
                }`}
              >
                Live Kitchen Display (KDS)
              </button>
              <button
                onClick={() => onSelectTab('service-calls')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  activeTab === 'service-calls' ? 'bg-[#E85738]/15 text-[#E85738]' : ''
                }`}
              >
                <Bell className="w-3 h-3 text-[#E85738]" />
                <span>Service Calls ({pendingServiceCallsCount})</span>
              </button>
              <button
                onClick={() => onSelectTab('staff-tables')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-black/5"
              >
                Floor & Table Plan
              </button>
            </>
          )}

          {currentRole === 'manager' && (
            <>
              <button
                onClick={() => onSelectTab('manager-menu')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'manager-menu' ? 'bg-[#10B981]/15 text-[#10B981]' : ''
                }`}
              >
                Menu & Availability
              </button>
              <button
                onClick={() => onSelectTab('manager-inventory')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'manager-inventory' ? 'bg-[#10B981]/15 text-[#10B981]' : ''
                }`}
              >
                Inventory & Stock
              </button>
              <button
                onClick={() => onSelectTab('manager-coupons')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'manager-coupons' ? 'bg-[#10B981]/15 text-[#10B981]' : ''
                }`}
              >
                Coupons & Promos
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => onSelectTab('admin-analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'admin-analytics' ? 'bg-[#6366F1]/15 text-[#6366F1]' : ''
                }`}
              >
                Sales & Revenue Analytics
              </button>
              <button
                onClick={() => onSelectTab('admin-logs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'admin-logs' ? 'bg-[#6366F1]/15 text-[#6366F1]' : ''
                }`}
              >
                Audit Logs
              </button>
              <button
                onClick={() => onSelectTab('admin-settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'admin-settings' ? 'bg-[#6366F1]/15 text-[#6366F1]' : ''
                }`}
              >
                System Configuration
              </button>
            </>
          )}
        </nav>

        {/* Right Controls: Currency, Dark Mode, Cart, User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher (INR ₹ / USD $) */}
          <button
            onClick={onToggleCurrency}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              currency === 'INR'
                ? isDarkMode
                  ? 'bg-[#241C15] border-[#D97706]/50 text-[#F59E0B] shadow-sm shadow-[#D97706]/10'
                  : 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                : isDarkMode
                ? 'bg-[#181C26] border-[#283142] text-[#CBD5E1] hover:text-white'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:text-black'
            }`}
            title="Toggle Currency: Indian Rupee (₹) / US Dollar ($)"
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-extrabold transition-colors ${
                currency === 'INR' ? 'bg-[#D97706] text-white' : 'text-[#94A3B8]'
              }`}
            >
              ₹ INR
            </span>
            <span className="text-[#64748B] text-[10px]">/</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-extrabold transition-colors ${
                currency === 'USD' ? 'bg-[#D97706] text-white' : 'text-[#94A3B8]'
              }`}
            >
              $ USD
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#181C26] border-[#283142] text-[#CBD5E1] hover:text-white'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:text-black'
            }`}
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-gray-700" />}
          </button>

          {/* Customer Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D97706]/20 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Royal Cart</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#D97706] text-[11px] font-extrabold flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Account / JWT Simulator */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#181C26] border-[#283142] hover:border-[#38455E]'
                : 'bg-gray-100 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white text-[11px] font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-bold leading-none">{currentUser.name}</div>
              <div className="text-[9px] text-[#D97706] uppercase font-semibold mt-0.5">
                {currentUser.role}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
