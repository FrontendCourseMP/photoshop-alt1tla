export type ImageFormat = "png" | "jpeg" | "gb7" | "unknown";
/**
 * Определяет формат изображения по его заголовку.
 * @param file Файл изображения.
 * @returns Формат изображения.
 */
export async function detectFormat(file: File): Promise<ImageFormat> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const view = new DataView(buffer);
  if (
    view.getUint8(0) === 0x47 &&
    view.getUint8(1) === 0x42 &&
    view.getUint8(2) === 0x37 &&
    view.getUint8(3) === 0x1d
  ) {
    return "gb7";
  }
  return "unknown";
}
