import React, { useState, useEffect } from 'react';
import { Play, Pause, Library, Sparkles, X, BookOpen, Volume2, Users, Church } from 'lucide-react';
import { REPERTOIRE_LIST, RepertoireItem } from '../data/concertData';
import { sacredAudio } from '../utils/audioSynth';

export const RepertoireSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('00:00');
  const [selectedMovement, setSelectedMovement] = useState<RepertoireItem | null>(null);

  useEffect(() => {
    const unsubscribe = sacredAudio.init((playing, progress) => {
      setIsPlaying(playing);
      setProgressPercent(progress);
      setCurrentTimeFormatted(sacredAudio.getCurrentTimeFormatted());
    });
    return () => unsubscribe();
  }, []);

  const toggleAudio = () => {
    const playing = sacredAudio.toggle();
    setIsPlaying(playing);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    sacredAudio.seekToPercent(newPercent);
  };

  const getTagBadgeClass = (tagType: string) => {
    switch (tagType) {
      case 'gold':
        return 'bg-[#0a0f0c] text-[#e9c349] border border-[#e9c349]/30';
      case 'mint':
        return 'bg-[#0a0f0c] text-[#a3d0be] border border-[#a3d0be]/30';
      case 'crimson':
        return 'bg-[#8b0014] text-[#dfe4de] border border-[#ffb3ae]/40';
      default:
        return 'bg-[#181d1a] text-[#dfe4de] border border-[#313632]';
    }
  };

  return (
    <section id="program-section" className="w-full py-16 sm:py-20 lg:py-28 px-3 sm:px-6 lg:px-12 bg-[#0a0f0c]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-[#e9c349] text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase flex items-center gap-1.5">
              <Library className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e9c349]" />
              Concert Program Teaser
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#dfe4de] mt-1.5 sm:mt-2">
              The Musical Repertoire
            </h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-[#e2bebc] max-w-md leading-relaxed">
            A transcendent journey across Classicals, Christmas Carols, and Cameroonian/African medleys.
          </p>
        </div>

        {/* Grid: Conductor Spotlight & Program Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left: Choirmaster Profile & Audio Player */}
          <div className="lg:col-span-5 bg-[#1c211e] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-[#e9c349]/20">
            <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                alt="MD James Neilen conducting choir in sanctuary"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c211e] via-[#1c211e]/40 to-transparent" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <span className="px-2.5 py-0.5 rounded bg-[#1f4a3c]/90 text-[#e9c349] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-[#e9c349]/30 inline-block">
                  Musical Director
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#dfe4de] mt-1 drop-shadow">
                  MD James Neilen
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 flex-grow">
              <p className="text-xs sm:text-sm text-[#e2bebc] italic leading-relaxed">
                “Under the theme <span className="text-[#e9c349] font-semibold font-serif">‘Sing Unto God for Christ is Born’</span>, our voices gather in Christ the King Parish to celebrate divine hope, joy, and peace across our community and the world.”
              </p>

              {/* Featured Guest Choir Highlight */}
              <div className="bg-[#262b28]/80 p-3 sm:p-4 rounded-lg flex flex-col gap-2 border border-[#e9c349]/20">
                <div className="flex items-center justify-between text-[#e9c349] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#e9c349]" />
                    <span>Featured Guest Choir</span>
                  </span>
                  <span className="px-2 py-0.5 bg-[#0a0f0c] rounded text-[#a3d0be] text-[10px] border border-[#a3d0be]/20 font-semibold">
                    Guest Ministration
                  </span>
                </div>
                <div className="bg-[#181d1a] p-3 rounded-lg border border-[#e9c349]/25 flex items-center justify-between gap-3 hover:border-[#e9c349]/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-[#0a0f0c] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/40 flex-shrink-0 shadow-sm">
                      <Church className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#dfe4de] truncate">
                        St Joseph Cathedral Choir
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#e2bebc]">
                        Special Guest Choir • St Joseph Cathedral, Bamenda
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-semibold bg-[#e9c349]/10 text-[#e9c349] border border-[#e9c349]/30 flex-shrink-0">
                    Special Appearance
                  </span>
                </div>
              </div>

              {/* Mini Audio Player Card */}
              <div className="bg-[#0a0f0c] p-3 sm:p-4 rounded-lg shadow-inner flex flex-col gap-2.5 sm:gap-3 border border-[#e9c349]/25 mt-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      onClick={toggleAudio}
                      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#8b0014] hover:bg-[#b4262c] text-[#dfe4de] flex items-center justify-center transition-all shadow-[0_0_12px_rgba(233,195,73,0.3)] border border-[#e9c349] flex-shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-[#e9c349]" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 text-[#e9c349]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-[#dfe4de] truncate">
                        For Unto Us a Child Is Born (Handel)
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#e9c349] flex items-center gap-1.5 truncate">
                        <span>Chorale & Orchestra Performance</span>
                        {isPlaying && (
                          <span className="flex items-center gap-0.5 ml-1 flex-shrink-0">
                            <span className="w-1 h-2.5 bg-[#e9c349] animate-pulse" />
                            <span className="w-1 h-1.5 bg-[#e9c349] animate-pulse delay-75" />
                            <span className="w-1 h-3 bg-[#e9c349] animate-pulse delay-150" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono text-[#e2bebc] flex-shrink-0">
                    {isPlaying ? currentTimeFormatted : '04:18'}
                  </span>
                </div>

                {/* Interactive seek / progress track */}
                <div
                  onClick={handleSeek}
                  title="Click to seek"
                  className="w-full bg-[#262b28] hover:bg-[#313632] h-2 rounded-full overflow-hidden cursor-pointer transition-colors relative"
                >
                  <div
                    className="bg-[#e9c349] h-full rounded-full transition-all duration-150"
                    style={{ width: `${Math.max(progressPercent, 0)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-[#e2bebc]/80 tracking-wider">
                  <span className="flex items-center gap-1 truncate">
                    <Volume2 className="w-3 h-3 text-[#e9c349] flex-shrink-0" />
                    <span>{isPlaying ? "Playing Handel's Messiah Chorale..." : 'Tap play to hear the chorale'}</span>
                  </span>
                  <span className="flex-shrink-0">Choir & Orchestra • 04:18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Ordered Repertoire Program List */}
          <div className="lg:col-span-7 bg-[#1c211e] rounded-xl p-4 sm:p-6 lg:p-7 shadow-2xl flex flex-col gap-3 sm:gap-3.5 border border-[#e9c349]/20">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#313632]">
              <span className="font-serif text-sm sm:text-base font-semibold text-[#e9c349] uppercase tracking-wider">
                Concert Program Selection
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#e2bebc] tracking-wider uppercase">
                Three Parts • 180 Min
              </span>
            </div>

            {/* Movement list */}
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {REPERTOIRE_LIST.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMovement(item)}
                  className={`p-3 sm:p-3.5 rounded-lg transition-all flex items-start gap-2.5 sm:gap-3.5 cursor-pointer border ${
                    item.id === 'm6'
                      ? 'bg-[#262b28] hover:bg-[#313632] border-[#e9c349]/40 shadow-md'
                      : 'bg-[#181d1a] hover:bg-[#262b28] border-transparent hover:border-[#e9c349]/30'
                  }`}
                >
                  <span className="font-serif text-lg sm:text-xl text-[#e9c349] font-bold min-w-5 sm:min-w-6 flex-shrink-0">
                    {item.num}
                  </span>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`font-serif text-sm sm:text-base font-bold truncate ${
                          item.id === 'm6' ? 'text-[#e9c349]' : 'text-[#dfe4de]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded self-start sm:self-auto flex-shrink-0 ${getTagBadgeClass(
                          item.tagType
                        )}`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#e2bebc] mt-0.5 font-normal leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Illuminated Folio Notice */}
            <div className="pt-2 sm:pt-3 text-center border-t border-[#313632]">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#e9c349]/80 uppercase tracking-widest block leading-tight">
                • 28-Page Illuminated Program Folio distributed at the Sanctuary doors •
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Movement Detail Modal */}
      {selectedMovement && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedMovement(null)}
        >
          <div
            className="bg-[#1c211e] max-w-lg w-full rounded-xl p-5 sm:p-6 border-2 border-[#e9c349]/40 shadow-2xl relative max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovement(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 rounded-full bg-[#0a0f0c] text-[#e9c349] hover:bg-[#313632]"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#e9c349] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 pr-8">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Program Folio Notes • Movement {selectedMovement.num}</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#dfe4de] mt-1.5 mb-1">
              {selectedMovement.title}
            </h3>
            <p className="text-xs text-[#e9c349] mb-3 sm:mb-4">{selectedMovement.subtitle}</p>

            <div className="bg-[#0a0f0c] p-3.5 sm:p-4 rounded-lg border border-[#e9c349]/20 mb-3.5 sm:mb-4">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider block mb-1">
                Composer & Score
              </span>
              <p className="text-xs sm:text-sm text-[#dfe4de] font-semibold">{selectedMovement.composer}</p>
              <p className="text-xs text-[#e2bebc] mt-2 leading-relaxed">
                {selectedMovement.description}
              </p>
            </div>

            {selectedMovement.lyricsSnippet && (
              <div className="p-3.5 sm:p-4 rounded-lg bg-[#262b28] border-l-2 border-[#e9c349] mb-4 sm:mb-5">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#e9c349] uppercase tracking-wider block mb-1">
                  Sacred Lyric Snippet
                </span>
                <p className="font-serif italic text-xs sm:text-sm text-[#dfe4de] leading-relaxed">
                  “{selectedMovement.lyricsSnippet}”
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedMovement(null);
                toggleAudio();
              }}
              className="w-full py-2.5 sm:py-3 rounded-lg bg-[#8b0014] hover:bg-[#b4262c] text-[#dfe4de] font-semibold text-xs tracking-wider uppercase border border-[#e9c349] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#e9c349]" />
              <span>Listen to Hymnal Cadence</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
