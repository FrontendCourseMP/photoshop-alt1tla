<script lang="ts">
  import { Slider } from "bits-ui";

  interface Props {
    black: number;
    white: number;
    gamma: number;
    onChange: (values: { black: number; white: number; gamma: number }) => void;
  }

  let { black, white, gamma, onChange }: Props = $props();
  let gammaPos = $derived(gammaToPosition(gamma));
  let bwValues = $state<[number, number]>([0, 255]);
  let gammaValue = $state<number>(0);
  $effect(() => {
    bwValues[0] = black;
    bwValues[1] = white;
    gammaValue = gammaPos;
  });

  function gammaToPosition(g: number): number {
    return Math.round(((g - 0.1) / 9.8) * 255);
  }

  function positionToGamma(pos: number): number {
    const g = 0.1 + (pos / 255) * 9.8;
    return parseFloat(g.toFixed(2));
  }

  const handleBWChange = (values: number[]) => {
    const [b, w] = values as [number, number];
    if (w - b < 2) return; // защита от "схлопывания" диапазона
    onChange({ black: b, white: w, gamma });
  };

  const handleGammaChange = (value: number) => {
    const newGamma = positionToGamma(value);
    onChange({ black, white, gamma: newGamma });
  };

  let displayBlack = $derived(bwValues[0]);
  let displayWhite = $derived(bwValues[1]);
  let displayGamma = $derived(gamma);
</script>

<div class="relative h-12 mt-4 select-none">
  <Slider.Root
    type="multiple"
    bind:value={bwValues}
    min={0}
    max={255}
    step={1}
    onValueChange={handleBWChange}
    class="absolute inset-x-0 top-1/2 -translate-y-1/2"
  >
    <Slider.Range class="absolute h-full bg-blue-500/60 rounded-full" />
    <Slider.Thumb
      index={0}
      class="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-white rounded-full shadow cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Точка чёрного"
    />
    <Slider.Thumb
      index={1}
      class="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-800 rounded-full shadow cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Точка белого"
    />
  </Slider.Root>
  <Slider.Root
    type="single"
    bind:value={gammaValue}
    min={0}
    max={255}
    step={0.1}
    onValueChange={handleGammaChange}
    class="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none"
  >
    <Slider.Thumb
      index={0}
      class="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-gray-300 border-2 border-gray-700 rounded-full shadow cursor-grab active:cursor-grabbing pointer-events-auto focus:outline-none focus:ring-2 focus:ring-gray-400"
      style="left: {(gammaValue / 255) * 100}%"
      aria-label="Гамма (средние тона)"
    />
  </Slider.Root>
  <div
    class="absolute inset-x-0 top-full flex justify-between text-[10px] text-gray-400 mt-1"
  >
    <span>{displayBlack}</span>
    <span>γ: {displayGamma.toFixed(2)}</span>
    <span>{displayWhite}</span>
  </div>
  <div
    class="absolute inset-x-0 bottom-0 h-3 bg-linear-to-r from-black via-gray-500 to-white opacity-40 rounded-b"
  ></div>
</div>
