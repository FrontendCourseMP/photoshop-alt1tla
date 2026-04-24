<script lang="ts">
  import { tick } from "svelte";
  import { get } from "svelte/store";
  import { channelState } from "$lib/state/channel.state";
  import { applyChannels } from "$lib/core/channel";
  import type { ImageInfo, ChannelView } from "$lib/core/types";
  import { imageInfo } from "$lib/state/image.state";
  import { restoreImageFromStorage } from "$lib/core/storage/image";
  import { toImageData } from "$lib/core/codec/utils";
  import { pickPixel, resetPickedColor } from "$lib/state/colorPicker.state";
  import { activeTool } from "$lib/state/tool.state";
  import Popover from "$lib/components/canvas/Popover.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let info: ImageInfo | null = null;
  let activeChannels: ChannelView[] = [];

  let canvasWidth = $state(0);
  let canvasHeight = $state(0);

  let offsetX = 0;
  let offsetY = 0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const observer = $derived(
    new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      canvasWidth = rect.width;
      canvasHeight = rect.height;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      render();
    }),
  );

  $effect(() => {
    restoreImageFromStorage();

    ctx = canvas.getContext("2d")!;
    observer.observe(canvas);

    const unsub = imageInfo.subscribe((v) => {
      info = v;
      centerImage();
      render();
    });

    const unsubChannels = channelState.subscribe((v) => {
      activeChannels = v.active;
      render();
    });

    return () => {
      observer.disconnect();
      unsub();
      unsubChannels();
    };
  });

  /**
   * Центрирование изображения
   */
  function centerImage() {
    if (!info) return;

    offsetX = (canvasWidth - info.width) / 2;
    offsetY = (canvasHeight - info.height) / 2;
  }

  /**
   * Рендер изображени на холсте
   */
  function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (!info?.data) return;

    const filtered = applyChannels(info.data, activeChannels);

    const img = toImageData(filtered, info.width, info.height);
    ctx.putImageData(img, offsetX, offsetY);

    if (info.hasMask) drawBorder();
  }

  /**
   * Обводка для изображений с масков
   */
  function drawBorder() {
    if (!info) return;

    ctx.save();
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 2;

    ctx.strokeRect(offsetX, offsetY, info.width, info.height);

    ctx.restore();
  }

  /**
   * Захват для перетягивания
   */
  function onMouseDown(e: MouseEvent) {
    const tool = get(activeTool);
    if (tool !== "move") return;
    if (!info) return;

    isDragging = true;

    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }

  /**
   * Перетягивание
   */
  function onMouseMove(e: MouseEvent) {
    const tool = get(activeTool);
    if (!isDragging) return;
    if (tool !== "move") return;
    if (!info) return;

    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;

    render();
  }

  /**
   * Отмена перетягивания
   */
  function onMouseUp() {
    isDragging = false;
  }

  /**
   * Вызов вычисления "цвета" пикселя
   * @param e
   */
  async function onClick(e: MouseEvent) {
    if (!info) return;
    const tool = get(activeTool);
    if (tool !== "eyedropper") return;
    resetPickedColor();
    await tick();
    pickPixel(e, canvas, info.data!, info.width, info.height, offsetX, offsetY);
  }
</script>

<div class="w-full h-full relative">
  <canvas
    bind:this={canvas}
    onmousedown={onMouseDown}
    onmousemove={onMouseMove}
    onmouseup={onMouseUp}
    onmouseleave={onMouseUp}
    onclick={onClick}
    class="w-full h-full block cursor-grab active:cursor-grabbing border-4 border-gray-700 bg-gray-800"
  >
  </canvas>
  <Popover />
</div>
