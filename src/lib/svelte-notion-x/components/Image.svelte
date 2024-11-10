<script lang="ts">
  import { toNotionImageUrl } from "$lib/toImgURL";
  import DebugJson from "./DebugJSON.svelte";

  export let block: {
    [key: string]: any;
  };
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
