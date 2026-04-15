<script lang="ts">
  import { Button } from "bits-ui";
  import Image from "phosphor-svelte/lib/Image";
  import { imageFile } from "$lib/stores/image";
  import { saveImage } from "$lib/stores/saveImage"
  import { goto } from "$app/navigation";
  
  let { topage = null } = $props();
  let input: HTMLInputElement;

  function openFileDialog() {
    input.click();
  }

  async function handleFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    imageFile.set(file);
    await saveImage(file);
    if (topage) {
      goto(topage);
    }
  }
</script>

<Button.Root
  onclick={openFileDialog}
  class="cursor-pointer bg-gray-800 text-gray-100 hover:bg-gray-700 px-4 py-2 flex items-center gap-2"
>
  <Image class="size-6" />
  Загрузить изображение
</Button.Root>

<input
  type="file"
  accept=".png,.jpg,.jpeg,.gb7"
  bind:this={input}
  onchange={handleFile}
  hidden
/>
