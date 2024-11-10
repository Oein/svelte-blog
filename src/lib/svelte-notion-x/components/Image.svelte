<script lang="ts">
  import DebugJson from "./DebugJSON.svelte";

  export let block: {
    [key: string]: any;
  };
  const defaultMapImageUrl = (url: string | undefined): string | undefined => {
    if (!url) {
      return undefined;
    }

    if (url.startsWith("data:")) {
      return url;
    }

    // more recent versions of notion don't proxy unsplash images
    if (url.startsWith("https://images.unsplash.com")) {
      return url;
    }

    console.log("IMGSO", url);

    if (url.startsWith("https://prod-files-secure.")) {
      console.log("IMGSO0");
      const u = new URL(url);
      const urlspli = u.pathname.split("/");
      const region = u.hostname
        .replace("prod-files-secure.s3.", "")
        .replace(".amazonaws.com", "");
      const sp = u.searchParams;
      const arr = [
        region,
        urlspli[1],
        urlspli[2],
        urlspli[3],
        sp.get("X-Amz-Algorithm"),
        sp.get("X-Amz-Content-Sha256"),
        sp.get("X-Amz-Credential"),
        sp.get("X-Amz-Date"),
        sp.get("X-Amz-Expires"),
        sp.get("X-Amz-Signature"),
        sp.get("X-Amz-SignedHeaders"),
        sp.get("x-id"),
      ]
        .filter((x) => !!x)
        .map((x) => btoa(x!));
      console.log(arr);
      const ur = "/image/" + arr.join("/");

      return ur;
    }

    try {
      const u = new URL(url);

      if (
        u.pathname.startsWith("/secure.notion-static.com") &&
        u.hostname.endsWith(".amazonaws.com")
      ) {
        if (
          u.searchParams.has("X-Amz-Credential") &&
          u.searchParams.has("X-Amz-Signature") &&
          u.searchParams.has("X-Amz-Algorithm")
        ) {
          // if the URL is already signed, then use it as-is

          console.log("IMGSO1");
          return url;
        }
      }
    } catch {
      // ignore invalid urls
    }

    if (url.startsWith("/images")) {
      console.log("IMGSO2");
      url = `https://www.notion.so${url}`;
    }

    if (url.startsWith("/image")) console.log("IMGSO3");
    else console.log("IMGSO4");

    url = `https://www.notion.so${
      url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
    }`;

    const notionImageUrlV2 = new URL(url);
    notionImageUrlV2.searchParams.set("id", block.id);
    notionImageUrlV2.searchParams.set("cache", "v2");

    url = notionImageUrlV2.toString();

    return url;
  };

  const toNotionImageUrl = (url: string, blockId: string) =>
    defaultMapImageUrl(url);
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
