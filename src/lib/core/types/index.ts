export interface ImageInfo {
  name: string;
  data?: Uint8ClampedArray;
  width: number;
  height: number;
  depth: number;
  hasMask: boolean;
  channels: ChannelView[];
}
export type ExportFormat = "png" | "jpg" | "jpeg" | "gb7";
export type ImageFormat = "png" | "jpeg" | "gb7" | "unknown";
export type StoredImage = {
  file: File;
  meta: ImageInfo;
};
export type ChannelView = "grayscale" | "alpha" | "red" | "green" | "blue";
export interface ChannelState {
  active: ChannelView[];
}
export interface PickedColor {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  labL: number;
  labA: number;
  labB: number;
  hex: string;
  canvasX: number;
  canvasY: number;
}
export type Tool = "move" | "eyedropper";
