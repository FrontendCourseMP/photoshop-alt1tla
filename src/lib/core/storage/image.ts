import { getDB } from "$lib/core/storage/indexeddb";
import type { ImageInfo, StoredImage } from "$lib/core/types";
import { imageInfo, imageFile } from "$lib/state/image.state";
import { channelState } from "$lib/state/channel.state";
/**
 * Сохраняет изображение в IndexedDB под ключом "current".
 * @param file фаил изображения
 * @param meta мета-данные изображения
 * @returns Если база данных недоступна, возвращает `undefined`.
 */
export async function saveImage(file: File, meta: ImageInfo) {
  const db = await getDB();
  if (!db) return;
  const record = {
    id: "current",
    file,
    meta,
  };
  await db.put("images", record, "current");
}

/**
 * Загружает изображение из IndexedDB и сохраняет его в хранилище `imageFile`. Если изображение не найдено, ничего не происходит.
 */
export async function restoreImageFromStorage() {
  const db = await getDB();
  if (!db) return;
  const record = (await db.get("images", "current")) as StoredImage | undefined;
  if (!record) return;
  imageFile.set(record.file);
  imageInfo.set(record.meta);
  channelState.set({
    active: record.meta.channels,
  });
}

/**
 * Перезаписывает имя файла в indexeddb и обновляет значение в хранилище
 * @param newName новое имя файла
 */
export async function renameFile(newName: string) {
  const db = await getDB();
  if (!db) return;
  const record = (await db.get("images", "current")) as StoredImage | undefined;
  if (!record) return;
  const { file, meta } = record;
  const ext = file.name.split(".").pop();
  const baseName = newName.replace(/\.[^/.]+$/, "");
  const finalName = baseName.endsWith(`.${ext}`)
    ? baseName
    : `${baseName}.${ext}`;
  const renamedFile = new File([file], finalName, {
    type: file.type,
  });
  const updatedRecord: StoredImage = {
    file: renamedFile,
    meta: {
      ...meta,
      name: finalName,
    },
  };
  await db.put("images", updatedRecord, "current");
  imageFile.set(renamedFile);
  imageInfo.update((info) => ({
    ...info,
    name: finalName,
  }));
}
