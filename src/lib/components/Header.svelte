<script lang="ts">
  import { Menubar } from "bits-ui";
  import { imageInfo, uploadFile, exportOriginal } from "$lib/stores/image";

  import PencilRulerIcon from "phosphor-svelte/lib/PencilRulerIcon";

  let input: HTMLInputElement;

  function openFileDialog() {
    input.click();
  }
  async function handleUploadFile(e: Event) {
    await uploadFile(e);
  }
  async function handleExportOriginal() {
    await exportOriginal();
  }
</script>

<div
  class="bg-gray-900 border-t border-gray-700 px-4 py-2 text-sm text-gray-400 flex justify-between"
>
  <input
    type="file"
    accept=".png,.jpg,.jpeg,.gb7"
    bind:this={input}
    onchange={handleUploadFile}
    hidden
  />
  <Menubar.Root class="flex gap-2">
    <PencilRulerIcon class="size-6" />
    <Menubar.Menu>
      <Menubar.Trigger
        class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
      >
        Файл
      </Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Content
          class="bg-gray-900 border-r border-l border-b border-gray-700 px-4 py-2 mt-1 text-sm text-gray-400"
          align="start"
          sideOffset={4}
        >
          <Menubar.Item
            class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
            onclick={openFileDialog}
          >
            Импортировать
          </Menubar.Item>
          <Menubar.Item
            class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
            onclick={handleExportOriginal}
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
  <span class="">{$imageInfo.name != "" ? $imageInfo.name : "Не выбрано"}</span>
</div>
