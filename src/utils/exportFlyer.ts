// Draw the decoded portrait directly. A DOM snapshot can omit nested photos
// when WebKit rasterizes an HTML foreignObject for a PNG.
export async function exportFlyerPng(card: HTMLElement): Promise<string> {
  const photo = card.querySelector('img');
  if (!photo) throw new Error('The flyer portrait is missing.');
  await Promise.all([document.fonts.ready, photo.decode()]);
  if (!photo.naturalWidth || !photo.naturalHeight) throw new Error('The portrait could not be decoded.');

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('The flyer could not be rendered.');

  const artwork = card.querySelector('svg');
  const photoHeight = artwork ? canvas.height * 0.8 : canvas.height;
  const scale = Math.max(canvas.width / photo.naturalWidth, photoHeight / photo.naturalHeight);
  const cropHeight = photoHeight / scale;
  const cropWidth = canvas.width / scale;
  ctx.fillStyle = '#370511';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(photo, (photo.naturalWidth - cropWidth) / 2,
    (photo.naturalHeight - cropHeight) * (artwork ? 0.32 : 0.5),
    cropWidth, cropHeight, 0, 0, canvas.width, photoHeight);

  if (artwork) {
    const svg = artwork.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('width', String(canvas.width));
    svg.setAttribute('height', String(canvas.height));
    const overlay = new Image();
    overlay.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    await overlay.decode();
    ctx.drawImage(overlay, 0, 0);
  }

  const name = card.querySelector<HTMLElement>('[data-flyer-name]');
  if (name?.firstChild && name.textContent) drawGuestName(ctx, card, name);
  return canvas.toDataURL('image/png');
}

function drawGuestName(ctx: CanvasRenderingContext2D, card: HTMLElement, label: HTMLElement) {
  const box = card.getBoundingClientRect();
  const badge = label.getBoundingClientRect();
  const style = getComputedStyle(label);
  const x = badge.left - box.left;
  const y = badge.top - box.top;
  ctx.scale(ctx.canvas.width / box.width, ctx.canvas.height / box.height);
  ctx.fillStyle = 'rgba(57, 8, 20, 0.9)';
  ctx.fillRect(x, y, badge.width, badge.height);
  ctx.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
  ctx.fillStyle = '#fff3dc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Use the preview's actual line breaks, including long names and emojis.
  const text = label.firstChild!;
  const lines = new Map<number, string>();
  const range = document.createRange();
  let offset = 0;
  for (const character of label.textContent!) {
    range.setStart(text, offset);
    offset += character.length;
    range.setEnd(text, offset);
    const rect = range.getBoundingClientRect();
    const middle = Math.round(rect.top + rect.height / 2 - box.top);
    lines.set(middle, (lines.get(middle) ?? '') + character);
  }
  for (const [middle, line] of lines) ctx.fillText(line.trim(), x + badge.width / 2, middle);
}
