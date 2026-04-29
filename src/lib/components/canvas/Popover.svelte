<script lang="ts">
  import { Popover, Separator } from "bits-ui";
  import { canvasInfo } from "$lib/state/canvas.state";
  import { pickedColor } from "$lib/state/colorPicker.state";

  let popoverEl: HTMLDivElement | null = $state(null);

  interface Props {
    containerWidth: number;
    containerHeight: number;
  }
  let { containerWidth, containerHeight }: Props = $props();

  let popW = $state(0);
  let popH = $state(0);

  const observer = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    popW = rect.width;
    popH = rect.height;
  });

  /**
   * Вычисление реактивное позиции для плашки
   */
  let pos = $derived(() => {
    if (!$pickedColor || !$canvasInfo) return { x: -9999, y: -9999 };

    const x = $canvasInfo.canvasX;
    const y = $canvasInfo.canvasY;

    if (popW === 0 || popH === 0) {
      return { x: -9999, y: -9999 };
    }

    let finalX = x - popW / 2;
    let finalY = y - popH / 2;

    if (finalX + popW >= containerWidth) {
      finalX -= popW; 
    }

    if (finalX - popW <= 0) {
      finalX += popW;
    }

    if (finalX < 0) {
      finalX = 0;
    }

    if (finalX + popW > containerWidth) {
      finalX = containerWidth - popW;
    }

    if (finalY + popH >= containerHeight) {
      finalY -= popH; 
    }

    if (finalY - popH <= 0) {
      finalY += popH; 
    }

    if (finalY < 0) {
      finalY = 0;
    }

    if (finalY + popH > containerHeight) {
      finalY = containerHeight - popH;
    }

    return { x: finalX, y: finalY };
  });

  $effect(() => {
    if (!popoverEl) return;
    observer.observe(popoverEl);

    return () => observer.disconnect();
  });
</script>

<Popover.Root open={$pickedColor !== null}>
  <Popover.Content
    bind:ref={popoverEl}
    class="absolute z-50
           bg-gray-900 border border-gray-700 rounded
           px-3 py-2 text-xs text-gray-200 shadow-lg"
    style="
      left: {pos().x}px;
      top: {pos().y}px;
    "
  >
    {#if $pickedColor}
      <div class="space-y-1 w-max">
        <div class=" flex flex-row justify-between">
          <p>
            X: {$pickedColor.x}
          </p>
          <p>
            Y: {$pickedColor.y}
          </p>
        </div>
        <Separator.Root class="border border-gray-700" />
        <div>
          <p>
            RGB: {$pickedColor.r}, {$pickedColor.g}, {$pickedColor.b}
          </p>
        </div>
        <Separator.Root class="border border-gray-700" />
        <div>
          LAB:
          {Math.round($pickedColor.labL)},
          {Math.round($pickedColor.labA)},
          {Math.round($pickedColor.labB)}
        </div>
        <Separator.Root class="border border-gray-700" />
        <div class="flex items-center gap-2">
          HEX: {$pickedColor.hex}
          <div
            class="w-4 h-4 border border-gray-600"
            style="background: {$pickedColor.hex}"
          ></div>
        </div>
      </div>
    {/if}

    <Popover.Arrow class="fill-gray-900" />
  </Popover.Content>
</Popover.Root>
