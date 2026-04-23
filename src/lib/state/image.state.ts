import { writable } from "svelte/store";
import type { ImageInfo } from "$lib/core/types";
import { extractGB7Meta } from "$lib/core/codec/gb7/decoder";
import { extractStandardMeta } from "$lib/core/codec/utils";
import { detectFormat } from "$lib/core/codec/registry";
import { saveImage } from "$lib/core/storage/image"
/**
 * Реактивное хранилище файла изображения
 */
export const imageFile = writable<File | null>(null);

/**
 * Реактивное хранилище информации об изображении
 */
export const imageInfo = writable<ImageInfo>({
  name: "",
  width: 0,
  height: 0,
  depth: 0,
  hasMask: false,
});

/**
 * Загружает файл в хранилище и сохраняет его в IndexedDB.
 * @param e Событие выбора файла.
 */
export async function uploadFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  imageFile.set(file);
  const meta = await extractImageMeta(file);
  imageInfo.set(meta!);
  await saveImage(file, meta!);
}

/**
 * Извлекает метаданные изображения
 * @param file файл изображения
 * @return мета-данные изображения
 */
async function extractImageMeta(file: File) {
  let format = await detectFormat(file);
  if (format === "gb7") {
    return await extractGB7Meta(file);
  } else {
    return await extractStandardMeta(file, format);
  }
}


