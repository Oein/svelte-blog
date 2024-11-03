<script lang="ts">
  import lazyML from "../lazy/mathml";
  import BlogLink from "./RenderText/BlogLink.svelte";
  import HandleAnnotation from "./RenderText/HandleAnnotation.svelte";

  export let block: {
    rich_text: {
      plain_text: string;
      type: string;
      text: {
        content: string;
        link: string | null;
      };
      annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
      };
      [key: string]: any;
    }[];
    [key: string]: any;
  };
</script>

{#each block.rich_text as text, i}
  {#if text.type == "text"}
    <HandleAnnotation
      lastAnnotations={block.rich_text[i - 1]?.annotations}
      nextAnnotations={block.rich_text[i + 1]?.annotations}
      annotations={text.annotations}
      text={text.text.content}
    />
  {:else if text.type == "mention" && text.mention.type == "link_preview"}
    <a href={text.href} class="notion-render notion-link">
      <HandleAnnotation
        lastAnnotations={block.rich_text[i - 1]?.annotations}
        nextAnnotations={block.rich_text[i + 1]?.annotations}
        annotations={text.annotations}
        text={new URL(text.plain_text).hostname +
          new URL(text.plain_text).pathname}
      />
    </a>
  {:else if text.type == "mention" && text.mention.type == "page" && text.href.startsWith("https://www.notion.so/")}
    <BlogLink
      {text}
      lan={block.rich_text[i - 1]?.annotations}
      nan={block.rich_text[i + 1]?.annotations}
    />
  {:else if text.type == "equation"}
    {#await lazyML then { default: LazyComponent }}
      <LazyComponent tex={text.equation.expression} />
    {/await}
  {:else}
    <span
      class="notion-render notion-rich-text-not-handled"
      data-body={JSON.stringify(text)}>{text.plain_text}</span
    >
  {/if}
{/each}

<!-- <details>
  <summary>RAW JSON: RichText</summary>
  <pre class="notion-debug">{JSON.stringify(block, null, 2)}</pre>
</details> -->
