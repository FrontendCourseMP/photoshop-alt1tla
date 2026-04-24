<script lang="ts">
  import Canvas from "$lib/components/canvas/Canvas.svelte";
  import Header from "$lib/components/layout/Header.svelte";
  import StatusBar from "$lib/components/layout/StatusBar.svelte";
  import SideBar from "$lib/components/layout/SideBar.svelte";
  import ToolBar from "$lib/components/layout/ToolBar.svelte";
</script>

<div class="h-screen flex flex-col">
  <Header />
  <div class="flex-1 flex overflow-hidden relative">
    <div class="w-1/3 max-w-xs bg-gray-900 border-t border-gray-700">
      <SideBar />
    </div>
    <div class="flex-1 relative overflow-hidden">
      <Canvas />
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <ToolBar />
      </div>
    </div>
  </div>
  <StatusBar />
</div>
