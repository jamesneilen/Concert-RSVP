import React from 'react';
import { Church, Sparkles, ArrowUp, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0a0f0c] border-t border-[#e9c349]/20 pt-12 sm:pt-16 pb-28 xl:pb-12 text-[#dfe4de]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#1c211e] flex items-center justify-center text-[#e9c349] border border-[#e9c349]/30">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#dfe4de]">
                  St Cletus Choir
                </h4>
                <p className="text-[10px] text-[#e9c349] font-bold tracking-widest uppercase">
                  Christ the King Parish • Nacho, Bamenda
                </p>
              </div>
            </div>
            <p className="text-xs text-[#e2bebc] max-w-md leading-relaxed mb-4">
              “Sing Unto God for Christ is Born” is the premier sacred music event of the Advent and Christmas season in Bamenda, lifting souls through polyphony, African choral hymns, and sacred pipe organ praise.
            </p>
            <div className="text-xs text-[#e9c349] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Motto: Called to win by our voices</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-serif text-sm font-bold text-[#e9c349] uppercase tracking-wider mb-3">
              Event Information
            </h5>
            <ul className="text-xs text-[#e2bebc] space-y-2">
              <li>
                <strong className="text-[#dfe4de]">Date:</strong> Sun, Dec 27, 2026
              </li>
              <li>
                <strong className="text-[#dfe4de]">Concert Begins:</strong> 1:00 PM WAT
              </li>
              <li>
                <strong className="text-[#dfe4de]">Venue:</strong> Main Sanctuary Nave
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-serif text-sm font-bold text-[#e9c349] uppercase tracking-wider mb-3">
              Parish Choir Contact
            </h5>
            <div className="text-xs text-[#e2bebc] space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#e9c349] flex-shrink-0" />
                <span className="truncate">stcletuschoir.nacho@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#e9c349] flex-shrink-0" />
                <span>+237 677 82 91 04 / 675 14 30 89</span>
              </p>
              <p className="pt-2 text-[11px] text-[#a3d0be]">
                Christ the King Parish, Nacho Gate, Bamenda
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar matching the exact footer in screenshot */}
        <div className="pt-6 border-t border-[#e9c349]/15 flex flex-col sm:flex-row items-center justify-between text-[#e2bebc] text-xs gap-3 sm:gap-4">
          <p className="text-center sm:text-left text-[11px] sm:text-xs">
            © 2026 St Cletus Choir, Nacho, Bamenda. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-[#e9c349]/80 uppercase tracking-widest text-center">
            <span>Sing Unto God for Christ is Born</span>
            <span>•</span>
            <span>Called to win by our voices</span>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[#1c211e] hover:bg-[#313632] text-[#e9c349] border border-[#e9c349]/20 transition-all min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            title="Scroll to Top"
            aria-label="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
