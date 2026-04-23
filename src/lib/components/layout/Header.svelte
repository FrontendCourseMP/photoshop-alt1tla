<script lang="ts">
  import { Menubar, Dialog, Button } from "bits-ui";
  import { imageInfo, uploadFile } from "$lib/state/image.state";
  import {
    exportOriginal,
    exportAs,
    getNameWithoutExtension,
  } from "$lib/core/codec/registry";
  import { renameFile } from "$lib/core/storage/image";
  import PencilRulerIcon from "phosphor-svelte/lib/PencilRulerIcon";

  let input: HTMLInputElement;
  let open = $state(false);
  let newName = $state("");

  let isImage = $derived(() => $imageInfo.name !== "");

  let button: HTMLButtonElement;

  function openFileDialog() {
    input.click();
  }
  async function handleUploadFile(e: Event) {
    await uploadFile(e);
  }
  async function handleExportOriginal() {
    await exportOriginal();
  }
  function openRename() {
    newName = getNameWithoutExtension($imageInfo.name);
    open = true;
  }
  async function handleRename() {
    await renameFile(newName);
    open = false;
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
          <Menubar.Sub>
            <Menubar.SubTrigger
              class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
              >Экспортировать как..</Menubar.SubTrigger
            >
            <Menubar.Portal>
              <Menubar.SubContent
                class="bg-gray-900 border border-gray-700 px-4 py-2 text-sm text-gray-400"
              >
                <Menubar.Item
                  class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
                  onclick={() => exportAs("png")}
                >
                  PNG
                </Menubar.Item>

                <Menubar.Item
                  class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
                  onclick={() => exportAs("jpg")}
                >
                  JPG
                </Menubar.Item>

                <Menubar.Item
                  class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
                  onclick={() => exportAs("jpeg")}
                >
                  JPEG
                </Menubar.Item>

                <Menubar.Item
                  class="hover:bg-gray-950 px-1 hover:text-gray-50 cursor-pointer"
                  onclick={() => exportAs("gb7")}
                >
                  GB7
                </Menubar.Item>
              </Menubar.SubContent>
            </Menubar.Portal>
          </Menubar.Sub>
        </Menubar.Content>
      </Menubar.Portal>
    </Menubar.Menu>
  </Menubar.Root>
  <Button.Root
    class=" {isImage() && 'cursor-pointer hover:text-white'}"
    onclick={isImage() ? openRename : null}
  >
    {$imageInfo.name || "Не выбрано"}
  </Button.Root>
</div>
<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 bg-black/50" />

    <Dialog.Content
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 p-4 rounded-xl w-80"
    >
      <Dialog.Title class="text-gray-200 mb-2">Переименовать файл</Dialog.Title>

      <input
        class="w-full px-2 py-1 bg-gray-800 text-gray-100 border border-gray-700 rounded"
        bind:value={newName}
      />

      <div class="flex justify-end gap-2 mt-4">
        <button
          class="px-2 py-1 text-gray-400 hover:text-white"
          onclick={() => (open = false)}
        >
          Отмена
        </button>

        <button
          class="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
          onclick={handleRename}
        >
          Сохранить
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
