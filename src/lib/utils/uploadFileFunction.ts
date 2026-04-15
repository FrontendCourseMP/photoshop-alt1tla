import { imageFile } from "$lib/stores/image";
import { saveImage } from "$lib/stores/saveImage";

export async function uploadFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  imageFile.set(file);
  await saveImage(file);
}
