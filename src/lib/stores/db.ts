import { openDB } from "idb";
import { browser } from "$app/environment";

let dbPromise: Promise<any> | null = null;

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
