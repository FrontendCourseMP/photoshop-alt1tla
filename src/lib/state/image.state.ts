import { writable } from "svelte/store";
import { getDB } from "$lib/core/storage/indexeddb";
import type { ImageInfo } from "$lib/core/image/types";
import { extractGB7Meta } from "$lib/codecs/gb7/utils";
import { extractStandardMeta } from "$lib/codecs/standard/utils";

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
 * Перезаписывает имя файла в indexeddb и обновляет значение в хранилище
 * @param newName новое имя файла
 */
export async function renameImage(newName: string) {
  const db = await getDB();
  if (!db) return;
  const file: File = await db.get("images", "current");
  if (!file) return;
  const ext = file.name.split(".").pop();
  const processName = newName.replace(/\.[^/.]+$/, "");
  const finalName = processName.endsWith(`.${ext}`)
    ? processName
    : `${processName}.${ext}`;
  const renamedFile = new File([file], finalName, {
    type: file.type,
  });
  await db.put("images", renamedFile, "current");
  imageFile.set(renamedFile);
  imageInfo.update((info) => ({
    ...info,
    name: finalName,
  }));
}
