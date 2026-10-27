import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RepertoireSection } from './components/RepertoireSection';
import { RsvpBragPassSection } from './components/RsvpBragPassSection';
import { LogisticsAndVenue } from './components/LogisticsAndVenue';
import { Footer } from './components/Footer';
import { INITIAL_PATRON, PatronPassData } from './data/concertData';
import { X, Sparkles, Church, QrCode, Share2 } from 'lucide-react';
import { SocialShareModal } from './components/SocialShareModal';
import { SpreadsheetSyncModal } from './components/SpreadsheetSyncModal';

export default function App() {
  const [currentPass, setCurrentPass] = useState<PatronPassData>(INITIAL_PATRON);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const handleOpenRsvp = () => {
    const el = document.getElementById('rsvp-portal');
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      // Focus on the first input inside the form for convenience
      const nameInput = document.getElementById('rsvp-name') as HTMLInputElement;
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 400);
      }
    }
  };

  const handlePassConfirmed = (pass: PatronPassData) => {
    setCurrentPass(pass);
  };

  return (
    <div className="bg-[#101412] text-[#dfe4de] min-h-screen flex flex-col font-sans selection:bg-[#8b0014] selection:text-[#ff908a]">
      {/* Liturgical Navigation Header */}
      <Header
        onOpenRsvp={handleOpenRsvp}
        onOpenPassModal={() => setShowPassModal(true)}
      />

      <main className="w-full flex-grow">
        {/* Monumental Hero Section with Countdown & Cathedral Backing */}
        <Hero />

        {/* Featured Guest Choir, Choirmaster Profile & Concert Program Selection */}
        <RepertoireSection />

        {/* Central RSVP Portal with Live Custom Brag Pass Flyer Generator & PNG Exporter */}
        <RsvpBragPassSection
          onPassConfirmed={handlePassConfirmed}
          onPassChange={handlePassConfirmed}
          onOpenSyncModal={() => setShowSyncModal(true)}
        />

        {/* Sanctuary & Venue Arrival Logistics */}
        <LogisticsAndVenue />
      </main>

      {/* Liturgical Footer */}
      <Footer onOpenSyncModal={() => setShowSyncModal(true)} />

      {/* Floating Action Button (FAB) for WhatsApp Inquiries */}
      <aside aria-label="Quick WhatsApp Inquiries" className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-50">
        <a
          href="https://wa.me/237672668334?text=Hello%20St.%20Cletus%20Choir%2C%20I%20have%20an%20inquiry%20regarding%20the%20Sing%20Unto%20God%20Christmas%20Concert%20at%20Christ%20the%20King%20Parish"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Inquiries +237 672 668 334"
          className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-[0_10px_28px_rgba(37,211,102,0.48)] hover:shadow-[0_14px_36px_rgba(37,211,102,0.65)] border-2 border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="relative flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-200 rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full shadow" />
          </span>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[9px] uppercase tracking-wider text-emerald-100 font-semibold hidden sm:inline">
              Choir Secretariat
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              WhatsApp Inquiries
            </span>
          </div>
        </a>
      </aside>

      {/* Quick Patron Pass Modal (viewed via profile icon or mobile dock) */}
      {showPassModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowPassModal(false)}
        >
          <div
            className="bg-[#1c211e] max-w-md w-full rounded-2xl p-4 sm:p-6 border-2 border-[#e9c349]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPassModal(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 rounded-full bg-[#0a0f0c] text-[#e9c349] hover:bg-[#313632]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#e9c349] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 pr-6">
              <Church className="w-4 h-4 flex-shrink-0" />
              <span>Sanctuary Admission Pass</span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#dfe4de] mt-1 mb-3 sm:mb-4">
              Your Reserved Concert Pass
            </h3>

            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-b from-[#8b0014] to-[#0a0f0c] border border-[#e9c349]/40 text-center mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#e9c349] to-[#ffe088] shadow-lg mb-2">
                <img
                  key={currentPass.photoUrl}
                  src={currentPass.photoUrl}
                  alt={currentPass.fullName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = INITIAL_PATRON.photoUrl;
                  }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#e9c349] uppercase tracking-widest font-bold block">
                {currentPass.tier}
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#e9c349] truncate px-1">
                {currentPass.fullName}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#e2bebc] mt-0.5">
                Christ the King Parish, Nacho, Bamenda
              </p>
              <div className="mt-3 pt-3 border-t border-[#e9c349]/20 flex items-center justify-around text-xs text-[#dfe4de]">
                <div>
                  <span className="text-[8px] sm:text-[9px] text-[#e9c349] uppercase block font-bold">
                    Event Date
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold">Sun, Dec 27, 2026</span>
                </div>
                <div>
                  <span className="text-[8px] sm:text-[9px] text-[#e9c349] uppercase block font-bold">
                    Curtain
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold">1:00 PM WAT</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0a0f0c] p-2.5 sm:p-3 rounded-lg border border-[#313632] mb-3 sm:mb-4 text-xs">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-[#e9c349]" />
                <span className="font-mono text-[#e9c349] font-bold text-xs">
                  {currentPass.passCode}
                </span>
              </div>
              <span className="text-[#a3d0be] font-semibold text-[11px]">Active Pass</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setShowPassModal(false);
                  setShowShareModal(true);
                }}
                className="flex-1 py-2.5 sm:py-3 rounded-lg bg-[#313632] hover:bg-[#3d423e] text-[#e9c349] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#e9c349]/40 min-h-[44px] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to Socials</span>
              </button>

              <button
                onClick={() => {
                  setShowPassModal(false);
                  handleOpenRsvp();
                }}
                className="flex-1 py-2.5 sm:py-3 rounded-lg bg-[#e9c349] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Customize Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Share Suite Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        patron={currentPass}
        onDownloadImage={() => {
          setShowShareModal(false);
          handleOpenRsvp();
        }}
      />

      {/* Google Sheet Sync & Attendees Diagnostic Suite Modal */}
      <SpreadsheetSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
      />
    </div>
  );
}
