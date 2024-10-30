<script lang="ts">
  import DebugJson from "./DebugJSON.svelte";

  export let block: {
    [key: string]: any;
  };
  const toNotionImageUrl = (url: string, blockId: string) =>
    `https://notion.so${
      url.startsWith("/image")
        ? url
        : `/image/${encodeURIComponent(url)}?table=block&id=${blockId}`
    }`;
</script>

<img
  class="notion-image notion-render"
  src={toNotionImageUrl(block.image.file.url, block.id)}
  alt="from notion"
/>

<!-- <DebugJson {block} name="image" /> -->

<style>
  .notion-image {
    width: 100%;
  }
</style>
