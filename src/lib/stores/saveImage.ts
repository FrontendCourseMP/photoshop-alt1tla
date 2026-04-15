import { getDB } from "./db";
// Сохраняет изображение в IndexedDB
export async function saveImage(file: File) {
  const db = await getDB();
  if (!db) return;
  await db.put("images", file, "current");
}
