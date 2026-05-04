<script lang="ts">
  import { Dialog, Select, Switch, Checkbox, Label, Button } from "bits-ui";
  import { CaretDownIcon, CheckIcon } from "phosphor-svelte";
  import { calculateHistogram } from "$lib/core/tools/histogram";
  import { applyLevelsToImage } from "$lib/core/tools/levels";
  import type {
    HistogramMode,
    HistogramData,
    LevelSettings,
    ImageInfo,
  } from "$lib/core/types";
  import HistogramChart from "$lib/components/panels/HistogramPanel.svelte";
  import LevelsSlider from "$lib/components/panels/LevelsSlider.svelte";

  interface Props {
    open?: boolean;
    image: ImageInfo | null;
    originalData: Uint8ClampedArray | null;
    onPreview: (data: Uint8ClampedArray | null) => void;
    onApply: (data: Uint8ClampedArray) => void;
  }

  let {
    open = $bindable(false),
    image,
    originalData,
    onPreview,
    onApply,
  }: Props = $props();

  let levelsByChannel = $state<Record<HistogramMode, LevelSettings>>({
    master: { black: 0, white: 255, gamma: 1.0 },
    grayscale: { black: 0, white: 255, gamma: 1.0 },
    red: { black: 0, white: 255, gamma: 1.0 },
    green: { black: 0, white: 255, gamma: 1.0 },
    blue: { black: 0, white: 255, gamma: 1.0 },
    alpha: { black: 0, white: 255, gamma: 1.0 },
  });
  let selectedChannel: HistogramMode = $state("master");
  let isLogarithmic = $state(true);
  let isPreviewEnabled = $state(true);
  let lastKey = "";

  let currentLevels: LevelSettings = $derived(levelsByChannel[selectedChannel]);
  let currentHistogram: HistogramData = $derived(calculateHistogram(image));

  const DEFAULT_LEVELS: LevelSettings = { black: 0, white: 255, gamma: 1.0 };
  const names: Record<HistogramMode, string> = {
    master: "Мастер (RGB)",
    grayscale: "Линейный (G)",
    red: "Красный (R)",
    green: "Зеленый (G)",
    blue: "Синий (B)",
    alpha: "Маска (A)",
  };

  const channelOptions = $derived.by(() => {
    if (!image || !image.channels) return [];
    const isRGB = image.channels.includes("red");
    const options: { value: HistogramMode; label: string }[] = [];
    if (isRGB) {
      options.push({ value: "master", label: names["master"] });
    }
    image.channels.forEach((ch) => {
      options.push({ value: ch, label: names[ch] });
    });
    if (image.hasMask && !image.channels.includes("alpha")) {
      options.push({ value: "alpha", label: names["alpha"] });
    }
    return options;
  });

  $effect(() => {
    if (!image?.channels || channelOptions.length === 0) return;
    if (!channelOptions.some((opt) => opt.value === selectedChannel)) {
      selectedChannel = channelOptions[0].value;
    }
  });

  const handleReset = () => {
    levelsByChannel[selectedChannel] = { ...DEFAULT_LEVELS };
  };

  const handleCancel = () => {
    onPreview(null);
    open = false;
  };

  const handleApply = () => {
    if (!originalData || !image) return;
    if (!image.width || !image.height || image.width <= 0 || image.height <= 0)
      return;
    const expectedLength = image.width * image.height * 4;
    if (originalData.length !== expectedLength) {
      return;
    }
    try {
      const src = new ImageData(
        new Uint8ClampedArray(originalData),
        image.width,
        image.height,
      );
      const result = applyLevelsToImage(src, levelsByChannel, selectedChannel);
      onApply(result.data);
      open = false;
    } catch (err) {
      return;
    }
  };

  $effect(() => {
    if (!originalData || !image || !isPreviewEnabled) return;
    const channel = selectedChannel;
    const { black, white, gamma } = levelsByChannel[channel];
    const key = `${channel}-${black}-${white}-${gamma}`;
    if (key === lastKey) return;
    lastKey = key;
    if (black === 0 && white === 255 && gamma === 1.0) {
      onPreview(null);
      return;
    }
    const src = new ImageData(
      new Uint8ClampedArray(originalData),
      image.width,
      image.height,
    );
    const result = applyLevelsToImage(src, levelsByChannel, channel);
    onPreview(result.data);
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset- z-40" />
    <Dialog.Content
      class="fixed left-[25%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-700 bg-gray-900 p-6 shadow-lg duration-200 text-gray-200"
    >
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <Dialog.Title
          class="text-lg font-semibold leading-none tracking-tight text-white"
        >
          Уровни
        </Dialog.Title>
        <Dialog.Description class="text-gray-400">
          Коррекция тонового диапазона изображения.
        </Dialog.Description>
      </div>
      <div class="flex items-center justify-between gap-4 py-2">
        <div class="flex-1">
          <label
            for="channel-select"
            class="text-xs font-medium mb-1 block text-gray-400"
          >
            Канал
          </label>
          <Select.Root type="single" bind:value={selectedChannel}>
            <Select.Trigger
              class="flex w-full items-center justify-between px-3 py-2 border border-gray-700 bg-gray-800 text-gray-200 placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Select.Value>
                {names[selectedChannel]}
              </Select.Value>
              <CaretDownIcon class="ml-4 opacity-50" />
            </Select.Trigger>
            <Select.Content
              sideOffset={2}
              class="bg-gray-800 border-gray-700 text-gray-200 z-50 focus-override border-muted bg-background shadow-popover outline-hidden w-(--bits-select-anchor-width) min-w-(--bits-select-anchor-width) select-none border"
            >
              {#each channelOptions as opt}
                <Select.Item
                  label={names[opt.value]}
                  value={opt.value}
                  class="cursor-pointer hover:bg-gray-700 focus:bg-gray-700 px-3 py-2"
                >
                  {names[opt.value]}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="flex flex-col items-end">
          <label
            for="log-scale"
            class="text-xs font-medium mb-1 block text-gray-400"
          >
            Шкала
          </label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Лин.</span>
            <Switch.Root
              id="log-scale"
              bind:checked={isLogarithmic}
              class="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-700"
            >
              <Switch.Thumb
                class="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
              />
            </Switch.Root>
            <span class="text-xs text-gray-500">Лог.</span>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 border-gray-700">
        {#if image}
          <HistogramChart
            {image}
            histogramData={currentHistogram}
            channel={selectedChannel}
            {isLogarithmic}
          />
        {:else}
          <div
            class="h-48 flex items-center justify-center text-gray-500 text-sm"
          >
            Изображение не загружено
          </div>
        {/if}
      </div>
      {#if image}
        <LevelsSlider
          black={currentLevels.black}
          white={currentLevels.white}
          gamma={currentLevels.gamma}
          onChange={(values) => {
            levelsByChannel[selectedChannel] = { ...values };
          }}
        />
        <div class="flex w-full flex-row gap-2 justify-end-safe my-1">
          <Checkbox.Root
            id="ch"
            bind:checked={isPreviewEnabled}
            class="flex items-center justify-center"
          >
            {#snippet children({ checked })}
              <div
                class={[
                  "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                  "border-gray-600 bg-gray-800",
                  checked ? "bg-blue-600 border-blue-600" : "",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                ].join(" ")}
              >
                {#if checked}
                  <CheckIcon class="w-3 h-3 text-white" />
                {/if}
              </div>
            {/snippet}
          </Checkbox.Root>
          <Label.Root for="ch" class="text-gray-400">Предпросмотр</Label.Root>
        </div>
      {/if}
      <div class="flex justify-between mt-2 gap-2">
        <Button.Root
          onclick={handleReset}
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white hover:cursor-pointer"
          title="Сбросить настройки канала"
        >
          Сбросить
        </Button.Root>
        <div class="flex space-x-2">
          <Button.Root
            onclick={handleCancel}
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white hover:cursor-pointer"
          >
            Отмена
          </Button.Root>
          <Button.Root
            onclick={handleApply}
            class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
          >
            Применить
          </Button.Root>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
