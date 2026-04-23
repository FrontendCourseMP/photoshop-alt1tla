import { imageInfo } from "$lib/state/image.state";

const SIGNATURE = [0x47, 0x42, 0x37, 0x1d]; // "GB7" + 0x1d 
const VERSION = 0x01; // Версия формата GB7

/** 
 * Извлекает метаданные из файла GB7 и сохраняет их в хранилище `imageInfo`.
 * @param file Файл изображения в формате GB7.
*/
export async function extractGB7Meta(file: File) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);

  // Проверка сигнатуры
  const signature =
    view.getUint8(0) === SIGNATURE[0] && // G
    view.getUint8(1) === SIGNATURE[1] && // B
    view.getUint8(2) === SIGNATURE[2] && // 7
    view.getUint8(3) === SIGNATURE[3]; // 0x1d
  if (!signature) return;

  // Проверка версии
  const version = view.getUint8(4) === VERSION;
  if (!version) return;

  const flag = view.getUint8(5);
  const width = view.getUint16(6, false); 
  const height = view.getUint16(8, false);
  const hasMask = (flag & 0b00000001) === 1;
  const depth = hasMask ? 8 : 7;
  imageInfo.set({
    name: file.name,
    width,
    height,
    depth,
  });
}
