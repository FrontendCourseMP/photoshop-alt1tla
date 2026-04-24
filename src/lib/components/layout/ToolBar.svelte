<script lang="ts">
  import { Toolbar } from "bits-ui";
  import { activeTool, setTool } from "$lib/state/tool.state";
  import { MouseIcon, EyedropperIcon } from "phosphor-svelte";
</script>

<Toolbar.Root
  class="flex items-center gap-1 px-2 py-2
         bg-gray-900
         border border-gray-700 text-gray-400"
>
  <Toolbar.Button
    class="w-10 h-10 flex items-center justify-center
           hover:bg-gray-800 transition
           data-[active=true]:bg-gray-700
           data-[active=true]:text-gray-100
           data-[active=true]:shadow-inner
           active:scale-95"
    data-active={$activeTool === "move"}
    onclick={() => setTool("move")}
  >
    <MouseIcon size={24} />
  </Toolbar.Button>

  <Toolbar.Button
    class="w-10 h-10 flex items-center justify-center
           hover:bg-gray-800 transition
           data-[active=true]:bg-gray-700
           data-[active=true]:text-gray-100
           data-[active=true]:shadow-inner
           active:scale-95"
    data-active={$activeTool === "eyedropper"}
    onclick={() => setTool("eyedropper")}
  >
    <EyedropperIcon size={24} />
  </Toolbar.Button>
</Toolbar.Root>
