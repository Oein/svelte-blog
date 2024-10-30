<script lang="ts">
  import { onMount } from "svelte";
  import lazyMermaid from "../lazy/mermaid";
  import lazyHighlightJS from "../lazy/highlightjs";

  let container: HTMLSpanElement;

  export let block: {
    [key: string]: any;
  };

  let preElement: HTMLElement;
  onMount(async () => {
    if (block.code.language == "mermaid") {
      const mermaid = (await lazyMermaid).default;
      const { svg } = await mermaid.render(
        "mermaid",
        block.code.rich_text[0].text.content
      );
      container.innerHTML = svg;
      return;
    }
    const hljs = (await lazyHighlightJS).default;
    hljs.highlightBlock(preElement.children[0] as any);
  });
</script>

{#if block.code.language == "mermaid"}
  <div
    bind:this={container}
    class="notion-mermaid-container notion-render"
  ></div>
{:else}
  <pre
    class="notion-render"
    bind:this={preElement}>{@html `<code>${block.code.rich_text[0].text.content}</code>`}</pre>
{/if}

<!-- <details>
  <summary>RAW JSON: CODE</summary>
  <pre class="notion-debug">{JSON.stringify(block, null, 2)}</pre>
</details> -->

<style>
  .notion-mermaid-container {
    background: #f7f6f3;
    max-width: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
  }
</style>
