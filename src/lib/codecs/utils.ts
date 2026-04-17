import { getDB } from "$lib/stores/db";
import { decodeGB7 } from "$lib/codecs/gb7/decoder";
import { encodeGB7 } from "$lib/codecs/gb7/encoder";

type ExportFormat = "png" | "jpg" | "jpeg" | "gb7";
type ImageFormat = "png" | "jpeg" | "gb7" | "unknown";

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
/**
 * Экспортирует оригинальное изображение.
 */
export async function exportOriginal() {
  const db = await getDB();
  if (!db) return;
  const file: File = await db.get("images", "current");
  if (!file) return;
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name || "image";
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAs(format: ExportFormat) {
  const db = await getDB();
  if (!db) return;

  const file: File | null = await db.get("images", "current");
  if (!file) return;

  const inputFormat = getFormatFromFileName(file.name);

  if (isSameFormat(inputFormat, format)) {
    downloadBlob(file, changeExtension(file.name, format));
    return;
  }

  // GB7
  if (format === "gb7") {
    let imageData: ImageData;
    const img = await fileToImage(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buffer = encodeGB7(imageData);
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    downloadBlob(blob, changeExtension(file.name, "gb7"));
    return;
  }

  // PNG / JPG / JPEG
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  if (inputFormat === "gb7") {
    const imageData = await decodeGB7(file);

    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);
  } else {
    const img = await fileToImage(file);

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
  }
  const mime = format === "png" ? "image/png" : "image/jpeg";
  canvas.toBlob((blob) => {
    if (!blob) return;
    downloadBlob(blob, changeExtension(file.name, format), mime);
  }, mime);
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function downloadBlob(blob: Blob, name: string, mime?: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();

  URL.revokeObjectURL(url);
}

function getFormatFromFileName(name: string): ExportFormat {
  const ext = name.split(".").pop()?.toLowerCase();

  if (ext === "png") return "png";
  if (ext === "jpg") return "jpg";
  if (ext === "jpeg") return "jpeg";
  if (ext === "gb7") return "gb7";

  return "png";
}

function isSameFormat(a: ExportFormat, b: ExportFormat) {
  if (a === "jpg" && b === "jpeg") return true;
  if (a === "jpeg" && b === "jpg") return true;
  return a === b;
}

function changeExtension(name: string, format: ExportFormat) {
  return name.replace(/\.[^.]+$/, `.${format}`);
}

export function getNameWithoutExtension(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}
