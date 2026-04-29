import { writable } from "svelte/store";
import type { Canvas } from "$lib/core/types";

/**
 * Реактивное хранилище для пипетки
 */
export const canvasInfo = writable<Canvas | null>(null);

/**
 * Сброс состояния пипетки
 */
export function resetPickedColor() {
  canvasInfo.set(null);
}

export function setCanvasInfo(x: number, y: number) {
  const canvasX = x;
  const canvasY = y;

  canvasInfo.set({
    canvasX: canvasX,
    canvasY: canvasY,
  });
}
