import { writable } from "svelte/store";
import { getDB } from "./db";
import type { ImageInfo } from "$lib/types/image";
import { extractGB7Meta } from "$lib/codecs/gb7/utils";
import { extractStandardMeta } from "$lib/codecs/others/utils";

// Хранит выбранный файл изображения для редактирования
export const imageFile = writable<File | null>(null);

// Хранит информацию о текущем изображении
export const imageInfo = writable<ImageInfo>({
  name: "",
  width: 0,
  height: 0,
  depth: 0,
});

/**
 * Сохраняет изображение в IndexedDB под ключом "current".
 * @param file Файл изображения, который нужно сохранить. Должен быть экземпляром `File`.
 * @returns Если база данных недоступна, возвращает `undefined`.
 */
async function saveImage(file: File) {
  const db = await getDB();
  if (!db) return;
  await db.put("images", file, "current");
}

/**
 * Извлекает метаданные изображения и сохраняет их в хранилище `imageInfo`.
 * @param file Файл изображения.
 */
async function extractImageMeta(file: File) {
  if (file.name.endsWith(".gb7")) {
    await extractGB7Meta(file);
  } else {
    await extractStandardMeta(file);
  }
}

/**
 * Загружает файл в хранилище и сохраняет его в IndexedDB.
 * @param e Событие выбора файла.
 */
export async function uploadFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  imageFile.set(file);
  await extractImageMeta(file);
  await saveImage(file);
}

/**
 * Загружает изображение из IndexedDB и сохраняет его в хранилище `imageFile`. Если изображение не найдено, ничего не происходит.
 */
export async function loadImage() {
  const db = await getDB();
  if (!db) return;
  const file = await db.get("images", "current");
  if (file) {
    imageFile.set(file);
    await extractImageMeta(file);
  }
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
