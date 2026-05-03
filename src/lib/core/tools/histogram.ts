import type { ImageInfo, HistogramData } from '$lib/core/types'; 

const getEmptyHistogram = (): HistogramData => ({
    red: new Array(256).fill(0),
    green: new Array(256).fill(0),
    blue: new Array(256).fill(0),
    alpha: new Array(256).fill(0),
    grayscale: new Array(256).fill(0),
    master: new Array(256).fill(0)
});

const getLuminosity = (r: number, g: number, b: number): number => {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
};

export const calculateHistogram = (image: ImageInfo | null): HistogramData => {
    const result = getEmptyHistogram();
    if (!image || !image.data) return result;

    const pixels = image.data;
    const len = pixels.length;

    for (let i = 0; i < len; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        result.red[r]++;
        result.green[g]++;
        result.blue[b]++;
        result.alpha[a]++;

        const grayVal = getLuminosity(r, g, b);
        result.grayscale[grayVal]++;

        result.master[grayVal]++;
    }

    return result;
};
