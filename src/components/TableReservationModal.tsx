import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  Crown,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
} from 'lucide-react';
import { Reservation } from '../types';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReservation: (res: Reservation) => void;
  isDarkMode: boolean;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
  onAddReservation,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [date, setDate] = useState('2026-09-14');
  const [timeSlot, setTimeSlot] = useState('20:00 (Dinner)');
  const [guestsCount, setGuestsCount] = useState(4);
  const [section, setSection] = useState<
    'Royal Darbar' | 'Maharaja Booth' | 'Garden Courtyard' | 'Private Diwan'
  >('Maharaja Booth');
  const [specialOccasion, setSpecialOccasion] = useState('Royal Dinner');
  const [notes, setNotes] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    // Generate assigned table
    let table = 'Table 14';
    if (section === 'Maharaja Booth') table = `Booth M-${Math.floor(Math.random() * 5) + 1}`;
    else if (section === 'Private Diwan') table = `Diwan Suite ${Math.floor(Math.random() * 3) + 1}`;
    else if (section === 'Garden Courtyard') table = `Courtyard Table ${Math.floor(Math.random() * 8) + 1}`;

    const newRes: Reservation = {
      id: `res-${Date.now().toString().slice(-4)}`,
      guestName,
      guestPhone,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@domain.com`,
      date,
      timeSlot,
      guestsCount,
      section,
      status: 'confirmed',
      tableAssigned: table,
      specialOccasion,
      notes,
    };

    onAddReservation(newRes);
    setConfirmedReservation(newRes);
  };

  const handleClose = () => {
    setConfirmedReservation(null);
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
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#151A25] border-[#252D3E]' : 'bg-amber-50/50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#D97706]">
                Royal Table Reservation
              </h2>
              <p className="text-[11px] text-[#8E98A8]">
                Reserve a high-table or private salon at Royal Gupta Bites
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-gray-700/50 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {confirmedReservation ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97706]">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  We look forward to hosting you!
                </h3>
                <p className="text-xs text-[#8E98A8] mt-1 max-w-sm mx-auto">
                  A verification confirmation code has been dispatched to {confirmedReservation.guestPhone}.
                </p>
              </div>

              {/* Booking Card */}
              <div
                className={`p-4 rounded-2xl border text-left space-y-2 ${
                  isDarkMode ? 'bg-[#151922] border-[#252C3B]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between border-b border-black/10 dark:border-white/10 pb-2">
                  <span className="text-[#8E98A8]">Booking Ref</span>
                  <span className="font-bold text-[#D97706]">{confirmedReservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E98A8]">Guest</span>
                  <span className="font-bold">{confirmedReservation.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E98A8]">Assigned Sanctuary</span>
                  <span className="font-bold text-amber-400">
                    {confirmedReservation.tableAssigned} ({confirmedReservation.section})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E98A8]">Party Size</span>
                  <span className="font-bold">{confirmedReservation.guestsCount} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E98A8]">Date & Time</span>
                  <span className="font-bold">
                    {confirmedReservation.date} · {confirmedReservation.timeSlot}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                Return to Royal Menu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seating Salon Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#D97706] block">
                  Select Seating Sanctuary
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Maharaja Booth', desc: 'Velvet booth & brass screen' },
                    { id: 'Royal Darbar', desc: 'Sitar acoustics & grand hall' },
                    { id: 'Garden Courtyard', desc: 'Fountain breeze under sky' },
                    { id: 'Private Diwan', desc: 'VIP suite & personal chef' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSection(s.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        section === s.id
                          ? 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]'
                          : isDarkMode
                          ? 'border-[#242C3B] bg-[#151922] text-[#8E98A8]'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold text-xs leading-snug">{s.id}</div>
                      <div className="text-[10px] text-[#8E98A8] mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D97706] ${
                      isDarkMode
                        ? 'bg-[#151922] border-[#252C3B] text-white'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D97706] ${
                      isDarkMode
                        ? 'bg-[#151922] border-[#252C3B] text-white'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <option value="12:30 (Royal Lunch)">12:30 PM (Royal Lunch)</option>
                    <option value="13:30 (Royal Lunch)">01:30 PM (Royal Lunch)</option>
                    <option value="19:00 (Evening Feast)">07:00 PM (Evening Feast)</option>
                    <option value="19:30 (Evening Feast)">07:30 PM (Evening Feast)</option>
                    <option value="20:00 (Dinner)">08:00 PM (Prime Dinner)</option>
                    <option value="20:30 (Dinner)">08:30 PM (Prime Dinner)</option>
                    <option value="21:15 (Late Soiree)">09:15 PM (Late Soiree)</option>
                  </select>
                </div>
              </div>

              {/* Guest Count Stepper */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                  Number of Royal Guests
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 p-1 rounded-xl border bg-black/10 dark:bg-black/30 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-8 h-8 rounded-lg font-bold text-sm hover:bg-black/20 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{guestsCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(20, guestsCount + 1))}
                      className="w-8 h-8 rounded-lg font-bold text-sm hover:bg-black/20 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#8E98A8]">
                    For parties over 12, our banquet manager will contact you.
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pt-1 border-t border-black/10 dark:border-white/10">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Maharaja Vikramaditya"
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D97706] ${
                      isDarkMode
                        ? 'bg-[#151922] border-[#252C3B] text-white'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D97706] ${
                        isDarkMode
                          ? 'bg-[#151922] border-[#252C3B] text-white'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                      Special Occasion
                    </label>
                    <select
                      value={specialOccasion}
                      onChange={(e) => setSpecialOccasion(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D97706] ${
                        isDarkMode
                          ? 'bg-[#151922] border-[#252C3B] text-white'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <option value="Royal Dinner">Royal Dinner</option>
                      <option value="Wedding Anniversary">Wedding Anniversary</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Corporate Milestone">Corporate Milestone</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#8E98A8] block">
                    Special Notes / Dietary Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Quiet corner, Jain food requirements, anniversary sparkler cake..."
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D97706] ${
                      isDarkMode
                        ? 'bg-[#151922] border-[#252C3B] text-white'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#D97706]/20 active:scale-95 mt-4"
              >
                <Crown className="w-4 h-4" />
                <span>Confirm Royal Reservation</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
