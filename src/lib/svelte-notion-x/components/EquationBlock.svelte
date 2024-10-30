<script lang="ts">
  import lazyML from "../lazy/mathml";
  import DebugJson from "./DebugJSON.svelte";

  export let block: {
    [key: string]: any;
  };
</script>

<div class="notion-equation-block notion-render">
  {#await lazyML then { default: LazyComponent }}
    <LazyComponent tex={block.expression} />
  {/await}
  <!-- <MathMl tex={block.expression} /> -->
</div>

<!-- <DebugJson {block} name="equation" /> -->

<style>
  .notion-equation-block {
    display: flex;
    padding: calc(4px + var(--notion-default-font-size)) 8px;
    border-radius: 4px;
    width: 100%;
    flex-direction: column;
    overflow: auto;
    color: inherit;
    fill: inherit;
    transition: background 20ms ease-in;
  }

  .notion-equation-block:hover {
    background: #f3f3f3;
  }
</style>
