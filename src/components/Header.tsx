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
  const [activeSection, setActiveSection] = useState<'hero-section' | 'program-section' | 'rsvp-portal' | 'venue-section'>('hero-section');

  useEffect(() => {
    const unsub = sacredAudio.init((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => unsub();
  }, []);

  // Track active section as user scrolls
  useEffect(() => {
    const sectionIds = ['hero-section', 'program-section', 'rsvp-portal', 'venue-section'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id as any);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${sectionId}`);
      }
    }
  };

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
        <a
          href="#hero-section"
          onClick={(e) => scrollToSection('hero-section', e)}
          className="flex items-center gap-2 sm:gap-3 group min-w-0 cursor-pointer"
        >
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
            onClick={(e) => scrollToSection('hero-section', e)}
            className={`pb-1 transition-all ${
              activeSection === 'hero-section'
                ? 'text-[#e9c349] border-b-2 border-[#e9c349] font-bold'
                : 'text-[#e2bebc] hover:text-[#dfe4de] border-b-2 border-transparent'
            }`}
          >
            The Concert
          </a>
          <a
            href="#program-section"
            onClick={(e) => scrollToSection('program-section', e)}
            className={`pb-1 transition-all ${
              activeSection === 'program-section'
                ? 'text-[#e9c349] border-b-2 border-[#e9c349] font-bold'
                : 'text-[#e2bebc] hover:text-[#dfe4de] border-b-2 border-transparent'
            }`}
          >
            Program & Carols
          </a>
          <a
            href="#rsvp-portal"
            onClick={(e) => {
              scrollToSection('rsvp-portal', e);
              onOpenRsvp();
            }}
            className={`pb-1 transition-all ${
              activeSection === 'rsvp-portal'
                ? 'text-[#e9c349] border-b-2 border-[#e9c349] font-bold'
                : 'text-[#e2bebc] hover:text-[#dfe4de] border-b-2 border-transparent'
            }`}
          >
            Claim Brag Pass
          </a>
          <a
            href="#venue-section"
            onClick={(e) => scrollToSection('venue-section', e)}
            className={`pb-1 transition-all ${
              activeSection === 'venue-section'
                ? 'text-[#e9c349] border-b-2 border-[#e9c349] font-bold'
                : 'text-[#e2bebc] hover:text-[#dfe4de] border-b-2 border-transparent'
            }`}
          >
            Sanctuary & Venue
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* WhatsApp Inquiries Button */}
          <a
            href="https://wa.me/237672668334?text=Hello%20St.%20Cletus%20Choir%2C%20I%20have%20an%20inquiry%20regarding%20the%20Sing%20Unto%20God%20Christmas%20Concert%20at%20Christ%20the%20King%20Parish"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Inquiries (+237 672 668 334)"
            className="hidden lg:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#4EFA8B] text-xs font-semibold tracking-wider transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="text-[11px]">Inquiries</span>
          </a>

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
            onClick={(e) => {
              scrollToSection('rsvp-portal', e);
              onOpenRsvp();
            }}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#8b0014] text-[#dfe4de] hover:bg-[#b4262c] font-semibold text-xs tracking-wider uppercase rounded-lg border border-[#e9c349] shadow-[0_0_16px_rgba(233,195,73,0.25)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e9c349]" />
            <span className="hidden sm:inline">RSVP & Get Your Pass</span>
            <span className="sm:hidden font-bold">RSVP Pass</span>
          </a>

          {/* Quick pass / Profile button */}
          <button
            onClick={onOpenPassModal}
            title="View Your Personalized Brag Pass"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ffb3ae] hover:bg-[#ffe088] transition-colors flex items-center justify-center shadow-sm text-[#410005] font-bold flex-shrink-0 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 text-[#e9c349] hover:text-[#ffe088] rounded-md focus:outline-none cursor-pointer"
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
            onClick={(e) => scrollToSection('hero-section', e)}
            className={`flex items-center gap-2.5 py-2 border-b border-[#313632] transition-colors ${
              activeSection === 'hero-section' ? 'text-[#e9c349] font-bold' : 'text-[#dfe4de]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#e9c349]" />
            <span>The Concert</span>
          </a>
          <a
            href="#program-section"
            onClick={(e) => scrollToSection('program-section', e)}
            className={`flex items-center gap-2.5 py-2 border-b border-[#313632] transition-colors ${
              activeSection === 'program-section' ? 'text-[#e9c349] font-bold' : 'text-[#dfe4de]'
            }`}
          >
            <Music className="w-4 h-4 text-[#e9c349]" />
            <span>Program & Carols</span>
          </a>
          <a
            href="#rsvp-portal"
            onClick={(e) => {
              scrollToSection('rsvp-portal', e);
              onOpenRsvp();
            }}
            className={`flex items-center gap-2.5 py-2 border-b border-[#313632] transition-colors ${
              activeSection === 'rsvp-portal' ? 'text-[#e9c349] font-bold' : 'text-[#dfe4de]'
            }`}
          >
            <Ticket className="w-4 h-4 text-[#e9c349]" />
            <span>Claim Brag Pass</span>
          </a>
          <a
            href="#venue-section"
            onClick={(e) => scrollToSection('venue-section', e)}
            className={`flex items-center gap-2.5 py-2 border-b border-[#313632] transition-colors ${
              activeSection === 'venue-section' ? 'text-[#e9c349] font-bold' : 'text-[#dfe4de]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#e9c349]" />
            <span>Sanctuary & Venue</span>
          </a>

          {/* WhatsApp Inquiries in Mobile Menu */}
          <a
            href="https://wa.me/237672668334?text=Hello%20St.%20Cletus%20Choir%2C%20I%20have%20an%20inquiry%20regarding%20the%20Sing%20Unto%20God%20Christmas%20Concert%20at%20Christ%20the%20King%20Parish"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#4EFA8B] text-xs font-bold"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Inquiries</span>
            </span>
            <span className="text-[10px] text-[#4EFA8B]/80 font-mono">+237 672 668 334</span>
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
