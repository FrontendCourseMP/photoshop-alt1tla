<script lang="ts">
  import { Menubar } from "bits-ui";
  import { imageInfo } from "$lib/stores/imageInfo";
  import Dog from "phosphor-svelte/lib/Dog";
</script>
 <div
  class="bg-gray-900 border-t border-gray-700 px-4 py-2 text-sm text-gray-400 flex justify-between"
>
<Menubar.Root class="flex gap-2">
  <Dog class="size-6" />
  <Menubar.Menu>
    <Menubar.Trigger class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer">
      Файл
    </Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content
        class="bg-gray-900 border-r border-l border-b border-gray-700 px-4 py-2 mt-1.25 text-sm text-gray-400"
        align="start"
        sideOffset={3}
      >
        <Menubar.Item
          class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
        >
          Импортировать
        </Menubar.Item>
        <Menubar.Item
          class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
        >
          Экспортировать
        </Menubar.Item>
        <Menubar.Item
          class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
        >
          Экспортировать как...
        </Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
    <span class="">{($imageInfo.name != '') ? $imageInfo.name : 'Не выбрано'}</span>
</div>
