import React from 'react';
import { Church, MapPin, Clock, ShieldCheck, Sparkles, Navigation, Users } from 'lucide-react';

export const LogisticsAndVenue: React.FC = () => {
  return (
    <section id="venue-section" className="w-full py-16 sm:py-20 lg:py-28 px-3 sm:px-6 lg:px-12 bg-[#0a0f0c]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12 text-center md:text-left">
          <span className="text-[#e9c349] text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase flex items-center justify-center md:justify-start gap-1.5">
            <Church className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e9c349]" />
            Sanctuary & Arrival Protocol
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#dfe4de] mt-1.5 sm:mt-2">
            Venue, Seating & Arrival Logistics
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#e2bebc] mt-2 max-w-xl leading-relaxed">
            Everything you need for a joyful, serene, and spirit-filled Christmas evening at Christ the King Parish.
          </p>
        </div>

        {/* 2 Logistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {/* Card 1 */}
          <div className="bg-[#1c211e] p-5 sm:p-6 rounded-xl border border-[#e9c349]/20 shadow-xl flex flex-col justify-between hover:border-[#e9c349]/40 transition-colors">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#262b28] flex items-center justify-center text-[#e9c349] mb-3 sm:mb-4 border border-[#e9c349]/20">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#dfe4de] mb-1.5 sm:mb-2">
                Concert Schedule & Admission
              </h3>
              <p className="text-xs text-[#e2bebc] leading-relaxed mb-4">
                The concert begins promptly at <strong className="text-[#e9c349]">1:00 PM WAT</strong>. Please arrive with your personalized brag pass for priority sanctuary admission and guest verification.
              </p>
            </div>
            <div className="pt-3 border-t border-[#313632] flex items-center justify-between text-[11px] text-[#e9c349] font-semibold">
              <span>Concert Curtain: 1:00 PM WAT</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1c211e] p-5 sm:p-6 rounded-xl border border-[#e9c349]/20 shadow-xl flex flex-col justify-between hover:border-[#e9c349]/40 transition-colors">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#262b28] flex items-center justify-center text-[#a3d0be] mb-3 sm:mb-4 border border-[#a3d0be]/20">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#dfe4de] mb-1.5 sm:mb-2">
                Attire & Liturgical Decorum
              </h3>
              <p className="text-xs text-[#e2bebc] leading-relaxed mb-4">
                Patrons are warmly encouraged to wear <strong className="text-[#a3d0be]">Festive African Traditional Regalia</strong> or Sunday Church Formal. Please preserve the quiet reverence of the sanctuary during choral prayer movements.
              </p>
            </div>
            <div className="pt-3 border-t border-[#313632] flex items-center justify-between text-[11px] text-[#a3d0be] font-semibold">
              <span>Reverent Sanctuary Protocol</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>



        {/* Sanctuary Location Bar */}
        <div className="bg-[#262b28] p-4 sm:p-6 lg:p-7 rounded-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#e9c349]/25">
          <div className="flex items-center gap-3 sm:gap-4 text-left min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#af8d11] flex items-center justify-center text-[#342800] shadow-md flex-shrink-0">
              <Church className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#dfe4de] leading-snug">
                Christ the King Parish, Nacho, Bamenda, Cameroon
              </h4>
              <p className="text-[11px] sm:text-xs md:text-sm text-[#e2bebc] flex items-center gap-1.5 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#e9c349] flex-shrink-0" />
                <span className="truncate">Nacho Gate, Bamenda, North West Region, Cameroon</span>
              </p>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/search/Christ+the+King+Parish+Nacho+Bamenda+Cameroon"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-5 py-3 bg-[#0a0f0c] hover:bg-[#101412] text-[#e9c349] hover:text-[#ffe088] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 border border-[#e9c349]/35 shadow-md flex-shrink-0 min-h-[44px]"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Directions in Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};
