import { getDB } from "./db";
import { imageFile } from "$lib/stores/image";
// Загружает сохраненное изображение из IndexedDB и устанавливает его в store
export async function loadImage() {
  const db = await getDB();
  if (!db) return;

  const file = await db.get("images", "current");

  if (file) {
    imageFile.set(file);
  }
}
