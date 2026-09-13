import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Key,
  Crown,
  ChefHat,
  Sliders,
  BarChart3,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'jwt'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Generate synthetic JWT token
  const syntheticJWT =
    currentUser.jwtToken ||
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItODg0MSIsInJvbGUiOiIke3NlbGVjdGVkUm9sZX0iLCJuYW1lIjoiJHtuYW1lfSIsImV4cCI6MTgwMDAwMDAwMH0.s8XfG9R3_RoyalGuptaBitesSignatureToken`;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      email,
      phone,
      role: selectedRole,
      jwtToken: syntheticJWT,
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleCopyJWT = () => {
    navigator.clipboard.writeText(syntheticJWT);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden my-auto ${
          isDarkMode
            ? 'bg-[#121620] border-[#252C3B] text-[#F3EFE6]'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#151A25] border-[#252D3E]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#D97706]">
                Authentication & Role Control
              </h2>
              <p className="text-[11px] text-[#8E98A8]">
                JWT Authentication & Role-Based Access Control (RBAC)
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

        {/* Tab switcher */}
        <div className="p-3 border-b flex items-center gap-2 text-xs font-bold bg-black/10 dark:bg-black/30">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            User Profile & Role
          </button>
          <button
            onClick={() => setActiveTab('jwt')}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'jwt'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-[#8E98A8] hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>JWT Token Inspector</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#D97706] block mb-1.5">
                  Assigned RBAC Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'customer', name: 'Customer', icon: User, desc: 'Dine, Reserve & Order' },
                    { id: 'staff', name: 'Staff / KDS', icon: ChefHat, desc: 'Kitchen & Floor Buzzers' },
                    { id: 'manager', name: 'Manager', icon: Sliders, desc: 'Menu 86 & Stock Restock' },
                    { id: 'admin', name: 'Admin', icon: BarChart3, desc: 'SaaS Analytics & Logs' },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id as UserRole)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                            : isDarkMode
                            ? 'border-[#242C3B] bg-[#151922] text-[#8E98A8]'
                            : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{r.name}</span>
                        </div>
                        <div className="text-[9px] text-[#8E98A8] mt-0.5">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-bold text-[11px] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-bold text-[11px] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="font-bold text-[11px] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-black/20 focus:border-[#D97706]"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#D97706]/20 active:scale-95 mt-2"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Profile & Role Updated!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Apply Role & Sign In</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#D97706]">
                  Simulated JWT Bearer Token
                </span>
                <button
                  onClick={handleCopyJWT}
                  className="text-[11px] text-[#D97706] hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedToken ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-black/20 dark:border-white/10 font-mono text-[10px] break-all text-amber-200/90 leading-relaxed max-h-36 overflow-y-auto">
                {syntheticJWT}
              </div>

              {/* Decoded Claims */}
              <div
                className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
                  isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                  Decoded Claims Payload
                </span>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#8E98A8]">sub:</span>
                  <span>{currentUser.id}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#8E98A8]">role:</span>
                  <span className="text-[#D97706] font-bold">{selectedRole}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#8E98A8]">name:</span>
                  <span>{name}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#8E98A8]">issuer:</span>
                  <span>https://royalguptabites.com/auth</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
