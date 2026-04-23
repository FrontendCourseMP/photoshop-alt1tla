import { imageInfo } from "$lib/state/image.state";
/**
 * Извлекает метаданные из стандартного изображения и сохраняет их в хранилище `imageInfo`.
 * @param file Файл изображения.
 */
export async function extractStandardMeta(file: File) {
  const bitmap = await createImageBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;
  const depth = file.type === "image/png" ? 32 : 24;
  imageInfo.set({
    name: file.name,
    width,
    height,
    depth,
  });
  bitmap.close();
}
