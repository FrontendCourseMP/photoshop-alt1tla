<script lang="ts">
    import type { ImageInfo } from "$lib/types/image";

  let { width = 0, height = 0, depth = 0 }: ImageInfo = $props();
</script>

<div class="bg-gray-900 border-t border-gray-700 px-4 py-2 text-sm text-gray-400">
  <div class="flex justify-between">
    <span>Ширина: {width} px</span>
    <span>Высота: {height} px</span>
    <span>Глубина: {depth*8} bpp</span>
  </div>
</div>

<style>
</style>
