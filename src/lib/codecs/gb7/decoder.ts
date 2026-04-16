/**
 * Декодирует изображение в формате GB7 в объект ImageData.
 * @param file - Файл изображения в формате GB7. 
 * @returns Объект `ImageData`, представляющий декодированное изображение.
 */
export async function decodeGB7(file: File): Promise<ImageData> {
  const buffer = await file.arrayBuffer(); 
  const view = new DataView(buffer);
  const flag = view.getUint8(5); 
  const width = view.getUint16(6, false); // смещение 6, 6 и 7 - ширина
  const height = view.getUint16(8, false); // смещение 8, 8 и 9 - высота
  const hasMask = (flag & 1) === 1; 
  const pixels = new Uint8ClampedArray(width * height * 4); // canvas требует RGBA, даже если у нас 7 бит + маска
  let offset = 12; // начало пиксельных данных
  for (let i = 0; i < width * height; i++) {
    const byte = view.getUint8(offset++);
    const gray7 = byte & 0b01111111; // 7 бит
    const mask = (byte & 0b10000000) >> 7;

    // масштабируем 0–127 → 0–255
    const gray8 = Math.round((gray7 / 127) * 255);
    // Заполняем RGBA
    const idx = i * 4;
    pixels[idx] = gray8;     // R
    pixels[idx + 1] = gray8; // G
    pixels[idx + 2] = gray8; // B
    if (hasMask) {
      pixels[idx + 3] = mask ? 255 : 0;
    } else {
      pixels[idx + 3] = 255;
    }
  }
  return new ImageData(pixels, width, height);
}
