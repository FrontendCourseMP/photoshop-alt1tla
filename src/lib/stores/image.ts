import { writable } from 'svelte/store';
// Хранит выбранный файл изображения для редактирования
export const imageFile = writable<File | null>(null);
