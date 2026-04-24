<script lang="ts">
  import { Popover, Separator } from "bits-ui";
  import { pickedColor } from "$lib/state/colorPicker.state";

  let popoverEl: HTMLDivElement | null = null;

  let popW = 0;
  let popH = 0;

  const observer = $derived(
    new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      popW = rect.width;
      popH = rect.height;
    }),
  );

  /**
   * Вычисление реактивное позиции для плашки
   */
  let pos = $derived(() => {
    if (!$pickedColor) return { x: 0, y: 0 };

    const x = $pickedColor.canvasX;
    const y = $pickedColor.canvasY;

    // flip по вертикали
    const placeBelow = y < popH + 10;

    let finalX = x - popW / 2;
    let finalY = placeBelow ? y + 10 : y - popH - 10;

    // clamp по X (чтобы не вылезал)
    finalX = Math.max(4, finalX);
    finalX = Math.min(finalX, window.innerWidth - popW - 4);

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
    ref={popoverEl}
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
