import type { ImageFormat, ImageInfo } from "$lib/core/types";
/**
 * Извлекает метаданные из стандартного изображения и сохраняет их в хранилище `imageInfo`.
 * @param file Файл изображения.
 */
export async function extractStandardMeta(
  file: File,
  format: ImageFormat,
): Promise<ImageInfo> {
  const bitmap = await createImageBitmap(file);

  const width = bitmap.width;
  const height = bitmap.height;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let hasMask = false;
  let depth = 24;

  if (format === "png") {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        hasMask = true;
        break;
      }
    }
    depth = hasMask ? 32 : 24;
  }

  if (format === "jpeg") {
    hasMask = false;
    depth = 24;
  }

  bitmap.close();

  return {
    name: file.name,
    data: imageData,
    width,
    height,
    depth,
    hasMask,
  };
}
