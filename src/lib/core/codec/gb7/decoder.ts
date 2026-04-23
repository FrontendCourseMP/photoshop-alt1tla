import type { ImageInfo } from "$lib/core/types";

const SIGNATURE = [0x47, 0x42, 0x37, 0x1d]; // "GB7" + 0x1d
const VERSION = 0x01; // Версия формата GB7
const EMPTY = {
  name: "",
  width: 0,
  height: 0,
  depth: 0,
  hasMask: false,
};

/**
 * Извлекает метаданные из файла GB7 и сохраняет их в хранилище `imageInfo`.
 * @param file Файл изображения в формате GB7.
 */
export async function extractGB7Meta(file: File): Promise<ImageInfo> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);

  // Проверка сигнатуры
  const signature =
    view.getUint8(0) === SIGNATURE[0] && // G
    view.getUint8(1) === SIGNATURE[1] && // B
    view.getUint8(2) === SIGNATURE[2] && // 7
    view.getUint8(3) === SIGNATURE[3]; // 0x1d
  if (!signature) return EMPTY;

  // Проверка версии
  const version = view.getUint8(4) === VERSION;
  if (!version) return EMPTY;

  const flag = view.getUint8(5);
  const width = view.getUint16(6, false);
  const height = view.getUint16(8, false);
  const hasMask = (flag & 0b00000001) === 1;
  const depth = hasMask ? 8 : 7;
  const pixels = new Uint8ClampedArray(width * height * 4);
  let offset = 12; // начало пиксельных данных
  for (let i = 0; i < width * height; i++) {
    const byte = view.getUint8(offset++);
    const gray7 = byte & 0b01111111; // 7 бит
    const mask = (byte & 0b10000000) >> 7;
    // масштабируем 0–127 → 0–255
    const gray8 = Math.round((gray7 / 127) * 255);
    // Заполняем RGBA
    const idx = i * 4;
    pixels[idx] = gray8; // R
    pixels[idx + 1] = gray8; // G
    pixels[idx + 2] = gray8; // B
    if (hasMask) {
      pixels[idx + 3] = mask ? 255 : 0;
    } else {
      pixels[idx + 3] = 255;
    }
  }
  const data = new ImageData(pixels, width, height);
  return {
    name: file.name,
    data: data,
    width: width,
    height: height,
    depth: depth,
    hasMask: hasMask,
  };
}
