<script lang="ts">
  import { Button } from "bits-ui";
  import { HandsPrayingIcon } from "phosphor-svelte";
  import { goto } from "$app/navigation";
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
  <h1 class="text-3xl font-bold text-center text-white mb-4">PHOTOSHOP-ALT1TLA</h1>
  <Button.Root
  onclick={() => goto('/editor')}
  class="cursor-pointer bg-gray-800 text-gray-100 hover:bg-gray-700 px-4 py-2 flex items-center gap-2"
>
  <HandsPrayingIcon class="size-6" />
  Перейти к редактору
</Button.Root>
</div>
