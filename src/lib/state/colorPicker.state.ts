import { writable } from "svelte/store";
import { rgbToLab, rgbToHex } from "$lib/core/tools/colorPicker";
import type { PickedColor } from "$lib/core/types";

/**
 * Реактивное хранилище для пипетки
 */
export const pickedColor = writable<PickedColor | null>(null);

/**
 * Сброс состояния пипетки
 */
export function resetPickedColor() {
  pickedColor.set(null);
}

/**
 * Назначает состояние для пипетки
 * @param e
 * @param canvas
 * @param ctx
 * @param data
 * @param imgWidth
 * @param imgHeight
 * @param offsetX
 * @param offsetY
 * @returns
 */
export function pickPixel(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  data: Uint8ClampedArray,
  imgWidth: number,
  imgHeight: number,
  offsetX: number,
  offsetY: number,
) {
  const rect = canvas.getBoundingClientRect();

  // координаты мыши 
  const x = e.clientX - rect.left - offsetX;
  const y = e.clientY - rect.top - offsetY;
  //  canvas 
  const canvasX = x + offsetX;
  const canvasY = y + offsetY;

  // image 
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  if (ix < 0 || iy < 0 || ix >= imgWidth || iy >= imgHeight) return;

  const idx = (iy * imgWidth + ix) * 4;

  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];

  const lab = rgbToLab(r, g, b);
  const hex = rgbToHex(r, g, b);

  pickedColor.set({
    x: ix,
    y: iy,
    r,
    g,
    b,
    a,
    labL: lab.L,
    labA: lab.A,
    labB: lab.B,
    hex: hex,
    canvasX: canvasX,
    canvasY: canvasY,
  });
}
