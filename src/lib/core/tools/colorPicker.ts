/**
 * Конвертация в LAB
 * @param r
 * @param g
 * @param b
 * @returns
 */
export function rgbToLab(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const lin = (c: number) =>
    c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;

  r = lin(r);
  g = lin(g);
  b = lin(b);

  let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  x /= 0.95047;
  y /= 1.0;
  z /= 1.08883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  const L = 116 * fy - 16;
  const A = 500 * (fx - fy);
  const B = 200 * (fy - fz);

  return { L, A, B };
}
/**
 * Конвертация в hex
 * @param r 
 * @param g 
 * @param b 
 * @returns строка формата hex
 */
export function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
