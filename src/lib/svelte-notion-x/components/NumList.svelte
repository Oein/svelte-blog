<script lang="ts">
  import Notion from "../Notion.svelte";
  import RenderText from "./RenderText.svelte";

  export let block: {
    [key: string]: any;
    bulleted_list_item: {
      rich_text: any;
    };
    children: any[];
  };

  export let number: number = 1;

  export let customRenderer: { [key: string]: any } = {};
</script>

<!-- <li><RenderText block={block.numbered_list_item} /></li> -->

<div class="notion-list notion-render">
  <div class="notion-list-dot notion-render">
    <div
      class="notion-list-dot-inner notion-render"
      style={`--pseudoBefore--content: "${number}.";`}
    ></div>
  </div>
  <div class="notion-list-content notion-render">
    <div class="notion-list-text notion-render">
      <RenderText block={block.numbered_list_item} />
    </div>
    {#if block.children}
      <Notion blocks={block.children} {customRenderer} />
    {/if}
  </div>
</div>

<!-- <DebugJson {block} name="num-list" /> -->

<style>
  .notion-list {
    display: flex;
    align-items: flex-start;
    width: 100%;
    padding-left: 2px;
    color: inherit;
    fill: inherit;
  }
  .notion-list-dot {
    user-select: none;
    --pseudoSelection--background: transparent;
    margin-right: 2px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    min-height: calc(1.5em + 6px);
  }
  .notion-list-dot-inner {
    width: 24px;
    text-align: center;
    white-space: nowrap;

    --pseudoBefore--fontFamily: Arial;
  }
  .notion-list-dot-inner:before {
    background: var(--pseudoBefore--background);
    border: var(--pseudoBefore--border);
    color: var(--pseudoBefore--color);
    content: var(--pseudoBefore--content);
    display: var(--pseudoBefore--display) !important;
    font-family: var(--pseudoBefore--fontFamily);
    font-size: var(--pseudoBefore--fontSize);
    font-weight: var(--pseudoBefore--fontWeight);
    height: var(--pseudoBefore--height);
    width: var(--pseudoBefore--width);
  }

  .notion-list-text {
    width: 100%;
    padding: 3px 0px;
  }
</style>
