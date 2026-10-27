import { Church, Sparkles, ArrowUp, Mail, Phone, FileSpreadsheet } from 'lucide-react';

interface FooterProps {
  onOpenSyncModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSyncModal }) => {
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
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#e9c349] flex-shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a href="tel:+237675360863" className="text-[#dfe4de] hover:text-[#e9c349] font-medium transition-colors">
                    675360863
                  </a>
                  <span>/</span>
                  <a href="tel:+237672668334" className="text-[#dfe4de] hover:text-[#e9c349] font-medium transition-colors">
                    672668334
                  </a>
                </div>
              </div>

              {/* WhatsApp Button for Inquiries */}
              <div className="pt-1.5">
                <a
                  href="https://wa.me/237672668334?text=Hello%20St.%20Cletus%20Choir%2C%20I%20have%20an%20inquiry%20regarding%20the%20Sing%20Unto%20God%20Christmas%20Concert%20at%20Christ%20the%20King%20Parish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[11px] shadow-sm transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp Inquiries</span>
                </a>
              </div>

              <p className="pt-1.5 text-[11px] text-[#a3d0be]">
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
          <div className="flex items-center gap-3">
            {onOpenSyncModal && (
              <button
                type="button"
                onClick={onOpenSyncModal}
                className="px-3 py-1.5 rounded-lg bg-[#1c211e] hover:bg-[#262b28] text-[#e9c349] border border-[#e9c349]/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open Google Sheet Registry & Webhook Diagnostics"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Spreadsheet Sync</span>
              </button>
            )}
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
      </div>
    </footer>
  );
};
