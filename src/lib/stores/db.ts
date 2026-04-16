import { openDB } from "idb";
import { browser } from "$app/environment";

let dbPromise: Promise<any> | null = null;

/**
 * Возвращает промис с подключением к IndexedDB. Если подключение уже было установлено, возвращает существующий промис. 
 * Если код выполняется не в браузере, возвращает null.
 */
export function getDB() {
  if (!browser) return null;

  if (!dbPromise) {
    dbPromise = openDB("photoshop-alt1tla", 1, {
      upgrade(db) {
        db.createObjectStore("images");
      },
    });
  }

  return dbPromise;
}
