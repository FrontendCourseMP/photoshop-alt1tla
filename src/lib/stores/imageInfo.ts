import { writable } from 'svelte/store';
import type { ImageInfo } from '$lib/types/image';
// Хранит информацию о текущем изображении
export const imageInfo = writable<ImageInfo>({
  name: '',
  width: 0,
  height: 0,
  depth: 0
});
