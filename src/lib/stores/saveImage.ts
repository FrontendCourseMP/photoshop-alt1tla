import { getDB } from "./db";

/**
 * Сохраняет изображение в IndexedDB под ключом "current".
 * @param file - Файл изображения, который нужно сохранить. Должен быть экземпляром `File`.
 * @returns - Если база данных недоступна, возвращает `undefined`.
 */
export async function saveImage(file: File) {
  const db = await getDB();
  if (!db) return;
  await db.put("images", file, "current");
}
