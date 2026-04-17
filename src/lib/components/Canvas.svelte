<script lang="ts">
  import { imageFile, loadImage } from "$lib/stores/image";
  import { detectFormat } from "$lib/codecs/utils";
  import { decodeGB7 } from "$lib/codecs/gb7/decoder";

  // Ссылки на элементы и данные
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let image: ImageData | HTMLImageElement | null = null;
  let hasMask = false;
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
  // Вычисляемый наблюдатель за изменением размера canvas
  const observer = $derived(
    new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      render();
    }),
  );

  $effect(() => {
    loadImage();
    ctx = canvas.getContext("2d")!;
    observer.observe(canvas);
    const unsubscribe = imageFile.subscribe((file) => {
      if (!file) return;
      loadImageFromFile(file);
    });
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  });

  async function loadImageFromFile(file: File) {
    const format = await detectFormat(file);
    image = null;
    hasMask = false;
    ctx.clearRect(0, 0, width, height);
    if (format === "gb7") {
      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const flag = view.getUint8(5);
      hasMask = (flag & 1) === 1;
      const decoded = await decodeGB7(file);
      image = new ImageData(decoded.data, decoded.width, decoded.height);
      centerImage();
      render();
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      image = img;
      centerImage();
      render();
      URL.revokeObjectURL(url);
    };
    img.src = url;
    return;
  }

  function centerImage() {
    if (!image) return;
    offsetX = (width - image.width) / 2;
    offsetY = (height - image.height) / 2;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    if (!image) return;
    if (image instanceof ImageData) {
      ctx.putImageData(image, offsetX, offsetY);
    } else {
      ctx.drawImage(image, offsetX, offsetY);
    }
    if (hasMask) {
      drawBorder();
    }
  }

  function drawBorder() {
    if (!image || !hasMask) return;

    ctx.save();

    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 2;

    ctx.strokeRect(offsetX, offsetY, image.width, image.height);

    ctx.restore();
  }

  /**
   * Обработчик начала перетаскивания изображения
   * @param e - событие мыши
   */
  function onMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
  }

  /**
   * Обработчик перемещения мыши при перетаскивании изображения
   * @param e - событие мыши
   */
  function onMouseMove(e: MouseEvent) {
    if (!isDragging || !image) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    render();
  }

  /**
   * Обработчик окончания перетаскивания изображения
   * @param e - событие мыши
   */
  function onMouseUp() {
    isDragging = false;
  }
</script>

<div class="w-full h-full">
  <canvas
    bind:this={canvas}
    class="w-full h-full block cursor-grab active:cursor-grabbing border-4 border-gray-700 bg-gray-800"
    onmousedown={onMouseDown}
    onmousemove={onMouseMove}
    onmouseup={onMouseUp}
    onmouseleave={onMouseUp}
  ></canvas>
</div>
