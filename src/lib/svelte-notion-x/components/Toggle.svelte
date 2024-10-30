<script lang="ts">
  import Notion from "../Notion.svelte";
  import NotionBlock from "../NotionBlock.svelte";
  import DebugJson from "./DebugJSON.svelte";
  import RenderText from "./RenderText.svelte";

  export let block: {
    [key: string]: any;
  };

  let open = false;
  export let customRenderer: { [key: string]: any } = {};
</script>

<div class="notion-toggle notion-render">
  <button
    class="notion-toggle-dot notion-render"
    on:click={() => (open = !open)}
  >
    <div class="notion-toggle-inner notion-render">
      <svg
        role="graphics-symbol"
        viewBox="0 0 100 100"
        class="triangle notion-render"
        style={`width: 0.6875em; height: 0.6875em; display: block; fill: inherit; flex-shrink: 0; transition: transform 200ms ease-out; transform: rotateZ(${open ? "180deg" : "90deg"}); opacity: 1;`}
        ><polygon points="5.9,88.2 50,11.8 94.1,88.2" fill="currentColor"
        ></polygon></svg
      >
    </div>
  </button>
  <div class="notion-toggle-content notion-render">
    <RenderText block={block.toggle} />
    {#if block.children && open}
      <Notion blocks={block.children} {customRenderer} />
    {/if}
  </div>
</div>

<!-- <DebugJson {block} name="toggle" /> -->

<!-- <DebugJson {block} name="dot-list" /> -->

<style>
  .notion-toggle {
    display: flex;
    align-items: flex-start;
    width: 100%;
    padding-left: 2px;
    color: inherit;
    fill: inherit;
  }
  .notion-toggle-dot {
    user-select: none;
    --pseudoSelection--background: transparent;
    min-height: calc(1.5em + 6px);

    border: none;
    outline: none;
    background: none;

    margin-right: 2px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    min-height: calc(1.5em + 6px);
    padding-right: 2px;
  }
  .notion-toggle-inner {
    user-select: none;
    transition: background 20ms ease-in;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
  .notion-toggle-inner:hover {
    background: #f3f3f3;
  }
  .notion-toggle-inner:active {
    background: #eaeaea;
  }
</style>
