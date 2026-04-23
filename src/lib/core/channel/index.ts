import type { ChannelView } from "$lib/core/types";
/** Генерирует `ImageData` для миниатюры */
export function extractChannelPreview(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  channel: ChannelView,
  maxSize = 128,
): ImageData {
  const full = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    let value = 0;

    switch (channel) {
      case "red":
        value = r;
        break;
      case "green":
        value = g;
        break;
      case "blue":
        value = b;
        break;
      case "alpha":
        value = a;
        break;
      case "grayscale":
        value = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        break;
    }

    full[idx] = value;
    full[idx + 1] = value;
    full[idx + 2] = value;
    full[idx + 3] = 255;
  }

  const fullImage = new ImageData(full, width, height);

  const scale = Math.min(maxSize / width, maxSize / height, 1);

  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;

  const ctx = off.getContext("2d")!;
  ctx.putImageData(fullImage, 0, 0);

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;

  const outCtx = out.getContext("2d")!;
  outCtx.imageSmoothingEnabled = true;
  outCtx.drawImage(off, 0, 0, w, h);

  return outCtx.getImageData(0, 0, w, h);
}

/** Собирает финальное изображение с учётом активных каналов */
export function applyChannels(
  data: Uint8ClampedArray,
  channels: ChannelView[],
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data.length);

  const hasRGB =
    channels.includes("red") ||
    channels.includes("green") ||
    channels.includes("blue");

  const hasAlpha = channels.includes("alpha");
  const hasGray = channels.includes("grayscale");

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    let nr = 0,
      ng = 0,
      nb = 0;

    if (hasRGB) {
      nr = channels.includes("red") ? r : 0;
      ng = channels.includes("green") ? g : 0;
      nb = channels.includes("blue") ? b : 0;
    }

    if (hasGray && !hasRGB) {
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      nr = ng = nb = gray;
    }

    if (!hasRGB && !hasGray) {
      nr = ng = nb = 0;
    }

    out[i] = nr;
    out[i + 1] = ng;
    out[i + 2] = nb;

    out[i + 3] = hasAlpha ? a : 255;
  }

  return out;
}
