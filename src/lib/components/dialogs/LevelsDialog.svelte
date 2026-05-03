<script lang="ts">
  import { Dialog, Select, Switch } from "bits-ui";
  import { CaretDownIcon } from "phosphor-svelte";
  import { calculateHistogram } from "$lib/core/tools/histogram";
  import type { HistogramMode, HistogramData } from "$lib/core/types";
  import HistogramChart from "$lib/components/panels/HistogramPanel.svelte";
  import type { ImageInfo } from "$lib/core/types";

  interface Props {
    open?: boolean;
    image: ImageInfo | null;
    onClose?: () => void;
  }

  let { open = $bindable(false), image, onClose }: Props = $props();

  let selectedChannel: HistogramMode = $state("master");
  let isLogarithmic = $state(true);
  let currentHistogram: HistogramData = $derived(calculateHistogram(image));

  const names: Record<HistogramMode, string> = {
    master: "Мастер (RGB)",
    grayscale: "Линейный (G)",
    red: "Красный (R)",
    green: "Зеленый (G)",
    blue: "Синий (B)",
    alpha: "Маска (A)",
  };

  const channelOptions = $derived.by(() => {
    const options: { value: HistogramMode; label: string }[] = [
      { value: "master", label: names["master"] },
    ];
    if (!image || !image.channels) return options;

    image.channels.forEach((ch) => {
      options.push({
        value: ch,
        label: names[ch],
      });
    });
    return options;
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 bg-black/60 z-40" />
    <Dialog.Content
      class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-700 bg-gray-900 p-6 shadow-lg duration-200 text-gray-200"
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
                  label={opt.label}
                  value={opt.value}
                  class="cursor-pointer hover:bg-gray-700 focus:bg-gray-700 px-3 py-2"
                >
                  {opt.label}
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
              class="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-700"
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
      <div class="space-y-4">
        <!-- Тут будут слайдеры -->
      </div>
      <div
        class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-2"
      >
        <Dialog.Close
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white hover:cursor-pointer"
        >
          Отмена
        </Dialog.Close>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
          onclick={() => (open = false)}
        >
          Применить
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
