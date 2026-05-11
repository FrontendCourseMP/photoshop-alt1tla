export const SCALE_MIN = 12;
export const SCALE_MAX = 300;
export const SCALE_MARGIN = 50; 
export const SCALE_PRESETS = [12, 25, 50, 75, 100, 150, 200, 300];

/**
 * Оптимальный масштаб, чтобы изображение поместилось в контейнер
 * с учётом отступов и ограничений по диапазону.
 */
export function calculateFitScale(
  imgW: number, imgH: number,
  containerW: number, containerH: number,
  margin: number = SCALE_MARGIN,
  minScale: number = SCALE_MIN,
  maxScale: number = SCALE_MAX
): number {
  const availableW = containerW - margin * 2;
  const availableH = containerH - margin * 2;
    if (availableW <= 0 || availableH <= 0 || imgW <= 0 || imgH <= 0) return 100;
    // Масштаб, при котором изображение впишется по ширине/высоте
  const scaleW = (availableW / imgW) * 100;
  const scaleH = (availableH / imgH) * 100;
    // Берём меньший, чтобы влезло по обоим измерениям
  let fitScale = Math.min(scaleW, scaleH);
    // Ограничиваем диапазоном
  fitScale = Math.max(minScale, Math.min(maxScale, fitScale));
    return Math.round(fitScale);
}

export function formatScaleLabel(scale: number): string {
  return `${scale}%`;
}
