import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RepertoireSection } from './components/RepertoireSection';
import { RsvpBragPassSection } from './components/RsvpBragPassSection';
import { LogisticsAndVenue } from './components/LogisticsAndVenue';
import { Footer } from './components/Footer';
import { INITIAL_PATRON, PatronPassData } from './data/concertData';
import { X, Sparkles, Church, QrCode, Ticket, Volume2, VolumeX, Share2 } from 'lucide-react';
import { sacredAudio } from './utils/audioSynth';
import { SocialShareModal } from './components/SocialShareModal';

export default function App() {
  const [currentPass, setCurrentPass] = useState<PatronPassData>(INITIAL_PATRON);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  const handleOpenRsvp = () => {
    const el = document.getElementById('rsvp-portal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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

        {/* Choral Forces, Choirmaster Profile & Concert Program Selection */}
        <RepertoireSection />

        {/* Central RSVP Portal with Live Custom Brag Pass Flyer Generator & PNG Exporter */}
        <RsvpBragPassSection
          onPassConfirmed={handlePassConfirmed}
          onPassChange={handlePassConfirmed}
        />

        {/* Sanctuary & Venue Arrival Logistics */}
        <LogisticsAndVenue />
      </main>

      {/* Liturgical Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Quick Action Dock */}
      <div className="xl:hidden fixed bottom-3 inset-x-3 z-40 bg-[#16211c]/95 backdrop-blur-md border border-[#e9c349]/40 rounded-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2">
        <button
          onClick={handleOpenRsvp}
          className="flex-1 py-2.5 px-3 bg-[#8b0014] hover:bg-[#b4262c] text-[#dfe4de] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md border border-[#e9c349]/40 min-h-[44px]"
        >
          <Ticket className="w-4 h-4 text-[#e9c349]" />
          <span>Claim Free Pass</span>
        </button>

        <button
          onClick={() => setShowPassModal(true)}
          className="py-2.5 px-3 bg-[#262b28] hover:bg-[#313632] text-[#e9c349] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#e9c349]/30 min-h-[44px]"
        >
          <QrCode className="w-4 h-4" />
          <span>My Pass</span>
        </button>

        <button
          onClick={toggleSacredAudio}
          title={isPlayingAudio ? 'Pause "For Unto Us a Child Is Born"' : 'Play "For Unto Us a Child Is Born" Chorale'}
          className="w-11 h-11 bg-[#101412] hover:bg-[#1c211e] text-[#e9c349] rounded-lg border border-[#e9c349]/30 flex items-center justify-center flex-shrink-0"
        >
          {isPlayingAudio ? (
            <Volume2 className="w-5 h-5 animate-pulse text-[#e9c349]" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#e2bebc]" />
          )}
        </button>
      </div>

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
    </div>
  );
}
