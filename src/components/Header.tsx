import React, { useState, useEffect } from 'react';
import { Church, Sparkles, User, Volume2, VolumeX, Menu, X, Ticket, Calendar, Music, MapPin } from 'lucide-react';
import { sacredAudio } from '../utils/audioSynth';

interface HeaderProps {
  onOpenRsvp: () => void;
  onOpenPassModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRsvp, onOpenPassModal }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = sacredAudio.init((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => unsub();
  }, []);

  const toggleSacredAudio = () => {
    const playing = sacredAudio.toggle();
    setIsPlayingAudio(playing);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#101412]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.7)] border-b border-[#e9c349]/20">
      {/* Top liturgical ribbon bar */}
      <div className="w-full bg-[#0a0f0c] border-b border-[#e9c349]/20 py-1 sm:py-1.5 px-3 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[#e9c349] text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#e9c349] flex-shrink-0 animate-pulse" />
            <span className="truncate">
              <span className="hidden sm:inline">Sing Unto God for Christ is Born • December 27, 2026 • 1:00 PM WAT</span>
              <span className="sm:hidden">Sing Unto God • Dec 27, 2026 • 1:00 PM WAT</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[#e2bebc] text-xs font-medium lowercase tracking-normal flex-shrink-0">
            <span className="capitalize">Christ the King Parish, Nacho, Bamenda</span>
            <span className="text-[#e9c349]/40">•</span>
            <span className="capitalize">Main Sanctuary Nave</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#1c211e] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/30 shadow-md group-hover:border-[#e9c349] transition-all flex-shrink-0">
            <Church className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base sm:text-lg tracking-wide text-[#dfe4de] leading-tight font-semibold group-hover:text-[#e9c349] transition-colors truncate">
              St Cletus Choir
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#e9c349] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase truncate">
              <span className="hidden xs:inline">Nacho, Bamenda • </span>Christmas Concert
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <nav className="hidden xl:flex items-center gap-8 text-[13px] tracking-wider uppercase font-semibold">
          <a
            href="#hero-section"
            className="text-[#e9c349] border-b-2 border-[#e9c349] pb-1 transition-colors"
          >
            The Concert
          </a>
          <a
            href="#program-section"
            className="text-[#e2bebc] hover:text-[#dfe4de] transition-colors pb-1"
          >
            Program & Carols
          </a>
          <a
            href="#rsvp-portal"
            className="text-[#e2bebc] hover:text-[#dfe4de] transition-colors pb-1"
          >
            Claim Brag Pass
          </a>
          <a
            href="#venue-section"
            className="text-[#e2bebc] hover:text-[#dfe4de] transition-colors pb-1"
          >
            Sanctuary & Venue
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Chorale Audio Preview */}
          <button
            onClick={toggleSacredAudio}
            title={isPlayingAudio ? 'Pause "For Unto Us a Child Is Born"' : 'Play "For Unto Us a Child Is Born" Chorale'}
            className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#181d1a] border border-[#e9c349]/30 hover:border-[#e9c349] text-[#e9c349] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce text-[#e9c349]" />
                <span className="hidden lg:inline text-[11px]">Playing Chorale</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-[#e2bebc]" />
                <span className="hidden lg:inline text-[11px] text-[#dfe4de]">Play Chorale</span>
              </>
            )}
          </button>

          {/* Primary CTA (Responsive on mobile) */}
          <a
            href="#rsvp-portal"
            onClick={onOpenRsvp}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#8b0014] text-[#dfe4de] hover:bg-[#b4262c] font-semibold text-xs tracking-wider uppercase rounded-lg border border-[#e9c349] shadow-[0_0_16px_rgba(233,195,73,0.25)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e9c349]" />
            <span className="hidden sm:inline">RSVP & Get Your Pass</span>
            <span className="sm:hidden font-bold">RSVP Pass</span>
          </a>

          {/* Quick pass / Profile button */}
          <button
            onClick={onOpenPassModal}
            title="View Your Personalized Brag Pass"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ffb3ae] hover:bg-[#ffe088] transition-colors flex items-center justify-center shadow-sm text-[#410005] font-bold flex-shrink-0"
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 text-[#e9c349] hover:text-[#ffe088] rounded-md focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#101412] border-b border-[#e9c349]/30 px-4 sm:px-6 py-5 flex flex-col gap-3 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-2xl animate-in slide-in-from-top-2">
          <a
            href="#hero-section"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 text-[#e9c349] py-2 border-b border-[#313632]"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Concert</span>
          </a>
          <a
            href="#program-section"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 text-[#dfe4de] hover:text-[#e9c349] py-2 border-b border-[#313632]"
          >
            <Music className="w-4 h-4 text-[#e9c349]" />
            <span>Program & Carols</span>
          </a>
          <a
            href="#rsvp-portal"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRsvp();
            }}
            className="flex items-center gap-2.5 text-[#dfe4de] hover:text-[#e9c349] py-2 border-b border-[#313632]"
          >
            <Ticket className="w-4 h-4 text-[#e9c349]" />
            <span>Claim Brag Pass</span>
          </a>
          <a
            href="#venue-section"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 text-[#dfe4de] hover:text-[#e9c349] py-2 border-b border-[#313632]"
          >
            <MapPin className="w-4 h-4 text-[#e9c349]" />
            <span>Sanctuary & Venue</span>
          </a>

          {/* Quick Audio Toggle inside mobile menu */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#e2bebc] lowercase tracking-normal font-normal">
              Chorale preview: Handel's Messiah:
            </span>
            <button
              onClick={toggleSacredAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c211e] border border-[#e9c349]/40 text-[#e9c349] text-xs"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Pause Chorale</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Play Chorale</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
