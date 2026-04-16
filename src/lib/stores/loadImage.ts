import { getDB } from "./db";
import { imageFile } from "$lib/stores/image";

/**
 * Загружает изображение из IndexedDB и сохраняет его в хранилище `imageFile`. Если изображение не найдено, ничего не происходит.
 */
export async function loadImage() {
  const db = await getDB();
  if (!db) return;

  const file = await db.get("images", "current");

  if (file) {
    imageFile.set(file);
  }
}
