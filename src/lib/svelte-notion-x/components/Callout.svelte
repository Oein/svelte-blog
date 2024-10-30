<script lang="ts">
  import Notion from "../Notion.svelte";
  import NotionBlock from "../NotionBlock.svelte";
  import DebugJson from "./DebugJSON.svelte";
  import RenderText from "./RenderText.svelte";

  export let block: {
    [key: string]: any;
  };

  export let customRenderer: { [key: string]: any } = {};
</script>

<!-- <DebugJson name="callout" {block} /> -->

<div class="notion-callout notion-render">
  <div class="notion-callout-icn0 notion-render">
    <div class="notion-callout-icn1 notion-render">
      {#if block.callout.icon.type == "emoji"}
        <div class="notion-callout-txt0 notion-render">
          <div class="notion-callout-txt1 notion-render">
            <span role="img" class="notion-callout-txt2 notion-render">
              {block.callout.icon.emoji}
            </span>
          </div>
        </div>
      {:else}
        <div>
          <div class="notion-callout-icn2 notion-render">
            <img
              class="notion-callout-icn notion-render"
              src={block.callout.icon.external.url}
              alt="Callout Icon"
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="notion-callout-content notion-render">
    {#if block.callout.rich_text.length > 0}
      <div class="notion-callout-rich notion-render">
        <div class="notion-callout-rich1 notion-render">
          <RenderText block={block.callout} />
        </div>
      </div>
    {/if}
    {#if block.children}
      <Notion blocks={block.children} {customRenderer} />
    {/if}
  </div>
</div>

<style>
  .notion-callout {
    display: flex;
    width: 100%;
    border-radius: 4px;
    background: rgb(244, 238, 238);
    padding: 12px 16px 12px 12px;
  }
  .notion-callout-icn0 {
    margin-top: 4px;
  }
  .notion-callout-icn1 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 24px;
    border-radius: 0.25em;
    flex-shrink: 0;
  }
  .notion-callout-icn2 {
    width: 100%;
    height: 100%;
  }
  .notion-callout-txt0 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 24px;
  }
  .notion-callout-txt1 {
    height: 21.6px;
    width: 21.6px;
    font-size: 21.6px;
    line-height: 1;
    margin-left: 0px;
    color: black;
  }
  .notion-callout-txt2 {
    white-space: nowrap;
  }
  .notion-callout-icn {
    display: block;
    object-fit: cover;
    border-radius: 4px;
    width: 23.04px;
    height: 23.04px;
    transition: opacity 100ms ease-out;
  }
  .notion-callout-content {
    display: flex;
    flex-direction: column;
    min-width: 0px;
    margin-left: 8px;
    width: 100%;
    min-height: 32px;
  }
  .notion-callout-rich {
    margin-top: 2px;
  }
  .notion-callout-rich1 {
    max-width: 100%;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    padding: 3px 2px;
  }
</style>
