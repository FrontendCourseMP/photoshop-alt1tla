<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { imageFile } from "$lib/stores/image";
  import type { ImageInfo } from "$lib/types/image";

  let { onInfo }: { onInfo: (data: ImageInfo) => void } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let img: HTMLImageElement | null = null;

  let width = 0;
  let height = 0;

  // Смещение для перемещения изображения
  let offsetX = 0;
  let offsetY = 0;
  // Флаг для перетаскивания
  let isDragging = false;
  // Начальные координаты при начале перетаскивания
  let startX = 0;
  let startY = 0;

  onMount(() => {
    ctx = canvas.getContext("2d")!;

    // Размеры canvas будут адаптироваться к размеру контейнера
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;

      width = rect.width;
      height = rect.height;

      canvas.width = width;
      canvas.height = height;

      if (img) centerImage();

      render();
    });

    observer.observe(canvas);

    loadImage();

    return () => observer.disconnect();
  });

  function loadImage() {
    const file = get(imageFile);
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;

      image.onload = () => {
        img = image;

        const channels = detectChannels(image);

        onInfo?.({
          width: image.width,
          height: image.height,
          depth: channels,
        });

        render();
      };
    };

    reader.readAsDataURL(file);
  }

  function centerImage() {
    if (!img) return;

    offsetX = (width - img.width) / 2;
    offsetY = (height - img.height) / 2;
  }

  function render() {
    if (!ctx || !img) return;
    ctx.clearRect(0, 0, width, height);
    // Вычисляем центрирование изображения
    ctx.drawImage(img, offsetX, offsetY);
  }

  function detectChannels(image: HTMLImageElement) {
    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d")!;
    temp.width = image.width;
    temp.height = image.height;
    tctx.drawImage(image, 0, 0);
    const imageData = tctx.getImageData(0, 0, image.width, image.height);
    return imageData.data.length / (image.width * image.height);
  }

  function onMouseDown(e: MouseEvent) {
    isDragging = true;
    // Вычисляем начальные координаты для перетаскивания
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging || !img) return;
    // Вычисляем новое смещение на основе движения мыши
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
    class="w-full h-full block cursor-grab active:cursor-grabbing border-4 border-gray-700"
    onmousedown={onMouseDown}
    onmousemove={onMouseMove}
    onmouseup={onMouseUp}
    onmouseleave={onMouseUp}
  ></canvas>
</div>
