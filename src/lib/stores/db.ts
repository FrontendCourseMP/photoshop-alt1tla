import { openDB } from "idb";
import { browser } from "$app/environment";

let dbPromise: Promise<any> | null = null;

/**
 * Получает подключение к IndexedDB. 
 * @return {Promise<IDBPDatabase> | null} Промис с подключением к IndexedDB или null, если код выполняется не в браузере.
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
