/**
 * Кодирует ImageData в GB7 формат.
 * @param image Объект ImageData.
 * @returns ArrayBuffer, содержащий данные в формате GB7.
 */
export function encodeGB7(image: ImageData): ArrayBuffer {
  const { width, height, data } = image;
  const hasMask = true; 
  const headerSize = 12;
  const buffer = new ArrayBuffer(headerSize + width * height);
  const view = new DataView(buffer);
  view.setUint8(0, 0x47); // G
  view.setUint8(1, 0x42); // B
  view.setUint8(2, 0x37); // 7
  view.setUint8(3, 0x1d);
  view.setUint8(4, 0x01); // версия 
  view.setUint8(5, hasMask ? 1 : 0); 
  view.setUint16(6, width, false); // смещение 6, 6 и 7 - ширина
  view.setUint16(8, height, false); // смещение 8, 8 и 9 - высота
  view.setUint16(10, 0, false); // зарезервировано

  let offset = headerSize; // начало пиксельных данных
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    // RGBA в 7-битный серый + маска
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    const gray7 = Math.max(0, Math.min(127, Math.round((gray / 255) * 127)));
    const mask = a > 128 ? 1 : 0;
    const byte = (mask << 7) | gray7;
    view.setUint8(offset++, byte);
  }
  return buffer;
}
