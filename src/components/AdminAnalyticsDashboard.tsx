import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Award,
  FileText,
  Settings,
  Shield,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AuditLog, Currency } from '../types';
import { REVENUE_CHART_DATA, CATEGORY_SALES_DATA } from '../data/royalData';
import { formatRupees, formatUSD, INR_EXCHANGE_RATE } from '../utils/currency';

interface AdminAnalyticsDashboardProps {
  auditLogs: AuditLog[];
  isDarkMode: boolean;
  currency?: Currency;
  activeAdminTab: 'analytics' | 'logs' | 'settings';
  onChangeAdminTab: (tab: 'analytics' | 'logs' | 'settings') => void;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({
  auditLogs,
  isDarkMode,
  currency = 'INR',
  activeAdminTab,
  onChangeAdminTab,
}) => {
  const [logFilter, setLogFilter] = useState('All');

  // Filter audit logs
  const filteredLogs = auditLogs.filter((l) =>
    logFilter === 'All' ? true : l.category === logFilter
  );

  const topDishes = [
    {
      name: 'Royal Gupta Mutton Dum Biryani',
      orders: 184,
      revenueUSD: 4324,
      revenueINR: 361054,
      margin: '68%',
      imageUrl:
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Gupta Shahi Galouti Kebab',
      orders: 156,
      revenueUSD: 2962,
      revenueINR: 247327,
      margin: '74%',
      imageUrl:
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Gupta Dal Bukhara Heritage (36-Hr)',
      orders: 242,
      revenueUSD: 3993,
      revenueINR: 333415,
      margin: '81%',
      imageUrl:
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Old Delhi Royal Butter Chicken',
      orders: 168,
      revenueUSD: 3276,
      revenueINR: 273546,
      margin: '70%',
      imageUrl:
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Truffle & Roasted Garlic Butter Naan',
      orders: 410,
      revenueUSD: 1845,
      revenueINR: 154057,
      margin: '86%',
      imageUrl:
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner with Navigation */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151A24] border-[#252C3B]' : 'bg-white border-gray-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#6366F1]/20 text-[#6366F1]">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold">
              Executive SaaS & Business Intelligence
            </h1>
          </div>
          <p className="text-xs text-[#8E98A8] mt-1">
            Real-time revenue metrics, dish profit margins, audit trail & operational settings
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/10 dark:bg-black/30 border border-black/10 dark:border-white/10">
          <button
            onClick={() => onChangeAdminTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'analytics'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Revenue & KPIs</span>
          </button>

          <button
            onClick={() => onChangeAdminTab('logs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'logs'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => onChangeAdminTab('settings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'settings'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* 1. ANALYTICS VIEW */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-3xl border ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8E98A8]">
                <span>Today's Gross Sales</span>
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center">
                  +18.4%
                </span>
              </div>
              <div className="font-serif text-2xl font-bold mt-2 text-[#F59E0B]">
                {currency === 'INR' ? formatRupees(874245) : formatUSD(10470)}
              </div>
              <p className="text-[11px] text-[#8E98A8] mt-1">
                {currency === 'INR' ? `(USD: ${formatUSD(10470)}) · ` : `(INR: ${formatRupees(874245)}) · `}
                Peak dinner sales outperforming par
              </p>
            </div>

            <div
              className={`p-4 rounded-3xl border ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8E98A8]">
                <span>Total Orders Today</span>
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">
                  284 tickets
                </span>
              </div>
              <div className="font-serif text-2xl font-bold mt-2 text-white">284</div>
              <p className="text-[11px] text-[#8E98A8] mt-1">
                68% Dine-In · 22% Delivery · 10% Pickup
              </p>
            </div>

            <div
              className={`p-4 rounded-3xl border ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8E98A8]">
                <span>Average Check (AOV)</span>
                <span className="p-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold">
                  +$4.20
                </span>
              </div>
              <div className="font-serif text-2xl font-bold mt-2 text-white">
                {currency === 'INR' ? formatRupees(3077) : formatUSD(36.85)}
              </div>
              <p className="text-[11px] text-[#8E98A8] mt-1">
                {currency === 'INR' ? `(${formatUSD(36.85)}) · ` : `(${formatRupees(3077)}) · `}
                Driven by Biryani pairings & saffron
              </p>
            </div>

            <div
              className={`p-4 rounded-3xl border ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8E98A8]">
                <span>Guest Satisfaction</span>
                <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold">
                  ★ 4.95 / 5.0
                </span>
              </div>
              <div className="font-serif text-2xl font-bold mt-2 text-emerald-400">
                98.6%
              </div>
              <p className="text-[11px] text-[#8E98A8] mt-1">
                Based on 1,420 verified diner reviews
              </p>
            </div>
          </div>

          {/* Charts Row: Recharts Hourly Revenue & Category Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Over Time */}
            <div
              className={`p-5 rounded-3xl border lg:col-span-2 ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-base font-bold">
                    Hourly Sales Progression & Volume
                  </h3>
                  <p className="text-xs text-[#8E98A8]">
                    Real-time revenue ($) plotted against service hours
                  </p>
                </div>
                <span className="text-xs font-bold text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded-full border border-[#D97706]/30">
                  Peak at 8:00 PM
                </span>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? '#222A3A' : '#E2E8F0'}
                    />
                    <XAxis
                      dataKey="time"
                      stroke={isDarkMode ? '#8E98A8' : '#64748B'}
                      fontSize={11}
                    />
                    <YAxis
                      stroke={isDarkMode ? '#8E98A8' : '#64748B'}
                      fontSize={11}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#141822' : '#FFFFFF',
                        borderColor: isDarkMode ? '#2D3748' : '#CBD5E1',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: isDarkMode ? '#FFFFFF' : '#000000',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue ($)"
                      stroke="#D97706"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div
              className={`p-5 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
              }`}
            >
              <div>
                <h3 className="font-serif text-base font-bold">Category Sales Share</h3>
                <p className="text-xs text-[#8E98A8] mb-4">
                  Share of banquet orders by kitchen section
                </p>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_SALES_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {CATEGORY_SALES_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'Share']}
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#141822' : '#FFFFFF',
                          borderColor: isDarkMode ? '#2D3748' : '#CBD5E1',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 pt-2 border-t border-black/10 dark:border-white/5 text-xs">
                {CATEGORY_SALES_DATA.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      ></span>
                      <span className="text-[11px] text-[#8E98A8] truncate max-w-[140px]">
                        {c.name}
                      </span>
                    </div>
                    <span className="font-bold text-xs">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Dishes Margin Leaderboard */}
          <div
            className={`p-5 rounded-3xl border space-y-3 ${
              isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold">
                  Royal Crown Dish Leaderboard & Profit Margins
                </h3>
                <p className="text-xs text-[#8E98A8]">
                  Volume, gross revenue generated and food cost profit margin
                </p>
              </div>
              <span className="text-xs text-[#8E98A8]">Ranked by Lifetime Revenue</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDarkMode ? 'text-[#8E98A8]' : 'text-gray-600'
                  }`}
                >
                  <tr>
                    <th className="py-2.5">Dish</th>
                    <th className="py-2.5">Orders Today</th>
                    <th className="py-2.5">Gross Revenue</th>
                    <th className="py-2.5 text-right">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/5">
                  {topDishes.map((d, i) => (
                    <tr key={d.name} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="py-3 font-semibold flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-[#D97706]/20 text-[#D97706] font-bold text-[10px] flex items-center justify-center shrink-0">
                          #{i + 1}
                        </span>
                        <img
                          src={d.imageUrl}
                          alt={d.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <span className="truncate max-w-[220px]">{d.name}</span>
                      </td>
                      <td className="py-3 text-[#8E98A8]">{d.orders}</td>
                      <td className="py-3">
                        <div className="font-serif font-bold text-[#D97706]">
                          {currency === 'INR' ? formatRupees(d.revenueINR) : formatUSD(d.revenueUSD)}
                        </div>
                        <div className="text-[10px] text-[#8E98A8]">
                          {currency === 'INR' ? formatUSD(d.revenueUSD) : formatRupees(d.revenueINR)}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                          {d.margin}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. AUDIT LOGS VIEW */}
      {activeAdminTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1] flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Immutable System Audit Trail</span>
            </span>

            {/* Category Filter */}
            <div className="flex items-center gap-1 flex-wrap">
              {['All', 'Orders', 'Inventory', 'Menu', 'Coupons'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLogFilter(cat)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors ${
                    logFilter === cat
                      ? 'bg-[#6366F1] border-[#6366F1] text-white'
                      : 'border-gray-700 bg-transparent text-[#8E98A8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

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
                    <th className="p-3.5 pl-5">Timestamp</th>
                    <th className="p-3.5">Actor / Role</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5 pr-5">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <td className="p-3.5 pl-5 text-[#8E98A8] font-mono text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-xs">{log.user}</div>
                        <span className="text-[10px] text-[#6366F1] uppercase font-semibold">
                          {log.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/20 dark:bg-white/10">
                          {log.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[#F59E0B]">{log.action}</td>
                      <td className="p-3.5 pr-5 text-[#CBD5E1]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SYSTEM CONFIGURATION */}
      {activeAdminTab === 'settings' && (
        <div
          className={`p-6 rounded-3xl border space-y-6 max-w-2xl ${
            isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-white border-gray-200'
          }`}
        >
          <div>
            <h3 className="font-serif text-lg font-bold">Restaurant System Parameters</h3>
            <p className="text-xs text-[#8E98A8]">
              Configure POS tax rates, delivery radius, table turnover rules & currency
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">State & City Tax Rate (%)</label>
                <input
                  type="number"
                  defaultValue="8.0"
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Currency Code</label>
                <input
                  type="text"
                  defaultValue="USD ($)"
                  disabled
                  className="w-full p-2.5 rounded-xl border bg-black/40 opacity-70"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">Delivery Radius (Miles)</label>
                <input
                  type="number"
                  defaultValue="12"
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Default Flat Delivery Fee ($)</label>
                <input
                  type="number"
                  defaultValue="4.99"
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Table Pacing & Turnover Window</label>
              <select className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#6366F1]">
                <option>90 Minutes (Standard Fine Dining Pacing)</option>
                <option>60 Minutes (Fast Casual / Lunch)</option>
                <option>120 Minutes (Tasting Menu & Banquet)</option>
              </select>
            </div>

            <button
              onClick={() => alert('Configuration parameters safely synchronized.')}
              className="px-5 py-2.5 rounded-2xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs transition-colors shadow-md mt-2"
            >
              Save System Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
