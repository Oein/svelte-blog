<script lang="ts">
  import DebugJson from "./DebugJSON.svelte";
  import RenderText from "./RenderText.svelte";

  export let block: {
    [key: string]: any;
    to_do: {
      checked: boolean;
      rich_text: any;
    };
  };
</script>

<div class="notion-todo notion-render">
  <div class="notion-render">
    <input
      class="notion-todo-checkbox notion-render"
      type="checkbox"
      checked={block.to_do.checked}
    />
  </div>
  <div class="notion-render">
    <RenderText block={block.to_do} />
  </div>
</div>

<!-- <DebugJson {block} name="todo" /> -->

<style>
  .notion-todo {
    display: flex;
  }
</style>
