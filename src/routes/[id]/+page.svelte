<script lang="ts">
  export let data: import("./$types").PageData;
  import Notion from "./../../lib/svelte-notion-x/Notion.svelte";

  import { Utterances, utterancesTheme } from "@codewithshin/svelte-utterances";
  import { onMount } from "svelte";
  import File from "./File.svelte";

  onMount(() => {
    utterancesTheme.set("dark-blue");

    if (typeof window == "undefined") return;

    let trie = 0;
    let inter = setInterval(() => {
      try {
        /** @type {HTMLIFrameElement}*/
        const iFrame = document.getElementsByClassName("utterances-frame")[0];
        if (iFrame && iFrame instanceof HTMLIFrameElement) {
          iFrame.contentWindow?.postMessage(
            { type: "set-theme", theme: "dark-blue" },
            "https://utteranc.es"
          );
        }
        trie++;
        if (trie > 10) {
          clearInterval(inter);
        }
      } catch (e) {
        // iFrame is not loaded yet!
        console.log("error", e);
      }
    }, 1000);

    return () => {
      clearInterval(inter);
    };
  });

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
      const ur = "/image/" + arr.join("/") + "/image.png";

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
    notionImageUrlV2.searchParams.set("id", data.data.page.id);
    notionImageUrlV2.searchParams.set("cache", "v2");

    url = notionImageUrlV2.toString();

    return url;
  };

  const toNotionImageUrl = (url: string, blockId: string) =>
    defaultMapImageUrl(url);
</script>

<svelte:head>
  <title>{data.data.page.properties.title.title[0].plain_text}</title>
</svelte:head>

<article>
  <div class="title">{data.data.page.properties.title.title[0].plain_text}</div>
  <div class="tags">
    <div class="tag">
      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V3q0-.425.288-.712T7 2t.713.288T8 3v1h8V3q0-.425.288-.712T17 2t.713.288T18 3v1h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5zm0 0V6z"
          />
        </svg>
      </div>
      <div class="text">
        {data.data.page.properties.date.date.start}
      </div>
    </div>

    <div class="tag">
      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
          /></svg
        >
      </div>
      <div class="text">
        {"select" in data.data.page.properties.category &&
        data.data.page.properties.category.select != null &&
        "name" in data.data.page.properties.category.select
          ? data.data.page.properties.category.select.name
          : "Uncategorized"}
      </div>
    </div>
  </div>

  {#if data.data.page.properties.thumbnail.files.length > 0}
    <img
      src={toNotionImageUrl(
        data.data.page.properties.thumbnail.files[0].file.url,
        data.data.page.id
      )}
      alt="thumbnail"
      class="thumbnail"
    />
  {/if}

  <Notion
    blocks={data.data.blocks}
    customRenderer={{
      file: File,
    }}
  />

  <!-- @ts-ignore -->
  <Utterances reponame="Oein/svelte-blog" theme="dark-blue" />
</article>

<style>
  article {
    max-width: 100%;

    background: var(--color-bg-layer1);
    border-radius: 1rem;
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .thumbnail {
    width: 100%;
    border-radius: 1rem;
    margin: 0.75rem 0px;
  }

  .title {
    font-size: 1.875rem;
    line-height: 2.25rem;

    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .tags {
    display: flex;
    gap: 0.5rem;

    margin: 0.75rem 0px;
  }

  .tag {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .tag > .icon {
    color: var(--color-accent-1);
    border-radius: 0.5rem;
    width: 2rem;
    height: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--color-accent-2-hover);

    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .tag > .text {
    line-height: 1;
    color: #ffffff80;
  }
</style>
