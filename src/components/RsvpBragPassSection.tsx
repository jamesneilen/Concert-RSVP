import { useEffect, useRef, useState } from 'react';
import { INITIAL_PATRON, PATRON_TIERS, SAMPLE_AVATARS } from '../data/concertData';
import type { PatronPassData } from '../data/concertData';
import { submitRsvpToSpreadsheet } from '../services/rsvpRegistryService';
import { exportFlyerPng } from '../utils/exportFlyer';

export function RsvpBragPassSection({ formData, setFormData }: {
  formData: PatronPassData;
  setFormData: React.Dispatch<React.SetStateAction<PatronPassData>>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [exportAttempt, setExportAttempt] = useState(0);
  const [exportError, setExportError] = useState(false);
  const [download, setDownload] = useState<{ guest: PatronPassData; url: string; file: File } | null>(null);
  const flyerCardRef = useRef<HTMLDivElement>(null);
  const saving = useRef(false);
  const pendingCode = useRef('');
  const ready = !isProcessingPhoto && download?.guest === formData ? download : null;

  function editRegistration(fields: Partial<PatronPassData>) {
    setFormData(previous => ({ ...previous, ...fields, confirmedAt: undefined }));
    setError('');
    setNotice('');
  }

  async function confirm(event: React.FormEvent) {
    event.preventDefault();
    if (saving.current || isProcessingPhoto || formData.confirmedAt) return;
    if (!formData.fullName.trim()) {
      setError('Enter your name to confirm your RSVP.');
      document.getElementById('rsvp-name')?.focus();
      return;
    }
    saving.current = true;
    setIsSubmitting(true);
    setError('');
    try {
      pendingCode.current ||= 'CK-2026-' + crypto.randomUUID().slice(0, 8).toUpperCase();
      const guest = { ...formData, fullName: formData.fullName.trim(), passCode: pendingCode.current, confirmedAt: new Date().toISOString() };
      await submitRsvpToSpreadsheet(guest);
      setFormData(guest);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your RSVP could not be saved. Please try again.');
    } finally {
      saving.current = false;
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    setDownload(null);
    setExportError(false);
    setNotice('');
    const card = flyerCardRef.current;
    if (!card || !formData.confirmedAt || isProcessingPhoto) return;
    let cancelled = false;
    let url = '';
    async function prepare(element: HTMLDivElement) {
      const png = await exportFlyerPng(element);
      if (cancelled) return;
      const blob = await (await fetch(png)).blob();
      if (cancelled) return;
      const file = new File([blob], 'St_Cletus_' + formData.fullName.replace(/[^\p{L}\p{N}-]+/gu, '_') + '.png', { type: 'image/png' });
      url = URL.createObjectURL(file);
      setDownload({ guest: formData, url, file });
    }
    prepare(card).catch(() => { if (!cancelled) setExportError(true); });
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [formData, exportAttempt, isProcessingPhoto]);

  async function share() {
    if (!ready) return;
    try {
      await navigator.share({ files: [ready.file], title: 'St. Cletus Choir Christmas Concert', text: 'I will be there! Sunday, 27 December at 1:00 PM in Nacho, Bamenda.' });
    } catch (reason) {
      if (!(reason instanceof Error && reason.name === 'AbortError')) setNotice('Use Download flyer to save the image and share it.');
    }
  }
  const processImageFile = (file: File) => {
    if (saving.current || isProcessingPhoto) return;
    setPhotoError(null);

    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|bmp|heic|svg)$/i.test(file.name)) {
      setPhotoError('Choose an image file for your flyer.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setPhotoError('Choose a photo smaller than 25 MB.');
      return;
    }
    setIsProcessingPhoto(true);

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

      // Resize the full portrait before placing it on the flyer
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const scale = Math.min(1, 1440 / Math.max(img.width, img.height));
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          const photoUrl = ctx ? canvas.toDataURL('image/jpeg', 0.92) : rawDataUrl;
          setFormData(previous => ({ ...previous, photoUrl }));
        } catch {
          setFormData(previous => ({ ...previous, photoUrl: rawDataUrl }));
        } finally {
          setIsProcessingPhoto(false);
        }
      };

      img.onerror = () => {
        setPhotoError("This image could not be decoded. Please choose a JPG, PNG, or WebP photo.");
        setIsProcessingPhoto(false);
        return;

      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  return <section id="rsvp-portal" className="concert-rsvp py-16 sm:py-20 lg:py-28 px-3 sm:px-6 lg:px-12">
    <div className="max-w-7xl mx-auto">
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold">Your concert RSVP</h2>
      <p className="intro">Confirm your attendance and create your personal “I will be there” flyer.</p>
      <div className="registration">
        <form id="concert-registration" onSubmit={confirm} onInvalidCapture={event => {
          const details = (event.target as HTMLElement).closest('details');
          if (details) details.open = true;
        }}>
          <fieldset disabled={isSubmitting}>
            <legend className="font-serif text-2xl font-semibold mb-5 text-[#e9c349]">Reserve your seats</legend>
            <label htmlFor="rsvp-name">Full name</label>
            <input id="rsvp-name" autoComplete="name" required maxLength={120} value={formData.fullName} onChange={e => editRegistration({ fullName: e.target.value })} />
            <div className="fields">
              <div><label htmlFor="rsvp-seats">Seats</label><select id="rsvp-seats" value={formData.guestCount} onChange={e => editRegistration({ guestCount: Number(e.target.value) })}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              <div><label htmlFor="rsvp-tier">Admission</label><select id="rsvp-tier" value={formData.tier} onChange={e => {
                const tier = PATRON_TIERS.find(item => item.id === e.target.value);
                if (tier) editRegistration({ tier: tier.id, seatingZone: tier.seatingDefault });
              }}>{PATRON_TIERS.map(t => <option key={t.id}>{t.label}</option>)}</select></div>
            </div>
            <label htmlFor="portrait">Flyer photo <small>(optional)</small></label>
            <input id="portrait" type="file" accept="image/*" disabled={isProcessingPhoto} onChange={e => { const file = e.target.files?.[0]; if (file) processImageFile(file); e.target.value = ''; }} />
            {isProcessingPhoto && <p role="status">Preparing photo…</p>}
            {photoError && <p role="alert">{photoError}</p>}
            <details className="form-details"><summary>Choose a sample portrait</summary><div className="portraits">
              {SAMPLE_AVATARS.map(avatar => <button type="button" key={avatar.url} disabled={isProcessingPhoto} aria-label={avatar.name} aria-pressed={avatar.url === formData.photoUrl} onClick={() => {
                setPhotoError(null);
                setFormData(previous => ({...previous, photoUrl: avatar.url}));
              }}><img src={avatar.url} alt="" loading="lazy" /></button>)}
            </div></details>
            <details className="form-details"><summary>Contact details and special requests <small>(optional)</small></summary>
              <label>Email<input type="email" autoComplete="email" value={formData.email} onChange={e => editRegistration({email:e.target.value})} /></label>
              <label>WhatsApp or phone<input type="tel" autoComplete="tel" value={formData.phone} onChange={e => editRegistration({phone:e.target.value})} /></label>
              <label>Seating request or prayer intention<input value={formData.prayerIntentions ?? ''} onChange={e => editRegistration({prayerIntentions:e.target.value})} /></label>
            </details>
            <button className="action red" type="submit" disabled={!!formData.confirmedAt || isSubmitting || isProcessingPhoto}>
              {isSubmitting ? 'Saving your RSVP…' : formData.confirmedAt ? 'RSVP confirmed' : 'I will be there — confirm RSVP'}
            </button>
            {error && <p role="alert">{error}</p>}
            {formData.confirmedAt && <p role="status">Confirmed for {formData.guestCount} {formData.guestCount === 1 ? 'guest' : 'guests'} · {formData.passCode}</p>}
          </fieldset>
        </form>
        <div className="flyer">
            <div ref={flyerCardRef} id="brag-pass-card"
              className="relative mx-auto w-full overflow-hidden bg-[#370511]"
              style={{ aspectRatio: '4 / 5', maxWidth: 560 }}>
              {formData.photoUrl === INITIAL_PATRON.photoUrl ? (
                <img src="/assets/choir-rsvp-2026.webp" alt="St. Cletus Choir Christmas Concert. I will be there! Sunday, 27 December 2026 at 1:00 PM, Christ the King Parish, Mankon, Nacho, Bamenda."
                  className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <img src={formData.photoUrl} alt="Concert guest portrait" crossOrigin="anonymous"
                    className="absolute inset-x-0 top-0 h-[80%] w-full object-cover"
                    style={{ objectPosition: '50% 32%' }}
                    onError={(event) => {
                      if (event.currentTarget.getAttribute('src') !== INITIAL_PATRON.photoUrl)
                        event.currentTarget.src = INITIAL_PATRON.photoUrl;
                    }} />
                  <svg viewBox="0 0 800 1000" className="absolute inset-0 h-full w-full"
                    role="img" aria-label="St. Cletus Choir Christmas Concert RSVP flyer"
                    fontFamily="Arial, Helvetica, sans-serif" fill="#fff3dc">
                    <defs>
                      <linearGradient id="concert-shade" x2="0" y2="1" gradientUnits="objectBoundingBox">
                        <stop stopColor="#28000c" stopOpacity=".48" />
                        <stop offset=".23" stopColor="#590e1e" stopOpacity=".06" />
                        <stop offset=".48" stopColor="#590e1e" stopOpacity=".10" />
                        <stop offset=".78" stopColor="#23050d" />
                        <stop offset="1" stopColor="#110508" />
                      </linearGradient>
                    </defs>
                    <rect width="800" height="1000" fill="url(#concert-shade)" />
                    <g textAnchor="end" style={{ textShadow: '0 1px 5px #310811' }}>
                      <text x="770" y="55" fontSize="30" fontWeight="900">ST. CLETUS CHOIR</text>
                      <text x="770" y="85" fontSize="26" fontStyle="italic">Christmas Concert</text>
                    </g>
                    <rect x="30" y="303" width="162" height="204" rx="16" fill="#680b24" />
                    <g textAnchor="middle" fontWeight="900">
                      <text x="111" y="352" fontSize="45">SUN</text>
                      <text x="111" y="405" fontSize="40">27 DEC</text>
                      <text x="111" y="448" fontSize="40">2026</text>
                      <text x="111" y="488" fontSize="32">1:00 PM</text>
                    </g>
                    <g textAnchor="middle">
                      <text x="400" y="707" fill="#e6b345" fontWeight="1000" fontSize="143" letterSpacing="-6">I WILL</text>
                      <text x="400" y="815" fontWeight="1000" fontSize="119" letterSpacing="-5" textLength="720" lengthAdjust="spacingAndGlyphs">BE THERE!</text>
                      <text x="400" y="860" fill="#e6b345" fontStyle="italic" fontWeight="700" fontSize="36">Sing Unto God for Christ is Born</text>
                      <rect x="87" y="888" width="626" height="88" fill="none" stroke="#fff3dc" strokeWidth="2" />
                      <text x="400" y="926" fontSize="29" fontWeight="700">Christ the King Parish, Mankon</text>
                      <text x="400" y="961" fontSize="27">Nacho, Bamenda</text>
                    </g>
                  </svg>
                </>
              )}
              {formData.fullName.trim() && (
                <div className="absolute inset-x-[6%] bottom-[40%] text-center">
                  <span className="inline-block max-w-full break-words rounded bg-[#390814]/90 px-2 py-0.5 font-semibold text-[#fff3dc]">
                    {formData.fullName}
                  </span>
                </div>
              )}
            </div>
          <div className="flyer-tools" aria-live="polite">
            {!formData.confirmedAt ? <p>Confirm your RSVP to download or share this flyer.</p> :
              ready ? <>
                <a className="action red" href={ready.url} download={ready.file.name}>Download flyer</a>
                {typeof navigator.canShare === 'function' && navigator.canShare({ files: [ready.file] }) && <button className="action outline" type="button" onClick={share}>Share flyer</button>}
              </> : exportError ? <><p>Your RSVP is saved. The flyer could not be prepared.</p><button className="text-link" onClick={() => setExportAttempt(n => n+1)}>Retry flyer</button></> : <p>Preparing your flyer…</p>}
            {notice && <p>{notice}</p>}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
