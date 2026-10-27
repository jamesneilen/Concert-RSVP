import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Church, Ticket, Music, Sparkles, Users, Maximize2, X } from 'lucide-react';

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

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [modalViewMode, setModalViewMode] = useState<'themed' | 'clean'>('themed');
  const choirPhotoThemedUrl = '/assets/st_cletus_choir_theme_2k.jpeg';
  const choirPhotoCleanUrl = '/assets/st_cletus_choir_hero_2k.jpeg';
  const choirPhotoOriginalUrl = '/assets/st_cletus_choir_hero_2k.jpeg';

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPhotoModal(false);
      }
    };
    if (showPhotoModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPhotoModal]);

  return (
    <section
      id="hero-section"
      className="relative w-full pt-28 sm:pt-34 lg:pt-38 pb-16 sm:pb-24 lg:pb-28 px-3 sm:px-6 lg:px-12 overflow-hidden flex flex-col justify-center items-center min-h-[90vh] scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Background with Reduced Opacity and Deep Liturgical Scrims */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={choirPhotoThemedUrl}
          onError={(e) => {
            (e.target as HTMLImageElement).src = choirPhotoCleanUrl;
          }}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter blur-xl brightness-[0.20] contrast-110 scale-110 opacity-20 transition-opacity duration-1000"
        />
        {/* Deep liturgical gradient scrims to melt seamlessly into the website palette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101412] via-[#101412]/92 to-[#101412]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#101412]/85 to-[#101412]" />
        <div className="absolute inset-0 bg-[#0a0f0c]/60" />
      </div>

      {/* Festive Radial Amber/Gold Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[720px] h-[340px] sm:h-[720px] bg-[#af8d11]/12 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center mt-2 w-full">
        {/* Liturgical Overline Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#1f4a3c]/85 text-[#e9c349] border border-[#e9c349]/35 backdrop-blur-md shadow-[0_0_24px_rgba(233,195,73,0.25)] mb-4 sm:mb-5 max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-[#e9c349] animate-spin flex-shrink-0" style={{ animationDuration: '14s' }} />
          <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase truncate">
            Sing Unto God for Christ is Born • Christmas Concert 2026
          </span>
        </div>

        {/* Monumental Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#dfe4de] mb-3 leading-[1.15] drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] px-1">
          Sing Unto God for <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#e9c349] drop-shadow-[0_0_30px_rgba(233,195,73,0.4)]">
            Christ is Born
          </span>
        </h1>

        {/* Narrative introduction */}
        <p className="text-xs sm:text-base md:text-lg text-[#e2bebc] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed drop-shadow-md px-2">
          Presented with joy by the <strong className="text-[#e9c349]">St. Cletus Choir</strong> of Christ the King Parish, Nacho, Bamenda. Join us for centuries of liturgical splendor, candlelight, and celestial polyphony.
        </p>

        {/* Centerpiece Choir Photo Showcase Frame - Distraction-free, theme-blended with reduced opacity & soft vignette */}
        <div className="relative w-full max-w-4xl p-1.5 sm:p-2 rounded-2xl bg-gradient-to-tr from-[#af8d11]/45 via-[#ffe088]/25 to-[#af8d11]/45 shadow-[0_24px_60px_rgba(0,0,0,0.95),_0_0_35px_rgba(233,195,73,0.16)] border border-[#e9c349]/35 mb-7 sm:mb-9 group overflow-hidden">
          <div className="relative rounded-xl overflow-hidden bg-[#101412]">
            {/* Themed Choir Photograph with subtle blend overlays */}
            <div className="relative overflow-hidden">
              <img
                src={choirPhotoThemedUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = choirPhotoCleanUrl;
                }}
                alt="St. Cletus Choir of Christ the King Parish, Nacho, Bamenda gathered on the sanctuary steps"
                className="w-full h-auto max-h-[440px] sm:max-h-[520px] object-cover object-center opacity-90 transition-all duration-500 group-hover:scale-[1.01] group-hover:opacity-100"
              />

              {/* Edge Gradient Blends ensuring seamless integration into the dark liturgical palette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101412] via-transparent to-[#101412]/30 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101412] to-transparent pointer-events-none" />
            </div>

            {/* Top Floating Badge - Choir Identity */}
            <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#0a0f0c]/85 backdrop-blur-md text-[#e9c349] border border-[#e9c349]/35 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
              <Users className="w-3.5 h-3.5 text-[#e9c349] flex-shrink-0" />
              <span>St. Cletus Choir</span>
            </div>

            {/* Top Right Floating Badge - Venue Parish */}
            <div className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#1f4a3c]/85 backdrop-blur-md text-[#dfe4de] border border-[#a3d0be]/30 text-[10px] sm:text-xs font-semibold shadow-lg">
              <Church className="w-3.5 h-3.5 text-[#e9c349] flex-shrink-0" />
              <span className="hidden xs:inline">Christ the King Parish,</span>
              <span>Nacho</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-[#101412] via-[#101412]/90 to-transparent flex items-center justify-between gap-3 text-left">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#dfe4de] drop-shadow flex items-center gap-2">
                  <span>The Choristers & Voices of St. Cletus</span>
                  <span className="text-[10px] sm:text-xs font-sans font-semibold text-[#e9c349] px-2 py-0.5 rounded bg-[#e9c349]/15 border border-[#e9c349]/30 hidden sm:inline-block">
                    Full Choir Forces
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                aria-label="Expand choir photo"
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#262b28]/90 hover:bg-[#313632] text-[#e9c349] hover:text-[#ffe088] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#e9c349]/40 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">View Full</span>
              </button>
            </div>
          </div>
        </div>

        {/* Event Key Info Bar */}
        <div className="w-full max-w-3xl bg-[#262b28]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 border border-[#e9c349]/25 text-left">
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
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center mb-7 sm:mb-9 px-2">
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

      {/* Full Photo Lightbox Modal */}
      {showPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#1c211e] rounded-2xl border-2 border-[#e9c349]/50 shadow-2xl overflow-hidden p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-[#0a0f0c]/85 hover:bg-[#313632] text-[#e9c349] border border-[#e9c349]/40 transition-colors"
              aria-label="Close photo view"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo */}
            <div className="rounded-xl overflow-hidden max-h-[80vh] flex items-center justify-center bg-black">
              <img
                src={modalViewMode === 'themed' ? choirPhotoThemedUrl : choirPhotoCleanUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = choirPhotoOriginalUrl;
                }}
                alt="St. Cletus Choir of Christ the King Parish, Nacho, Bamenda"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>

            {/* Modal caption & toggle */}
            <div className="pt-3 sm:pt-4 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-left">
              <div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#e9c349]">
                  St. Cletus Choir • Christ the King Parish, Nacho, Bamenda
                </h4>
                <p className="text-xs text-[#e2bebc] mt-0.5">
                  Concert Theme: “Sing Unto God for Christ is Born” • Sunday, December 27, 2026 at 1:00 PM WAT
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalViewMode(modalViewMode === 'themed' ? 'clean' : 'themed')}
                  className="px-2.5 py-1 rounded bg-[#0a0f0c] text-[#e9c349] hover:bg-[#262b28] text-[10px] font-semibold border border-[#e9c349]/30 transition-colors"
                >
                  {modalViewMode === 'themed' ? 'Switch to Full Light' : 'Switch to Liturgical Theme'}
                </button>
                <span className="text-[10px] text-[#a3d0be] font-mono px-2 py-1 rounded bg-[#0a0f0c] border border-[#313632]">
                  45+ Choristers
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
