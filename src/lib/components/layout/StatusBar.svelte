<script lang="ts">
  import { imageInfo } from "$lib/state/image.state";
</script>

<div
  class="bg-gray-900 border-t border-gray-700 px-4 py-2 text-sm text-gray-400"
>
  <div class="flex justify-end gap-2">
    <span>Ширина: {$imageInfo.width} px</span>
    <span>Высота: {$imageInfo.height} px</span>
    <span>Глубина цвета: {$imageInfo.depth} bpp</span>
  </div>
</div>
