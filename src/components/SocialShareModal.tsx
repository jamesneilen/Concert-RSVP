import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { PatronPassData } from '../data/concertData';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  patron: PatronPassData;
  onDownloadImage: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  patron,
  onDownloadImage,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [sharedViaDevice, setSharedViaDevice] = useState(false);

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const currentPath =
    typeof window !== 'undefined' && window.location.pathname
      ? window.location.pathname
      : '';

  const shareUrl = `${currentOrigin}${currentPath}?patron=${encodeURIComponent(
    patron.fullName
  )}&pass=${encodeURIComponent(patron.passCode)}#rsvp-portal`;

  const shareHeadline = `Sing Unto God for Christ is Born • St Cletus Choir Christmas Concert 2026`;
  
  const whatsappText = `✨ I just reserved my ${patron.tier} seat for "Sing Unto God for Christ is Born" Christmas Concert with St Cletus Choir!

📅 Sunday, December 27, 2026 • 1:00 PM WAT
📍 Christ the King Parish, Nacho, Bamenda
🎟️ Official Pass Code: #${patron.passCode}
👤 Attendee: ${patron.fullName}

Claim your personalized keepsake brag pass here:
${shareUrl}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}&quote=${encodeURIComponent(
    `✨ I'm attending "Sing Unto God for Christ is Born" with St Cletus Choir at Christ the King Parish, Nacho, Bamenda (Dec 27, 2026)! Claim your personalized brag pass here:`
  )}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I just claimed my personalized brag pass for "Sing Unto God for Christ is Born" with St Cletus Choir at Christ the King Parish, Nacho, Bamenda! 🎶 Join us:`
  )}&url=${encodeURIComponent(shareUrl)}&hashtags=StCletusChoir,ChristmasConcert,NachoBamenda,SingUntoGod`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;

  const storyCaption = `✨ "For Unto Us a Child Is Born, Unto Us a Son Is Given!" I just secured my ${patron.tier} pass for "Sing Unto God for Christ is Born" Christmas Concert with St Cletus Choir at Christ the King Parish, Nacho, Bamenda (Sunday, Dec 27, 2026 at 1:00 PM WAT). Get your free illuminated brag pass at ${shareUrl}`;

  // Native share fallback
  const handleDeviceShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareHeadline,
          text: `I just reserved my ${patron.tier} seat for "Sing Unto God for Christ is Born" with St Cletus Choir! 🎶`,
          url: shareUrl,
        });
        setSharedViaDevice(true);
        setTimeout(() => setSharedViaDevice(false), 3000);
      } catch (err) {
        console.debug('User cancelled device share', err);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(storyCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#1c211e] max-w-lg w-full rounded-2xl p-4 sm:p-6 border-2 border-[#e9c349]/50 shadow-2xl relative max-h-[92vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#0a0f0c] text-[#e2bebc] hover:text-[#e9c349] hover:bg-[#313632] transition-colors cursor-pointer"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-[#e9c349] text-xs font-bold tracking-widest uppercase mb-1">
          <Share2 className="w-4 h-4 text-[#e9c349]" />
          <span>Social Media Share Suite</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#dfe4de] mb-1">
          Share Your Keepsake Brag Pass
        </h3>
        <p className="text-xs text-[#e2bebc] mb-4 sm:mb-5 leading-relaxed">
          Broadcast your personalized concert pass directly to WhatsApp, Facebook, or Twitter (X), or post your downloaded pass image to your story.
        </p>

        {/* Pass Mini Preview Card */}
        <div className="bg-[#0a0f0c] p-3 sm:p-3.5 rounded-xl border border-[#e9c349]/30 flex items-center gap-3.5 mb-5 shadow-inner">
          <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#e9c349] to-[#ffe088] shadow-md flex-shrink-0">
            <img
              key={patron.photoUrl}
              src={patron.photoUrl}
              alt={patron.fullName}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          <div className="min-w-0 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#e9c349] uppercase tracking-wider bg-[#1f4a3c] px-2 py-0.5 rounded">
                {patron.tier}
              </span>
              <span className="text-[10px] font-mono text-[#a3d0be] truncate">
                #{patron.passCode}
              </span>
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#dfe4de] truncate mt-0.5">
              {patron.fullName}
            </h4>
            <p className="text-[11px] text-[#e2bebc] truncate">
              Christ the King Parish, Nacho, Bamenda • Dec 27, 2026
            </p>
          </div>
          <button
            onClick={onDownloadImage}
            title="Download pass PNG"
            className="p-2.5 rounded-lg bg-[#262b28] hover:bg-[#313632] text-[#e9c349] border border-[#e9c349]/30 flex-shrink-0 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Social Channels Grid (WhatsApp, Facebook, Twitter) */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-[#e9c349] uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e9c349]" />
            <span>Share Directly to Social Platforms:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer min-h-[46px] text-decoration-none"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer min-h-[46px] text-decoration-none"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] border border-neutral-700 cursor-pointer min-h-[46px] text-decoration-none"
            >
              <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter (X)</span>
            </a>
          </div>
        </div>

        {/* Device Native Share option if available */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <div className="mb-4">
            <button
              onClick={handleDeviceShare}
              className="w-full py-2.5 px-3 rounded-lg bg-[#262b28] hover:bg-[#313632] text-[#dfe4de] text-xs font-semibold flex items-center justify-center gap-2 border border-[#313632] cursor-pointer transition-colors"
            >
              <Smartphone className="w-4 h-4 text-[#e9c349]" />
              <span>
                {sharedViaDevice ? 'Shared via device menu!' : 'Share via Other Apps / Device Menu'}
              </span>
            </button>
          </div>
        )}

        {/* Copy Caption Block */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider">
              Ready-to-Post Story / Status Caption:
            </span>
            <button
              onClick={handleCopyCaption}
              className="text-xs text-[#e9c349] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#a3d0be]" />
                  <span className="text-[#a3d0be]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-[#0a0f0c] p-3 rounded-xl border border-[#313632] text-xs font-mono text-[#dfe4de] leading-relaxed break-words max-h-24 overflow-y-auto">
            “{storyCaption}”
          </div>
        </div>

        {/* Action Buttons Row: Download & Copy Link */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-[#313632]/60">
          <button
            onClick={onDownloadImage}
            className="flex-1 py-3 px-3 bg-[#e9c349] hover:bg-[#ffe088] text-[#3c2f00] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Download Pass Image (PNG)</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-3 px-4 bg-[#262b28] hover:bg-[#313632] text-[#dfe4de] hover:text-[#e9c349] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#e9c349]/30 transition-all cursor-pointer min-h-[44px]"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-[#a3d0be]" />
                <span className="text-[#a3d0be]">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
