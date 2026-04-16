import { imageFile } from "$lib/stores/image";
import { saveImage } from "$lib/stores/saveImage";

/**
 * Загружает файл в хранилище и сохраняет его в IndexedDB.
 * @param e - Событие выбора файла.
 */
export async function uploadFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  imageFile.set(file);
  await saveImage(file);
}
