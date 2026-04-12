<script lang="ts">
  import Canvas from "$lib/components/Canvas.svelte";
  import StatusBar from "$lib/components/StatusBar.svelte";

  let width = $state(0);
  let height = $state(0);
  let depth = $state(0);

  function handleInfo(data: { width: number; height: number; depth: number }) {
    width = data.width;
    height = data.height;
    depth = data.depth;
  }
</script>

<div class="h-screen bg-gray-950 flex flex-col">
  <div class="flex-1 flex overflow-hidden">
    <Canvas onInfo={handleInfo} />
  </div>

  <StatusBar {width} {height} {depth} />
</div>
