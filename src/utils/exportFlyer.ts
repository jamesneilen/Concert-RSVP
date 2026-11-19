import { getFontEmbedCSS, toPng } from 'html-to-image';

// Download and sharing must use identical fonts and layout measurements.
export async function exportFlyerPng(card: HTMLElement): Promise<string> {
  await document.fonts.ready;
  await Promise.all(Array.from(card.querySelectorAll('img')).map(async (image) => {
    await image.decode();
  }));
  const fontEmbedCSS = await getFontEmbedCSS(card, { preferredFontFormat: 'woff2' });
  return toPng(card, {
    fontEmbedCSS,
    canvasWidth: 1080,
    canvasHeight: 1350,
    pixelRatio: 1,
    style: { transform: 'none', animation: 'none', transition: 'none' },
  });
}
