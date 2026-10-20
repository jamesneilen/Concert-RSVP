import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Church, Ticket, Music, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  // Target: Sunday, December 27, 2026 at 1:00 PM WAT (GMT+1)
  const targetDate = new Date('2026-12-27T13:00:00+01:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 73,
    hours: 6,
    minutes: 29,
    seconds: 50,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section
      id="hero-section"
      className="relative w-full pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-32 px-3 sm:px-6 lg:px-12 overflow-hidden flex flex-col justify-center items-center min-h-[90vh]"
    >
      {/* Cathedral Background with Dark Liturgical Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548625361-195feeed155e?auto=format&fit=crop&w=2000&q=80"
          alt="Cathedral Basilica Sanctuary in Christmas choral celebration"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Deep liturgical gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101412] via-[#101412]/80 to-[#101412]/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#101412]/60 to-[#101412]" />
      </div>

      {/* Festive Radial Amber/Gold Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[720px] h-[340px] sm:h-[720px] bg-[#af8d11]/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center mt-2 sm:mt-4 w-full">
        {/* Liturgical Overline Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#1f4a3c]/85 text-[#e9c349] border border-[#e9c349]/35 backdrop-blur-md shadow-[0_0_24px_rgba(233,195,73,0.25)] mb-4 sm:mb-6 max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-[#e9c349] animate-spin flex-shrink-0" style={{ animationDuration: '14s' }} />
          <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase truncate">
            Sing Unto God for Christ is Born • Christmas Concert 2026
          </span>
        </div>

        {/* Monumental Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#dfe4de] mb-3 sm:mb-4 leading-[1.15] drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] px-1">
          Sing Unto God for <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#e9c349] drop-shadow-[0_0_30px_rgba(233,195,73,0.4)]">
            Christ is Born
          </span>
        </h1>

        {/* Narrative introduction */}
        <p className="text-xs sm:text-base md:text-lg text-[#e2bebc] max-w-2xl mx-auto mb-6 sm:mb-9 leading-relaxed drop-shadow-md px-2">
          Immerse yourself in centuries of liturgical splendor, radiant candlelight, and celestial polyphony featuring the combined parish choirs, festival brass, and sanctuary pipe organ.
        </p>

        {/* Event Key Info Bar */}
        <div className="w-full max-w-3xl bg-[#262b28]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-9 border border-[#e9c349]/25 text-left">
          {/* Date */}
          <div className="flex items-center gap-3 bg-[#181d1a]/50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#313632] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/20 shadow-inner flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#e9c349] uppercase">
                Date & Evening
              </div>
              <div className="text-xs sm:text-sm md:text-base font-semibold text-[#dfe4de] truncate">
                Sun, Dec 27, 2026
              </div>
            </div>
          </div>

          {/* Time & Curtain */}
          <div className="flex items-center gap-3 bg-[#181d1a]/50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#313632] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/20 shadow-inner flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#e9c349] uppercase">
                Concert Curtain
              </div>
              <div className="text-xs sm:text-sm md:text-base font-semibold text-[#dfe4de] truncate">
                1:00 PM WAT
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-3 bg-[#181d1a]/50 sm:bg-transparent p-2 sm:p-0 rounded-lg sm:rounded-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#313632] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/20 shadow-inner flex-shrink-0">
              <Church className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#e9c349] uppercase">
                Parish Venue
              </div>
              <div className="text-xs sm:text-sm md:text-base font-semibold text-[#dfe4de] truncate">
                Christ the King Parish
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center mb-8 sm:mb-12 px-2">
          <a
            href="#rsvp-portal"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#8b0014] hover:bg-[#b4262c] text-[#dfe4de] font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-lg border border-[#e9c349] shadow-[0_0_24px_rgba(233,195,73,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-[#e9c349]" />
            <span>Reserve Free Seat</span>
          </a>
          <a
            href="#program-section"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#262b28]/90 hover:bg-[#313632] text-[#e9c349] font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-lg border border-[#e9c349]/40 backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>View Concert Program</span>
          </a>
        </div>

        {/* Solemn Countdown Timer Module */}
        <div className="w-full max-w-xl bg-[#0a0f0c]/85 backdrop-blur-md p-3.5 sm:p-5 rounded-xl shadow-2xl border border-[#e9c349]/20">
          <div className="text-[#e9c349] text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase mb-2.5 sm:mb-3 text-center">
            Countdown to Christmas Concert
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-[#262b28]/70 p-2 sm:p-3 rounded-lg border border-[#e9c349]/15 shadow-inner">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#e9c349] block font-bold leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider mt-1 block">
                Days
              </span>
            </div>
            <div className="bg-[#262b28]/70 p-2 sm:p-3 rounded-lg border border-[#e9c349]/15 shadow-inner">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#dfe4de] block font-bold leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider mt-1 block">
                Hours
              </span>
            </div>
            <div className="bg-[#262b28]/70 p-2 sm:p-3 rounded-lg border border-[#e9c349]/15 shadow-inner">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#dfe4de] block font-bold leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider mt-1 block">
                Mins
              </span>
            </div>
            <div className="bg-[#262b28]/70 p-2 sm:p-3 rounded-lg border border-[#e9c349]/15 shadow-inner">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#e9c349] block font-bold leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider mt-1 block">
                Secs
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
