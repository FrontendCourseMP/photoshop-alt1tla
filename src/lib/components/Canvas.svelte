<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { imageFile } from "$lib/stores/image";
  import { imageInfo } from "$lib/stores/imageInfo";
  import { loadImage } from "$lib/stores/loadImage";
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let img: HTMLImageElement | null = null;
 
  let unsubscribe: (() => void) | undefined;

  // Размеры 
  let width = 0;
  let height = 0;
  // Смещение для перемещения изображения
  let offsetX = 0;
  let offsetY = 0;
  // Флаг для перетаскивания
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  onMount(() => {
    loadImage();
    ctx = canvas.getContext("2d")!;

    // Адаптивный canvas
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    });
    observer.observe(canvas);
    // Подписка на store 
    unsubscribe = imageFile.subscribe((file) => {
      if (!file) return;
        loadImageFromFile(file);
      });
    return () => {
      observer.disconnect();
    };
  });
  onDestroy(() => {
    unsubscribe?.();
  });

  function loadImageFromFile(file: File) {
    // Очистка перед новой загрузкой
    img = null;
    ctx.clearRect(0, 0, width, height);
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        img = image;
        const channels = detectChannels(image);
        imageInfo.set({
          name: file.name,
          width: image.width,
          height: image.height,
          depth: channels,
        });
        centerImage()
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
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging || !img) return;
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
