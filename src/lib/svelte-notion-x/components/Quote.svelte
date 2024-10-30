<script lang="ts">
  import DebugJson from "./DebugJSON.svelte";
  import RenderText from "./RenderText.svelte";

  export let block: {
    [key: string]: any;
  };
</script>

<div class="notion-quote-wrp notion-render">
  <div class="notion-quote-border notion-render">
    <div class="notion-quote-content notion-render">
      <RenderText block={block.quote} />
    </div>
  </div>
</div>

<style>
  .notion-quote-wrp {
    margin: 0px;
    font-size: 1em;
    padding: 3px 2px;
    color: inherit;
    fill: inherit;
    display: flex;
  }

  .notion-quote-border {
    border-left: 3px solid currentcolor;
    padding-left: 14px;
    padding-right: 14px;
    width: 100%;
  }

  .notion-quote-content {
    max-width: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    padding-left: 2px;
    padding-right: 2px;
  }
</style>
