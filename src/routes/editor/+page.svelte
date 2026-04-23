<script lang="ts">
  import Canvas from "$lib/components/canvas/Canvas.svelte";
  import Header from "$lib/components/layout/Header.svelte";
  import StatusBar from "$lib/components/layout/StatusBar.svelte";
  import ToolBar from "$lib/components/layout/ToolBar.svelte";
</script>

<div class="h-screen flex flex-col">
  <Header />
  <div class="flex-1 flex overflow-hidden">
    <ToolBar />
    <Canvas />
  </div>
  <StatusBar />
</div>
