<script lang="ts">
  import { channelPreviews } from "$lib/state/channel.state";
  import { toggleChannel } from "$lib/state/channel.state";

  let canvases: HTMLCanvasElement[] = [];

  let channelName = {
    red: "Красный (R)",
    green: "Зеленый (G)",
    blue: "Синий (B)",
    alpha: "Маска (A)",
    grayscale: "Линейный (L)",
  };

  function renderPreviews() {
    const items = $channelPreviews;
    if (!items) return;

    items.forEach((item, i) => {
      const canvas = canvases[i];
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = item.preview.width;
      canvas.height = item.preview.height;

      ctx.putImageData(item.preview, 0, 0);
    });
  }

  $effect(() => {
    const items = $channelPreviews;
    if (!items) return;

    renderPreviews();
  });
</script>

<div class="flex flex-row flex-wrap p-2 gap-2 bg-gray-900">
  {#each $channelPreviews as item, i}
    <button
      class="flex flex-1 flex-col items-center gap-1 p-2 border
             {item.active ? 'border-green-400 bg-gray-800' : 'border-gray-700'}"
      onclick={() => toggleChannel(item.channel)}
    >
      <canvas bind:this={canvases[i]} class="bg-black"></canvas>

      <span class="text-xs text-gray-300">
        {channelName[item.channel]}
      </span>
    </button>
  {/each}
</div>
