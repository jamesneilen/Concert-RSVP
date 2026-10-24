import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  Smartphone,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { PatronPassData } from '../data/concertData';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  patron: PatronPassData;
  onDownloadImage: () => void;
  getFlyerFile?: () => Promise<File | null>;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  patron,
  onDownloadImage,
  getFlyerFile,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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

  const shareHeadline = `St Cletus Choir Christmas Concert • ${patron.fullName}'s Pass`;

  // Caption text attached to the flyer image
  const flyerCaptionText = `✨ "For Unto Us a Child Is Born, Unto Us a Son Is Given!"

Here is my official personalized pass for "Sing Unto God for Christ is Born" Christmas Concert with St Cletus Choir!
📅 Sunday, Dec 27, 2026 • 1:00 PM WAT
📍 Christ the King Parish, Nacho, Bamenda
🎟️ Pass Code: #${patron.passCode}
👤 Attendee: ${patron.fullName} (${patron.tier})

📞 Concert Inquiries: WhatsApp +237 672 668 334 / Tel: 675360863
🎟️ Claim your free illuminated brag pass:
${shareUrl}`;

  // Helper to obtain the actual flyer File
  const obtainFlyerFile = async (): Promise<File | null> => {
    if (getFlyerFile) {
      try {
        const file = await getFlyerFile();
        if (file) return file;
      } catch (e) {
        console.warn('getFlyerFile failed, falling back to DOM capture', e);
      }
    }

    const cardElement = document.getElementById('brag-pass-card');
    if (!cardElement) {
      return null;
    }

    const dataUrl = await toPng(cardElement, {
      cacheBust: true,
      quality: 0.98,
      pixelRatio: 2,
    });

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const cleanName = patron.fullName.trim().replace(/\s+/g, '_') || 'Patron';
    return new File([blob], `St_Cletus_Christmas_Flyer_${cleanName}.png`, {
      type: 'image/png',
    });
  };

  // Primary sharing action: shares the actual flyer file with the caption text attached
  const handleShareFlyerWithText = async (targetPlatform?: 'whatsapp' | 'facebook' | 'twitter') => {
    setIsGenerating(true);
    setFeedbackMessage(null);

    try {
      const file = await obtainFlyerFile();

      // Check if Web Share API with files is supported (iOS Safari, Android Chrome, mobile apps)
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare &&
        file &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: shareHeadline,
          text: flyerCaptionText,
        });
        setFeedbackMessage('Flyer image & caption shared successfully!');
        setTimeout(() => setFeedbackMessage(null), 4000);
        return;
      }

      // If file sharing is not supported directly (e.g., desktop browsers):
      // 1. Copy image to clipboard
      let imageCopiedSuccess = false;
      if (file && typeof navigator !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': file }),
          ]);
          imageCopiedSuccess = true;
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 3000);
        } catch (clipErr) {
          console.warn('Direct image clipboard copy not permitted:', clipErr);
        }
      }

      // 2. Download the flyer image automatically so user has the file
      if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        onDownloadImage();
      }

      // 3. Copy caption text to clipboard
      await navigator.clipboard.writeText(flyerCaptionText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);

      // 4. If a specific social platform was clicked on desktop, launch it
      if (targetPlatform === 'whatsapp') {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(flyerCaptionText)}`,
          '_blank'
        );
      } else if (targetPlatform === 'facebook') {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(flyerCaptionText)}`,
          '_blank'
        );
      } else if (targetPlatform === 'twitter') {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `I just claimed my personalized Christmas concert pass with St Cletus Choir! 🎶\n\nInquiries: WhatsApp +237 672 668 334`
          )}&url=${encodeURIComponent(shareUrl)}&hashtags=StCletusChoir,Bamenda,SingUntoGod`,
          '_blank'
        );
      }

      setFeedbackMessage(
        imageCopiedSuccess
          ? 'Flyer image downloaded and copied to clipboard! Paste (Ctrl+V) into your chat to send the flyer image with your caption.'
          : 'Flyer image downloaded and caption copied! Attach the downloaded flyer to your message.'
      );
      setTimeout(() => setFeedbackMessage(null), 7000);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Sharing error:', err);
        onDownloadImage();
        navigator.clipboard.writeText(flyerCaptionText);
        setFeedbackMessage('Flyer downloaded and caption copied to clipboard!');
        setTimeout(() => setFeedbackMessage(null), 5000);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy flyer image directly to clipboard
  const handleCopyImageOnly = async () => {
    setIsGenerating(true);
    setFeedbackMessage(null);
    try {
      const file = await obtainFlyerFile();
      if (file && typeof navigator !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': file }),
        ]);
        setCopiedImage(true);
        setFeedbackMessage('Flyer graphic copied to clipboard! You can paste (Ctrl+V) it anywhere.');
        setTimeout(() => {
          setCopiedImage(false);
          setFeedbackMessage(null);
        }, 4000);
      } else {
        onDownloadImage();
        setFeedbackMessage('Flyer downloaded to your device!');
        setTimeout(() => setFeedbackMessage(null), 4000);
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
      onDownloadImage();
      setFeedbackMessage('Flyer downloaded to your device!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaptionOnly = () => {
    navigator.clipboard.writeText(flyerCaptionText);
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
          Share Your Keepsake Concert Flyer
        </h3>
        <p className="text-xs text-[#e2bebc] mb-4 leading-relaxed">
          Share your official illuminated flyer image with concert date, time, and caption attached directly to WhatsApp, Facebook, or Twitter.
        </p>

        {/* Pass Mini Preview Card with Attendee Portrait */}
        <div className="bg-[#0a0f0c] p-3 sm:p-3.5 rounded-xl border border-[#e9c349]/30 flex items-center gap-3.5 mb-4 shadow-inner">
          <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#e9c349] to-[#ffe088] shadow-md flex-shrink-0">
            <img
              key={patron.photoUrl}
              src={patron.photoUrl}
              alt={patron.fullName}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/avatars/avatar_eleanor.jpg';
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
              Christ the King Parish, Nacho, Bamenda • Sun, Dec 27, 2026 at 1:00 PM WAT
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

        {/* Feedback Alert if present */}
        {feedbackMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#e9c349]/15 border border-[#e9c349]/40 text-[#ffe088] text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#e9c349] flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{feedbackMessage}</span>
          </div>
        )}

        {/* PRIMARY ACTION: Share Flyer Image + Caption */}
        <div className="mb-4">
          <button
            onClick={() => handleShareFlyerWithText()}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8b0014] via-[#b4262c] to-[#8b0014] hover:from-[#a00018] hover:to-[#a00018] text-[#dfe4de] rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,0,20,0.5)] border-2 border-[#e9c349] transition-all cursor-pointer disabled:opacity-50 min-h-[50px] transform active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#e9c349]" />
                <span>Preparing High-Res Flyer...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#e9c349]" />
                <span>Share Actual Flyer with Caption</span>
              </>
            )}
          </button>
          <span className="text-[10px] text-[#e2bebc] text-center block mt-1.5">
            Attaches your rendered pass graphic and description directly into WhatsApp or device apps.
          </span>
        </div>

        {/* Direct Social Channels Grid (WhatsApp, Facebook, Twitter) */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-[#e9c349] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#e9c349]" />
            <span>Or Send Directly To Platform:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <button
              onClick={() => handleShareFlyerWithText('whatsapp')}
              disabled={isGenerating}
              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer min-h-[44px]"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShareFlyerWithText('facebook')}
              disabled={isGenerating}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer min-h-[44px]"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={() => handleShareFlyerWithText('twitter')}
              disabled={isGenerating}
              className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] border border-neutral-700 cursor-pointer min-h-[44px]"
            >
              <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter (X)</span>
            </button>
          </div>
        </div>

        {/* Copy Image & Copy Caption Auxiliary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleCopyImageOnly}
            disabled={isGenerating}
            className="py-2.5 px-3 rounded-lg bg-[#262b28] hover:bg-[#313632] text-[#dfe4de] hover:text-[#e9c349] text-xs font-semibold flex items-center justify-center gap-2 border border-[#313632] cursor-pointer transition-colors"
          >
            {copiedImage ? (
              <>
                <Check className="w-4 h-4 text-[#a3d0be]" />
                <span className="text-[#a3d0be]">Flyer Image Copied!</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 text-[#e9c349]" />
                <span>Copy Flyer Image</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyCaptionOnly}
            className="py-2.5 px-3 rounded-lg bg-[#262b28] hover:bg-[#313632] text-[#dfe4de] hover:text-[#e9c349] text-xs font-semibold flex items-center justify-center gap-2 border border-[#313632] cursor-pointer transition-colors"
          >
            {copiedCaption ? (
              <>
                <Check className="w-4 h-4 text-[#a3d0be]" />
                <span className="text-[#a3d0be]">Caption Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#e9c349]" />
                <span>Copy Caption Text</span>
              </>
            )}
          </button>
        </div>

        {/* Caption Preview Box */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider">
              Attached Flyer Caption:
            </span>
          </div>
          <div className="bg-[#0a0f0c] p-3 rounded-xl border border-[#313632] text-xs font-mono text-[#dfe4de] leading-relaxed break-words max-h-24 overflow-y-auto whitespace-pre-wrap select-all">
            {flyerCaptionText}
          </div>
        </div>

        {/* Footer: Direct PNG Download Button */}
        <div className="pt-2 border-t border-[#313632]/60 flex items-center justify-between">
          <span className="text-[11px] text-[#e2bebc]">
            Inquiries: WhatsApp <strong className="text-[#e9c349]">+237 672 668 334</strong>
          </span>
          <button
            onClick={onDownloadImage}
            className="py-2 px-3.5 bg-[#e9c349] hover:bg-[#ffe088] text-[#3c2f00] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
