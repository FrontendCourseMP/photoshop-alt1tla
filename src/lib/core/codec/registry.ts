import { get } from "svelte/store";
import { getDB } from "$lib/core/storage/indexeddb";
import { imageInfo } from "$lib/state/image.state";
import { convertToGB7Meta } from "$lib/core/codec/gb7/encoder";
import type { ImageFormat, ExportFormat } from "$lib/core/types";
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
  if (
    view.getUint8(0) === 0x89 &&
    view.getUint8(1) === 0x50 &&
    view.getUint8(2) === 0x4e &&
    view.getUint8(3) === 0x47 &&
    view.getUint8(4) === 0x0d &&
    view.getUint8(5) === 0x0a &&
    view.getUint8(6) === 0x1a &&
    view.getUint8(7) === 0x0a
  ) {
    return "png";
  }
  if (
    view.getUint8(0) === 0xff &&
    view.getUint8(1) === 0xd8 &&
    view.getUint8(2) === 0xff
  ) {
    return "jpeg";
  }
  return "unknown";
}
/**
 * Экспорт оригинального файла (без переработки)
 */
export async function exportOriginal() {
  const db = await getDB();
  if (!db) return;
  const record = await db.get("images", "current");
  if (!record?.file) return;
  const file = record.file;
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name || "image";
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAs(format: ExportFormat) {
  const info = get(imageInfo);
  if (!info) return;

  if (format === "gb7") {
    if (!info.data) return;
    const buffer = convertToGB7Meta(info.data, info.hasMask);
    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });
    downloadBlob(blob, changeExtension(info.name, "gb7"));
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = info.width;
  canvas.height = info.height;
  if (info.data) {
    ctx.putImageData(info.data, 0, 0);
  }
  const mime = format === "png" ? "image/png" : "image/jpeg";
  canvas.toBlob((blob) => {
    if (!blob) return;
    downloadBlob(blob, changeExtension(info.name, format), mime);
  }, mime);
}

function downloadBlob(blob: Blob, name: string, mime?: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();

  URL.revokeObjectURL(url);
}

function changeExtension(name: string, format: ExportFormat) {
  return name.replace(/\.[^.]+$/, `.${format}`);
}

export function getNameWithoutExtension(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}
