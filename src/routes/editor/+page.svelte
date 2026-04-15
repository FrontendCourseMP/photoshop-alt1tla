<script lang="ts">
  import Canvas from "$lib/components/Canvas.svelte";
  import Header from "$lib/components/Header.svelte";
  import StatusBar from "$lib/components/StatusBar.svelte";
  import ToolBar from "$lib/components/ToolBar.svelte";
</script>

<div class="h-screen bg-gray-950 flex flex-col">
  <Header />
  <div class="flex-1 flex overflow-hidden">
    <ToolBar />
    <Canvas />
  </div>
  <StatusBar />
</div>
