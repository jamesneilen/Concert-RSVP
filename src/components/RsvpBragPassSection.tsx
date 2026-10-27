import React, { useState, useRef } from 'react';
import {
  Camera,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Lock,
  Church,
  Sparkles,
  QrCode,
  UserCheck,
  ChevronDown,
  Calendar,
  Clock,
  Heart,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { INITIAL_PATRON, SAMPLE_AVATARS, PatronPassData, PATRON_TIERS, PatronTier } from '../data/concertData';
import { submitRsvpToSpreadsheet } from '../services/rsvpRegistryService';
import { SocialShareModal } from './SocialShareModal';

interface RsvpBragPassSectionProps {
  onPassConfirmed?: (pass: PatronPassData) => void;
  onPassChange?: (pass: PatronPassData) => void;
  onOpenSyncModal?: () => void;
}

export const RsvpBragPassSection: React.FC<RsvpBragPassSectionProps> = ({
  onPassConfirmed,
  onPassChange,
  onOpenSyncModal,
}) => {
  const [formData, setFormData] = useState<PatronPassData>(INITIAL_PATRON);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isPassPulsing, setIsPassPulsing] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const flyerCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerPassPulse = () => {
    setIsPassPulsing(true);
    setTimeout(() => setIsPassPulsing(false), 500);
  };

  // Robust client-side photo processing with automatic canvas centering, high-res optimization, and CORS avoidance
  const processImageFile = (file: File) => {
    setPhotoError(null);

    // Validate image MIME type or extension
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|heic|svg)$/i.test(file.name);
    if (!isImage) {
      setPhotoError('Please select a valid image file (PNG, JPG, WebP, or GIF).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setPhotoError('Image exceeds 25MB limit. Please choose a smaller photo.');
      return;
    }

    setIsProcessingPhoto(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();

    reader.onerror = () => {
      setIsProcessingPhoto(false);
      setPhotoError('Could not read image file. Please try selecting another photo.');
    };

    reader.onload = (readerEvent) => {
      const rawDataUrl = readerEvent.target?.result as string;
      if (!rawDataUrl) {
        setIsProcessingPhoto(false);
        setPhotoError('Empty image data.');
        return;
      }

      // Load into offscreen Image to calculate center square crop and optimal canvas size
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const targetDim = 800; // Optimal 800x800 for crystal-clear flyer embossing without bloat
          canvas.width = targetDim;
          canvas.height = targetDim;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Center square aspect-fill calculation
            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;

            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetDim, targetDim);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

            const updatedPass: PatronPassData = {
              ...formData,
              photoUrl: optimizedDataUrl,
            };

            setFormData(updatedPass);
            onPassConfirmed?.(updatedPass);
            onPassChange?.(updatedPass);
            triggerPassPulse();
            setPhotoError(null);
          } else {
            // Direct dataUrl fallback if 2D context unavailable
            const updatedPass: PatronPassData = {
              ...formData,
              photoUrl: rawDataUrl,
            };
            setFormData(updatedPass);
            onPassConfirmed?.(updatedPass);
            onPassChange?.(updatedPass);
            triggerPassPulse();
          }
        } catch (canvasErr) {
          console.warn('Canvas optimization fallback:', canvasErr);
          const updatedPass: PatronPassData = {
            ...formData,
            photoUrl: rawDataUrl,
          };
          setFormData(updatedPass);
          onPassConfirmed?.(updatedPass);
          onPassChange?.(updatedPass);
          triggerPassPulse();
        } finally {
          setIsProcessingPhoto(false);
        }
      };

      img.onerror = () => {
        // Fallback directly to raw data URL
        const updatedPass: PatronPassData = {
          ...formData,
          photoUrl: rawDataUrl,
        };
        setFormData(updatedPass);
        onPassConfirmed?.(updatedPass);
        onPassChange?.(updatedPass);
        triggerPassPulse();
        setIsProcessingPhoto(false);
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  // Handle local photo upload from input
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Select sample avatar
  const handleSelectPresetAvatar = (avatarUrl: string, name: string) => {
    setUploadedFileName(null);
    setPhotoError(null);
    const updatedPass = {
      ...formData,
      photoUrl: avatarUrl,
      fullName: name,
    };
    setFormData(updatedPass);
    onPassConfirmed?.(updatedPass);
    onPassChange?.(updatedPass);
    triggerPassPulse();
  };

  // Submit RSVP - automatically updates the spreadsheet in the backend
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const updatedPass: PatronPassData = {
      ...formData,
      passCode: `CK-2026-XMAS-${randomCode}`,
      confirmedAt: new Date().toLocaleDateString(),
    };
    setFormData(updatedPass);
    triggerPassPulse();

    // Sacred gold & crimson celebratory confetti
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e9c349', '#8b0014', '#ffe088', '#a3d0be'],
    });

    onPassConfirmed?.(updatedPass);

    // Silently update the backend spreadsheet registry
    submitRsvpToSpreadsheet(updatedPass).catch((err) => {
      console.warn('Background spreadsheet update:', err);
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 6000);
  };

  // Helper to obtain the actual flyer File
  const getFlyerFile = async (): Promise<File | null> => {
    if (!flyerCardRef.current) return null;
    try {
      const dataUrl = await toPng(flyerCardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const cleanName = formData.fullName.trim().replace(/\s+/g, '_') || 'Patron';
      return new File([blob], `St_Cletus_Christmas_Flyer_${cleanName}.png`, {
        type: 'image/png',
      });
    } catch (err) {
      console.warn('Could not generate flyer file:', err);
      return null;
    }
  };

  const flyerCaptionText = `✨ "For Unto Us a Child Is Born, Unto Us a Son Is Given!"

Here is my official personalized pass for "Sing Unto God for Christ is Born" Christmas Concert with St Cletus Choir!
📅 Sunday, Dec 27, 2026 • 1:00 PM WAT
📍 Christ the King Parish, Nacho, Bamenda
🎟️ Pass Code: #${formData.passCode}
👤 Attendee: ${formData.fullName} (${formData.tier})

📞 Concert Inquiries: WhatsApp +237 672 668 334 / Tel: 675360863
🎟️ Claim your free pass: ${typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?patron=${encodeURIComponent(formData.fullName)}&pass=${encodeURIComponent(formData.passCode)}#rsvp-portal` : ''}`;

  // Download pass as PNG
  const handleDownloadFlyer = async () => {
    if (!flyerCardRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(flyerCardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
      });

      const cleanName = formData.fullName.trim().replace(/\s+/g, '_') || 'Patron';
      const link = document.createElement('a');
      link.download = `St_Cletus_Choir_Christmas_Pass_${cleanName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Image export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct share flyer image with text attached
  const handleDirectShareFlyer = async (platform?: 'whatsapp' | 'facebook' | 'twitter') => {
    setIsDownloading(true);
    try {
      const file = await getFlyerFile();

      // If mobile Web Share with file is supported, share image + text directly
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare &&
        file &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `St Cletus Choir Christmas Concert - ${formData.fullName}`,
          text: flyerCaptionText,
        });
        return;
      }

      // Desktop fallback: open share modal which downloads image and copies caption
      setShowShareModal(true);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setShowShareModal(true);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Share flyer modal opener
  const handleShareFlyer = () => {
    setShowShareModal(true);
  };

  // Copy personal brag link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}?patron=${encodeURIComponent(
        formData.fullName
      )}&pass=${formData.passCode}#rsvp-portal`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getTierColorStyle = () => {
    switch (formData.tier) {
      case 'VIP Benefactor (Reserved)':
        return 'bg-[#e9c349] text-[#3c2f00] font-bold shadow-sm';
      case 'Clergy Guest (Honorary)':
        return 'bg-[#8b0014] text-[#dfe4de] border border-[#ffb3ae]/40 font-bold';
      case 'Choir Patron':
        return 'bg-[#af8d11] text-[#0a0f0c] border border-[#ffe088]/60 font-bold shadow-sm';
      case 'Choir Alumni':
        return 'bg-[#1f4a3c] text-[#a3d0be] border border-[#a3d0be]/40 font-bold';
      case 'General Admission (Free)':
      default:
        return 'bg-[#313632] text-[#dfe4de] border border-[#e9c349]/30';
    }
  };

  const getTierSeating = () => {
    const tierInfo = PATRON_TIERS.find((t) => t.id === formData.tier);
    return tierInfo ? tierInfo.seatingDefault : 'Reserved Seating Granted • Main Sanctuary Nave';
  };

  return (
    <section id="rsvp-portal" className="w-full py-16 sm:py-20 lg:py-28 px-3 sm:px-6 lg:px-12 bg-[#101412] relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Decorative Ambient Halo Behind Flyer */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#8b0014]/20 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute left-6 bottom-10 w-64 sm:w-80 h-64 sm:h-80 bg-[#af8d11]/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#af8d11]/20 text-[#e9c349] border border-[#e9c349]/30 mb-2.5 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#e9c349]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em]">
              Sing Unto God for Christ is Born • Free RSVP
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#dfe4de] leading-tight px-1">
            Confirm Your RSVP & Claim Your <br />
            <span className="text-[#e9c349] italic font-serif">
              Personalized Concert Brag Pass
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#e2bebc] mt-2 sm:mt-3 leading-relaxed px-2">
            Upload your portrait photo and enter your name to generate your official, customized illuminated keepsake brag flyer for{' '}
            <strong className="text-[#e9c349]">Christ the King Parish, Nacho, Bamenda</strong>.
          </p>
        </div>

        {/* Two-Column Interactive RSVP & Live Generator Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left: Interactive Form with Photo Upload */}
          <div className="lg:col-span-6 bg-[#1c211e] rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl flex flex-col justify-between border border-[#e9c349]/20">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#313632] mb-5">
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#dfe4de] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#e9c349] flex-shrink-0" />
                  <span>Patron Registration</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#e9c349] uppercase tracking-wider bg-[#0a0f0c] px-2.5 py-1 rounded border border-[#e9c349]/20 flex-shrink-0">
                  Step 1 of 1
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
                {/* Attendee Photo Upload Block */}
                <div className="bg-[#181d1a] p-3.5 sm:p-5 rounded-lg border border-[#e9c349]/25">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] sm:text-xs font-bold text-[#e9c349] uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#e9c349]" />
                      <span>Upload Your Photo / Portrait</span>
                      <span className="text-[#e9c349]">*</span>
                    </label>
                    {uploadedFileName && (
                      <span className="text-[9px] text-[#a3d0be] font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#e9c349]" />
                        <span>Live on Flyer</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#e2bebc] mb-3 leading-relaxed">
                    Upload your portrait photo (PNG, JPG, WebP). Your picture will be embossed instantly onto your official Concert Brag Flyer.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
                    {/* Preview Thumbnail */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#e9c349] overflow-hidden bg-[#313632] flex-shrink-0 flex items-center justify-center shadow-[0_0_14px_rgba(233,195,73,0.35)]">
                      {isProcessingPhoto ? (
                        <div className="flex flex-col items-center justify-center text-[#e9c349] text-[9px] p-1 text-center">
                          <Loader2 className="w-5 h-5 animate-spin mb-0.5" />
                          <span>Applying...</span>
                        </div>
                      ) : (
                        <img
                          key={formData.photoUrl}
                          src={formData.photoUrl}
                          alt="Patron portrait thumbnail preview"
                          className="w-full h-full object-cover transition-opacity duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = INITIAL_PATRON.photoUrl;
                          }}
                        />
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-[#0a0f0c]/90 text-[8px] text-[#e9c349] text-center py-0.5 font-bold uppercase tracking-wider">
                        Photo
                      </div>
                    </div>

                    {/* Upload Control / Dropzone Area */}
                    <div className="flex-grow w-full">
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            processImageFile(file);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }
                        }}
                        className={`flex flex-col items-center justify-center w-full px-3 py-2.5 sm:py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all group min-h-[52px] select-none ${
                          isDragging
                            ? 'border-[#e9c349] bg-[#e9c349]/15 shadow-[0_0_20px_rgba(233,195,73,0.3)]'
                            : 'border-[#e9c349]/40 hover:border-[#e9c349] bg-[#0a0f0c] hover:bg-[#181d1a]'
                        }`}
                      >
                        {isProcessingPhoto ? (
                          <div className="flex items-center gap-2 text-[#e9c349]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                              Processing & Embossing Photo...
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-[#e9c349] group-hover:text-[#ffe088]">
                              <Camera className="w-4 h-4" />
                              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                                {uploadedFileName ? 'Choose Different Photo' : 'Choose Portrait Photo'}
                              </span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-[#e2bebc] mt-0.5 text-center px-1">
                              {uploadedFileName
                                ? `${uploadedFileName} (Click or Drop to replace)`
                                : 'Click to browse or drag & drop photo (PNG, JPG, WebP up to 25MB)'}
                            </span>
                          </>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        id="photo-upload-input"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        onClick={(e) => {
                          (e.target as HTMLInputElement).value = '';
                        }}
                      />

                      {/* Photo Error Banner */}
                      {photoError && (
                        <div className="mt-2 p-2 rounded bg-[#8b0014]/40 border border-[#8b0014] text-[#ff908a] text-[11px] flex items-center gap-1.5 animate-fadeIn">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{photoError}</span>
                        </div>
                      )}

                      {/* Photo Confirmation & Reset */}
                      {uploadedFileName && !photoError && (
                        <div className="mt-2 flex items-center justify-between text-[10px] text-[#a3d0be] bg-[#0a0f0c] px-2.5 py-1 rounded border border-[#a3d0be]/20">
                          <span className="flex items-center gap-1 truncate">
                            <CheckCircle2 className="w-3 h-3 text-[#e9c349] flex-shrink-0" />
                            <span className="truncate">Photo successfully applied to flyer card!</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFileName(null);
                              const updated = { ...formData, photoUrl: INITIAL_PATRON.photoUrl };
                              setFormData(updated);
                              onPassConfirmed?.(updated);
                              onPassChange?.(updated);
                              triggerPassPulse();
                            }}
                            className="text-[9px] text-[#e2bebc] hover:text-[#e9c349] underline ml-2 flex-shrink-0"
                          >
                            Reset photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Preset Selector for instant testing */}
                  <div className="mt-3 pt-2.5 border-t border-[#313632]/60">
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#e2bebc] uppercase tracking-wider block mb-1.5">
                      Or Select 3D Character Preset:
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {SAMPLE_AVATARS.map((av) => (
                        <button
                          key={av.name}
                          type="button"
                          onClick={() => handleSelectPresetAvatar(av.url, av.name)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] transition-all border cursor-pointer ${
                            formData.fullName === av.name
                              ? 'bg-[#e9c349]/20 border-[#e9c349] text-[#e9c349] font-bold shadow-[0_0_10px_rgba(233,195,73,0.25)]'
                              : 'bg-[#0a0f0c] border-[#313632] text-[#dfe4de] hover:border-[#e9c349]/40'
                          }`}
                        >
                          <img
                            src={av.url}
                            alt={av.name}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-[#e9c349]/40 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span>{av.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full Name Field (Live sync to pass) */}
                <div>
                  <label
                    htmlFor="rsvp-name"
                    className="block text-[11px] sm:text-xs font-bold text-[#dfe4de] uppercase tracking-wider mb-1"
                  >
                    Full Name / Attendee Name <span className="text-[#e9c349]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => {
                        const updated = { ...formData, fullName: e.target.value };
                        setFormData(updated);
                        onPassChange?.(updated);
                        triggerPassPulse();
                      }}
                      placeholder="e.g. Dr. Eleanor Vance"
                      className="w-full bg-[#0a0f0c] text-[#dfe4de] px-3.5 py-2.5 sm:py-2.5 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#e9c349] placeholder:text-[#e2bebc]/40 border border-[#e9c349]/30 min-h-[44px]"
                    />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#e2bebc] mt-1">
                    This exact name will be custom gold-embossed on your brag flyer.
                  </p>
                </div>

                {/* Two Col: Tier & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Patron Tier */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#dfe4de] uppercase tracking-wider mb-1">
                      Patron Tier
                    </label>
                    <div className="relative">
                      <select
                        value={formData.tier}
                        onChange={(e) => {
                          const newTier = e.target.value as PatronTier;
                          const tierInfo = PATRON_TIERS.find((t) => t.id === newTier);
                          const updated = {
                            ...formData,
                            tier: newTier,
                            seatingZone: tierInfo ? tierInfo.seatingDefault : formData.seatingZone,
                          };
                          setFormData(updated);
                          onPassChange?.(updated);
                          triggerPassPulse();
                        }}
                        className="w-full bg-[#0a0f0c] text-[#dfe4de] px-3.5 py-2.5 rounded-lg text-base sm:text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-[#e9c349] border border-[#e9c349]/30 min-h-[44px]"
                      >
                        <option value="General Admission (Free)">General Admission (Free)</option>
                        <option value="VIP Benefactor (Reserved)">VIP Benefactor (Reserved)</option>
                        <option value="Clergy Guest (Honorary)">Clergy Guest (Honorary)</option>
                        <option value="Choir Patron">Choir Patron</option>
                        <option value="Choir Alumni">Choir Alumni</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#e9c349] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Reserved Seats Count */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#dfe4de] uppercase tracking-wider mb-1">
                      Reserved Seats
                    </label>
                    <div className="relative">
                      <select
                        value={formData.guestCount}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            guestCount: parseInt(e.target.value, 10),
                          }));
                        }}
                        className="w-full bg-[#0a0f0c] text-[#dfe4de] px-3.5 py-2.5 rounded-lg text-base sm:text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-[#e9c349] border border-[#e9c349]/30 min-h-[44px]"
                      >
                        <option value={1}>1 Seat (Single Patron)</option>
                        <option value={2}>2 Seats (Patron + Companion)</option>
                        <option value={3}>3 Seats (Small Family)</option>
                        <option value={4}>4 Seats (Family Pew)</option>
                        <option value={5}>5 Seats (Parish Delegation)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#e9c349] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#dfe4de] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="e.vance@cameroon-health.org"
                      className="w-full bg-[#0a0f0c] text-[#dfe4de] px-3.5 py-2.5 sm:py-2 rounded-lg text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#e9c349] border border-[#313632] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#dfe4de] uppercase tracking-wider mb-1">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="675360863 or 672668334"
                      className="w-full bg-[#0a0f0c] text-[#dfe4de] px-3.5 py-2.5 sm:py-2 rounded-lg text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#e9c349] border border-[#313632] min-h-[44px]"
                    />
                    <p className="text-[10px] text-[#e2bebc] mt-1">
                      Inquiries? Chat via WhatsApp:{' '}
                      <a
                        href="https://wa.me/237672668334?text=Hello%20St.%20Cletus%20Choir%2C%20I%20have%20an%20inquiry%20regarding%20the%20Sing%20Unto%20God%20Christmas%20Concert%20at%20Christ%20the%20King%20Parish"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#e9c349] font-bold hover:underline"
                      >
                        +237 672 668 334
                      </a>{' '}
                      or call 675360863
                    </p>
                  </div>
                </div>

                {/* Optional Prayer Intention */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#e2bebc] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#e9c349]" />
                    <span>Special Seating or Prayer Intention (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.prayerIntentions}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, prayerIntentions: e.target.value }))
                    }
                    placeholder="e.g. Prayer intention for peace in Bamenda"
                    className="w-full bg-[#0a0f0c] text-[#dfe4de] px-3.5 py-2.5 sm:py-2 rounded-lg text-base sm:text-xs focus:outline-none focus:ring-1 focus:ring-[#e9c349] border border-[#313632] min-h-[44px]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#e9c349] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-lg shadow-[0_0_24px_rgba(233,195,73,0.35)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Confirm RSVP & Update Brag Pass</span>
                </button>
              </form>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#313632]/50 flex items-center justify-between text-[#e2bebc] text-[11px] sm:text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#e9c349]" />
                  <span>Encrypted Parish Registry</span>
                </span>
                {onOpenSyncModal && (
                  <button
                    type="button"
                    onClick={onOpenSyncModal}
                    className="text-[#e9c349] hover:underline font-semibold ml-2 text-[10px] sm:text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>(Google Sheet Diagnostics)</span>
                  </button>
                )}
              </div>
              <span className="text-[#e9c349] font-semibold">100% Free Admission</span>
            </div>
          </div>

          {/* Right: Live Dynamic Flyer Render */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#262b28] rounded-xl p-3.5 sm:p-6 lg:p-7 shadow-2xl border border-[#e9c349]/25">
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e9c349] animate-ping" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#e9c349] uppercase tracking-widest">
                  Live Dynamic Flyer Render
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#a3d0be]">
                ID: {formData.passCode}
              </span>
            </div>

            {/* THE SACRED BRAG PASS GRAPHIC CARD (Render Target) */}
            <div
              ref={flyerCardRef}
              id="brag-pass-card"
              className={`relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#8b0014] via-[#0a0f0c] to-[#0a0f0c] shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-[#dfe4de] p-3.5 sm:p-6 lg:p-7 flex flex-col justify-between my-auto border-2 border-[#e9c349]/40 transition-all duration-300 ${
                isPassPulsing ? 'scale-[1.01] border-[#e9c349] shadow-[0_0_30px_rgba(233,195,73,0.4)]' : ''
              }`}
            >
              {/* Ornate Outer Gold Halo */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e9c349]/15 via-transparent to-transparent pointer-events-none" />

              {/* Top Header & Parish Seal Bar */}
              <div className="relative z-10 flex items-start justify-between border-b border-[#e9c349]/30 pb-2.5 sm:pb-3 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-[#0a0f0c]/90 flex items-center justify-center shadow-lg text-[#e9c349] border border-[#e9c349]/40 flex-shrink-0">
                    <Church className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#e9c349] tracking-widest uppercase block leading-none mb-1 truncate">
                      Official RSVP Concert Flyer • 2026
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#dfe4de] tracking-wide leading-tight truncate">
                      St Cletus Choir
                    </h4>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    id="flyer-tier-badge"
                    className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${getTierColorStyle()}`}
                  >
                    {formData.tier}
                  </span>
                </div>
              </div>

              {/* Concert Theme Banner on Flyer */}
              <div className="relative z-10 text-center mt-2.5 sm:mt-3 mb-2 px-2.5 py-1 sm:py-1.5 rounded bg-[#0a0f0c]/80 border border-[#e9c349]/20 shadow-inner">
                <span className="text-[8px] sm:text-[9px] font-bold text-[#e9c349]/80 tracking-widest uppercase block">
                  Concert Theme
                </span>
                <span className="font-serif text-sm sm:text-lg lg:text-xl text-[#e9c349] font-bold italic tracking-wide block truncate">
                  “Sing Unto God for Christ is Born”
                </span>
              </div>

              {/* Center Dynamic Patron Spotlight with Photo Frame */}
              <div className="relative z-10 my-2 sm:my-3 py-3 sm:py-4 bg-[#0a0f0c]/70 rounded-lg px-2.5 sm:px-4 backdrop-blur-sm text-center border border-[#e9c349]/20">
                {/* Attendee Photo Display Frame */}
                <div className="relative mx-auto mb-2 sm:mb-3 w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#e9c349] via-[#ffe088] to-[#e9c349] shadow-[0_0_24px_rgba(233,195,73,0.45)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#313632] relative">
                    <img
                      key={formData.photoUrl}
                      src={formData.photoUrl}
                      alt="Patron attendee portrait on brag pass"
                      crossOrigin="anonymous"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isProcessingPhoto ? 'opacity-40 scale-105' : 'opacity-100 scale-100'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = INITIAL_PATRON.photoUrl;
                      }}
                    />
                    {isProcessingPhoto && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[#e9c349]">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#8b0014] border-2 border-[#e9c349] flex items-center justify-center text-[#e9c349] shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold text-[#e9c349] uppercase tracking-[0.2em] sm:tracking-[0.25em] block mb-0.5">
                  Honored Patron Attendee
                </span>
                <div className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#e9c349] drop-shadow-md my-0.5 truncate px-1">
                  {formData.fullName || 'Honored Parish Guest'}
                </div>
                <p className="text-[11px] sm:text-xs text-[#e2bebc] mt-0.5">
                  {getTierSeating()}
                </p>

                {/* Venue Notice in Card */}
                <div className="inline-flex items-center gap-1.5 text-[#e9c349] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1.5 sm:mt-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#1f4a3c]/70 border border-[#e9c349]/20 max-w-full">
                  <Church className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Christ the King Parish, Nacho, Bamenda</span>
                </div>

                {/* Garland / Ribbon Motif divider */}
                <div className="flex items-center justify-center gap-2 my-2 sm:my-2.5 text-[#e9c349]">
                  <span className="h-px w-6 sm:w-10 bg-[#e9c349]/40" />
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">
                    Christmas Concert
                  </span>
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="h-px w-6 sm:w-10 bg-[#e9c349]/40" />
                </div>

                {/* Date, Time, Venue Details in Pass */}
                <div className="grid grid-cols-2 gap-2 text-left bg-[#1c211e]/80 p-2 sm:p-2.5 rounded border border-[#e9c349]/15">
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#e9c349] uppercase block flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      Event Date
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#dfe4de] block truncate">
                      Sun, Dec 27, 2026
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#e9c349] uppercase block flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Curtain Call
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#dfe4de] block truncate">
                      1:00 PM WAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Pass Stub with QR Code & Barcode */}
              <div className="relative z-10 pt-2 flex items-center justify-between border-t border-[#e9c349]/25 text-[9px] sm:text-[10px] text-[#e2bebc]">
                <div className="flex items-center gap-2 min-w-0">
                  <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-[#e9c349] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[#e9c349] font-mono font-bold block truncate">
                      {formData.passCode}
                    </span>
                    <span className="truncate block">
                      {formData.guestCount} {formData.guestCount === 1 ? 'Guest' : 'Guests'} Reserved
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-1">
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#e9c349]/80 block">
                    ||| | |||| | |||
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-[#a3d0be]">SANCTUARY ACCESS</span>
                </div>
              </div>
            </div>

            {/* Flyer Actions & Social Media Share Suite */}
            <div className="mt-4 sm:mt-5 flex flex-col gap-3">
              {/* Primary action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadFlyer}
                  disabled={isDownloading}
                  className="py-3 sm:py-2.5 px-4 bg-[#e9c349] text-[#3c2f00] rounded-lg text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 hover:bg-[#ffe088] transition-all shadow-md cursor-pointer disabled:opacity-50 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generating...' : 'Download Pass (PNG)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectShareFlyer()}
                  disabled={isDownloading}
                  className="py-3 sm:py-2.5 px-4 bg-gradient-to-r from-[#8b0014] to-[#a00018] hover:from-[#a00018] hover:to-[#b4262c] text-[#dfe4de] rounded-lg text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all border border-[#e9c349]/50 shadow-[0_0_15px_rgba(139,0,20,0.35)] cursor-pointer min-h-[44px]"
                >
                  <Share2 className="w-4 h-4 text-[#e9c349]" />
                  <span>Share Flyer (Image + Text)</span>
                </button>
              </div>

              {/* Direct 1-Click Social Media Sharing Buttons */}
              <div className="bg-[#181d1a] p-3 rounded-xl border border-[#e9c349]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#e9c349] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#e9c349]" />
                    <span>Send Actual Flyer To:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="text-[10px] text-[#e9c349] hover:underline cursor-pointer font-semibold"
                  >
                    More Options →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleDirectShareFlyer('whatsapp')}
                    disabled={isDownloading}
                    className="py-2.5 px-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[38px] disabled:opacity-50"
                    title="Share actual flyer to WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleDirectShareFlyer('facebook')}
                    disabled={isDownloading}
                    className="py-2.5 px-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer min-h-[38px] disabled:opacity-50"
                    title="Share to Facebook"
                  >
                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    type="button"
                    onClick={() => handleDirectShareFlyer('twitter')}
                    disabled={isDownloading}
                    className="py-2.5 px-2 bg-black hover:bg-neutral-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 border border-neutral-700 cursor-pointer min-h-[38px] disabled:opacity-50"
                    title="Share to Twitter / X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter (X)</span>
                  </button>
                </div>
              </div>

              {/* Copy link & Status badge */}
              <div className="flex items-center justify-between text-[#e2bebc] text-xs px-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 hover:text-[#e9c349] transition-colors cursor-pointer py-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Personal Brag Link'}</span>
                </button>
                <span className="text-[10px] sm:text-[11px] text-[#e9c349]/80 hidden xs:inline">
                  WhatsApp & Story Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 bg-[#1c211e] border-2 border-[#e9c349] text-[#dfe4de] p-3.5 sm:p-4 rounded-xl shadow-2xl flex items-start gap-3 sm:max-w-sm animate-bounce">
          <div className="w-8 h-8 rounded-full bg-[#e9c349] text-[#3c2f00] flex items-center justify-center flex-shrink-0 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#e9c349]">
              Peace be with you, {formData.fullName}!
            </h4>
            <p className="text-[11px] sm:text-xs text-[#e2bebc] mt-0.5">
              Your free seat at Christ the King Parish is confirmed, and your personalized photo brag pass has been generated!
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessToast(false);
                setShowShareModal(true);
              }}
              className="mt-2 text-xs font-bold text-[#e9c349] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Pass to WhatsApp & Socials Now →</span>
            </button>
          </div>
        </div>
      )}

      {/* Social Media Sharing Modal Component */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        patron={formData}
        onDownloadImage={handleDownloadFlyer}
        getFlyerFile={getFlyerFile}
      />
    </section>
  );
};
