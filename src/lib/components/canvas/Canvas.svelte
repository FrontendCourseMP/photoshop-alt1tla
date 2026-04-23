<script lang="ts">
  import { channelState } from "$lib/state/channel.state";
  import { applyChannels } from "$lib/core/channel";
  import type { ImageInfo, ChannelView } from "$lib/core/types";
  import { imageInfo } from "$lib/state/image.state";
  import { restoreImageFromStorage } from "$lib/core/storage/image";
  import { toImageData } from "$lib/core/codec/utils";
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let info: ImageInfo | null = null;
  let activeChannels: ChannelView[] = [];

  let canvasWidth = 0;
  let canvasHeight = 0;

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
    };
  });

  function centerImage() {
    if (!info) return;

    offsetX = (canvasWidth - info.width) / 2;
    offsetY = (canvasHeight - info.height) / 2;
  }

  function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (!info?.data) return;

    const filtered = applyChannels(info.data, activeChannels);

    const img = toImageData(filtered, info.width, info.height);
    ctx.putImageData(img, offsetX, offsetY);

    if (info.hasMask) drawBorder();
  }

  function drawBorder() {
    if (!info) return;

    ctx.save();
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 2;

    ctx.strokeRect(offsetX, offsetY, info.width, info.height);

    ctx.restore();
  }

  function onMouseDown(e: MouseEvent) {
    if (!info) return;

    isDragging = true;

    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging || !info) return;

    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;

    render();
  }

  function onMouseUp() {
    isDragging = false;
  }
</script>

<div class="w-full h-full">
  <canvas
    bind:this={canvas}
    onmousedown={onMouseDown}
    onmousemove={onMouseMove}
    onmouseup={onMouseUp}
    onmouseleave={onMouseUp}
    class="w-full h-full block cursor-grab active:cursor-grabbing border-4 border-gray-700 bg-gray-800"
  ></canvas>
</div>
