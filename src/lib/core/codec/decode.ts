import { decodeGB7 } from "$lib/core/codec/gb7/decoder";
import type { DecodedImage } from "$lib/core/types";

/**
 * Декодирование изображения в зависимости от формата
 * @param file
 * @param format
 * @returns
 */
export async function decodeImage(
  file: File,
  format: string,
): Promise<DecodedImage> {
  if (format === "gb7") {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const flag = view.getUint8(5);
    const hasMask = (flag & 1) === 1;
    const decoded = await decodeGB7(file);
    return {
      type: "image-data",
      data: new ImageData(decoded.data, decoded.width, decoded.height),
      meta: {
        hasMask,
      },
    };
  }
  let hasMask = false;
  if (format === "png") {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = url;
    });
    URL.revokeObjectURL(url);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        hasMask = true;
        break;
      }
    }
    return {
      type: "html-image",
      image: img,
      meta: {
        hasMask,
      },
    };
  }
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = url;
  });
  URL.revokeObjectURL(url);
  return {
    type: "html-image",
    image: img,
    meta: {
      hasMask,
    },
  };
}
