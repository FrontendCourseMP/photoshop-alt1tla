const correctValue = (val: number, black: number, white: number, gamma: number): number => {
  const range = white - black;
  if (range <= 0) return val;
  const clamped = Math.max(black, Math.min(white, val));
  return Math.round(Math.pow((clamped - black) / range, 1 / gamma) * 255);
};

export const applyLevelsToImage = (
  source: ImageData,
  settings: Record<string, { black: number; white: number; gamma: number }>,
  activeChannel: string
): ImageData => {
  const result = new ImageData(
    new Uint8ClampedArray(source.data),
    source.width,
    source.height
  );

  const { black, white, gamma } = settings[activeChannel] ?? { black: 0, white: 255, gamma: 1.0 };
  const data = result.data;
  const len = data.length;

  if (activeChannel === 'master') {
    for (let i = 0; i < len; i += 4) {
      data[i]     = correctValue(data[i], black, white, gamma);
      data[i + 1] = correctValue(data[i + 1], black, white, gamma);
      data[i + 2] = correctValue(data[i + 2], black, white, gamma);
    }
  } else {
    const channelIdx = { red: 0, green: 1, blue: 2, alpha: 3 }[activeChannel];
    if (channelIdx !== undefined) {
      for (let i = 0; i < len; i += 4) {
        data[i + channelIdx] = correctValue(data[i + channelIdx], black, white, gamma);
      }
    }
    //grayscale
  }

  return result;
};
