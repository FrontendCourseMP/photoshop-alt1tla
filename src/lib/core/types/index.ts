export interface ImageInfo {
  name: string;
  data?: ImageData;
  width: number;
  height: number;
  depth: number;
  hasMask: boolean;
}
export type ExportFormat = "png" | "jpg" | "jpeg" | "gb7";
export type ImageFormat = "png" | "jpeg" | "gb7" | "unknown";
export type ChannelView = "grayscale" | "grayscale_alpha" | "rgb" | "rgba";
export type StoredImage = {
  file: File;
  meta: ImageInfo;
};
export interface ChannelState {
  active: ChannelView[];
}
export type DecodedImage =
  | {
      type: "image-data";
      data: ImageData;
      meta?: {
        hasMask?: boolean;
      };
    }
  | {
      type: "html-image";
      image: HTMLImageElement;
      meta?: {
        hasMask?: boolean;
      };
    };
export type Drawable =
  | { kind: "image-data"; data: ImageData }
  | { kind: "image"; image: HTMLImageElement };
