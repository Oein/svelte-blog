<script lang="ts">
  import NotionBlock from "./NotionBlock.svelte";

  import "highlight.js/styles/dark.min.css";

  export let blocks: any[] = [];

  let renderData: any[] = [];
  $: blocks &&
    (() => {
      renderData = blocks;
      let propsWK: any = {};
      for (let i = 0; i < renderData.length; i++) {
        // console.log("PROP", propsWK, renderData[i]);
        if (renderData[i].type === "numbered_list_item") {
          if (propsWK.nli) {
            renderData[i].custom = {};
            renderData[i].custom.number = propsWK.nli + 1;
            propsWK.nli++;
          } else {
            renderData[i].custom = {};
            renderData[i].custom.number = 1;
            propsWK.nli = 1;
          }
        } else propsWK.nli = 0;
      }
    })();

  export let customRenderer: { [key: string]: any } = {};
</script>

<article class="notion-renderer notion-render">
  {#each renderData as block}
    <NotionBlock {customRenderer} {block} />
  {/each}
</article>

<style>
  .notion-renderer {
    font-size: var(--notion-default-font-size);
    line-height: 1.5;

    flex-shrink: 0;
    flex-grow: 1;
    max-width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    z-index: 4;
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;

    font-family:
      ui-sans-serif,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI Variable Display",
      "Segoe UI",
      Helvetica,
      "Apple Color Emoji",
      Arial,
      sans-serif,
      "Segoe UI Emoji",
      "Segoe UI Symbol";
    margin: 0 auto;
  }
</style>
